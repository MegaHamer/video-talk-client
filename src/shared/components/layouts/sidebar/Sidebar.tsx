import Image from "next/image";
import Link from "next/link";
import { MENU } from "./sidebar.data";
import { ChatIcon } from "../../svgs";

export function Sidebar() {
  return (
    <aside className="w-18 bg-gray-200 p-0">
      <div className="my-3 flex items-center justify-center">
        <Link href={"/"}>
          <Image alt="" src={"/logo.svg"} width={40} height={40} />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        {MENU.map((item, index) => (
          <Link href={item.url} key={index}>
            <div className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
              <item.Icon size={34} className="fill-black dark:fill-white" />
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
