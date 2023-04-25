import { NextApiRequest, NextApiResponse } from "next";
import nodemailer, { SentMessageInfo } from "nodemailer";
import { withIronSession } from "next-iron-session";
import {  IronSessionPassword } from "../../utils/links";

interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false,
      auth: {
        user: "rifatbilalphilips@gmail.com",
        pass:"xsmtpsib-402c3b33a82bcdef9a5edc78d5ab720dc5c5715d09a7b0da3c5bd764dfb684c1-pJqVj9cG3XmwDrfb",
      },
    });

    const token = Math.random().toString(36).substr(2, 8);

    req.session.set("token", token);
    await req.session.save();

    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    
    // construct the app URL
    const appUrl = `${protocol}://${host}`;

    const info: SentMessageInfo = await transporter.sendMail({
      from: "Your App Name <nyl9488.yln@gmail.com>",
      to: email,
      subject: "Magic Login Link",
      html: `
        <p>Hello!</p>
        <p>You recently requested a magic login link for Your App Name.</p>
        <p>Click the link below to login:</p>
        <a href="${appUrl}/api/verifyMagicLink?token=${token}&&email=${email}">
        ${appUrl}/api/verifyMagicLink?token=${token}&&email=${email}
        </a>
        <p>Note: This link will expire in 24 hours.</p>
      `,
    });

    console.log("Email sent: ", info);

      const savedToken = req.session.get("token");
    res.status(200).json({ message: "Magic login link sent to email address",savedToken,token });
  } catch (error) {
    console.error("Error sending magic link: ", error);
    res.status(500).json({ message: "Error sending magic link" });
  }
}

export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});
