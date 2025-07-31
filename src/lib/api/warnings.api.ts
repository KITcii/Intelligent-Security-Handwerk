import { CustomCurrentAlertData, CustomFeedData } from "@/types/assistant";
import { handleError } from "@/lib/utils";
import { CommonSecurityAdvisoryFramework } from "@/types/csaf";
import { Asset } from "@/types/assistant";
import { delayLoad } from "../actions/test.action";

export async function getCustomFeed({
  page = 0,
  maxItems = 10,
}: {
  page?: number;
  maxItems?: number;
  companyId?: number;
}): Promise<CustomFeedData | undefined> {
  // nextIteration: fetch data from API
  await delayLoad(0);
  const testCSAs = [
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0703.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0704.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0702.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0701.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0700.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0699.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-3050.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-3174.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0698.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2022/wid-sec-w-2022-1243.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2022/wid-sec-w-2022-1847.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-0978.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-1503.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-1842.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-1858.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-2193.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-2275.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-2497.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-2620.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-2723.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0701.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0700.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0699.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-3050.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-3174.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2022/wid-sec-w-2022-1243.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2022/wid-sec-w-2022-1847.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-0978.json",
    "https://wid.cert-bund.de/.well-known/csaf/white/2023/wid-sec-w-2023-1503.json",
  ];

  // Pagination
  const totalPages = Math.ceil(testCSAs.length / maxItems);
  // default to page 0 if requested page is out of range
  const currentPage = page >= 0 && page < totalPages ? page : 0;

  const testCSAsSelection = testCSAs.slice(
    currentPage * maxItems,
    currentPage * maxItems + maxItems
  );

  const items = await Promise.all(
    testCSAsSelection.map(async (url: string) => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Could not fetch data from external source");
        }

        const csa: CommonSecurityAdvisoryFramework =
          (await response.json()) as CommonSecurityAdvisoryFramework;

        if (csa) {
          return {
            csa: csa,
            assets: [{} as Asset],
          };
        }
      } catch (error) {
        handleError(error);
        return undefined;
      }
    })
  );

  return {
    items: items,
    sourceName: "CERT-Bund",
    sourceUrl: "https://wid.cert-bund.de",
    page: currentPage,
    total: totalPages,
    lastUpdated: new Date(Date.now() - 1000 * 60),
  } as CustomFeedData;
}

export async function getCustomCurrentAlert(): Promise<
  CustomCurrentAlertData | undefined
> {
  try {
    await delayLoad(0);
    // nextIteration: fetch data from API
    const response = await fetch(
      `https://wid.cert-bund.de/.well-known/csaf/white/2024/wid-sec-w-2024-0389.json`
    );

    if (!response.ok) {
      throw new Error("Could not fetch data from external source.");
    }

    const csa: CommonSecurityAdvisoryFramework =
      (await response.json()) as CommonSecurityAdvisoryFramework;

    if (csa) {
      return { csa: csa } as CustomCurrentAlertData;
    }
  } catch (error) {
    handleError(error);
    return undefined;
  }
  return {};
}
