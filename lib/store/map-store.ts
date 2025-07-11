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
  zoomToPoint: (point: { x: number; y: number }) => void;

  // Method to update initial position based on screen size
  updateInitialPosition: (screenWidth: number, screenHeight: number) => void;

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
      setIsZooming(false);
      return;
    }

    const stage = layerRef.current.getStage();
    const stageWidth = stage?.width() || 0;
    const stageHeight = stage?.height() || 0;

    // Get the initial position for centering
    const initialPosition = getInitialPosition(
      stageWidth,
      stageHeight,
      mapSize.width,
      mapSize.height
    );

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
      (paddedX + paddedWidth / 2 - initialPosition.x) * newScale;
    const newY =
      stageHeight / 2 -
      (paddedY + paddedHeight / 2 - initialPosition.y) * newScale;

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
}));
