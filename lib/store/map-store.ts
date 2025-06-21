import { create } from "zustand";
import { Tween, Easings } from "konva/lib/Tween";
import { Layer } from "konva/lib/Layer";
import { TMapType } from "@/app/types/map";

interface MapState {
  mapSize: { width: number; height: number };
  mapType: TMapType;

  // Region-related state
  selectedRegion: string | null;
  hoveredRegion: string | null;

  // City-related state
  selectedCity: string | null;

  // Admin state
  isAdmin: boolean;
  instructions: string | null;

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
  setSelectedCity: (id: string | null) => void;
  setMapType: (type: TMapType) => void;
  setScale: (scale: number) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setIsZooming: (isZooming: boolean) => void;
  setRegionBounds: (
    bounds: Record<
      string,
      { x: number; y: number; width: number; height: number }
    >
  ) => void;
  setInstructions: (text: string | null) => void;
  resetZoom: () => void;

  // Helper method to zoom to a region
  zoomToRegion: (regionId: string) => void;
  zoomToPoint: (point: { x: number; y: number }) => void;
}

const intialPosition = { x: -200, y: -500 };

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  mapSize: { width: 2048, height: 2048 },
  mapType: "main",
  selectedRegion: null,
  hoveredRegion: null,
  selectedCity: null,
  isAdmin: true, // Set default admin state
  instructions: null,
  scale: 1,
  position: { x: intialPosition.x, y: intialPosition.y },
  isZooming: false,
  regionBounds: {},
  layerRef: null,

  // Actions
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  setHoveredRegion: (id) => set({ hoveredRegion: id }),
  setSelectedCity: (id) => set({ selectedCity: id }),
  setMapType: (type) => set({ mapType: type }),
  setScale: (scale) => set({ scale }),
  setPosition: (position) => set({ position }),
  setIsZooming: (isZooming) => set({ isZooming }),
  setRegionBounds: (bounds) => set({ regionBounds: bounds }),
  setLayerRef: (ref) => set({ layerRef: ref }),
  setInstructions: (text) => set({ instructions: text }),

  resetZoom: () => {
    const { layerRef, setScale, setPosition, setIsZooming, setSelectedRegion } =
      get();

    setIsZooming(true);
    const newScale = 1;
    const newPos = intialPosition;

    // Animate the zoom out if layer ref exists
    if (layerRef?.current) {
      const tween = new Tween({
        node: layerRef.current,
        duration: 0.5,
        easing: Easings.EaseInOut,
        scaleX: newScale,
        scaleY: newScale,
        x: newPos.x,
        y: newPos.y,
        onFinish: () => {
          setSelectedRegion(null);
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

  zoomToRegion: (regionId) => {
    const { regionBounds, layerRef, setScale, setPosition, setIsZooming } =
      get();

    setIsZooming(true);

    const bounds = regionBounds[regionId];

    if (!bounds || !layerRef?.current) {
      setIsZooming(false);
      return;
    }

    const stage = layerRef.current.getStage();
    const stageWidth = stage?.width();
    const stageHeight = stage?.height();

    // Add some padding around the region
    const paddingFactor = 0;
    const paddedWidth = bounds.width * (1 + paddingFactor);
    const paddedHeight = bounds.height * (1 + paddingFactor);
    const paddedX = bounds.x - bounds.width * paddingFactor;
    const paddedY = bounds.y - bounds.height * paddingFactor;

    // Calculate scale to fit the region
    const scaleX = stageWidth / paddedWidth;
    const scaleY = stageHeight / paddedHeight;
    const newScale = Math.min(scaleX, scaleY);

    // Calculate position to center the region
    const newX =
      stageWidth / 2 -
      (paddedX + paddedWidth / 2 - intialPosition.x) * newScale;
    const newY =
      stageHeight / 2 -
      (paddedY + paddedHeight / 2 - intialPosition.y) * newScale;

    // Animate the zoom
    const tween = new Tween({
      node: layerRef.current,
      duration: 0.5,
      easing: Easings.EaseInOut,
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

  zoomToPoint: (point) => {
    const { layerRef, setScale, setPosition, setIsZooming } = get();
    if (!layerRef?.current) {
      return;
    }
    setIsZooming(true);

    const stage = layerRef.current.getStage();
    const stageWidth = stage?.width() || 0;
    const stageHeight = stage?.height() || 0;

    const newScale = 2;

    // Calculate position to center the point
    const newX = stageWidth / 2 - point.x * newScale;
    const newY = stageHeight / 2 - point.y * newScale;

    // Animate the zoom
    const tween = new Tween({
      node: layerRef.current,
      duration: 0.5,
      easing: Easings.EaseInOut,
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
