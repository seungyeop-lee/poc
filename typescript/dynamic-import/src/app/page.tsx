import Link from "next/link";

export default function Home() {
  return (
    <div className="w-svh h-svh p-5 flex flex-col justify-center items-center space-y-5">
      <div className="flex justify-center">
        <h1 className="text-2xl">Dynamic Import Demo</h1>
      </div>
      <div className="grow flex flex-col w-[100%] md:w-[80%] xl:w-[60%]">
        <ul className="space-y-3">
          <li className="p-4 bg-slate-200 rounded w-32">
            <Link href={'/csr'}>CSR</Link>
          </li>
          <li className="p-4 bg-slate-200 rounded w-32">
            <Link href={'/ssr'}>SSR</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
