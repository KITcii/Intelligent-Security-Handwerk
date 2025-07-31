import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { footerLinksAssistant } from "@/constants/navigation";
import { APP_COPYRIGHT, APP_SLOGAN } from "@/constants/metadata";
import CookieConcent from "@/components/shared/CookieConcent";

const Footer = () => {
  return (
    <footer className="bg-background w-screen mt-auto px-10 py-7  ">
      <div className="flex flex-col md:flex-row flex-wrap gap-y-8 ">
        <div>
          <Image
            src="/assets/logos/ish-horizontal-text.svg"
            alt="logo"
            width={180}
            height={43}
          />
          <div className="text-tc-muted mt-3 w-64">{APP_SLOGAN}</div>
        </div>
        <Separator
          orientation="vertical"
          className="h-[130px] hidden md:flex bg-contrast-semidark mx-16"
        />
        <div className="grow">
          <ul>
            {footerLinksAssistant.map((link) => {
              return (
                <li className="my-2" key={`footer_link_${link.route}`}>
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
            <li className="my-2">
              <CookieConcent />
            </li>
          </ul>
        </div>
      </div>
      <div className="text-tc-muted mt-5">{APP_COPYRIGHT}</div>
    </footer>
  );
};

export default Footer;
