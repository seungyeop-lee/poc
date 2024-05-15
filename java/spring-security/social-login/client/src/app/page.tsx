'use client';

import {useMemberState} from "@/state/memberState";

export default function Home() {
    const {accessToken} = useMemberState();

    return <>
        <div className="m-5">
            <h1 className="text-4xl font-bold text-center">Welcome to the Social Login App</h1>
            <div className="flex flex-col items-center mt-10">
                <button
                    className="bg-sky-500 hover:bg-sky-700 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                    onClick={() => {
                        window.location.href = "http://localhost:8080/oauth2/authorization/google";
                    }}>
                    Google Login
                </button>
            </div>
            <hr className="my-10"/>
            <div className="flex flex-col">
                <h2 className="text-2xl text-center">Member State</h2>
                {accessToken != null &&
                    <div className="mt-5">
                        <h3 className="text-xl">Access Token</h3>
                        <div className="break-words">
                            {accessToken}
                        </div>
                    </div>}
            </div>
        </div>
    </>;
}
