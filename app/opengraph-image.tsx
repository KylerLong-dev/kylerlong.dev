import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "./lib/og";
import { SITE_NAME, SITE_TAGLINE } from "./lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage({
    eyebrow: "Orlando, FL",
    title: SITE_NAME,
    meta: SITE_TAGLINE,
  });
}
