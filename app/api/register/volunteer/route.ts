



// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { Role } from "@prisma/client";
// import {
//   generateEmailOtp,
//   sendVerificationEmail,
// } from "@/lib/emailVerification";

// type RegisterVolunteerBody = {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   country?: string;
//   countryCode?: string;
//   mobileNumber?: string;
//   skills?: string;
//   experience?: string;
//   bio?: string;
//   ref?: string;
//   referralCode?: string;
// };

// function generateUsername(name: string, email: string) {
//   const base =
//     name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ||
//     email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

//   return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
// }

// function generateReferralCode(name: string) {
//   const base =
//     name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 6) || "user";

//   return `${base}${Math.floor(100000 + Math.random() * 900000)}`;
// }

// export async function POST(req: Request) {
//   try {
//     const body: RegisterVolunteerBody = await req.json();

//     const name = body.name?.trim();
//     const email = body.email?.trim().toLowerCase();
//     const password = body.password || "";
//     const confirmPassword = body.confirmPassword || "";
//     const country = body.country?.trim() || undefined;
//     const countryCode = body.countryCode?.trim() || undefined;
//     const mobileNumber = body.mobileNumber?.trim() || undefined;
//     const skills = body.skills?.trim() || undefined;
//     const experience = body.experience?.trim() || undefined;
//     const bio = body.bio?.trim() || undefined;
//     // const referredByCode = body.ref?.trim() || undefined;
//     const referredByCode =
//   body.referralCode?.trim().toUpperCase() ||
//   body.ref?.trim().toUpperCase() ||
//   undefined;

//     if (
//       !name ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !country ||
//       !countryCode ||
//       !mobileNumber
//     ) {
//       return NextResponse.json(
//         {
//           error:
//             "Name, email, password, confirm password, country, country code, and mobile number are required.",
//         },
//         { status: 400 }
//       );
//     }

//     if (password.length < 6) {
//       return NextResponse.json(
//         { error: "Password must be at least 6 characters." },
//         { status: 400 }
//       );
//     }

//     if (password !== confirmPassword) {
//       return NextResponse.json(
//         { error: "Passwords do not match." },
//         { status: 400 }
//       );
//     }

//     const existing = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Email already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);


//     let referrer = null;

// if (referredByCode) {
//   referrer = await prisma.user.findFirst({
//     where: {
//       referralCode: referredByCode,
//     },
//   });
// }

//     let username = generateUsername(name, email);

//     while (await prisma.user.findUnique({ where: { username } })) {
//       username = generateUsername(name, email);
//     }

//   //   const referralCode =
//   // username.toUpperCase() +
//   // Math.floor(100 + Math.random() * 900);

//   //   let referralCode = generateReferralCode(name);

//   //   while (await prisma.user.findFirst({ where: { referralCode } })) {
//   //     referralCode = generateReferralCode(name);
//   //   }


//   let referralCode =
//   username.toUpperCase() +
//   Math.floor(100 + Math.random() * 900);

// while (await prisma.user.findFirst({ where: { referralCode } })) {
//   referralCode =
//     username.toUpperCase() +
//     Math.floor(100 + Math.random() * 900);
// }

//     const { otp, expiry } = generateEmailOtp();

//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         username,
//         email,
//         password: hashedPassword,
//         role: Role.VOLUNTEER,
//         country,
//         countryCode,
//         mobileNumber,
//         skills,
//         experience,
//         bio,
        
//         emailOtp: otp,
//         emailOtpExpiry: expiry,
//         emailVerified: false,
//         referralCode,
//         // referredByCode: referredByCode?.toUpperCase() || null,
//         referredByCode: referredByCode || null,
//       },
//     });


// //     if (referrer) {
// //   await prisma.referral.create({
// //     data: {
// //       referrerId: referrer.id,
// //       referredId: newUser.id,
// //       code: referredByCode!,
// //     },
// //   });

// //   await prisma.user.update({
// //     where: {
// //       id: referrer.id,
// //     },
// //     data: {
// //       referralCount: {
// //         increment: 1,
// //       },
// //     },
// //   });
// // }


// if (referrer) {
//   const REFERRAL_REWARD = 5000; // ₦50 if using kobo

//   // CREATE REFERRAL RECORD
//   await prisma.referral.create({
//     data: {
//       referrerId: referrer.id,
//       referredId: newUser.id,
//       code: referredByCode!,
//     },
//   });

//   // UPDATE REFERRER STATS
//   await prisma.user.update({
//     where: {
//       id: referrer.id,
//     },
//     data: {
//       referralCount: {
//         increment: 1,
//       },

//       referralBalance: {
//         increment: REFERRAL_REWARD / 100,
//       },
//     },
//   });

//   // FIND OR CREATE WALLET
//   let wallet = await prisma.wallet.findUnique({
//     where: {
//       userId: referrer.id,
//     },
//   });

//   if (!wallet) {
//     wallet = await prisma.wallet.create({
//       data: {
//         userId: referrer.id,
//         balance: 0,
//       },
//     });
//   }

//   // CREDIT WALLET
//   await prisma.wallet.update({
//     where: {
//       userId: referrer.id,
//     },
//     data: {
//       balance: {
//         increment: REFERRAL_REWARD,
//       },
//     },
//   });

//   // CREATE WALLET TRANSACTION
//   await prisma.walletTransaction.create({
//     data: {
//       userId: referrer.id,
//       type: "PROJECT_EARNING",
//       status: "COMPLETED",
//       amount: REFERRAL_REWARD,
//       description: `Referral reward for inviting ${newUser.name}`,
//     },
//   });
// }

//     await sendVerificationEmail(email, otp);

//     return NextResponse.json(
//       {
//         message: "Volunteer registered. Please verify your email.",
//         email,
//         redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("VOLUNTEER REGISTER ERROR:", error);
//     return NextResponse.json(
//       { error: "Registration failed" },
//       { status: 500 }
//     );
//   }
// }






import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import {
  generateEmailOtp,
  sendVerificationEmail,
} from "@/lib/emailVerification";

type RegisterVolunteerBody = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country?: string;
  countryCode?: string;
  mobileNumber?: string;
  skills?: string;
  experience?: string;
  bio?: string;
  ref?: string;
  referralCode?: string;
};

function generateUsername(name: string, email: string) {
  const base =
    name.toLowerCase().replace(/[^a-z0-9]+/g, "").trim() ||
    email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "");

  return `${base}${Math.floor(1000 + Math.random() * 9000)}`;
}

function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
    password
  );
}

function sanitizePhoneNumber(number: string) {
  return number.replace(/\D/g, "");
}

export async function POST(req: Request) {
  try {
    const body: RegisterVolunteerBody = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const country = body.country?.trim() || undefined;
    const countryCode = body.countryCode?.trim() || undefined;
    const mobileNumberRaw = body.mobileNumber?.trim() || undefined;
    const mobileNumber = mobileNumberRaw
      ? sanitizePhoneNumber(mobileNumberRaw)
      : undefined;

    const phoneE164 =
      countryCode && mobileNumber ? `${countryCode}${mobileNumber}` : undefined;

    const skills = body.skills?.trim() || undefined;
    const experience = body.experience?.trim() || undefined;
    const bio = body.bio?.trim() || undefined;

    const referredByCode =
      body.referralCode?.trim().toUpperCase() ||
      body.ref?.trim().toUpperCase() ||
      undefined;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !country ||
      !countryCode ||
      !mobileNumber ||
      !phoneE164
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, password, confirm password, country, country code, and mobile number are required.",
        },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: "Phone number must contain numbers only." },
        { status: 400 }
      );
    }

    if (countryCode === "+234" && mobileNumber.length !== 10) {
      return NextResponse.json(
        {
          error:
            "Nigerian phone numbers must contain exactly 10 digits after +234.",
        },
        { status: 400 }
      );
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const existingPhone = await prisma.user.findFirst({
      where: { phoneE164 },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: "Phone number already in use." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let referrer = null;

    if (referredByCode) {
      referrer = await prisma.user.findFirst({
        where: {
          referralCode: referredByCode,
        },
      });
    }

    let username = generateUsername(name, email);

    while (await prisma.user.findUnique({ where: { username } })) {
      username = generateUsername(name, email);
    }

    let referralCode =
      username.toUpperCase() + Math.floor(100 + Math.random() * 900);

    while (await prisma.user.findFirst({ where: { referralCode } })) {
      referralCode =
        username.toUpperCase() + Math.floor(100 + Math.random() * 900);
    }

    const { otp, expiry } = generateEmailOtp();

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: Role.VOLUNTEER,
        country,
        countryCode,
        mobileNumber,
        phoneE164,
        skills,
        experience,
        bio,
        emailOtp: otp,
        emailOtpExpiry: expiry,
        emailVerified: false,
        referralCode,
        referredByCode: referredByCode || null,

           wallet: {
      create: {
        available: 0,
        pending: 0,
        withdrawn: 0,
        totalEarned: 0,
      },
    },
        
      },
    });

    if (referrer) {
      const REFERRAL_REWARD = 5000;

      await prisma.referral.create({
        data: {
          referrerId: referrer.id,
          referredId: newUser.id,
          code: referredByCode!,
        },
      });

      await prisma.user.update({
        where: {
          id: referrer.id,
        },
        data: {
          referralCount: {
            increment: 1,
          },
          referralBalance: {
            increment: REFERRAL_REWARD / 100,
          },
        },
      });

      let wallet = await prisma.wallet.findUnique({
        where: {
          userId: referrer.id,
        },
      });

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId: referrer.id,
            balance: 0,
          },
        });
      }

      await prisma.wallet.update({
        where: {
          userId: referrer.id,
        },
        data: {
          available: {
            increment: REFERRAL_REWARD,
          },
        },
      });

      await prisma.walletTransaction.create({
        data: {
          userId: referrer.id,
          type: "PROJECT_EARNING",
          status: "COMPLETED",
          amount: REFERRAL_REWARD,
          description: `Referral reward for inviting ${newUser.name}`,
        },
      });
    }

    await sendVerificationEmail(email, otp);

    return NextResponse.json(
      {
        message: "Volunteer registered. Please verify your email.",
        email,
        redirectTo: `/verify-email?email=${encodeURIComponent(email)}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("VOLUNTEER REGISTER ERROR:", error);

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}