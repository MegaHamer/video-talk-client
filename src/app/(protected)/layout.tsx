import LayoutSidebar from "@/shared/components/layouts/sidebar/LayoutSidebar";
import { SocketProvider } from "@/shared/components/providers/SocketProvider";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutSidebar>
      {children}
      <SocketProvider />
    </LayoutSidebar>
  );
}
