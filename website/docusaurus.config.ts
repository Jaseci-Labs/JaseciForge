import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Jaseci Forge",
  tagline: "A modern frontend architecture for building scalable applications",
  favicon: "img/favicon.ico",

  url: "https://jaseci-forge.github.io",
  baseUrl: "/",

  organizationName: "jaseci-forge",
  projectName: "jaseci-forge",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          editUrl:
            "https://github.com/Jaseci-Labs/JaseciForge/tree/main/website/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Jaseci Forge",
      logo: {
        alt: "Jaseci Forge Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          position: "left",
          sidebarId: "docs",
          label: "Documentation",
        },
        {
          href: "https://github.com/Jaseci-Labs/JaseciForge",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/Jaseci-Labs/JaseciForge",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jaseci Forge. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["typescript", "javascript", "json"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
