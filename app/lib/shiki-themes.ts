import type { ThemeRegistrationRaw } from "shiki";

// Custom Shiki theme pair built from the prototype's token palette
// (design-reference/styles.css .tok-* values) so highlighted code matches
// the site exactly in both themes. rehype-pretty-code renders both themes
// as --shiki-dark/--shiki-light CSS vars; globals.css flips them on
// [data-theme].

type TokenPalette = {
  fg: string; // tok-var — default identifiers/text
  key: string; // tok-key — keywords, storage (import/const/async…)
  str: string; // tok-str — strings
  num: string; // tok-num — numbers, language constants
  com: string; // tok-com — comments (italic)
  fn: string; // tok-fn — function names
  op: string; // tok-op — operators, punctuation
  type: string; // tok-type — types, classes
  tag: string; // tok-tag — JSX/HTML tags
};

const DARK: TokenPalette = {
  fg: "#e2e8f0",
  key: "#f472b6",
  str: "#86efac",
  num: "#fbbf24",
  com: "#64748b",
  fn: "#38bdf8",
  op: "#94a3b8",
  type: "#c4b5fd",
  tag: "#f87171",
};

const LIGHT: TokenPalette = {
  fg: "#0f172a",
  key: "#be185d",
  str: "#15803d",
  num: "#b45309",
  com: "#94a3b8",
  fn: "#0284c7",
  op: "#475569",
  type: "#6d28d9",
  tag: "#dc2626",
};

function buildTheme(
  name: string,
  type: "dark" | "light",
  c: TokenPalette,
): ThemeRegistrationRaw {
  return {
    name,
    type,
    colors: {
      "editor.background": "#00000000", // keepBackground:false drops it anyway
      "editor.foreground": c.fg,
    },
    settings: [
      // Unscoped default — everything not matched below.
      { settings: { foreground: c.fg } },
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: c.com, fontStyle: "italic" },
      },
      {
        scope: ["string", "punctuation.definition.string"],
        settings: { foreground: c.str },
      },
      {
        scope: [
          "constant.numeric",
          "constant.language",
          "constant.character",
        ],
        settings: { foreground: c.num },
      },
      {
        scope: [
          "keyword",
          "keyword.control",
          "storage.type",
          "storage.modifier",
          "keyword.operator.new",
          "keyword.operator.expression",
          "variable.language.this",
        ],
        settings: { foreground: c.key },
      },
      {
        scope: ["keyword.operator", "punctuation", "meta.brace"],
        settings: { foreground: c.op },
      },
      {
        scope: [
          "entity.name.function",
          "support.function",
          "meta.function-call entity.name.function",
        ],
        settings: { foreground: c.fn },
      },
      {
        scope: [
          "variable",
          "variable.other.readwrite",
          "variable.parameter",
          "support.variable",
          "variable.other.property",
          "variable.other.object.property",
          "meta.object-literal.key",
          "support.type.property-name",
        ],
        settings: { foreground: c.fg },
      },
      {
        scope: [
          "entity.name.type",
          "support.type",
          "support.type.primitive",
          "entity.name.class",
          "support.class",
          "entity.other.inherited-class",
        ],
        settings: { foreground: c.type },
      },
      {
        scope: [
          "entity.name.tag",
          "support.class.component",
          "punctuation.definition.tag",
        ],
        settings: { foreground: c.tag },
      },
    ],
  };
}

export const codeThemeDark = buildTheme("kylerlong-dark", "dark", DARK);
export const codeThemeLight = buildTheme("kylerlong-light", "light", LIGHT);