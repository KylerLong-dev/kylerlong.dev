// Project data + the shared link-affordance helpers (SPEC §7). Used by /work
// now and the home "selected work" section in Phase 4.

export type ProjectStatus = "building" | "paused" | "evergreen" | "planned";

export type ProjectLink = { type: "case-study" | "live"; href: string };

export type Project = {
  status: ProjectStatus;
  statusLabel: string;
  title: string;
  desc: string;
  stack: string[];
  links: ProjectLink[];
  // featured-only
  index?: string;
  role?: string;
  note?: string;
};

export type LinkMeta = { label: string; external: boolean; href: string };

// case-study → internal "Case study"; live → external "Visit" (new tab).
export function linkMeta(link: ProjectLink): LinkMeta | null {
  switch (link.type) {
    case "case-study":
      return { label: "Case study", external: false, href: link.href };
    case "live":
      return { label: "Visit", external: true, href: link.href };
    default:
      return null;
  }
}

export function projectLinks(project: Project): LinkMeta[] {
  return project.links
    .map(linkMeta)
    .filter((m): m is LinkMeta => m !== null);
}

// TODO(placeholder): real case-study hrefs (currently "#").
export const FEATURED: Project = {
  index: "01",
  status: "building",
  statusLabel: "Now building",
  title: "Route Optimizer",
  role: "Route planning for home-health clinicians",
  desc: "Clinicians can lose an hour a day just deciding what order to see patients in. Route Optimizer turns a day’s visit list into the fastest realistic loop — accounting for traffic, appointment windows, and the fact that some visits always run long.",
  note: "I built the first version for myself, sketching the day’s route on a paper map between visits. This is what that hunch grew into.",
  stack: ["Next.js", "Prisma", "Neon", "Google Maps API"],
  links: [],
};

export const ARCHIVE: Project[] = [
  {
    status: "paused",
    statusLabel: "Paused",
    title: "Scribe Companion",
    desc: "Dictate a visit and get a structured SOAP note back — an AI scribe tuned for the language of rehab. Parked while I work out the parts I’m not willing to get wrong.",
    stack: ["OpenAI", "Azure STT", "AWS", "Clerk"],
    links: [{ type: "case-study", href: "#" }],
  },
  {
    status: "evergreen",
    statusLabel: "Evergreen",
    title: "kylerlong.dev",
    desc: "This site. Journal, work, and the occasional long-form detour — built to stay out of the way of the writing.",
    stack: ["Next.js", "MDX", "App Router"],
    links: [
      { type: "case-study", href: "#" },
      { type: "live", href: "/" },
    ],
  },
  {
    status: "planned",
    statusLabel: "Planned",
    title: "verosnapshots.com",
    desc: "A portfolio and booking site for a Florida-based photographer — galleries, session packages, and inquiries in one place. On the someday list.",
    stack: ["Next.js", "Sanity", "Cloudinary"],
    links: [],
  },
];