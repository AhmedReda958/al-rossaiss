import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get localized text based on current locale
 * @param text - English text
 * @param textAr - Arabic text
 * @param locale - Current locale (default: 'en')
 * @returns Appropriate text based on locale
 */
export function getLocalizedText(
  text: string,
  textAr?: string | null,
  locale: string = "en"
): string {
  if (locale === "ar" && textAr) {
    return textAr;
  }
  return text;
}

/**
 * Get localized name for entities (cities, projects, landmarks)
 * @param entity - Entity with name and nameAr properties
 * @param locale - Current locale (default: 'en')
 * @returns Appropriate name based on locale
 */
export function getLocalizedName(
  entity: { name: string; nameAr?: string | null },
  locale: string = "en"
): string {
  return getLocalizedText(entity.name, entity.nameAr, locale);
}

/**
 * Get localized region name by ID using translations
 * @param regionId - Region ID number
 * @param tRegions - Regions translation function from useTranslations("Regions")
 * @returns Translated region name
 */
export function getLocalizedRegionName(
  regionId: number,
  tRegions: (key: string) => string
): string {
  // Convert region id to string for translation key lookup
  const key = REGION_ID_TO_KEY[regionId];
  return key ? tRegions(key) : `Region ${regionId}`;
}
