import { ChatIcon } from "@/shared/components/svgs";
import { ToggleTheme } from "@/shared/components/ui/ToggleTheme";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div>Home Page</div>
      <ToggleTheme />
      <ChatIcon/>
    </>
  );
}
