import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import prisma from "../../lib/prismadb";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  const data = []
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
 
    let user = await prisma.user.findUnique({
      where: {
        email: userSession.email!,
      },
    });
    data.push({user})
    if(!user) {
      if(userSession.email) {
        const userCreated = await prisma.user.create({
          data: {
            name:"Manually created User",
            email:userSession.email,
          
          },
        })
        data.push(userCreated)
       user = await prisma.user.findUnique({
          where: {
            email: userSession.email!,
          },
        });
        data.push({updatedUser:user})
      }
     
  }
  

        res.status(200).json({ message: "ok",user:user });
      

  } catch (error) {
    console.error("Error user: ", error);
    res.status(500).json({ message: "Error user",error:error, data  });
  }
}

export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});
