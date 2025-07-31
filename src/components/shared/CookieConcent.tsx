"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import Image from "next/image";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { cn, getConsentCookie, storeConsentCookie } from "@/lib/utils";
import CookieConcentPrivacy from "./CookieConcentPrivacy";
import { OptionalCookies } from "@/types";
import { optionalCookiesOptions, optionalCookiesValues } from "@/constants";

const CookieConcent = ({ className }: { className?: string }) => {
  const [showConsent, setShowConsent] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<
    OptionalCookies | undefined
  >(undefined);

  useEffect(() => {
    getConsentCookie()
      .then((c) => {
        if (c === undefined) {
          setShowConsent(true);
        }
        setCookieConsent(c);
      })
      .catch(() => {});
  }, []);

  const handelClose = (open: boolean) => {
    if (!open) {
      storeConsentCookie(cookieConsent).catch(() => {});
    }
  };

  const handleTrigger = () => {
    setShowConsent(true);
  };

  const updateCookieSettings = ({
    cookies,
    close,
  }: {
    cookies: OptionalCookies | undefined;
    close: boolean;
  }) => {
    storeConsentCookie(cookies)
      .then(() => {
        setCookieConsent(cookies);
      })
      .then(() => setShowConsent(!close))
      .catch(() => {});
  };

  return (
    <Dialog defaultOpen={true} open={showConsent} onOpenChange={handelClose}>
      <DialogTrigger asChild>
        <span
          className={cn("inline-link cursor-pointer", className)}
          onClick={handleTrigger}
        >
          Cookie-Einstellungen
        </span>
      </DialogTrigger>
      <DialogContent
        className="max-w-[750px] max-h-screen overflow-y-auto [&>button]:hidden"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-row align-center justify-center items-center px-8">
          <div>
            <DialogHeader className="px-0 flex flex-row justify-between mb-6">
              <div className="space-y-4">
                <DialogTitle className="m-0 text-3xl">
                  Diese Seite verwendet Cookies
                </DialogTitle>
                <DialogDescription className="text-base text-tc pe-5">
                  Wir verwenden notwendige Cookies, um unsere Website
                  funktionsfähig zu machen. Mit Ihrer Zustimmung verwenden wir
                  außerdem optionale Cookies, um die Nutzung unserer Website zu
                  analysieren und unser Angebot zu verbessern. Weitere
                  Informationen finden Sie in unserer{" "}
                  <CookieConcentPrivacy variant="link" />.
                </DialogDescription>
              </div>
              <Image
                src="/assets/images/cookie-icon.svg"
                width={120}
                height={120}
                alt="Cookie"
                className="max-sm:hidden"
              />
            </DialogHeader>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-base">
                  Welche Cookies verwenden wir?
                </AccordionTrigger>
                <AccordionContent className="text-base  bg-contrast-verylight p-6">
                  <div className="space-y-6 ">
                    <div>
                      <h2 className="text-lg font-semibold">
                        Notwendige Cookies
                      </h2>
                      <p>
                        Notwendige Cookies ermöglichen grundlegende Funktionen
                        und sind für die einwandfreie Funktion der
                        Kernfunktionen diser Website erforderlich. Dazu zählt
                        insbesondere die Benutzeranmeldung. Sie können diese
                        Cookies deaktiviern, indem Sie die Einstellungen Ihres
                        Browsers ändern. Dies kann jedoch zur Folge haben, dass
                        einige Funktionen dieser Website nicht mehr zur
                        Verfügung stehen.
                      </p>
                    </div>
                    {optionalCookiesValues.map((cookie, index) => {
                      const options = Object.hasOwn(
                        optionalCookiesOptions,
                        cookie
                      )
                        ? optionalCookiesOptions[cookie]
                        : undefined;

                      if (options) {
                        return (
                          <div key={`cookie_description_${index}`}>
                            <h2 className="text-lg font-semibold">
                              {options.label}
                            </h2>
                            <p className="whitespace-pre-wrap">
                              {options.description}
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex flex-row max-sm:flex-col justify-center gap-8 my-12">
              <div className="flex flex-row align-center max-sm:w-full max-sm:flex-between items-center gap-2">
                <span className="font-semibold text-md">
                  Notwendige Cookies
                </span>
                <Switch
                  checked={true}
                  disabled={true}
                  className="data-[state=checked]:bg-highlight-100"
                />
              </div>
              {optionalCookiesValues.map((cookie, index) => {
                const options = Object.hasOwn(optionalCookiesOptions, cookie)
                  ? optionalCookiesOptions[cookie]
                  : undefined;

                if (options) {
                  return (
                    <div
                      className="flex flex-row align-center max-sm:w-full max-sm:flex-between items-center gap-4"
                      key={`cookie_checkbox_${index}`}
                    >
                      <span className="font-semibold text-md">
                        {options.label}
                      </span>
                      <Switch
                        className="data-[state=checked]:bg-highlight-100"
                        onCheckedChange={(state) =>
                          setCookieConsent(
                            (prev) =>
                              ({ ...prev, [cookie]: state }) as OptionalCookies
                          )
                        }
                        checked={cookieConsent ? cookieConsent[cookie] : false}
                      />
                    </div>
                  );
                }
              })}
            </div>
            <DialogFooter className="flex flex-row max-sm:flex-col w-full justify-between px-0 gap-2 items-end">
              <div className="w-full">
                <CookieConcentPrivacy
                  variant="button"
                  className="max-sm:w-full"
                />
              </div>
              <div className="flex flex-col justify-center gap-2 max-sm:w-full">
                <Button
                  className="button-subtle"
                  onClick={() =>
                    updateCookieSettings({
                      cookies: cookieConsent,
                      close: true,
                    })
                  }
                >
                  Speichern & Schließen
                </Button>
                <Button
                  className="button-highlight sm:w-64"
                  onClick={() =>
                    updateCookieSettings({
                      cookies: optionalCookiesValues.reduce((acc, cookie) => {
                        acc[cookie] = true;
                        return acc;
                      }, {} as OptionalCookies),
                      close: true,
                    })
                  }
                >
                  Alle akzeptieren
                </Button>
                <Button
                  className="button-highlight sm:w-64"
                  onClick={() =>
                    updateCookieSettings({
                      cookies: optionalCookiesValues.reduce((acc, cookie) => {
                        acc[cookie] = false;
                        return acc;
                      }, {} as OptionalCookies),
                      close: true,
                    })
                  }
                >
                  Alle ablehnen
                </Button>
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CookieConcent;
