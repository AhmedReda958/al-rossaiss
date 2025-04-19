import Western from "./western";
import Eastern from "./eastern";
import Northern from "./northern";
import Southern from "./southern";
import Central from "./central";

const regions = [
  {
    id: "western",
    name: "Western Region",
    Component: Western,
  },
  {
    id: "eastern",
    name: "Eastern Region",
    Component: Eastern,
  },
  {
    id: "northern",
    name: "Northern Region",
    Component: Northern,
  },
  {
    id: "southern",
    name: "Southern Region",
    Component: Southern,
  },
  {
    id: "central",
    name: "Central Region",
    Component: Central,
  },
];

export default regions;
