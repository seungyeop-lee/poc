import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-2xl">Root</h1>
      <div className="space-x-3">
        <Link href={"/a"}>Go To A</Link>
        <Link href={"/b"}>Go To B</Link>
      </div>
    </>
  );
}
