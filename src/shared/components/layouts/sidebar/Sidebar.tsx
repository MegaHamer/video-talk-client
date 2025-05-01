import Image from "next/image";
import Link from "next/link";
import { MENU } from "./sidebar.data";
import { ChatIcon } from "../../svgs";

export function Sidebar() {
    return (
        <div>
            <Image alt="" src={'/logo.svg'} width={50} height={50} />

            {MENU.map((item, index) => (
                <Link href={item.url} key={index}>
                    <ChatIcon width={50} height={50} className="fill-black dark:fill-white" />
                </Link>
            )
            )}
        </div>
    )
}