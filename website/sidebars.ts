import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "doc",
      id: "index",
      label: "Introduction",
    },

    {
      type: "category",
      label: "Architecture",
      items: [
        "layers/presentation-layer",
        "layers/data-layer",
        "layers/service-layer",
        "layers/core-infrastructure",
      ],
    },
    {
      type: "category",
      label: "Features",
      items: [
        "features/authentication",
        "features/testing",
        "features/storybook",
      ],
    },
  ],
};

export default sidebars;
