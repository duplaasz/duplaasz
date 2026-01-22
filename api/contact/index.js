const Busboy = require("busboy");
const { Resend } = require("resend");
const {
  BlobServiceClient,
  generateBlobSASQueryParameters,
  BlobSASPermissions
} = require("@azure/storage-blob");

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTAINER = "uploads";
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50MB

function esc(s) {
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#39;");
}

module.exports = async function (context, req) {
  try {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!conn) throw new Error("Missing storage connection string");

    const blobService = BlobServiceClient.fromConnectionString(conn);
    const container = blobService.getContainerClient(CONTAINER);

    const body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    const bb = Busboy({ headers: req.headers });

    const fields = {};
    const links = [];
    let total = 0;

    bb.on("field", (n, v) => fields[n] = v);

    bb.on("file", (n, file, info) => {
      if (n !== "images") return file.resume();

      const { filename, mimeType } = info;
      if (!ALLOWED_MIME.has(mimeType)) throw new Error("Nem kép.");

      const chunks = [];
      file.on("data", d => {
        total += d.length;
        if (total > MAX_TOTAL_BYTES) throw new Error("Túl nagy fájl.");
        chunks.push(d);
      });

      file.on("end", async () => {
        const buf = Buffer.concat(chunks);
        const name = `${Date.now()}_${filename.replace(/[^\w.\-]/g,"_")}`;
        const blob = container.getBlockBlobClient(name);
        await blob.uploadData(buf, { blobHTTPHeaders: { blobContentType: mimeType } });

        const sas = generateBlobSASQueryParameters({
          containerName: CONTAINER,
          blobName: name,
          permissions: BlobSASPermissions.parse("r"),
          expiresOn: new Date(Date.now() + 7*24*60*60*1000)
        }, blobService.credential).toString();

        links.push({ name: filename, url: `${blob.url}?${sas}` });
      });
    });

    await new Promise((res, rej) => { bb.on("finish", res); bb.on("error", rej); bb.end(body); });

    if (!links.length) throw new Error("Nincs kép.");

    await resend.emails.send({
      from: "Weboldal <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL],
      subject: "Új űrlap beküldés",
      html: `
        <p><b>Név:</b> ${esc(fields.lastname)} ${esc(fields.firstname)}</p>
        <p><b>Telefon:</b> ${esc(fields.phone)}</p>
        <p><b>Email:</b> ${esc(fields.email)}</p>
        <p><b>Leírás:</b><br>${esc(fields.desc).replaceAll("\n","<br>")}</p>
        <p><b>Képek:</b></p>
        <ul>${links.map(l=>`<li><a href="${l.url}">${esc(l.name)}</a></li>`).join("")}</ul>
      `
    });

    context.res = { status: 200, body: "OK" };
  } catch (e) {
    context.log.error(e);
    context.res = { status: 400, body: e.message };
  }
};
