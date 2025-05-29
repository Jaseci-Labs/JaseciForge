import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "doc",
      id: "index",
      label: "Introduction",
    },
    {
      type: "doc",
      id: "quickstart",
      label: "Quick Start",
    },
    // add for installation, quick start
    {
      type: "doc",
      id: "installation",
      label: "Installation",
    },

    // CLI Tools section
    {
      type: "category",
      label: "CLI Tools",
      items: [
        "cli/create-app",
        "cli/cleanup",
        "cli/add-module",
        "cli/add-node",
        "cli/taurify",
      ],
    },

    // module creation
    {
      type: "doc",
      id: "module-creation",
      label: "Module Creation",
    },
    {
      type: "doc",
      id: "ui-customization",
      label: "Customizing UI",
    },
    {
      type: "doc",
      id: "routing",
      label: "Routing",
    },
    {
      type: "doc",
      id: "protected-page",
      label: "Protected Pages",
    },
    {
      type: "doc",
      id: "architecture",
      label: "Architecture Overview",
    },

    {
      type: "category",
      label: "Build your first App",
      items: [
        "guides/step1-installation",
        "guides/step2-module-creation",
        "guides/step3-customize-layers",
        "guides/step3a-node-customization",
        "guides/step3b-service-layer",
        "guides/step3c-actions-and-interfaces",
        "guides/step3d-store-and-reducers",
        "guides/step3e-custom-hooks",
        "guides/step3f-ui-implementation",
        "guides/summary",
      ],
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
      label: "Concepts",
      items: [
        "concepts/atoms",
        "concepts/molecules",
        "concepts/ds",
        "concepts/useAppNavigation",
        "concepts/stories",
        "concepts/nodes",
        "concepts/templates",
        "concepts/organisms",
        "concepts/pages",
        "concepts/hooks",
        "concepts/state-management",
        "concepts/theming",
        "concepts/testing",
        "concepts/routing",
        "concepts/utilities",
        "concepts/environment-variables",
      ],
    },
    {
      type: "category",
      label: "Customization Guide",
      items: [
        "customization/theme-customization",
        "customization/ui-library-customization",
        "customization/replace-redux",
        "customization/replace-service-layer",
      ],
    },
  ],
};

export default sidebars;
