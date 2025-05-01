import { PropsWithChildren } from "react";

export default function Layout({children}:PropsWithChildren<undefined>){
    return(
        <div className="w-full h-full flex justify-center items-center">
            {children}
        </div>
    )
}