import { PropsWithChildren } from "react";
import { Sidebar } from "./Sidebar";

export default function LayoutSidebar({ children }: PropsWithChildren<unknown>) {
    return (
        <main className="flex flex-row h-[100%]">
            <Sidebar/>
            <section className="grow">
                {children}
            </section>
        </main>
    )
}