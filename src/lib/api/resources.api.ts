"use server";

import "server-only";
import { EmergencyResourcesData } from "@/types/assistant";
import { handleError } from "../utils";

// eslint-disable-next-line @typescript-eslint/require-await
export async function getEmergencyResourcesData(): Promise<
  EmergencyResourcesData | undefined
> {
  try {
    // nextIteration: fetch data from API
    const data = {
      contacts: [
        {
          id: "1",
          name: "Notfall-Hotline Cyberwehr",
          phone: "0800-CYBERWEHR",
          businessHours: {
            always: true,
          },
        },
        {
          id: "2",
          name: "Service Center des BSI",
          phone: "0800 274 1000",
          businessHours: {
            weekDayStart: 1,
            weekDayEnd: 5,
            timeStart: 480,
            timeEnd: 1080,
            always: false,
          },
        },
        {
          id: "3",
          name: "Ansprechstellen Cybercrime Baden-Württemberg",
          phone: "0711 5401 2444",
          businessHours: {
            always: true,
          },
        },
        {
          id: "4",
          name: "Ansprechstellen Cybercrime Bundeskriminalamt",
          phone: "0611 55 15037",
          businessHours: {
            always: true,
          },
        },
      ],
      websites: [
        {
          id: "1",
          name: "TOP 12 Maßnahmen bei Cyber-Angriffen",
          url: "https://example.com",
        },
        {
          id: "2",
          name: "Maßnahmenkatalog zum Notfallmanagement",
          url: "https://example.com",
        },
        {
          id: "3",
          name: "Erste Hilfe bei schweren IT-Sicherheitsvorfällen",
          url: "https://example.com",
        },
      ],
    } as EmergencyResourcesData;
    return data;
  } catch (error) {
    handleError(error);
    return undefined;
  }
}
