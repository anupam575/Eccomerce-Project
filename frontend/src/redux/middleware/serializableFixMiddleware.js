const DATE_KEYS = ["createdAt", "updatedAt", "lastSeen"];

// 🔹 normalize single date
const normalizeDate = (value) => {
  if (!value) return null;

  // already string → assume ISO
  if (typeof value === "string") return value;

  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

// 🔹 deep normalize (safe recursion)
const deepNormalize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  // array case
  if (Array.isArray(obj)) {
    return obj.map(deepNormalize);
  }

  const newObj = {};

  for (const key in obj) {
    const value = obj[key];

    if (DATE_KEYS.includes(key)) {
      newObj[key] = normalizeDate(value);
    } else {
      newObj[key] = deepNormalize(value);
    }
  }

  return newObj;
};

// ✅ ✅ CORRECT REDUX MIDDLEWARE (FIXED)
export const serializableFixMiddleware =
  (store) => (next) => (action) => {
    try {
      // only normalize if payload is object
      if (
        action &&
        typeof action === "object" &&
        action.payload &&
        typeof action.payload === "object"
      ) {
        return next({
          ...action,
          payload: deepNormalize(action.payload),
        });
      }

      return next(action);
    } catch (error) {
      console.error("❌ serializableFixMiddleware error:", error);

      // fallback (never break app)
      return next(action);
    }
  };