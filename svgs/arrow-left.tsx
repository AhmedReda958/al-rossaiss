import React from "react";

const ArrowLeft = ({
  className,
  width = 24,
  height = 24,
  ...props
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 12H6" />
      <path d="M6 5v14" />
    </svg>
  );
};

export default ArrowLeft;
