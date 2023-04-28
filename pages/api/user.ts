import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import prisma from "../../lib/prismadb";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  try {
    const { email,token } = req.query;

    let userSession = req.session.get("user");

    if(userSession) {
      userSession =  JSON.parse(userSession)
    }
    if (!userSession || !userSession.email) {
      console.log("User not logged in");
      return res.status(401).json("Login to upload.");
    }
 
    const user = await prisma.user.findUnique({
      where: {
        email: userSession.email!,
      },
    });
  

        res.status(200).json({ message: "ok",user:user });
      

  } catch (error) {
    console.error("Error user: ", error);
    res.status(500).json({ message: "Error varify magic link",error:JSON.stringify(error)  });
  }
}

export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});
