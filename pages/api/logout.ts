import { NextApiRequest, NextApiResponse } from "next";

import { withIronSession } from "next-iron-session";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    req.session.destroy();
    res.status(200).json({ message: "ok" });

  } catch (error) {
    res.status(500).json({ message: "Error varify magic link",error });
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
