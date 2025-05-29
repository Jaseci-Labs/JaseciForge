import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import styles from "./index.module.css";

function JaseciLogo() {
  return (
    <img
      src="/img/logo.png"
      alt="Jaseci Logo"
      width="150"
      height="150"
      className={styles.heroLogo}
    />
  );
}

function GithubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.githubIcon}
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" />
    </svg>
  );
}

function FeatureIcon({ type }: { type: string }) {
  // SVG icons for each feature
  switch (type) {
    case "code":
      return (
        <span className={styles.featureIconCircle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 12l-2 2 2 2M16 12l2 2-2 2M14 4l-4 16"
              stroke="#ED4B34"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    case "shield":
      return (
        <span className={styles.featureIconCircle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z"
              stroke="#ED4B34"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      );
    case "cube":
      return (
        <span className={styles.featureIconCircle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="7"
              width="18"
              height="10"
              rx="2"
              stroke="#ED4B34"
              strokeWidth="2"
            />
            <path d="M3 7l9 5 9-5" stroke="#ED4B34" strokeWidth="2" />
          </svg>
        </span>
      );
    case "gear":
      return (
        <span className={styles.featureIconCircle}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#ED4B34" strokeWidth="2" />
            <path
              d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15.4 9a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z"
              stroke="#ED4B34"
              strokeWidth="2"
            />
          </svg>
        </span>
      );
    default:
      return null;
  }
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroSection}>
      <div className={styles.heroInner}>
        <JaseciLogo />
        <h1 className={styles.heroTitle}>Welcome to Jaseci Forge</h1>
        <p className={styles.heroSubtitle}>
          Empowering developers with enterprise-grade frontend architecture for
          building scalable applications with seamless Jaseci ecosystem
          integration.
        </p>
        <div className={styles.heroButtons}>
          <Link className={styles.getStartedBtn} to="/docs">
            Get Started <span className={styles.arrow}>&rarr;</span>
          </Link>
          <Link
            className={styles.githubBtn}
            href="https://github.com/Jaseci-Labs/JaseciForge"
          >
            <GithubIcon /> <span>View on GitHub</span>
          </Link>
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
      icon: "code",
    },
    {
      title: "Core-Layer Isolation",
      description:
        "Enforced architectural boundaries and strict core-layer abstraction ensure maintainability and third-party dependency isolation.",
      icon: "shield",
    },
    {
      title: "Modular Architecture",
      description:
        "Atomic design principles combined with a modular feature structure enable scalable and maintainable enterprise applications.",
      icon: "cube",
    },
    {
      title: "Enterprise Tooling",
      description:
        "Production-ready configuration with enterprise-grade authentication, testing, documentation, and state management solutions.",
      icon: "gear",
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresHeader}>
        <h2 className={styles.featuresTitle}>Enterprise-Ready Architecture</h2>
        <p className={styles.featuresSubtitle}>
          Built for scale, maintainability, and production excellence
        </p>
      </div>
      <div className={styles.featuresGrid}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureCardDark}>
            <FeatureIcon type={feature.icon} />
            <h3 className={styles.featureCardTitle}>{feature.title}</h3>
            <p className={styles.featureCardDesc}>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ForDevelopersSection() {
  return (
    <section className={styles.forDevSection}>
      <div className={styles.forDevCard}>
        <div className={styles.forDevLeft}>
          <h2 className={styles.forDevTitle}>For Developers</h2>
          <p className={styles.forDevDesc}>
            Leverage our open-source stack and toolchains to rapidly build and
            deploy robust, scalable applications with sophisticated architecture
            patterns and production-ready infrastructure.
          </p>
          <Link className={styles.forDevBtn} to="/docs">
            Visit Documentation <span className={styles.arrow}>&rarr;</span>
          </Link>
        </div>
        <div className={styles.forDevRight}>
          <div className={styles.terminalWindow}>
            <div className={styles.terminalHeader}>
              <span className={styles.dot} style={{ background: "#ED4B34" }} />
              <span className={styles.dot} style={{ background: "#F6A04D" }} />
              <span className={styles.dot} style={{ background: "#61C454" }} />
            </div>
            <pre className={styles.terminalCode}>
              {`$ npx create-jaseci-app my-app
✓ Creating a new Jaseci Forge app...
? Include Storybook? Yes
? Include React Testing Library? Yes
? Which package manager? npm
✓ Installing dependencies...
✓ Success! Created my-app at ./my-app
Inside that directory, you can run several commands:
npm run dev   - Start the development server
npm run build - Build for production`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStartSection() {
  return (
    <section className={styles.quickStartSection}>
      <div className={styles.quickStartCard}>
        <h2 className={styles.quickStartTitle}>Quick Start</h2>
        <p className={styles.quickStartSubtitle}>
          Get up and running in minutes with our CLI tool
        </p>
        <div className={styles.quickStartCodeBlockWrapper}>
          <code className={styles.quickStartCodeBlock}>
            npx create-jaseci-app my-app
          </code>
        </div>
        <a
          className={styles.quickStartBtn}
          href="/docs/guides/quickstart-guide"
        >
          Read Installation Guide <span className={styles.arrow}>&rarr;</span>
        </a>
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
      <ForDevelopersSection />
      <main>
        <HomepageFeatures />
        <QuickStartSection />
      </main>
    </Layout>
  );
}
