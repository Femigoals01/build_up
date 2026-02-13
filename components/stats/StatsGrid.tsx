

export default function StatsGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {children}
    </section>
  );
}
