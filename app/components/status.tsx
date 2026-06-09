import type { ProjectStatus } from "../lib/projects";

// Shared status pill: dot + mono label. building=sky (pulsing via .st.building
// .st-dot), paused=amber, evergreen=green, planned=purple. Colors live in CSS.
export function Status({
  status,
  label,
}: {
  status: ProjectStatus;
  label: string;
}) {
  return (
    <span className={`st ${status}`}>
      <span className="st-dot" />
      {label}
    </span>
  );
}
