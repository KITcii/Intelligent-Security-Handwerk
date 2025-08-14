import { Asset } from "@/types/assistant";
import styles from "@/components/assistant/widgets/WarningTickerItem.module.css";
import { cn, formatDateTime } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Branch,
  CommonSecurityAdvisoryFramework,
  ListOfBranches,
  Note,
  Reference,
} from "@/types/csaf";
import Link from "next/link";

const WarningTickerItem = ({
  csa,
  className,
}: {
  csa: CommonSecurityAdvisoryFramework;
  className?: string;
}) => {
  const severity = csa.document.aggregate_severity?.text;
  const date = new Date(Date.parse(csa.document.tracking.current_release_date));
  const getColors = (severity: string | undefined) => {
    switch (severity) {
      case "kritisch":
        return {
          bg: "bg-danger-critical",
          hover:
            "hover:from-danger-critical hover:to-danger-critical hover:text-carnation-50",
          label: "kritisch",
        };
      case "hoch":
        return {
          bg: "bg-danger-high",
          hover:
            "hover:from-danger-high hover:to-danger-high hover:text-carnation-50",
          label: "hoch",
        };
      case "mittel":
        return {
          bg: "bg-danger-mid",
          hover:
            "hover:from-danger-mid hover:to-danger-mid hover:text-orange-50",
          label: "mittel",
        };
      case "niedrig":
        return {
          bg: "bg-danger-low",
          hover:
            "hover:from-danger-low hover:to-danger-low hover:text-amber-950",
          label: "niedrig",
        };
      default:
        return {
          bg: "bg-danger-none",
          hover: "hover:danger-none",
          label: "",
        };
    }
  };

  // nextIteration: temporay for test purposes
  const extractProductNames = (
    products: string[],
    branches?: ListOfBranches
  ) => {
    if (branches !== undefined && branches.length > 0) {
      branches.map((branch: Branch) => {
        if (branch.category === "product_name") {
          products.push(branch.name);
        }
        if (branch.branches !== undefined && branch.branches.length > 0) {
          extractProductNames(products, branch.branches);
        }
        return;
      });
      return;
    }
    return;
  };
  const products: string[] = [];
  const assetsTest: Asset[] = [];
  extractProductNames(products, csa.product_tree?.branches);
  products.map((product: string, index) => {
    assetsTest?.push({
      id: `${index}`,
      name: product,
      description: "",
      label: "",
    });
  });

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-0 p-0 mb-[2px]">
        <AccordionTrigger
          className={cn(
            "transition-none hover:no-underline p-0 pe-2 bg-gradient-to-r from-background from-5% to-contrast-verylight",
            getColors(severity).hover
          )}
        >
          <div
            className={cn("w-full flex flex-between items-center", className)}
          >
            <div
              className={cn(getColors(severity).bg, "w-2 h-10 flex-none")}
            ></div>
            <div
              className={cn(
                styles.tickerbar,
                "flex-none bg-contrast-semidark text-tc-contrast font-bold hidden sm:block"
              )}
            >
              {getColors(severity).label}
            </div>

            <div className="grow h-9 flex items-center text-left max-md:ms-2">
              <p className="line-clamp-1">{csa.document.title}</p>
            </div>
            <div className="flex-none h-9 flex items-center px-2 pe-4 w-28 max-sm:hidden">
              {date && (
                <time
                  dateTime={date.toDateString()}
                  className="w-full text-right"
                >
                  {formatDateTime(date).dateOnlyShort}
                </time>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-base">
          <div className="ps-2 sm:ps-14 sm:pe-12 py-4">
            <p className="sm:hidden mb-3">
              {date && (
                <time
                  dateTime={date.toDateString()}
                  className="w-full text-right"
                >
                  {formatDateTime(date).dateOnlyShort}
                </time>
              )}
            </p>
            <p>
              {
                csa.document.notes?.filter((note: Note) => {
                  return note.category === "summary";
                })[0]?.text
              }
            </p>
            <p>
              {
                csa.document.notes?.filter((note: Note) => {
                  return note.category === "description";
                })[0]?.text
              }
            </p>
            <p className=" my-2">
              <Link
                href={
                  csa.document.references?.filter((ref: Reference) => {
                    return (
                      ref.category === "self" && !ref.url.endsWith(".json")
                    );
                  })[0]?.url || ""
                }
                target="_blank"
                className="external-link"
              >
                Weitere Informationen
              </Link>
            </p>
            <div>
              <h3 className="font-semibold mt-2 mb-1">
                Ihre betroffenen IT-Komponenten:
              </h3>
              <div>
                <ul>
                  {assetsTest?.map((asset, index) => {
                    return (
                      <li
                        key={`asset_${index}`}
                        className="list-inside list-disc"
                      >
                        {asset.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default WarningTickerItem;
