'use client';

import {useMemberStore} from "@/store/memberStore";

const clear = useMemberStore.persist.clearStorage;

export default function Home() {
    const {accessToken} = useMemberStore();

    return <>
        <div className="m-5">
            <h1 className="text-4xl font-bold text-center">Welcome to the Social Login App</h1>
            <div className="flex flex-col items-center mt-10">
                <button
                    className="bg-red-500 hover:bg-red-600 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                    onClick={() => {
                        window.location.href = "http://localhost:8080/oauth2/authorization/google";
                    }}>
                    Google Login
                </button>
            </div>
            <hr className="my-5"/>
            <div className="flex flex-col">
                <h2 className="text-2xl text-center">Call Test</h2>
                <div className="mt-5">
                    <button
                        className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                        onClick={() => {
                            callTest(accessToken, "http://localhost:8080/user/my");
                        }}>
                        /user/my
                    </button>
                </div>
            </div>
            <hr className="my-5"/>
            <div className="flex flex-col">
                <h2 className="text-2xl text-center">Member State</h2>
                <div className="flex justify-end mt-5">
                    <button
                        className="bg-black hover:bg-gray-800 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                        onClick={() => {
                            clear();
                            window.location.reload();
                        }}
                    >
                        clear storage
                    </button>
                </div>
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

function callTest(
    accessToken: string | undefined,
    url: string
) {
    if (!accessToken) {
        accessToken = '';
    }

    fetch(url, {
        headers: {
            "Authorization": "Bearer " + accessToken,
        }
    })
        .then(response => {
            if (response.ok) {
                response.text().then(text => { alert(text); })
            } else {
                throw new Error("HTTP status " + response.status);
            }
        })
        .catch(error => {
            alert(error);
        });
}
