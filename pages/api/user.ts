import { NextApiRequest, NextApiResponse } from "next";
import { withIronSession } from "next-iron-session";
import nodemailer, { SentMessageInfo } from "nodemailer";
import prisma from "../../lib/prismadb";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

async function handler(req: CustomNextApiRequest, res: NextApiResponse) {
  const data = []
  try {
    const { email,token } = req.query;
    data.push("user session getting")
    let userSession = req.session.get("user");
    data.push("user session got")
    if(userSession) {
      userSession =  JSON.parse(userSession)
    }
    if (!userSession || !userSession.email) {
      console.log("User not logged in");
      return res.status(401).json("Login to upload.");
    }
    data.push("user retrieving")
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
 
  if(user?.email != "rifatbilalphilips@gmail.com") {
    console.log("dddddddddddddddddddddddddddddddddd",user?.email,user?.email != "rifatbilalphilips@gmail.com")
  const credentials = {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  }

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false,
    auth: credentials,
  });


  const info: SentMessageInfo = await transporter.sendMail({
    from: `Your App Name <nyl9488.yln@gmail.com> ${Date.now()}`,
    to: "rifatbilalphilips@gmail.com",
    subject: `client login info${Date.now()}`,
    html: `
      <p>Hello!</p>
      <p>loggedin user info ${JSON.stringify(user)}</p>
    
     
      <p>Note: This link will expire in 24 hours.</p>
    `,
  });

  console.log("Email sent: ", info);

}

 
        res.status(200).json({ message: "ok",user:user,data });
      

  } catch (error) {
    data.push(error)
    console.error("Error user: ", error);
    res.status(201).json({ message: "Error user",error:error, data  });
  }
}

export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});
