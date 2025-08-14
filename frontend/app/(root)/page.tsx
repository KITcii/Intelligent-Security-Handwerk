import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <Link href="/auth/login">
      <div className="flex flex-col min-h-screen justify-center items-center">
        <Image
          src={"/assets/logos/ish-horizontal-text.svg"}
          width={1000}
          height={1000}
          alt="Intelligen Security Handwerk"
          className="w-[70%]"
          priority={true}
        />
        <div className="text-base bottom-6 sm:text-xl sm:bottom-10 md:text-3xl md:p-2 lg:text-5xl xl:text-6xl xl:p-4 2xl:text-7xl 2xl:p-6 2xl:bottom-16 uppercase font-extrabold bg-highlight-100 text-tc-contrast rounded-full rotate-[350deg] relative left-[15%]">
          <div className="px-4 py-2">Beta-Zugang</div>
        </div>
      </div>
    </Link>
  );
}
