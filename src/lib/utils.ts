import {
  FormDataNestedArray,
  FormDataNestedObject,
  OptionalCookies,
  OptionalCookieType,
  RemoveUrlQueryParams,
  UrlQueryParams,
} from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BusinessHours } from "@/types/assistant";
import { redirect } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import { optionalCookiesValues } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: "Europe/Berlin",
  };

  const dateTimeFullOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    //weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
    hour: "2-digit", // numeric hour (e.g., '8')
    minute: "2-digit", // numeric minute (e.g., '30')
    hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: "Europe/Berlin",
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
    timeZone: "Europe/Berlin",
  };

  const dateOptionsShort: Intl.DateTimeFormatOptions = {
    day: "2-digit", // numeric day of the month (e.g., '25')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    timeZone: "Europe/Berlin",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit", // numeric hour (e.g., '8')
    minute: "2-digit", // numeric minute (e.g., '30')
    hour12: false, // use 12-hour clock (true) or 24-hour clock (false)
    timeZone: "Europe/Berlin",
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "de-DE",
    dateTimeOptions
  );

  const formattedDateTimeFull: string = new Date(dateString).toLocaleString(
    "de-DE",
    dateTimeFullOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "de-DE",
    dateOptions
  );

  const formattedDateShort: string = new Date(dateString).toLocaleString(
    "de-DE",
    dateOptionsShort
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "de-DE",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateTimeFull: formattedDateTimeFull,
    dateOnly: formattedDate,
    dateOnlyShort: formattedDateShort,
    timeOnly: formattedTime,
  };
};

// calculates the difference between two Date objects and returns a formated string
export function formatTimeDiff(date_1: Date, date_2: Date) {
  const seconds = Math.ceil(
    Math.abs(date_1.valueOf() - date_2.valueOf()) / 1000
  );

  if (seconds < 100) {
    // less than 100 seconds: return as seconds
    return `${seconds} ${seconds > 1 ? "Sekunden" : "Sekunde"}`;
  } else if (seconds < 60 * 100) {
    // less than 100 minutes: return as minutes
    const value = Math.ceil(seconds / 60);
    return `${value} ${value > 1 ? "Minuten" : "Minute"}`;
  } else if (seconds < 60 * 60 * 24) {
    // less than 24 hours: return as hours
    const value = Math.ceil(seconds / (60 * 60));
    return `${value} ${value > 1 ? "Stunden" : "Stunde"}`;
  } else if (seconds < 60 * 60 * 24 * 31) {
    // less than 31 days: return as days
    const value = Math.ceil(seconds / (60 * 60 * 24));
    return `${value} ${value > 1 ? "Tage" : "Tag"}`;
  } else if (seconds < 60 * 60 * 24 * 365) {
    // less than 365 days: return as months
    const value = Math.ceil(seconds / (60 * 60 * 24 * 31));
    return `${value} ${value > 1 ? "Monate" : "Monat"}`;
  } else {
    // more than 365 days: return as years
    const value = Math.round(seconds / (60 * 60 * 24 * 365));
    return `${value} ${value > 1 ? "Jahre" : "Jahr"}`;
  }
}

// converts seconds to string
export function formatTimeString(sec: number) {
  const seconds = Math.ceil(sec);

  if (seconds < 1) {
    return "Unter einer Sekunde";
  } else if (seconds < 100) {
    // less than 100 seconds: return as seconds
    return `${seconds} ${seconds > 1 ? "Sekunden" : "Sekunde"}`;
  } else if (seconds < 60 * 100) {
    // less than 100 minutes: return as minutes
    const value = Math.ceil(seconds / 60);
    return `${value} ${value > 1 ? "Minuten" : "Minute"}`;
  } else if (seconds < 60 * 60 * 24) {
    // less than 24 hours: return as hours
    const value = Math.ceil(seconds / (60 * 60));
    return `${value} ${value > 1 ? "Stunden" : "Stunde"}`;
  } else if (seconds < 60 * 60 * 24 * 31) {
    // less than 31 days: return as days
    const value = Math.ceil(seconds / (60 * 60 * 24));
    return `${value} ${value > 1 ? "Tage" : "Tag"}`;
  } else if (seconds < 60 * 60 * 24 * 365) {
    // less than 365 days: return as months
    const value = Math.ceil(seconds / (60 * 60 * 24 * 31));
    return `${value} ${value > 1 ? "Monate" : "Monat"}`;
  } else {
    // more than 365 days: return as years
    const value = Math.round(seconds / (60 * 60 * 24 * 365));
    return `${value.toLocaleString()} ${value > 1 ? "Jahre" : "Jahr"}`;
  }
}

// convert business hours object to string
export function formatBusinessHours(bH: BusinessHours): string {
  const daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  if (!bH.always) {
    let days = "";
    if (
      bH.weekDayStart !== undefined &&
      bH.weekDayStart > 0 &&
      bH.weekDayStart <= daysOfWeek.length
    ) {
      days += daysOfWeek[bH.weekDayStart - 1];

      if (
        bH.weekDayEnd !== undefined &&
        bH.weekDayEnd > 0 &&
        bH.weekDayEnd <= daysOfWeek.length &&
        bH.weekDayEnd > bH.weekDayStart
      ) {
        days += "–" + daysOfWeek[bH.weekDayEnd - 1];
      }
    }
    let hours = "";
    if (
      bH.timeStart !== undefined &&
      bH.timeStart >= 0 &&
      bH.timeStart <= 24 * 60 &&
      bH.timeEnd !== undefined &&
      bH.timeEnd >= 0 &&
      bH.timeEnd <= 24 * 60 &&
      bH.timeStart < bH.timeEnd
    ) {
      const start = formatMinutesToHours(bH.timeStart);
      const end = formatMinutesToHours(bH.timeEnd);
      if (start !== "" && end !== "") {
        hours = `${start}–${end} Uhr`;
      }
    }
    return `${days}${days.length > 0 && hours.length > 0 ? " von " : ""}${hours}`;
  }
  return "Durchgehend erreichbar";
}

export function formatMinutesToHours(minutes: number): string {
  if (minutes >= 0 && minutes <= 24 * 60) {
    return `${Math.floor(minutes / 60)
      .toString()
      .padStart(
        2,
        "0"
      )}${minutes % 60 > 0 ? ":" + (minutes % 60).toString().padStart(2, "0") : ""}`;
  }
  return "";
}

export function removeKeysFromQuery({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function updatePramFromUrlQuery({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string;
}) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function updatePramsFromUrlQuery({
  params,
  data,
}: {
  params: string;
  data: { key: string; value: string | undefined }[];
}) {
  const currentUrl = qs.parse(params);
  data.forEach(({ key, value }) => {
    if (value === undefined) {
      delete currentUrl[key];
    } else {
      currentUrl[key] = value;
    }
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function formUrlQuery({ params, data }: UrlQueryParams) {
  const currentUrl = qs.parse(params);

  for (let i = 0; i < data.length; i++) {
    currentUrl[data[i].key] = data[i].value;
  }

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export const handleError = (error: unknown) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  //throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

// degrees to radians conversion
export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};

// subdivide an array of objects by the first letter of the key string and order the subdivisions alphabetically
export const subdivideAndOrder = <T>(
  objects: T[],
  getKey: (obj: T) => string
): { [key: string]: T[] } => {
  const subdivided: { [key: string]: T[] } = objects.reduce(
    (acc: { [key: string]: T[] }, obj: T) => {
      let key = getKey(obj).charAt(0).toUpperCase();
      // Check if the first character is a number
      if (!isNaN(parseInt(key, 10))) {
        key = "0-9";
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    },
    {}
  );

  // Sort the subdivisions alphabetically
  const sortedKeys = Object.keys(subdivided).sort((a, b) => a.localeCompare(b));
  const sortedSubdivided: { [key: string]: T[] } = {};
  sortedKeys.forEach((key) => {
    sortedSubdivided[key] = subdivided[key];
  });

  return sortedSubdivided;
};

// Transforms data submitted through a html form into an object of nested key-value pairs
export const transformNestedFormToObject = (pairs: {
  [key: string]: FormDataEntryValue;
}): FormDataNestedObject => {
  const result: FormDataNestedObject = {};
  for (const key in pairs) {
    const keys = key.split(".");
    const value = pairs[key];
    let current: FormDataNestedObject | FormDataNestedArray = result;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;

      const index = parseInt(key, 10);
      if (!isNaN(index)) {
        if (!Array.isArray(current)) {
          throw new Error("Trying to access array index on a non-array");
        }
        if (!current[index]) {
          if (isLast) {
            current[index] = value;
          } else {
            current[index] = {};
          }
        }
        current = current[index] as FormDataNestedObject | FormDataNestedArray;
      } else {
        if (Array.isArray(current)) {
          throw new Error("Trying to access object property on an array");
        }
        if (!current[key]) {
          if (isLast) {
            current[key] = value;
          } else {
            current[key] =
              keys[i + 1] && !isNaN(parseInt(keys[i + 1], 10)) ? [] : {};
          }
        }
        current = current[key] as FormDataNestedObject | FormDataNestedArray;
      }
    }
  }
  return result;
};

export const handleUnauthorized = () => {
  redirect("/auth/login");
};

// Function to calculate the visible page numbers in pagination
export function getVisiblePageNumbers(
  maxPages: number,
  currentPage: number,
  maxVisiblePages: number
): number[] {
  // Ensure the inputs are valid
  if (maxPages <= 0 || currentPage <= 0 || maxVisiblePages <= 0) {
    throw new Error("Invalid input: all parameters must be positive integers.");
  }

  // Limit currentPage to the range [1, maxPages]
  currentPage = Math.min(Math.max(currentPage, 1), maxPages);

  // Calculate the start and end of the visible page numbers
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(maxPages, currentPage + half);

  // Adjust the range if there are not enough pages at the start or end
  if (end - start + 1 < maxVisiblePages) {
    if (start === 1) {
      end = Math.min(maxPages, start + maxVisiblePages - 1);
    } else if (end === maxPages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
  }

  // Generate the visible page numbers
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
}

export function escapeRegex(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function areArraysEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) {
    return false;
  }

  const sortedArray1 = [...array1].sort();
  const sortedArray2 = [...array2].sort();

  for (let i = 0; i < sortedArray1.length; i++) {
    if (sortedArray1[i] !== sortedArray2[i]) {
      return false;
    }
  }

  return true;
}

const decodeConsentCookie = (cookie: string) => {
  return JSON.parse(cookie) as OptionalCookies;
};

const encodeConsentCookie = (cookie: OptionalCookies) => {
  return JSON.stringify(cookie);
};

export const getConsentCookie = async () => {
  const cookie = await getCookie("cookieConsent");

  if (cookie) {
    return decodeConsentCookie(cookie);
  }
  return undefined;
};

export const hasCookieConsent = async (key: OptionalCookieType) => {
  return getConsentCookie().then((cookie) => {
    return cookie !== undefined && cookie[key];
  });
};

export const storeConsentCookie = async (cookie?: OptionalCookies) => {
  console.log(cookie);
  if (cookie) {
    await setCookie("cookieConsent", encodeConsentCookie(cookie), {});
  } else {
    // default values for all optional cookies is false
    await setCookie(
      "cookieConsent",
      encodeConsentCookie(
        optionalCookiesValues.reduce((acc, cookie) => {
          acc[cookie] = false;
          return acc;
        }, {} as OptionalCookies)
      ),
      {}
    );
  }
};
