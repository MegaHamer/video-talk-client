import LayoutSidebar from "@/shared/components/layouts/sidebar/LayoutSidebar";
import { MediasoupProvider } from "@/shared/components/providers/MediasoupProvider";
import { SocketProvider } from "@/shared/components/providers/SocketProvider";

export default function SidebarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LayoutSidebar>
      <MediasoupProvider>{children}</MediasoupProvider>
      <SocketProvider />
    </LayoutSidebar>
  );
}
