import React from "react";

export default function Button({
  type = "submit",
  className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300",
  onClick,
  children
}) {
  return (
    <button
      className={className}
      type={type}
      onClick={typeof onClick === "function" ? (e) => onClick(e) : undefined}
    >
      {children}
    </button>
  );
}
