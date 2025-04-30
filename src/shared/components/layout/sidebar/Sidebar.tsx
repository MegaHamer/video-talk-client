import Image from "next/image";
import Link from "next/link";
import { MENU } from "./sidebar.data";

export function Sidebar() {
    return (
        <div>
            <Image alt="" src={'/logo.svg'} width={50} height={50} />

            {MENU.map((item, index) => (
                <Link href={'/chats'} key={index}>
                    <Image alt="" src={'/chat_icon.svg'} width={50} height={50} className="text-white"/>
                </Link>
            )
            )}
        </div>
    )
}