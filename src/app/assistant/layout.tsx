import Footer from "@/components/assistant/shared/Footer";
import Navbar from "@/components/assistant/shared/Navbar";
import BetaBanner from "@/components/shared/BetaBanner";
import Providers from "../providers";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Providers>
        <BetaBanner />
        <div className="flex min-h-screen flex-col lg:flex-row flex-wrap bg-contrast-verylight overflow-x-hidden">
          <Navbar />
          <main className="grow flex-1 flex flex-row justify-center my-5 mx-5 sm:ms-10">
            <div className="w-full max-w-[1200px]">{children}</div>
          </main>
          <Footer />
        </div>
      </Providers>
    </>
  );
}
