
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout can be used to wrap auth pages with a shared UI,
  // like a specific background or centered alignment.
  return <>{children}</>;
}
