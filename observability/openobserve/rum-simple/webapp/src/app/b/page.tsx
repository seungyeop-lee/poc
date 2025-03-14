import Link from "next/link";

export default function Page() {
    return (
        <>
            <h1 className="text-2xl">Page B</h1>
            <div className="space-x-3">
                <Link href={"/"}>Go To Root</Link>
                <Link href={"/a"}>Go To A</Link>
            </div>
        </>
    );
}
