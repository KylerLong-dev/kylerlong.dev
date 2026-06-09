// Horizon separator. Phase 1 only needs the reeds silhouette (rendered purely
// via CSS mask-image — see .separator.reeds in globals.css). Decorative.
export function Separator({
  variant = "reeds",
  position = "footer-top",
}: {
  variant?: "reeds";
  position?: string;
}) {
  if (variant === "reeds") {
    return <div className={`separator ${position} reeds`} aria-hidden="true" />;
  }
  return null;
}