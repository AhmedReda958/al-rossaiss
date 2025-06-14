import React from "react";

interface Props {
  className?: string;
}

function HomeIcon({ className }: Props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {" "}
      <path
        d="M7.13033 2.42683L3.26251 5.44072C2.61668 5.94303 2.09283 7.01224 2.09283 7.82312V13.1405C2.09283 14.8053 3.44908 16.1687 5.1139 16.1687H13.4236C15.0884 16.1687 16.4447 14.8053 16.4447 13.1477V7.92359C16.4447 7.0553 15.8634 5.94303 15.153 5.44789L10.7183 2.34072C9.71367 1.63748 8.09908 1.67336 7.13033 2.42683Z"
        stroke="currentColor"
        strokeWidth="1.07639"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.26871 13.2984V11.1456"
        stroke="currentColor"
        strokeWidth="1.07639"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HomeIcon;
