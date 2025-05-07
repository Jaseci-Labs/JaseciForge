/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Architecture",
      items: [
        "architecture",
        {
          type: "category",
          label: "Layers",
          items: [
            "layers/presentation-layer",
            "layers/data-layer",
            "layers/service-layer",
            "layers/core-infrastructure",
          ],
        },
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
    {
      type: "category",
      label: "Best Practices",
      items: [
        "best-practices/code-organization",
        "best-practices/state-management",
        "best-practices/error-handling",
      ],
    },
  ],
};

module.exports = sidebars;
