


// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import BankAccountForm from "./BankAccountForm";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// export default async function BankAccountPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const bankAccount = await prisma.bankAccount.findUnique({
//     where: { userId: session.user.id },
//   });

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-3xl space-y-6">
//         <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//           <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
//             Bank Account
//           </p>

//           <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             Set up withdrawal account
//           </h1>

//           <p className="mt-2 text-sm leading-6 text-slate-500">
//             Add your Nigerian bank account so BuildUp can process your wallet
//             withdrawals.
//           </p>
//         </section>

//         <BankAccountForm existingAccount={bankAccount} />
//       </div>
//     </main>
//   );
// }



import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import BankAccountForm from "./BankAccountForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BankAccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const bankAccount = await prisma.bankAccount.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Bank Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Set up withdrawal account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Add your Nigerian bank account so BuildUp can process your wallet
            withdrawals and referral reward payouts.
          </p>
        </section>

        <BankAccountForm existingAccount={bankAccount} />
      </div>
    </main>
  );
}