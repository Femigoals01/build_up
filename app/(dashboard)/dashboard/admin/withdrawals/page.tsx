




// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { prisma } from "@/lib/prisma";
// import ProcessWithdrawalButton from "./ProcessWithdrawalButton";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// function formatNaira(amount: number) {
//   return `₦${(amount / 100).toLocaleString("en-NG")}`;
// }

// function statusStyle(status: string) {
//   switch (status) {
//     case "PENDING":
//       return "border-amber-200 bg-amber-50 text-amber-700";
//     case "PROCESSING":
//       return "border-blue-200 bg-blue-50 text-blue-700";
//     case "COMPLETED":
//       return "border-emerald-200 bg-emerald-50 text-emerald-700";
//     case "FAILED":
//       return "border-rose-200 bg-rose-50 text-rose-700";
//     default:
//       return "border-slate-200 bg-slate-50 text-slate-700";
//   }
// }

// export default async function AdminWithdrawalsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session || session.user.role !== "ADMIN") {
//     redirect("/login");
//   }

//   const withdrawals = await prisma.withdrawalRequest.findMany({
//     orderBy: { createdAt: "desc" },
//     take: 100,
//   });

//   const pendingCount = withdrawals.filter((w) => w.status === "PENDING").length;

//   const pendingAmount = withdrawals
//     .filter((w) => w.status === "PENDING")
//     .reduce((sum, w) => sum + w.amount, 0);

//   const completedAmount = withdrawals
//     .filter((w) => w.status === "COMPLETED")
//     .reduce((sum, w) => sum + w.amount, 0);

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-6 md:px-8 lg:px-10">
//       <div className="mx-auto max-w-7xl space-y-8">
//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
//           <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
//             Admin Payouts
//           </p>

//           <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
//             Withdrawal Requests
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
//             Review volunteer withdrawal requests and process payouts through
//             Paystack Transfer.
//           </p>
//         </section>

//         <section className="grid gap-4 md:grid-cols-3">
//           <AdminStat title="Pending Requests" value={String(pendingCount)} />
//           <AdminStat title="Pending Amount" value={formatNaira(pendingAmount)} />
//           <AdminStat
//             title="Completed Payouts"
//             value={formatNaira(completedAmount)}
//           />
//         </section>

//         <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
//           <div className="border-b border-slate-200 px-6 py-5">
//             <h2 className="text-xl font-bold text-slate-900">
//               Recent withdrawal requests
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Process pending withdrawals only after confirming Paystack balance
//               is available.
//             </p>
//           </div>

//           <div className="divide-y divide-slate-100">
//             {withdrawals.length === 0 ? (
//               <div className="px-6 py-14 text-center text-sm text-slate-500">
//                 No withdrawal requests yet.
//               </div>
//             ) : (
//               withdrawals.map((withdrawal) => (
//                 <div
//                   key={withdrawal.id}
//                   className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_auto]"
//                 >
//                   <div className="min-w-0">
//                     <div className="flex flex-wrap items-center gap-3">
//                       <p className="text-lg font-bold text-slate-900">
//                         {formatNaira(withdrawal.amount)}
//                       </p>

//                       <span
//                         className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(
//                           withdrawal.status
//                         )}`}
//                       >
//                         {withdrawal.status}
//                       </span>
//                     </div>

//                     <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
//                       <Info label="Account Name" value={withdrawal.accountName} />
//                       <Info label="Bank" value={withdrawal.bankName} />
//                       <Info
//                         label="Account Number"
//                         value={withdrawal.accountNumber}
//                       />
//                       <Info
//                         label="Requested"
//                         value={new Date(
//                           withdrawal.createdAt
//                         ).toLocaleString()}
//                       />
//                     </div>

//                     {withdrawal.failureReason ? (
//                       <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
//                         {withdrawal.failureReason}
//                       </div>
//                     ) : null}

//                     {withdrawal.paystackTransferCode ? (
//                       <p className="mt-3 text-xs text-slate-500">
//                         Paystack transfer code:{" "}
//                         <span className="font-semibold text-slate-700">
//                           {withdrawal.paystackTransferCode}
//                         </span>
//                       </p>
//                     ) : null}
//                   </div>

//                   <div className="flex items-start justify-end">
//                     {withdrawal.status === "PENDING" ? (
//                       <ProcessWithdrawalButton withdrawalId={withdrawal.id} />
//                     ) : (
//                       <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-500">
//                         {withdrawal.status === "COMPLETED"
//                           ? "Processed"
//                           : withdrawal.status}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }

// function AdminStat({ title, value }: { title: string; value: string }) {
//   return (
//     <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
//         {title}
//       </p>
//       <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
//     </div>
//   );
// }

// function Info({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
//       <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
//         {label}
//       </p>
//       <p className="mt-1 truncate text-sm font-semibold text-slate-800">
//         {value}
//       </p>
//     </div>
//   );
// }





import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProcessWithdrawalButton from "./ProcessWithdrawalButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatNaira(amount: number) {
  return `₦${(amount / 100).toLocaleString("en-NG")}`;
}

function statusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "PROCESSING":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "FAILED":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export default async function AdminWithdrawalsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // const withdrawals = await prisma.withdrawalRequest.findMany({
  //   orderBy: { createdAt: "desc" },
  //   take: 100,
  // });

  const withdrawals = await prisma.withdrawalRequest.findMany({
    include: {
      transfer: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  const pendingCount = withdrawals.filter((w) => w.status === "PENDING").length;

  const pendingAmount = withdrawals
    .filter((w) => w.status === "PENDING")
    .reduce((sum, w) => sum + w.amount, 0);

  const completedAmount = withdrawals
    .filter((w) => w.status === "COMPLETED")
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 pb-6 pt-0 md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
            Admin Payouts
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Withdrawal Requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Review payout requests from volunteers, mentors, and organizations
            and process payouts through Paystack Transfer.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <AdminStat title="Pending Requests" value={String(pendingCount)} />

          <AdminStat
            title="Pending Amount"
            value={formatNaira(pendingAmount)}
          />

          <AdminStat
            title="Completed Payouts"
            value={formatNaira(completedAmount)}
          />
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-900">
              Recent withdrawal requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Process pending withdrawals only after confirming Paystack balance
              is available.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {withdrawals.length === 0 ? (
              <div className="px-6 py-14 text-center text-sm text-slate-500">
                No withdrawal requests yet.
              </div>
            ) : (
              withdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="grid gap-5 px-6 py-5 lg:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-bold text-slate-900">
                        {formatNaira(withdrawal.amount)}
                      </p>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle(
                          withdrawal.status
                        )}`}
                      >
                        {withdrawal.status}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                      <Info
                        label="Account Name"
                        value={withdrawal.accountName}
                      />

                      <Info label="Bank" value={withdrawal.bankName} />

                      <Info
                        label="Account Number"
                        value={withdrawal.accountNumber}
                      />

                      <Info
                        label="Requested"
                        value={new Date(
                          withdrawal.createdAt
                        ).toLocaleString()}
                      />
                    </div>

                    {withdrawal.failureReason ? (
                      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {withdrawal.failureReason}
                      </div>
                    ) : null}

                    {withdrawal.paystackTransferCode ? (
                      <p className="mt-3 text-xs text-slate-500">
                        Paystack transfer code:{" "}
                        <span className="font-semibold text-slate-700">
                          {withdrawal.paystackTransferCode}
                        </span>
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-start justify-end">
                    {/* {withdrawal.status === "PENDING" ? (
                      <ProcessWithdrawalButton withdrawalId={withdrawal.id} />
                    ) : (
                      <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-500">
                        {withdrawal.status === "COMPLETED"
                          ? "Processed"
                          : withdrawal.status}
                      </span>
                    )} */}



                    {/* {withdrawal.status === "PENDING" && !withdrawal.transfer ? (


                      <ProcessWithdrawalButton
                        withdrawalId={withdrawal.id}
                        mode="start"
                      />
                    )  */}
                    
                    
                    {withdrawal.status === "PENDING" ? (
  <ProcessWithdrawalButton
    withdrawalId={withdrawal.id}
    mode="start"
  />
): withdrawal.status === "PROCESSING" &&
                      withdrawal.transfer?.paystackTransferCode ? (
                      <ProcessWithdrawalButton
                        withdrawalId={withdrawal.id}
                        transferId={withdrawal.transfer.id}
                        transferCode={withdrawal.transfer.paystackTransferCode}
                        mode="otp"
                      />
                    ) : (
                      <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-500">
                        {withdrawal.status === "COMPLETED"
                          ? "Processed"
                          : withdrawal.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}