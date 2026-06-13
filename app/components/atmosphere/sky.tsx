import { Stars } from "./stars";
import { ShootingStar } from "./shooting-star";
import { Clouds } from "./clouds";
import { SunRays } from "./sun-rays";
import { InteractiveField } from "./interactive-field";

// The atmospheric sky for a tinted band, layered behind the content (the band's
// content sits at z-index 3). Dark = stars + shooting star + the cursor-reactive
// constellation field; light = clouds, and the sun on the home hero only. Each
// layer self-gates by theme (CSS for the sky layers; the field reads data-theme
// at runtime and draws nothing in light), so we always render both sets and let
// the right one show — no SSR theme guess.
export function Sky({
  sun = false,
  starCount,
}: {
  sun?: boolean;
  starCount?: number;
}) {
  return (
    <>
      <Stars count={starCount} />
      <ShootingStar />
      <InteractiveField moteCount={0} />
      <Clouds />
      {sun ? <SunRays /> : null}
    </>
  );
}