"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { hasCookie, setCookie } from "cookies-next";
import { hasCookieConsent } from "@/lib/utils";

const BetaBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const getBBCookie = async () => {
      return await hasCookie("hideBetaBanner");
    };
    getBBCookie()
      .then((c) => {
        setShow(!c);
      })
      .catch(() => {});
  }, []);

  const handleClose = () => {
    const setBBCookie = async () => {
      const cookiesAllowed = await hasCookieConsent("CONVINIENCE");
      if (cookiesAllowed) {
        // Set cookie to hide the banner for 12 hours
        await setCookie("hideBetaBanner", "true", { maxAge: 60 * 60 * 12 });
      }
    };
    setBBCookie()
      .catch(() => {})
      .finally(() => setShow(false));
  };

  if (!show) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-highlight-50 flex flex-row">
      <p className=" text-tc-contrast p-5 ">
        <span className="font-semibold">Wichtiger Hinweise:</span> Dies ist eine
        Demo-Version des Intelligenten Sicherheitsassistenten. Bitte beachten
        Sie, dass diese Version nicht zur produktiven Nutzung geeignet ist. Die
        bereitgestellten Handlungsempfehlungen basieren auf unvollständigen
        Datensätzen, die zu Demonstrationszwecken bereitgestellt wurden. Es wird
        ausdrücklich keine Garantie für ihre Vollständigkeit oder Richtigkeit
        gegeben. Zudem können die von Ihnen eingegebenen Daten nach einer
        Aktualisierung des Assistenten jederzeit verloren gehen.
      </p>
      <div>
        <Button
          className="text-tc-contrast p-0 px-2 me-2 mt-2"
          variant="ghost"
          onClick={() => handleClose()}
        >
          <i className="material-symbols-outlined md-md heavy">close</i>
        </Button>
      </div>
    </div>
  );
};

export default BetaBanner;
