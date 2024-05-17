'use client';

import {useMemberStore} from "@/store/memberStore";
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

const clearMemberStore = useMemberStore.persist?.clearStorage;

export default function Home() {
    const {accessToken, refreshToken, refreshAccessToken} = useMemberStore();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const router = useRouter();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

    useEffect(() => {
        if (error != null) {
            alert("로그인 중 에러가 발생하였습니다.");
            router.push("/");
        }
    }, [error, router]);

    return <>
        <div className="m-5">
            <h1 className="text-4xl font-bold text-center">Welcome to the Social Login App</h1>
            <div className="flex mt-10">
                <form className="flex justify-center items-center grow" action="http://localhost:8080/user/login" method="post">
                    <div className="grid grid-cols-1 gap-2">
                        <label className="block">
                            <span>이메일</span>
                            <input type="email" name="email" className="mt-1 block w-full" onChange={e => setEmail(e.target.value)}></input>
                        </label>
                        <label className="block">
                            <span>패스워드</span>
                            <input type="password" name="password" className="mt-1 block w-full" onChange={e => setPassword(e.target.value)}></input>
                        </label>
                    </div>
                    <div className="grid grid-cols-1 gap-2 ms-5">
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="outline outline-green-600 hover:outline-green-800 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold w-full"
                            >
                                로그인
                            </button>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="button"
                                className="outline outline-red-300 hover:outline-red-600 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold w-full"
                                onClick={() => joinRequest(email, password)}
                            >
                                회원가입
                            </button>
                        </div>
                    </div>
                </form>
                <div className="flex flex-col justify-center items-center grow">
                    <button
                        className="bg-red-500 hover:bg-red-600 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white"
                        onClick={() => {
                            window.location.href = "http://localhost:8080/oauth2/authorization/google";
                        }}>
                        Google Login
                    </button>
                    <button
                        className="bg-green-500 hover:bg-green-600 px-6 py-2.5 text-sm leading-5 rounded-md font-semibold text-white mt-3"
                        onClick={() => {
                            window.location.href = "http://localhost:8080/oauth2/authorization/naver";
                        }}>
                        Naver Login
                    </button>
                </div>
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
                    <button
                        className="bg-sky-500 hover:bg-sky-600 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white ms-1"
                        onClick={() => {
                            callTest(accessToken, "http://localhost:8080/auth/token/info");
                        }}>
                        /auth/token/info
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
                            refreshAccessToken();
                        }}
                    >
                        refresh token
                    </button>
                    <button
                        className="bg-black hover:bg-gray-800 px-5 py-2.5 text-sm leading-5 rounded-md font-semibold text-white ms-1"
                        onClick={() => {
                            clearMemberStore();
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
                {refreshToken != null &&
                    <div className="mt-5">
                    <h3 className="text-xl">Refresh Token</h3>
                        <div className="break-words">
                            {refreshToken}
                        </div>
                    </div>
                }
            </div>
        </div>
    </>
}

function joinRequest(email: string | undefined, password: string | undefined) {
    fetch("http://localhost:8080/user/join", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    })
        .then(response => {
            if (response.ok) {
                alert("회원가입이 완료되었습니다.");
                window.location.reload();
            } else {
                throw new Error("HTTP status " + response.status);
            }
        })
        .catch(error => {
            alert(error);
        });
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
                response.text().then(text => {
                    alert(text);
                })
            } else {
                throw new Error("HTTP status " + response.status);
            }
        })
        .catch(error => {
            alert(error);
        });
}
