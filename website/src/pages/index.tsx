import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroContent}>
          <Heading as="h1" className={clsx("hero__title", styles.animateTitle)}>
            {siteConfig.title}
          </Heading>
          <p className={clsx("hero__subtitle", styles.animateSubtitle)}>
            Enterprise-grade frontend architecture for building scalable
            applications with seamless Jaseci ecosystem integration and
            production-ready infrastructure.
          </p>
          <div className={clsx(styles.buttons, styles.animateButtons)}>
            <Link className="button button--primary button--lg" to="/docs">
              Documentation →
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/Jaseci-Labs/JaseciForge"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: "Production-Ready Architecture",
      description:
        "Production-ready architecture patterns and enterprise best practices through a comprehensive reference implementation.",
      icon: "🏢",
      color: "#2c3e50",
    },
    {
      title: "Core-Layer Isolation",
      description:
        "Enforced architectural boundaries and strict core-layer abstraction ensure maintainability and third-party dependency isolation.",
      icon: "🛡️",
      color: "#34495e",
    },
    {
      title: "Modular Architecture",
      description:
        "Atomic design principles combined with a modular feature structure enable scalable and maintainable enterprise applications.",
      icon: "📦",
      color: "#2c3e50",
    },
    {
      title: "Enterprise Tooling",
      description:
        "Production-ready configuration with enterprise-grade authentication, testing, documentation, and state management solutions.",
      icon: "⚙️",
      color: "#34495e",
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <h2>Enterprise-Ready Architecture</h2>
          <p>Built for scale, maintainability, and production excellence</p>
        </div>
        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={clsx(styles.featureCard, styles.animateCard)}
              style={
                { "--feature-color": feature.color } as React.CSSProperties
              }
            >
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Enterprise-grade frontend architecture for building scalable applications"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
