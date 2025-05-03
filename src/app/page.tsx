import LogoutButton from "@/features/auth/components/LogoutButton";
import { ChatIcon } from "@/shared/components/svgs";
import { ToggleTheme } from "@/shared/components/ui/ToggleTheme";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div>Home Page</div>
      <ToggleTheme />
      <LogoutButton />
      <Link href={"/auth/login"}>Перейти в приложение</Link>
    </div>
  );
}
