import { prisma } from "@/lib/prisma";

export default async function PublicProfile({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      portfolio: {
        include: {
          project: true,
          review: true,
        },
      },
    },
  });

  if (!user) return <p>User not found</p>;

  return (
    <main className="max-w-3xl mx-auto py-10 space-y-8">
      <section>
        <h1 className="text-4xl font-bold">{user.name}</h1>
        <p className="text-gray-600">{user.bio}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Portfolio</h2>

        {user.portfolio.map(item => (
          <div
            key={item.id}
            className="bg-white border rounded-xl p-6 mb-4"
          >
            <h3 className="font-semibold">{item.project.title}</h3>
            {item.review && (
              <>
                <p>⭐ {item.review.rating}/5</p>
                <p className="text-gray-600">{item.review.comment}</p>
              </>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
