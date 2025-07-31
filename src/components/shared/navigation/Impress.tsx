import BackgroundPanel from "@/components/assistant/shared/BackgroundPanel";
import Link from "next/link";

const Impress = () => {
  return (
    <BackgroundPanel contentClassName="p-10 md:ps-20">
      <div className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Beispielmann GmbH</h2>
          <p>
            Beispielstraße 10
            <br />
            01234 Beispielstadt
          </p>
          <p>Deutschland</p>
        </div>
        <div className="space-y-2">
          <p>Handelsregister: HRA 98765</p>
          <p>Registergericht: Amtsgericht Beispielstadt</p>
          <p>Umsatzsteuer-ID gem. § 27a UStG: DE 10987654</p>
        </div>
        <div>
          <p>Vertretungsberechtige Geschäftsführerin: Andrea Beispielfrau</p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Kontakt:</h2>
          <p>
            E-Mail:{" "}
            <a
              className="inline-link"
              href="mailto:kontakt@beispielmanngmbh.de"
            >
              kontakt@beispielmanngmbh.de
            </a>
          </p>
          <p>
            Telefon: 0123/0123456
            <br />
            Fax: 0123/0123458
          </p>
          <p>
            <Link
              className="external-link"
              href="https://www.beispielgmbh.de"
              target="_blank"
            >
              www.beispielgmbh.de
            </Link>
          </p>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">
            Inhaltlich Verantwortlicher gem. § 18 Abs. 2 MStV:
          </h2>
          <p>Andreas Beispielmann (Kontakt s.o.)</p>
        </div>
      </div>
    </BackgroundPanel>
  );
};

export default Impress;
