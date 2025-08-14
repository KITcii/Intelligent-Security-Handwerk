import { CommonSecurityAdvisoryFramework } from "./csaf";
import {
  AssetListStructureValues,
  AssetListViewsValues,
  AssetSortingFieldValues,
  AssetSortingOptionValues,
  AssetVariantsValues,
  MeasureDisplayStatusValues,
  MeasureStatusLabelValues,
  MeasureStatusValues,
  RecommendationsSeverityValues,
  RecommendationStatusValues,
  SettingsTabsNamesValues,
  StandardCoverageGradeValues,
  SupportServiceTypeValues,
} from "@/constants/assistant";
import { BackendUserRoles } from "@/constants/user";
import { BackendCompanyLocation, CompanySizeClasses } from ".";

export type RecommendationsMetaData = {
  newCounter: number; // number of new recommendations
};

export type CustomCurrentAlertData = {
  csa?: CommonSecurityAdvisoryFramework; // csa document that describes the warning
};

export type CustomFeedData = {
  sourceName: string; // name of the news vendor
  sourceUrl: string; // url to the news vendor website
  lastUpdated: Date; // date when the custom feed was last updated
  items?: {
    assets: Asset[]; // assets of the user that are involved in the warning
    csa: CommonSecurityAdvisoryFramework; // csa document that describes the warning
  }[];
};

export type EmergencyResourcesData = {
  contacts?: [EmergencyResourceContact, ...EmergencyResourceContact[]];
  websites?: [EmergencyResourceWebsite, ...EmergencyResourceWebsite[]];
  documents?: [EmergencyResourceDocument, ...EmergencyResourceDocument[]];
};

export type EmergencyResourceContact = {
  id: string;
  name: string; // name of the organization
  phone?: string; // phone hotline
  mail?: string; // mail
  url?: string; // contact organization's website
  businessHours?: BusinessHours;
};

export type EmergencyResourceWebsite = {
  id: string;
  name: string;
  url: string;
};

export type EmergencyResourceDocument = {
  id: string;
  name: string;
  url: string;
};

export type BusinessHours = {
  weekDayStart?: number; // week day (monday=1 sunday=7)
  weekDayEnd?: number; // week day (monday=1 sunday=7)
  timeStart?: number; // minutes since 0:00
  timeEnd?: number; // minutes since 0:00
  always: boolean; // uninterrupted opening hours
};

export type StandardCoverageDimensions = {
  id: string;
  name: string;
  description: string;
  website?: string;
  controls?: unknown;
  children?: StandardSubArea[];
};

export type StandardCoverageData = {
  standardElementId: string;
  coverage: number; // number between 0 and 1; coverage percentage of the standard
  grade?: StandardCoverageGrade;
  sections: StandardSubAreaData[]; // list of sections with their coverage
};

export type StandardScore = {
  standardElementId: string;
  name: string;
  coverage: number; // number between 0 and 1; coverage percentage of the standard
  grade?: StandardCoverageGrade;
  website?: string;
};

export type StandardSubArea = {
  id: number;
  name: string;
  description: string;
  controls?: unknown;
  parent?: number;
};

export type StandardSubAreaData = {
  standardElementId: number;
  coverage: number; // between 0 and 1
};

export type StandardCoverageGrade =
  (typeof StandardCoverageGradeValues)[number];

export type Point2D = [number, number];

export type RecommendationsListEntry = {
  id: string;
  control: Asset;
  status: MeasureStatus;
  severity: RecommendationSeverity;
  implementedGuidelines: number[];
};
export type RecommendationStatus = (typeof RecommendationStatusValues)[number];
export type RecommendationSeverity =
  (typeof RecommendationsSeverityValues)[number];
export type RecommendationPerception = "good" | "bad";

export type RecommendationThreat = {
  id: string;
  label: string;
  name: string;
};

export type RecommendationSource = {
  name: string;
  label: string;
  url?: string;
};

export type RecommendationStatistic = {
  percent: number;
  profession: BackendCompanyProfession;
};

export type SupportTopic = {
  id: string;
  name: string;
  description?: string;
};

export type RecommendationSupport = {
  topics?: SupportTopic[];
  listings?: SupportServiceEntry[];
};

export type BackendRecommendation = {
  recommendation: RecommendationEntry;
  state: AssetInstance;
  components?: RecommendationAffectedComponent[];
  sources?: RecommendationSource[];
  statistic?: RecommendationStatistic;
  support?: RecommendationSupport;
};

export type RecommendationEntry = {
  controlID: string;
  name?: string;
  text?: string;
  reason?: string;
  explanation?: string;
  status?: RecommendationStatus;
  severity?: RecommendationSeverity;
  threats?: RecommendationThreat[];
  implementedGuidelines?: number[];
};

export type RecommendationAffectedComponent = {
  id: string;
  component: Asset;
  aliases: ComponentAlias[];
};

export type SupportServiceEntry = {
  id: string;
  offer?: SupportServiceDetail;
  provider?: SupportOrganization;
  website?: string;
};

export type SupportServiceDetail = {
  id: string;
  name: string;
  description?: string;
  type: SupportServiceType;
  topics?: SupportServiceTopic[];
};

export type SupportServiceType = (typeof SupportServiceTypeValues)[number];

export type SupportServiceTopic = {
  id: string;
  name: string;
  description?: string;
};

export type SupportOrganization = {
  id: string;
  name: string;
  contactPerson?: string;
  street?: string;
  streetNumber?: string;
  addressDetails?: string;
  location?: BackendCompanyLocation;
  phone?: string;
  mail?: string;
  website?: string;
  description?: string;
};

export type ServicesTableFacets =
  | {
      column: string;
      title: string;
      data: string[];
    }[]
  | undefined;

export type BackendUser = {
  id: string;
  firstName: string;
  lastName: string;
  mail: string;
  verified: boolean;
  roles: BackendUserRole[];
};

export type BackendUserRole = (typeof BackendUserRoles)[number];

export type BackendCompany = {
  id?: string;
  name: string;
  owner?: unknown;
  users?: unknown[];
  profession?: BackendCompanyProfession | null;
  companyType?: CompanySizeClasses | null;
  location?: BackendCompanyLocation | null;
  locationId?: string | null;
  notificationsEnabled?: boolean; // nextIteration: needs to be implemented in backend
  notificationsEmail?: string; // nextIteration: needs to be implemented in backend
};

export type BackendCompanyProfession = {
  id: string;
  name: string;
};

export type Asset = {
  id: string;
  name: string;
  description?: string;
  longDescription?: string;
  parent?: string;
  asset?: AssetInstance;

  label?: string; // control exclusive
  level?: string; // control exclusive
  type?: string; // control exclusive
  guidelines?: MeasureGuideline[]; // control exclusive
  threats?: RecommendationThreat[]; // control exclusive
  children?: [...Asset[]];
};

export type AssetInstance = {
  id: string;
  status?: MeasureStatus; // control exclusive
  recommended: boolean;
  implementedGuidelines?: number[]; // control exclusive
  aliases?: [...ComponentAlias[]]; // component exclusive
};

export type AssetVariants = (typeof AssetVariantsValues)[number];
export type AssetListViews = (typeof AssetListViewsValues)[number];
export type AssetSortingOption = (typeof AssetSortingOptionValues)[number];
export type AssetSortingField = (typeof AssetSortingFieldValues)[number];
export type AssetListStructure = (typeof AssetListStructureValues)[number];

export type AssetListFilters = {
  tags?: string[];
  aliases?: [...ComponentAlias[]];
  query?: string;
};

export type ComponentAlias = {
  instanceId: string;
  aliasId: string;
  alias: string;
  tags?: [...ComponentAliasTag[]];
  createdAt?: string;
};

export type ComponentAliasTag = {
  id: string;
  name: string;
};

export type MeasureStatus = (typeof MeasureStatusValues)[number];

export type MeasureDisplayStatus = (typeof MeasureDisplayStatusValues)[number];

export type MeasureStatusLabel = (typeof MeasureStatusLabelValues)[number];

export type MeasureGuideline = {
  position: number;
  description: string;
};

export type AssetFacet = { id: string; name: string; count?: number };

export type SettingsTabsNames = (typeof SettingsTabsNamesValues)[number];

export type GlossaryCategory = {
  id: string;
  name: string;
  description: string;
  imageSrc?: string;
  entries?: GlossaryEntryLight[];
};

export type GlossaryEntryLight = {
  id: string;
  keyword: string;
  definition?: string;
};

export type GlossaryEntry = {
  term: {
    id: string;
    keyword: string;
    definition?: string;
    description?: string;
    category?: GlossaryCategory;
    synonyms?: string[];
    sources?: [{ id: string; name: string; url: string }];
    createdAt: string;
    updatedAt: string;
  };
  category: GlossaryCategory;
  references: { [key: string]: GlossaryEntryLight };
};

export type GlossarySearchResult = {
  totalPages?: number;
  totalElements?: number;
  pageable: unknown;
  numberOfElements: number;
  size: number;
  content?: GlossaryEntryLight[];
  number: number;
  sort?: unknown;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type AssetSearchResult = {
  totalPages?: number;
  totalElements?: number;
  pageable: unknown;
  numberOfElements: number;
  size: number;
  content?: Asset[];
  number: number;
  sort?: unknown;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type SupportServicesSearchResult = {
  totalPages?: number;
  totalElements?: number;
  pageable: unknown;
  numberOfElements: number;
  size: number;
  content?: SupportServiceEntry[];
  number: number;
  sort?: unknown;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
};

export type VariantAssetIndicator = {
  [key: MeasureDisplayStatus]: {
    color: string;
    label: string;
    icon: string;
  };
};

export type RecommendationsList = RecommendationsListItem[];
export type RecommendationsListItem = {
  id: string;
  title: string;
  status: RecommendationStatus;
  bedrohungsmass: RecommendationSeverity;
  direkteBedrohungen: RecommendationThreat[];
  beguenstigteBedrohungen: RecommendationThreat[];
};
