import { Request, Response } from "express";
import { contactSchema } from "../schemas/contact.schema";
import { sendContactEmail } from "../services/email.service";
import { verifyTurnstileToken } from "../services/turnstile.service";

export const submitContact = async (
  req: Request,
  res: Response
) => {
  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Revisa los datos ingresados",
      errors: result.error.flatten(),
    });
  }

  try {
    const isHuman = await verifyTurnstileToken(
      result.data.turnstileToken,
      req.ip,
    );

    if (!isHuman) {
      return res.status(403).json({
        success: false,
        message: "No se pudo validar la verificación de seguridad",
      });
    }

    await sendContactEmail(result.data);

    return res.status(200).json({
      success: true,
      message: "Consulta enviada correctamente",
    });
  } catch (error) {
    console.error("Error procesando consulta:", error);

    return res.status(500).json({
      success: false,
      message: "Error al enviar la consulta",
    });
  }
};
