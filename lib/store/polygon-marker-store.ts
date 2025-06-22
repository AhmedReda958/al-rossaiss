import { create } from "zustand";

interface Point {
  x: number;
  y: number;
}

export interface CityPolygon {
  id: string;
  name: string;
  points: number[];
  regionId: string;
  labelDirection: "up" | "down" | "left" | "right";
}

interface PolygonMarkerState {
  // Drawing state
  isDrawingMode: boolean;
  currentPoints: Point[];
  savedPolygons: CityPolygon[];
  editingPolygonId: string | null;

  // Actions
  setIsDrawingMode: (isDrawing: boolean) => void;
  setCurrentPoints: (points: Point[]) => void;
  addPoint: (point: Point) => void;
  clearCurrentPoints: () => void;
  updatePoint: (index: number, point: Point) => void;
  deletePoint: (index: number) => void;

  // Polygon management
  addPolygon: (polygon: CityPolygon) => void;
  updatePolygon: (id: string, polygon: Partial<CityPolygon>) => void;
  deletePolygon: (id: string) => void;
  setEditingPolygonId: (id: string | null) => void;

  // Utilities
  pointsToFlatArray: (points: Point[]) => number[];
  flatArrayToPoints: (flatArray: number[]) => Point[];

  // Workflow actions
  startEditingPolygon: (id: string) => void;
  finishPolygon: (
    regionId: string,
    name: string,
    labelDirection: "up" | "down" | "left" | "right"
  ) => void;
  toggleDrawingMode: (selectedRegion: string) => void;

  // New actions
  setPointsFromFlatArray: (points: number[]) => void;
}

export const usePolygonMarkerStore = create<PolygonMarkerState>((set, get) => ({
  // State
  isDrawingMode: false,
  currentPoints: [],
  savedPolygons: [],
  editingPolygonId: null,

  // Basic setters
  setIsDrawingMode: (isDrawing: boolean) => set({ isDrawingMode: isDrawing }),
  setCurrentPoints: (points: Point[]) => set({ currentPoints: points }),

  // Point management
  addPoint: (point: Point) =>
    set((state) => ({
      currentPoints: [...state.currentPoints, point],
    })),
  clearCurrentPoints: () => set({ currentPoints: [] }),
  updatePoint: (index, point) =>
    set((state) => {
      const newPoints = [...state.currentPoints];
      newPoints[index] = point;
      return { currentPoints: newPoints };
    }),
  deletePoint: (index) =>
    set((state) => ({
      currentPoints: state.currentPoints.filter((_, i) => i !== index),
    })),

  // Polygon management
  addPolygon: (polygon) =>
    set((state) => ({
      savedPolygons: [...state.savedPolygons, polygon],
    })),
  updatePolygon: (id, updatedFields) =>
    set((state) => ({
      savedPolygons: state.savedPolygons.map((polygon) =>
        polygon.id === id ? { ...polygon, ...updatedFields } : polygon
      ),
    })),
  deletePolygon: (id) =>
    set((state) => ({
      savedPolygons: state.savedPolygons.filter((polygon) => polygon.id !== id),
    })),
  setEditingPolygonId: (id) => set({ editingPolygonId: id }),

  // Utilities
  pointsToFlatArray: (points) => points.flatMap((p) => [p.x, p.y]),
  flatArrayToPoints: (flatArray) => {
    const points: Point[] = [];
    for (let i = 0; i < flatArray.length; i += 2) {
      points.push({
        x: flatArray[i],
        y: flatArray[i + 1],
      });
    }
    return points;
  },

  // Complex actions
  startEditingPolygon: (id) => {
    const {
      savedPolygons,
      flatArrayToPoints,
      setCurrentPoints,
      setIsDrawingMode,
      setEditingPolygonId,
    } = get();
    const polygonToEdit = savedPolygons.find((p) => p.id === id);

    if (polygonToEdit) {
      setCurrentPoints(flatArrayToPoints(polygonToEdit.points));
      setEditingPolygonId(id);
      setIsDrawingMode(true);
    }
  },

  finishPolygon: (regionId, name, labelDirection) => {
    const {
      currentPoints,
      pointsToFlatArray,
      savedPolygons,
      editingPolygonId,
    } = get();

    if (currentPoints.length < 3) {
      alert("A polygon needs at least 3 points");
      return;
    }

    if (editingPolygonId) {
      // Update existing polygon
      get().updatePolygon(editingPolygonId, {
        points: pointsToFlatArray(currentPoints),
        name,
        labelDirection,
      });
    } else {
      // Create new polygon
      const newPolygon: CityPolygon = {
        id: `city-${Date.now()}`,
        name: name || `City ${savedPolygons.length + 1}`,
        points: pointsToFlatArray(currentPoints),
        regionId,
        labelDirection: labelDirection,
      };
      get().addPolygon(newPolygon);
    }

    get().clearCurrentPoints();
    get().setEditingPolygonId(null);
    get().setIsDrawingMode(false);
  },

  toggleDrawingMode: (selectedRegion: string) => {
    const {
      isDrawingMode,
      currentPoints,
      clearCurrentPoints,
      finishPolygon,
      setIsDrawingMode,
    } = get();

    if (isDrawingMode) {
      if (currentPoints.length >= 3) {
        finishPolygon(
          selectedRegion,
          `City ${get().savedPolygons.length + 1}`,
          "up"
        ); // Region ID will be filled in by the component
      } else {
        clearCurrentPoints();
        set({
          isDrawingMode: false,
          editingPolygonId: null,
        });
      }
    } else {
      clearCurrentPoints();
      setIsDrawingMode(true);
    }
  },

  setPointsFromFlatArray: (points) => {
    const newPoints = [];
    for (let i = 0; i < points.length; i += 2) {
      newPoints.push({ x: points[i], y: points[i + 1] });
    }
    set({ currentPoints: newPoints });
  },
}));
