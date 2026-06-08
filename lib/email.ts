import { Resend } from "resend";

const FROM = "Compliflow <hello@compliflow.de>";
const OWNER_EMAIL = "alkhalilaoumeur@gmail.com";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function sendWaitlistNotification({
  email,
  source,
}: {
  email: string;
  source: string;
}) {
  const resend = getResend();
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to: [OWNER_EMAIL],
    subject: `Neue Waitlist-Anmeldung — ${email}`,
    html: `<p><strong>Email:</strong> ${escHtml(email)}<br><strong>Quelle:</strong> ${escHtml(source)}<br><strong>Zeit:</strong> ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}</p>`,
  });
}

export async function sendPaymentConfirmation({
  to,
  tool,
  sessionId,
}: {
  to: string;
  tool: "avv" | "vvt";
  sessionId: string;
}) {
  const resend = getResend();
  if (!resend) return;

  const toolLabel = tool === "avv" ? "AVV-Generator Pro" : "VVT-Generator Pro";
  const toolPath = tool === "avv" ? "avv" : "vvt";
  const returnUrl = `https://compliflow.de/${toolPath}?success=true&session_id=${sessionId}`;

  await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Dein ${toolLabel} ist bereit — compliflow.de`,
    html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f6f2ea;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f2ea;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fdfbf6;border:1px solid #e2ddd1;max-width:560px;width:100%;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e2ddd1;">
              <span style="font-family:Georgia,serif;font-size:18px;font-weight:600;color:#15171b;letter-spacing:-0.3px;">Compliflow</span>
              <span style="font-family:'Courier New',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.2em;color:#8b8e94;margin-left:8px;">DSGVO Suite</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="font-family:'Courier New',monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.18em;color:#1f3d2f;margin:0 0 16px;">
                Zahlung bestätigt
              </p>
              <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:500;color:#15171b;margin:0 0 16px;line-height:1.2;letter-spacing:-0.3px;">
                ${toolLabel} ist freigeschaltet.
              </h1>
              <p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#4f5359;line-height:1.65;margin:0 0 32px;">
                Dein Pro-Zugang ist aktiv. Klicke auf den Button unten um direkt zum Generator zu gelangen und dein PDF ohne Compliflow-Branding herunterzuladen.
              </p>
              <a href="${returnUrl}" style="display:inline-block;background:#1f3d2f;color:#f6f2ea;font-family:'Courier New',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.15em;padding:14px 28px;text-decoration:none;">
                Jetzt PDF herunterladen →
              </a>
              <p style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#8b8e94;margin:24px 0 0;line-height:1.5;">
                Dieser Link aktiviert deinen Pro-Zugang direkt im Browser. Du kannst ihn jederzeit erneut aufrufen — der Link bleibt 30 Tage gültig.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e2ddd1;">
              <p style="font-family:'Courier New',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.15em;color:#8b8e94;margin:0;">
                Compliflow · Al-Khalil Aoumeur · Egilolfstraße 41, 70599 Stuttgart ·
                <a href="https://compliflow.de/datenschutz" style="color:#8b8e94;">Datenschutz</a> ·
                <a href="https://compliflow.de/impressum" style="color:#8b8e94;">Impressum</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  });
}
