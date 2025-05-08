import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "doc",
      id: "index",
      label: "Introduction",
    },
    // add for installation, quick start
    {
      type: "doc",
      id: "installation",
      label: "Installation",
    },
    {
      type: "doc",
      id: "quickstart",
      label: "Quick Start",
    },
    {
      type: "doc",
      id: "architecture",
      label: "Architecture Overview",
    },
    {
      type: "category",
      label: "Architecture",
      items: [
        "docs/layers/presentation-layer",
        "docs/layers/data-layer",
        "docs/layers/service-layer",
        "docs/layers/core-infrastructure",
      ],
    },
    {
      type: "category",
      label: "Features",
      items: [
        "docs/features/authentication",
        "docs/features/testing",
        "docs/features/storybook",
      ],
    },

    {
      type: "category",
      label: "Guides",
      items: ["docs/guides/quickstart-guide"],
    },
  ],
};

export default sidebars;
