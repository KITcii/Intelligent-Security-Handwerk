import Image from "next/image";
import MobileNav from "@/components/assistant/shared/MobileNav";
import NavBarItems from "@/components/assistant/shared/NavBarItems";

const Navbar = () => {
  return (
    <>
      <div className="min-h-[50px] lg:min-h-[calc(100vh-200px)] w-screen lg:w-[275px] bg-background drop-shadow-soft-1 mb-5 p-3">
        <div className="flex flex-between mt-3">
          <Image
            src="/assets/logos/ish-horizontal-text.svg"
            alt="logo"
            priority
            width={180}
            height={43}
            className="max-sm:ms-3 sm:max-lg:ms-8"
          />
          <MobileNav />
        </div>
        <nav className="lg:flex-between hidden my-10">
          <NavBarItems />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
