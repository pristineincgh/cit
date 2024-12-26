export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="sidebar">Sidebar</div>
      <main>{children}</main>
    </div>
  );
}
