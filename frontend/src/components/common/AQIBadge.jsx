const colorMap = {
  Good: "bg-green-100 text-green-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  "Unhealthy for Sensitive Groups": "bg-orange-100 text-orange-700",
  Unhealthy: "bg-red-100 text-red-700",
  "Very Unhealthy": "bg-purple-100 text-purple-700",
  Hazardous: "bg-rose-100 text-rose-700",
};

export default function AQIBadge({ category, value }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${colorMap[category] || "bg-slate-100 text-slate-700"}`}>
      AQI {Math.round(value)} · {category}
    </span>
  );
}
