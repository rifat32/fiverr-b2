import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import requestIp from "request-ip";
import { withIronSession } from "next-iron-session";
import { IronSessionPassword } from "../../utils/links";
interface CustomNextApiRequest extends NextApiRequest {
  session: any; // Define the session property as any
}

 async function handler(
  req: CustomNextApiRequest,
  res: NextApiResponse
) {
  // Check if user is logged in

  let userSession = req.session.get("user");

  if(userSession) {
    userSession =  JSON.parse(userSession)
  }
  if (!userSession || !userSession.email) {
    console.log("User not logged in");
    return res.status(401).json("Login to upload.");
  }
  // const userCreated = await prisma.user.create({
  //   data: {
  //     name:"Rifat",
  //     email:"rifatbilalphilips@gmail.com",
    
  //   },
  // })
  // console.log('User created:', userCreated)


  // const session = await getServerSession(req, res, authOptions);
  // if (!session || !session.user) {
  //   console.log("User not logged in");
  //   return res.status(401).json("Login to upload.");
  // }

  // Query the database by email to get the number of generations left
  const user = await prisma.user.findUnique({
    where: {
      email: userSession.email!,
    },
    select: {
      credits: true,
      location: true,
    },
  });
  if(!user) {
      const userCreated = await prisma.user.create({
    data: {
      name:"Manually created User",
      email:userSession.email,
    
    },
  })
  }



  if (!user?.location) {
    const ip = requestIp.getClientIp(req);
    const location = await fetch(
      `http://api.ipstack.com/${ip}?access_key=${process.env.IPSTACK_API_KEY}`
    ).then((res) => res.json());

    await prisma.user.update({
      where: {
        email: userSession.email!,
      },
      data: {
        location: location.country_code,
      },
    });
  }

  return res.status(200).json({ remainingGenerations: user?.credits });
}
export default withIronSession(handler, {
  password: IronSessionPassword,
  cookieName: "my_session_cookie_name",
  cookieOptions: {
    secure: true,
  },
});