export const UNIT_TYPES = {
  VILLA: "villa",
  APARTMENT: "apartment",
  TOWNHOUSE: "townhouse",
  PENTHOUSE: "penthouse",
  STUDIO: "studio",
} as const;

export type UnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];
