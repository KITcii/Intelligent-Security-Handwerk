import { CompanySizeClassesValues, optionalCookiesValues } from "@/constants";

export type UrlQueryParams = {
  params: string;
  data: {
    key: string;
    value: string | null;
  }[];
};

export type RemoveUrlQueryParams = {
  params: string;
  keysToRemove: string[];
};

export type CustomFormState = {
  success?: boolean;
  errors?: {
    [key: string]: (string[] | { [key: string]: string[] }) | undefined;
  };
  message?: string; // global form error message if the success is false
  fields?: Record<string, string>;
  payload?: unknown;
};

export type CustomServerActionState = {
  success: boolean;
  message?: string;
  payload?: unknown;
};

export type FormDataNestedObject = {
  [key: string]:
    | FormDataNestedObject
    | FormDataNestedArray
    | FormDataEntryValue;
};
export type FormDataNestedArray = (FormDataNestedObject | FormDataEntryValue)[];

export type ZipCodeSearchResult = {
  totalPages?: number;
  totalElements?: number;
  pageable: unknown;
  numberOfElements: number;
  size: number;
  content?: ZipCodeEntryLight[];
  number: number;
  sort?: unknown;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type ZipCodeEntryLight = {
  id: number;
  name: string;
  postalCode: string;
};

export type BackendCompanyLocation = {
  id: string;
  name: string;
  postalCode: string;
  county: BackendCompanyLocationCounty;
};

export type BackendCompanyLocationCounty = {
  id: string;
  name: string;
  code: string;
  state: BackendCompanyLocationState;
};

export type BackendCompanyLocationState = {
  id: string;
  name: string;
  code: string;
  country: BackendCompanyLocationCountry;
};

export type BackendCompanyLocationCountry = {
  id: string;
  name: string;
  code: string;
};

export type CompanySizeClasses = (typeof CompanySizeClassesValues)[number];

export type CompanySizeClass = {
  id: CompanySizeClasses;
  name: string;
};

export type CreateOwnerRequest = {
  user: {
    mail: string;
    firstName: string;
    lastName: string;
  };
  password: string;
  company: {
    name: string;
    profession?: {
      id: string;
    } | null;
    companyType?: CompanySizeClasses | null;
    locationId?: string | null;
  };
};

export type UpdateCompanyRequest = {
  name?: string;
  companyType?: CompanySizeClasses | null;
  profession?: { id: string } | null;
  locationId?: string | null;
};

export type OptionalCookieType = (typeof optionalCookiesValues)[number];

export type OptionalCookies = { [K in OptionalCookieType]: boolean };

export type OptionalCookiesOptions = {
  [K in OptionalCookieType]: {
    label: string;
    description: string;
  };
};
