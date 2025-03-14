'use client';

import Link from "next/link";
import {useRef} from "react";

export default function Page() {
    const textInpputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <h1 className="text-2xl">Page A</h1>
            <div className="space-x-3">
                <Link href={"/"}>Go To Root</Link>
                <Link href={"/b"}>Go To B</Link>
            </div>
            <div className="flex flex-col space-y-3">
                <input type="text" className="input" ref={textInpputRef} />
                <button type="button" className="btn" onClick={() => {
                    console.log(textInpputRef.current?.value);
                }}>
                    Log in console
                </button>
                <button type="button" className="btn" onClick={() => {
                    console.error(textInpputRef.current?.value);
                }}>
                    Error Log in console
                </button>
                <button type="button" className="btn" onClick={() => {
                    throw Error("Error!!!");
                }}>
                    Error
                </button>
            </div>
        </>
    );
}
