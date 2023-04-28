import { NextApiRequest, NextApiResponse } from "next";

import { withIronSession } from "next-iron-session";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

      const savedToken = req.session.get("token");

        req.session.set("user", JSON.stringify({email}));
        await req.session.save();
       
        res.status(200).json({ message: "logged in successfully!",user:{email:email} });
 
     

  } catch (error) {
    console.error("Error google login: ", error);
    res.status(500).json({ message: "Error google login" });
  }
}

export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});
