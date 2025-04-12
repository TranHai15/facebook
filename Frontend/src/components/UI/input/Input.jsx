import React from "react";
import "./style.scss";
export default function Input({
  label = "",
  type = "text",
  name = "",
  id = "undefiled",
  placeholder = "undefiled",
  data = "",
  onClick,
  onChange,
  onBlur
}) {
  return (
    <div>
      <div className="input-group">
        {label && <label className="input-label">{label}</label>}
        <input
          type={type}
          name={name}
          className="input-field"
          id={id}
          value={data}
          placeholder={placeholder}
          onClick={
            typeof onClick === "function" ? (e) => onClick(e, data) : undefined
          }
          onChange={
            typeof onChange === "function"
              ? (e) => onChange(e, data)
              : undefined
          }
          onBlur={
            typeof onBlur === "function" ? (e) => onBlur(e, data) : undefined
          }
        />
      </div>
    </div>
  );
}
