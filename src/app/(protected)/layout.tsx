import LayoutSidebar from "@/shared/components/layouts/sidebar/LayoutSidebar";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutSidebar>{children}</LayoutSidebar>;
}
