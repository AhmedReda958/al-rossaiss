import React from "react";
import { Group, Text } from "react-konva";
import { useTranslations, useLocale } from "next-intl";
import { useRegionsLayer } from "@/lib/hooks/useRegionsLayer";

// Static positions for country names on the map (2048x2048)
const countryPositions = {
  // Saudi Arabia in the middle
  "saudi-arabia": { x: 1024, y: 1024 },

  // Surrounding countries
  egypt: { x: 280, y: 850 },
  jordan: { x: 460, y: 740 },
  iraq: { x: 930, y: 700 },
  kuwait: { x: 1050, y: 720 },
  qatar: { x: 1300, y: 880 },
  uae: { x: 1450, y: 960 },
  oman: { x: 1650, y: 1200 },
  yemen: { x: 1050, y: 1400 },
  sudan: { x: 230, y: 1150 },
  eritrea: { x: 300, y: 1450 },
  iran: { x: 1400, y: 780 },
};

// Water bodies with position and wavy text effect
const waterBodies = {
  "red-sea": { x: 500, y: 1300, rotation: -90 },
  "arabian-sea": { x: 1750, y: 1350, rotation: -50 },
  "arabian-gulf": { x: 1420, y: 890, rotation: -20 },
};

const CountriesLayer = () => {
  const { selectedRegion } = useRegionsLayer();
  const t = useTranslations("Countries");
  const locale = useLocale();

  // Don't show Saudi Arabia name if a region is selected
  const shouldShowSaudiArabia = !selectedRegion;

  return (
    <Group>
      {/* Country names */}
      {Object.entries(countryPositions).map(([countryId, position]) => {
        // Skip Saudi Arabia if a region is selected
        if (countryId === "saudi-arabia" && !shouldShowSaudiArabia) {
          return null;
        }

        const isArabic = locale === "ar";

        return (
          <Text
            key={countryId}
            x={position.x}
            y={position.y}
            text={t(countryId).toUpperCase()}
            fontSize={isArabic ? 20 : 16}
            fontFamily="inter, sans-serif"
            fill="white"
            opacity={0.3}
            align="center"
            verticalAlign="middle"
            offsetX={countryId === "saudi-arabia" ? 150 : 50}
            offsetY={countryId === "saudi-arabia" ? 20 : 12}
            direction={isArabic ? "rtl" : "ltr"}
          />
        );
      })}

      {/* Water bodies with rotation and wavy text */}
      {Object.entries(waterBodies).map(([id, { x, y, rotation }]) => {
        const isArabic = locale === "ar";

        return (
          <Text
            key={id}
            x={x}
            y={y}
            text={t(id).toUpperCase()}
            fontSize={isArabic ? 24 : 16}
            fontFamily="inter, sans-serif"
            fill="white"
            opacity={0.2}
            fontStyle="bold"
            align="center"
            verticalAlign="middle"
            rotation={rotation}
            offsetX={70}
            offsetY={10}
            scaleY={0.95} // Slightly squished vertically for wave effect
            letterSpacing={3} // Add spacing between letters for wave effect
            direction={isArabic ? "rtl" : "ltr"}
          />
        );
      })}
    </Group>
  );
};

export default CountriesLayer;
