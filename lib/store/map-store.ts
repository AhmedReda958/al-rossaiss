import { create } from "zustand";
import { Tween, Easings } from "konva/lib/Tween";
import { Layer } from "konva/lib/Layer";
import { City as GlobalCity, Region, Project } from "@/types";
import { TMapType } from "@/types/map";
import { LandmarkType } from "@/lib/constants";

// Duplicating the City type from Prisma schema
export interface City extends GlobalCity {
  region?: Region;
}

interface MapState {
  mapSize: { width: number; height: number };
  mapType: TMapType;

  // Loading states
  isLoading: boolean;
  loadingOperations: Set<string>;
  setIsLoading: (loading: boolean) => void;
  addLoadingOperation: (operation: string) => void;
  removeLoadingOperation: (operation: string) => void;

  // Region-related state
  selectedRegion: string | null;
  hoveredRegion: string | null;

  // City-related state
  selectedCity: string | null;
  editingCity: City | null;
  cities: City[];

  // Admin state
  isAdmin: boolean;
  instructions: string | null;

  // Instruction layer state
  showInstructionLayer: boolean;
  setShowInstructionLayer: (show: boolean) => void;

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
  setEditingCity: (city: City | null) => void;
  setCities: (cities: City[]) => void;
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
  zoomToRegionFallback: (regionId: string) => void;
  zoomToPoint: (point: { x: number; y: number }) => void;
  zoomToPolygon: (points: number[]) => void;

  // Method to update initial position based on screen size
  updateInitialPosition: (screenWidth: number, screenHeight: number) => void;

  // Force center map regardless of current state - useful for production fixes
  forceCenter: () => void;

  // Project-related state
  selectedProject: number | null;
  editingProject: Project | null;
  projects: Project[];

  // Actions
  setSelectedProject: (id: number | null) => void;
  setEditingProject: (project: Project | null) => void;
  setProjects: (projects: Project[]) => void;

  // New state
  selectedCityId: number | null;
  setSelectedCityId: (cityId: number | null) => void;

  landmarks: Array<{
    id: number;
    name: string;
    type: LandmarkType;
    coordinates: {
      x: number;
      y: number;
    };
  }>;
  setLandmarks: (landmarks: MapState["landmarks"]) => void;

  selectedLandmark: number | null;
  setSelectedLandmark: (landmarkId: number | null) => void;

  // Landmark drawing mode state
  landmarkTypeInDrawing: LandmarkType | null;
  setLandmarkTypeInDrawing: (type: LandmarkType | null) => void;

  // Landmark filter state
  hiddenLandmarkTypes: Set<LandmarkType>;
  setHiddenLandmarkTypes: (types: Set<LandmarkType>) => void;
  toggleLandmarkTypeVisibility: (type: LandmarkType) => void;
}

// Helper function to calculate initial position based on screen size
const getInitialPosition = (
  screenWidth: number,
  screenHeight: number,
  mapWidth: number,
  mapHeight: number
) => {
  return {
    x: (screenWidth - mapWidth) / 2,
    y: (screenHeight - mapHeight) / 2,
  };
};

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  mapSize: { width: 2048, height: 2048 },
  mapType: "main",
  isLoading: true, // Start with loading state
  loadingOperations: new Set(),
  selectedRegion: null,
  hoveredRegion: null,
  selectedCity: null,
  editingCity: null,
  cities: [],
  isAdmin: true, // Set default admin state
  instructions: null,
  scale: 1,
  position: { x: 0, y: 0 }, // Will be updated when stage is available
  isZooming: false,
  regionBounds: {},
  layerRef: null,
  selectedProject: null,
  editingProject: null,
  projects: [],
  selectedCityId: null,
  landmarks: [],
  selectedLandmark: null,
  landmarkTypeInDrawing: null,
  hiddenLandmarkTypes: new Set(),
  showInstructionLayer: false,

  // Actions
  setSelectedRegion: (id) => set({ selectedRegion: id }),
  setHoveredRegion: (id) => set({ hoveredRegion: id }),
  setSelectedCity: (id) => set({ selectedCity: id }),
  setEditingCity: (city) => set({ editingCity: city }),
  setCities: (cities) => set({ cities }),
  setMapType: (type) => set({ mapType: type }),
  setScale: (scale) => set({ scale }),
  setPosition: (position) => set({ position }),
  setIsZooming: (isZooming) => set({ isZooming }),
  setRegionBounds: (bounds) => set({ regionBounds: bounds }),
  setLayerRef: (ref) => set({ layerRef: ref }),
  setInstructions: (text) => set({ instructions: text }),
  setSelectedProject: (id) => set({ selectedProject: id }),
  setEditingProject: (project) => set({ editingProject: project }),
  setProjects: (projects) => set({ projects }),
  setSelectedCityId: (cityId) => set({ selectedCityId: cityId }),
  setLandmarks: (landmarks) => set({ landmarks }),
  setSelectedLandmark: (landmarkId) => set({ selectedLandmark: landmarkId }),
  setLandmarkTypeInDrawing: (type) => set({ landmarkTypeInDrawing: type }),
  setHiddenLandmarkTypes: (types) => set({ hiddenLandmarkTypes: types }),
  setShowInstructionLayer: (show) => set({ showInstructionLayer: show }),
  toggleLandmarkTypeVisibility: (type) => {
    const { hiddenLandmarkTypes } = get();
    const newHiddenTypes = new Set(hiddenLandmarkTypes);

    if (newHiddenTypes.has(type)) {
      newHiddenTypes.delete(type);
    } else {
      newHiddenTypes.add(type);
    }

    set({ hiddenLandmarkTypes: newHiddenTypes });
  },
  setIsLoading: (loading) => set({ isLoading: loading }),
  addLoadingOperation: (operation) => {
    const { loadingOperations } = get();
    const newOperations = new Set(loadingOperations);
    newOperations.add(operation);
    set({ loadingOperations: newOperations, isLoading: true });
  },
  removeLoadingOperation: (operation) => {
    const { loadingOperations } = get();
    const newOperations = new Set(loadingOperations);
    newOperations.delete(operation);
    set({
      loadingOperations: newOperations,
      isLoading: newOperations.size > 0,
    });
  },
  resetZoom: () => {
    const {
      layerRef,
      setScale,
      setPosition,
      setIsZooming,
      setSelectedRegion,
      mapSize,
    } = get();

    setIsZooming(true);
    const newScale = 1;

    // Calculate initial position based on screen size
    const stage = layerRef?.current?.getStage();
    const stageWidth = stage?.width() || 0;
    const stageHeight = stage?.height() || 0;

    // Ensure we have valid dimensions before calculating position
    if (stageWidth === 0 || stageHeight === 0) {
      // If dimensions are not available, try to get them from the container
      const container = stage?.container();
      if (container) {
        const rect = container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;

        if (containerWidth > 0 && containerHeight > 0) {
          const newPos = getInitialPosition(
            containerWidth,
            containerHeight,
            mapSize.width,
            mapSize.height
          );

          // Update position immediately without animation if stage dimensions are not ready
          setScale(newScale);
          setPosition(newPos);
          setIsZooming(false);
          setSelectedRegion(null);
          set({ cities: [] });
          return;
        }
      }
    }

    const newPos = getInitialPosition(
      stageWidth,
      stageHeight,
      mapSize.width,
      mapSize.height
    );

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
          set({ cities: [] });
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
      set({ cities: [] });
    }
  },

  zoomToRegion: (regionId) => {
    const {
      regionBounds,
      layerRef,
      setScale,
      setPosition,
      setIsZooming,
      mapSize,
    } = get();

    setIsZooming(true);

    const bounds = regionBounds[regionId];

    if (!bounds || !layerRef?.current) {
      // Try fallback method if bounds are not available
      if (!bounds && layerRef?.current) {
        get().zoomToRegionFallback(regionId);
        return;
      }

      setIsZooming(false);
      return;
    }

    const stage = layerRef.current.getStage();
    let stageWidth = stage?.width() || 0;
    let stageHeight = stage?.height() || 0;

    // Fallback to container dimensions if stage dimensions are not available
    if (stageWidth === 0 || stageHeight === 0) {
      const container = stage?.container();
      if (container) {
        const rect = container.getBoundingClientRect();
        stageWidth = rect.width;
        stageHeight = rect.height;
      }
    }

    // If we still don't have valid dimensions, try to wait and retry
    if (stageWidth === 0 || stageHeight === 0) {
      setTimeout(() => {
        get().zoomToRegion(regionId);
      }, 100);
      return;
    }

    // Get the initial position for centering
    const initialPosition = getInitialPosition(
      stageWidth,
      stageHeight,
      mapSize.width,
      mapSize.height
    );

    // Add some padding around the region (increased for better view)
    const paddingFactor = 0.1;
    const paddedWidth = bounds.width * (1 + paddingFactor);
    const paddedHeight = bounds.height * (1 + paddingFactor);
    const paddedX = bounds.x - bounds.width * paddingFactor * 0.5;
    const paddedY = bounds.y - bounds.height * paddingFactor * 0.5;

    // Calculate scale to fit the region with some constraints
    const scaleX = stageWidth / paddedWidth;
    const scaleY = stageHeight / paddedHeight;
    let newScale = Math.min(scaleX, scaleY);

    // Limit the scale to prevent over-zooming
    newScale = Math.min(newScale, 3);
    newScale = Math.max(newScale, 0.5);

    // Calculate position to center the region
    // The bounds already include the group offset, so we use them directly
    const regionCenterX = paddedX + paddedWidth / 2;
    const regionCenterY = paddedY + paddedHeight / 2;

    const newX =
      stageWidth / 2 - (regionCenterX - initialPosition.x) * newScale;
    const newY =
      stageHeight / 2 - (regionCenterY - initialPosition.y) * newScale;

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

  zoomToPolygon: (points) => {
    const { layerRef, setScale, setPosition, setIsZooming } = get();
    if (!layerRef?.current || points.length < 6) {
      // Need at least 3 points (6 coordinates)
      return;
    }
    setIsZooming(true);

    const stage = layerRef.current.getStage();
    const stageWidth = stage?.width() || 0;
    const stageHeight = stage?.height() || 0;

    // Calculate polygon bounds
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (let i = 0; i < points.length; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }

    const polygonWidth = maxX - minX;
    const polygonHeight = maxY - minY;
    const polygonCenterX = (minX + maxX) / 2;
    const polygonCenterY = (minY + maxY) / 2;

    // Add padding around the polygon
    const paddingFactor = 0.3; // 30% padding
    const paddedWidth = polygonWidth * (1 + paddingFactor);
    const paddedHeight = polygonHeight * (1 + paddingFactor);

    // Calculate scale to fit the polygon in the viewport
    const scaleX = stageWidth / paddedWidth;
    const scaleY = stageHeight / paddedHeight;
    let newScale = Math.min(scaleX, scaleY);

    // Limit the scale to prevent over-zooming or under-zooming
    newScale = Math.min(newScale, 2); // Max 4x zoom
    newScale = Math.max(newScale, 1); // Min 1x zoom

    // Calculate position to center the polygon
    const newX = stageWidth / 2 - polygonCenterX * newScale;
    const newY = stageHeight / 2 - polygonCenterY * newScale;

    // Animate the zoom
    const tween = new Tween({
      node: layerRef.current,
      duration: 0.6, // Slightly longer for smoother feel
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

  updateInitialPosition: (screenWidth, screenHeight) => {
    const { mapSize, scale, setPosition } = get();

    // Only update position if we're at initial scale (not zoomed) and have valid dimensions
    if (scale === 1 && screenWidth > 0 && screenHeight > 0) {
      const newPosition = getInitialPosition(
        screenWidth,
        screenHeight,
        mapSize.width,
        mapSize.height
      );
      setPosition(newPosition);
    }
  },

  // Force center map regardless of current state - useful for production fixes
  forceCenter: () => {
    const { layerRef, mapSize, setPosition } = get();

    if (layerRef?.current) {
      const stage = layerRef.current.getStage();
      if (stage) {
        let stageWidth = stage.width();
        let stageHeight = stage.height();

        // Fallback to container dimensions if stage dimensions are not available
        if (stageWidth === 0 || stageHeight === 0) {
          const container = stage.container();
          if (container) {
            const rect = container.getBoundingClientRect();
            stageWidth = rect.width;
            stageHeight = rect.height;
          }
        }

        if (stageWidth > 0 && stageHeight > 0) {
          const newPosition = getInitialPosition(
            stageWidth,
            stageHeight,
            mapSize.width,
            mapSize.height
          );
          setPosition(newPosition);

          // If we have a layer, also update its position immediately
          if (layerRef.current) {
            layerRef.current.position(newPosition);
          }
        }
      }
    }
  },

  // Fallback zoom to region using hardcoded region positions if bounds are not available
  zoomToRegionFallback: (regionId: string) => {
    const { layerRef, setScale, setPosition, setIsZooming, mapSize } = get();

    // Hardcoded region center positions (relative to group, so we need to add group offset)
    const regionCenters: Record<string, { x: number; y: number }> = {
      western: { x: 225 + 369, y: 322 + 664 },
      eastern: { x: 905 + 369, y: 372 + 664 },
      northern: { x: 325 + 369, y: 52 + 664 },
      southern: { x: 475 + 369, y: 572 + 664 },
      central: { x: 525 + 369, y: 272 + 664 },
    };

    const regionCenter = regionCenters[regionId];
    if (!regionCenter || !layerRef?.current) {
      setIsZooming(false);
      return;
    }

    setIsZooming(true);

    const stage = layerRef.current.getStage();
    let stageWidth = stage?.width() || 0;
    let stageHeight = stage?.height() || 0;

    // Fallback to container dimensions if stage dimensions are not available
    if (stageWidth === 0 || stageHeight === 0) {
      const container = stage?.container();
      if (container) {
        const rect = container.getBoundingClientRect();
        stageWidth = rect.width;
        stageHeight = rect.height;
      }
    }

    if (stageWidth === 0 || stageHeight === 0) {
      setTimeout(() => {
        get().zoomToRegionFallback(regionId);
      }, 100);
      return;
    }

    const initialPosition = getInitialPosition(
      stageWidth,
      stageHeight,
      mapSize.width,
      mapSize.height
    );

    const newScale = 2; // Fixed scale for fallback
    const newX =
      stageWidth / 2 - (regionCenter.x - initialPosition.x) * newScale;
    const newY =
      stageHeight / 2 - (regionCenter.y - initialPosition.y) * newScale;

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
