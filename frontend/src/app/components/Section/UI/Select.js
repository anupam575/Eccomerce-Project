"use client";

function SelectBasic({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder = "Select...",
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="
        w-full
        px-4 py-2
        border border-gray-300
        rounded-lg
        bg-white
        text-gray-800
        focus:outline-none
        focus:ring-2 focus:ring-blue-500
        focus:border-blue-500
        disabled:bg-gray-100
        disabled:cursor-not-allowed
      "
    >
      {/* Placeholder */}
      <option value="">{placeholder}</option>

      {options.map((item) => {
        // ✅ VALUE (priority order)
        const optionValue =
          item?._id ??
          item?.id ??
          item?.value ??
          (typeof item === "string" || typeof item === "number"
            ? item
            : "");

        // ✅ LABEL (priority order)
        const optionLabel =
          item?.name ??
          item?.label ??
          item?.title ??
          item?.status ??
          (typeof item === "string" || typeof item === "number"
            ? item
            : "Unknown");

        // ❌ skip invalid items
        if (!optionValue) return null;

        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
}

export default SelectBasic;