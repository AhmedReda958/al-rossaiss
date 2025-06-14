import React from "react";

interface Props {
  className?: string;
}

function CityIcon({ className }: Props) {
  return (
    <svg
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {" "}
      <path
        d="M2.10205 14.6667H15.4354M6.10205 14.6667V4.00004C6.10205 2.89671 6.33205 2.66671 7.43538 2.66671H10.1021C11.2054 2.66671 11.4354 2.89671 11.4354 4.00004V14.6667M6.10205 14.6667H11.4354M6.10205 14.6667H2.76872V10C2.76872 8.89671 2.99872 8.66671 4.10205 8.66671H6.10205V14.6667ZM11.4354 14.6667V8.66671H13.4354C14.5387 8.66671 14.7687 8.89671 14.7687 10V14.6667H11.4354ZM8.76872 2.66671V1.33337M8.76872 14.6667V13.3334M8.10205 10H9.43538M8.10205 7.66671H9.43538M8.10205 5.33337H9.43538"
        stroke="currentColor"
        strokeWidth="1.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default CityIcon;
