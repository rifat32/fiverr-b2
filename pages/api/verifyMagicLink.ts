import { NextApiRequest, NextApiResponse } from "next";

import { withIronSession } from "next-iron-session";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    const { email,token } = req.query;

      const savedToken = req.session.get("token");

      if(savedToken == token) {
     
        req.session.set("user", JSON.stringify({email}));
        await req.session.save();
        res.redirect('/');
       
      }
      else {
        res.status(200).json({ message: "invalid token",savedToken,token:token });
      }

  } catch (error) {
    console.error("Error varify magic link: ", error);
    res.status(200).json({ message: "Error varify magic link",error });
    // res.status(500).json({ message: "Error varify magic link",error });
  }
}

export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});
