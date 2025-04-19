import { create } from "zustand";
import Konva from "konva";
import { Layer } from "konva/lib/Layer";

interface MapState {
  mapSize: { width: number; height: number };

  // Region-related state
  selectedRegion: string | null;
  hoveredRegion: string | null;

  // Map view state
  scale: number;
  position: { x: number; y: number };
  isZooming: boolean;
  regionBounds: Record<
    string,
    { x: number; y: number; width: number; height: number }
  >;

  // Layer reference for animations
  layerRef: { current: Layer } | null;
  setLayerRef: (ref: { current: Layer }) => void;

  // Actions
  setSelectedRegion: (id: string | null) => void;
  setHoveredRegion: (id: string | null) => void;
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setIsZooming: (isZooming: boolean) => void;
  setRegionBounds: (
    bounds: Record<
      string,
      { x: number; y: number; width: number; height: number }
    >
  ) => void;
  resetZoom: () => void;

  // Helper method to zoom to a region
  zoomToRegion: (
    regionId: string,
    stageWidth: number,
    stageHeight: number
  ) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  mapSize: { width: 1368, height: 1024 },
  selectedRegion: null,
  hoveredRegion: null,
  scale: 1,
  position: { x: 0, y: 0 },
  isZooming: false,
  regionBounds: {},
  layerRef: null,

  // Actions
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  setHoveredRegion: (id) => set({ hoveredRegion: id }),
  setScale: (scale) => set({ scale }),
  setPosition: (position) => set({ position }),
  setIsZooming: (isZooming) => set({ isZooming }),
  setRegionBounds: (bounds) => set({ regionBounds: bounds }),
  setLayerRef: (ref) => set({ layerRef: ref }),

  resetZoom: () => {
    const { layerRef, setScale, setPosition, setIsZooming } = get();

    setIsZooming(true);
    const newScale = 1;
    const newPos = { x: 0, y: 0 };

    // Animate the zoom out if layer ref exists
    if (layerRef?.current) {
      const tween = new Konva.Tween({
        node: layerRef.current,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
        scaleX: newScale,
        scaleY: newScale,
        x: newPos.x,
        y: newPos.y,
        onFinish: () => {
          setScale(newScale);
          setPosition(newPos);
          setIsZooming(false);
        },
      });

      tween.play();
    } else {
      // No animation if no layer ref
      setScale(newScale);
      setPosition(newPos);
      setIsZooming(false);
    }
  },

  zoomToRegion: (regionId, stageWidth, stageHeight) => {
    const { regionBounds, layerRef, setScale, setPosition, setIsZooming } =
      get();

    setIsZooming(true);

    const bounds = regionBounds[regionId];
    if (!bounds || !layerRef?.current) {
      setIsZooming(false);
      return;
    }

    // Add some padding around the region
    const paddingFactor = -0.2;
    const paddedWidth = bounds.width * (1 + paddingFactor);
    const paddedHeight = bounds.height * (1 + paddingFactor);
    const paddedX = bounds.x - (bounds.width * paddingFactor) / 2;
    const paddedY = bounds.y - (bounds.height * paddingFactor) / 2;

    // Calculate scale to fit the region
    const scaleX = stageWidth / paddedWidth;
    const scaleY = stageHeight / paddedHeight;
    const newScale = Math.min(scaleX, scaleY);

    // Calculate position to center the region
    const newX = stageWidth / 2 - (paddedX + paddedWidth / 2) * newScale;
    const newY = stageHeight / 2 - (paddedY + paddedHeight / 2) * newScale;

    // Animate the zoom
    const tween = new Konva.Tween({
      node: layerRef.current,
      duration: 0.5,
      easing: Konva.Easings.EaseInOut,
      scaleX: newScale,
      scaleY: newScale,
      x: newX,
      y: newY,
      onFinish: () => {
        setScale(newScale);
        setPosition({ x: newX, y: newY });
        setIsZooming(false);
      },
    });

    tween.play();
  },
}));
