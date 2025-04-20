import React from "react";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";

const CityEditorControls: React.FC = () => {
  const { selectedRegion } = useMapStore();
  const {
    isDrawingMode,
    currentPoints,
    savedPolygons,
    editingPolygonId,
    toggleDrawingMode,
    startEditingPolygon,
    deletePolygon,
    finishPolygon,
  } = usePolygonMarkerStore();

  // Handle completing a polygon with the current region
  const handleFinishPolygon = () => {
    if (selectedRegion) {
      finishPolygon(selectedRegion);
    } else {
      alert("Please select a region before saving a city boundary");
    }
  };

  // Display only polygons for the selected region
  const filteredPolygons = savedPolygons.filter(
    (polygon) => !selectedRegion || polygon.regionId === selectedRegion
  );

  return (
    <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-10">
      <button
        onClick={() => toggleDrawingMode(selectedRegion || "")}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isDrawingMode
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isDrawingMode
          ? currentPoints.length >= 3
            ? "Finish Polygon"
            : "Cancel Drawing"
          : "Draw City Boundary"}
      </button>

      {isDrawingMode && editingPolygonId && (
        <button
          onClick={handleFinishPolygon}
          className="px-4 py-2 rounded-md text-white font-medium bg-green-500 hover:bg-green-600"
        >
          Update Polygon
        </button>
      )}

      {isDrawingMode && (
        <p className="text-sm text-gray-700 bg-white bg-opacity-75 p-2 rounded">
          Click to add points. Shift+click on a point to delete it.
          <br />
          Drag points to reposition them.
        </p>
      )}

      {!isDrawingMode && filteredPolygons.length > 0 && (
        <div className="bg-white bg-opacity-90 p-2 rounded max-h-60 overflow-y-auto">
          <h3 className="font-bold mb-2">City Boundaries:</h3>
          <ul className="space-y-1">
            {filteredPolygons.map((polygon) => (
              <li
                key={polygon.id}
                className="flex justify-between items-center"
              >
                <span>{polygon.name}</span>
                <div>
                  <button
                    onClick={() => startEditingPolygon(polygon.id)}
                    className="text-xs px-2 py-1 bg-yellow-500 text-white rounded mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePolygon(polygon.id)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CityEditorControls;
