export default function GridList({ children }: { children: React.ReactNode }) {
  return <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">{children}</ul>;
}
