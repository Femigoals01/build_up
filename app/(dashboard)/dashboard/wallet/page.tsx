





// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import WithdrawForm from "./WithdrawForm";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// function formatNaira(amount: number) {
//   return `₦${(amount / 100).toLocaleString("en-NG")}`;
// }

// export default async function WalletPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
//     redirect("/login");
//   }

//   const wallet = await prisma.wallet.findUnique({
//     where: { userId: session.user.id },
//   });

//   const transactions = await prisma.walletTransaction.findMany({
//     where: { userId: session.user.id },
//     orderBy: { createdAt: "desc" },
//     take: 20,
//   });

//   const acceptedApplications = await prisma.application.findMany({
//     where: {
//       volunteerId: session.user.id,
//       status: "ACCEPTED",
//       project: {
//         status: {
//           in: ["OPEN", "IN_PROGRESS"],
//         },
//       },
//     },
//     include: {
//       project: true,
//     },
//   });

//   const activeProjectFundings = await prisma.projectFunding.findMany({
//     where: {
//       volunteerId: session.user.id,
//       status: "HELD",
//     },
//   });

//   const activeProjectFundFromAssignedProjects = acceptedApplications.reduce(
//     (sum, application) => {
//       const projectFunding = activeProjectFundings.find(
//         (funding) => funding.projectId === application.projectId
//       );

//       return sum + (projectFunding?.volunteerAmount ?? 0);
//     },
//     0
//   );

//   const balance = wallet?.balance ?? 0;
//   const pending = wallet?.pending ?? 0;
//   const withdrawn = wallet?.withdrawn ?? 0;

//   const activeProjectFund = activeProjectFundFromAssignedProjects;
//   const canceledProjectFund = 0;

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-6xl space-y-8">
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//           <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
//             BuildUp Wallet
//           </p>

//           <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             Your earnings wallet
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//             Earnings are added here after an organization approves your work and
//             releases payment. You can request withdrawal once your available
//             balance reaches ₦20,000.
//           </p>
//         </section>

//         <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
//           <WalletStat title="Available Balance" value={formatNaira(balance)} />
//           <WalletStat title="Pending Withdrawal" value={formatNaira(pending)} />
//           <WalletStat title="Total Withdrawn" value={formatNaira(withdrawn)} />
//           <WalletStat
//             title="Active Project Fund"
//             value={formatNaira(activeProjectFund)}
//           />
//           <WalletStat
//             title="Canceled Project Fund"
//             value={formatNaira(canceledProjectFund)}
//           />
//         </section>

//         <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
//           <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//             <h2 className="text-xl font-bold text-slate-900">
//               Wallet Transactions
//             </h2>

//             <div className="mt-5 space-y-3">
//               {transactions.length === 0 ? (
//                 <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
//                   No wallet transactions yet.
//                 </div>
//               ) : (
//                 transactions.map((transaction) => (
//                   <div
//                     key={transaction.id}
//                     className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
//                   >
//                     <div>
//                       <p className="text-sm font-semibold text-slate-900">
//                         {transaction.description || transaction.type}
//                       </p>
//                       <p className="mt-1 text-xs text-slate-500">
//                         {transaction.type} • {transaction.status} •{" "}
//                         {new Date(transaction.createdAt).toLocaleString()}
//                       </p>
//                     </div>

//                     <p className="text-sm font-bold text-slate-900">
//                       {formatNaira(transaction.amount)}
//                     </p>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>

//           <WithdrawForm balance={balance} />
//         </section>
//       </div>
//     </main>
//   );
// }

// function WalletStat({ title, value }: { title: string; value: string }) {
//   return (
//     <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {title}
//       </p>
//       <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }


import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import WithdrawForm from "./WithdrawForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatNaira(amount: number) {
  return `₦${(amount / 100).toLocaleString("en-NG")}`;
}

export default async function WalletPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "VOLUNTEER" || !session.user.id) {
    redirect("/login");
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  const bankAccount = await prisma.bankAccount.findUnique({
    where: { userId: session.user.id },
  });

  const transactions = await prisma.walletTransaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const acceptedApplications = await prisma.application.findMany({
    where: {
      volunteerId: session.user.id,
      status: "ACCEPTED",
      project: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    },
    include: {
      project: true,
    },
  });

  const activeProjectFundings = await prisma.projectFunding.findMany({
    where: {
      volunteerId: session.user.id,
      status: "HELD",
    },
  });

  const activeProjectFundFromAssignedProjects = acceptedApplications.reduce(
    (sum, application) => {
      const projectFunding = activeProjectFundings.find(
        (funding) => funding.projectId === application.projectId
      );

      return sum + (projectFunding?.volunteerAmount ?? 0);
    },
    0
  );

  const balance = wallet?.balance ?? 0;
  const pending = wallet?.pending ?? 0;
  const withdrawn = wallet?.withdrawn ?? 0;

  const activeProjectFund = activeProjectFundFromAssignedProjects;
  const canceledProjectFund = 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                BuildUp Wallet
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Your earnings wallet
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Earnings are added here after an organization approves your work
                and releases payment. You can request withdrawal once your
                available balance reaches ₦20,000.
              </p>
            </div>

            <Link
              href="/dashboard/wallet/bank"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              {bankAccount?.paystackRecipientCode
                ? "Manage Bank Account"
                : "Set Up Bank Account"}
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <WalletStat title="Available Balance" value={formatNaira(balance)} />
          <WalletStat title="Pending Withdrawal" value={formatNaira(pending)} />
          <WalletStat title="Total Withdrawn" value={formatNaira(withdrawn)} />
          <WalletStat
            title="Active Project Fund"
            value={formatNaira(activeProjectFund)}
          />
          <WalletStat
            title="Canceled Project Fund"
            value={formatNaira(canceledProjectFund)}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Wallet Transactions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Track earnings, withdrawals, and project payments.
                </p>
              </div>

              {bankAccount ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <p className="font-semibold">Bank account connected</p>
                  <p className="mt-1 text-xs">
                    {bankAccount.bankName} • {bankAccount.accountNumber}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <p className="font-semibold">Bank account required</p>
                  <p className="mt-1 text-xs">
                    Add your bank account before payout processing.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-3">
              {transactions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                  No wallet transactions yet.
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {transaction.description || transaction.type}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {transaction.type} • {transaction.status} •{" "}
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {formatNaira(transaction.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <WithdrawForm balance={balance} />
        </section>
      </div>
    </main>
  );
}

function WalletStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}