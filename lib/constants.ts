export const UNIT_TYPES = {
  VILLA: "villa",
  APARTMENT: "apartment",
  TOWNHOUSE: "townhouse",
  PENTHOUSE: "penthouse",
  STUDIO: "studio",
} as const;

export type UnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];

export const LANDMARK_TYPES = {
  LANDMARK: "landmark",
  SHOP: "shop",
  EDUCATION: "education",
  HOSPITAL: "hospital",
  PARK: "park",
  MOSQUE: "mosque",
} as const;

export type LandmarkType = (typeof LANDMARK_TYPES)[keyof typeof LANDMARK_TYPES];
