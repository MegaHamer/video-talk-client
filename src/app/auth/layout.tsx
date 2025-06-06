import { PropsWithChildren } from "react";

export default function Layout({children}:PropsWithChildren<unknown>){
    return(
        <div className="w-full h-full flex justify-center items-center bg-radial from-sky-200 via-blue-400 to-indigo-700 to-90%">
            {children}
        </div>
    )
}