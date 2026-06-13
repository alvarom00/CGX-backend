import {
  TransactionalEmailsApi,
  TransactionalEmailsApiApiKeys,
  CreateSmtpEmail,
} from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error("Falta BREVO_API_KEY");
}

const client = new TransactionalEmailsApi();

client.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);

export type ContactEmailData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!,
  );
}

export async function sendContactEmail(data: ContactEmailData) {
  const name = escapeHtml(data.name);
  const company = escapeHtml(data.company);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const message = escapeHtml(data.message).replace(/\r?\n/g, "<br />");
  const subjectName = (data.company || data.name).replace(/[\r\n]+/g, " ");

  const response: { body: CreateSmtpEmail } = await client.sendTransacEmail({
    sender: {
      email: process.env.MAIL_FROM!,
      name: process.env.MAIL_FROM_NAME!,
    },
    to: [
      {
        email: process.env.CONTACT_EMAIL!,
      },
    ],
    subject: `Nueva consulta - ${subjectName}`,
    htmlContent: `
      <h2>Nueva consulta desde CGX International</h2>

      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Empresa:</strong> ${company}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefono:</strong> ${phone}</p>

      <hr />

      <p>${message}</p>
    `,
    replyTo: {
      email: data.email,
    },
  });

  console.log("Brevo OK:", response.body?.messageId);

  return response;
}
