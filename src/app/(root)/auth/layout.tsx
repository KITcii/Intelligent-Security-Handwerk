import Image from "next/image";
import Link from "next/link";
import { footerLinksAuth } from "@/constants/navigation";
import { APP_COPYRIGHT, APP_NAME, APP_SLOGAN } from "@/constants/metadata";
import CookieConcent from "@/components/shared/CookieConcent";
import BetaBanner from "@/components/shared/BetaBanner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BetaBanner />
      <div className="min-h-screen h-full min-w-[300px] flex flex-col justify-between bg-contrast-verylight">
        <main className="h-full">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col items-center gap-5 mt-12">
              <div>
                <Link href="/auth/login">
                  <Image
                    src="/assets/logos/ish-horizontal-text.svg"
                    alt="logo"
                    width={180}
                    height={43}
                  />
                </Link>
              </div>
              <div className="flex flex-col items-center w-full  bg-background sm:w-fit sm:drop-shadow-lg sm:rounded-lg p-10 mb-10">
                {children}
              </div>
            </div>
          </div>
        </main>
        <footer className="flex flex-col items-center w-full mt-auto sm:px-10 py-7 gap-3 sm:gap-1 bg-background text-tc-muted text-center">
          <div className="font-semibold">
            <Link href="/" className="inline-link">
              {APP_NAME}
            </Link>
          </div>
          <div>{APP_SLOGAN}</div>
          <div>
            <ul className="flex flex-col sm:flex-row">
              {footerLinksAuth.map((link, index) => {
                return (
                  <li key={`nav_link_${index}`}>
                    {index > 0 && (
                      <span className="text-tc-muted mx-2 hidden sm:inline ">
                        |
                      </span>
                    )}
                    <Link
                      href={link.route}
                      className="inline-link"
                      target={link.external ? "_blank" : ""}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                <span className="text-tc-muted mx-2 hidden sm:inline ">|</span>
                <CookieConcent />
              </li>
            </ul>
          </div>
          <div><Link href="https://kit.edu" target="_blank" className="inline-link">{APP_COPYRIGHT}</Link></div>
        </footer>
      </div>
    </>
  );
}
