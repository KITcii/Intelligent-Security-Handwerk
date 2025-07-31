import "@/styles/globals.css";
import { Metadata } from "next";
import {
  APP_DESCRIPTION,
  APP_NAME,
  DEFAULT_LANGUAGE,
} from "@/constants/metadata";

import "material-symbols";
import { poppins } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import ProgressBar from "@/components/shared/ProgressBar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  icons: {
    icon: "/assets/icons/intsec.logo.simple.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={DEFAULT_LANGUAGE}>
      <body className={cn("text-base", poppins.className)}>
        {children}
        <Toaster
          toastOptions={{
            className: "text-base",
            classNames: {
              success: "gap-4",
              error: "gap-4",
              warning: "gap-4",
              info: "gap-4",
            },
          }}
          icons={{
            success: (
              <i className="material-symbols-outlined text-lg text-highlight-100">
                check_circle
              </i>
            ),
            error: (
              <i className="material-symbols-outlined text-lg bold text-danger-high">
                error
              </i>
            ),
            warning: (
              <i className="material-symbols-outlined text-lg bold text-danger-low">
                warning
              </i>
            ),
            info: (
              <i className="material-symbols-outlined text-lg bold text-highlight-50">
                info
              </i>
            ),
            loading: (
              <ProgressBar
                progress={50}
                spinner={true}
                style="bold"
                className="w-6"
              />
            ),
          }}
        />
      </body>
    </html>
  );
}
