import React from "react";
import { Link } from "react-router-dom";
import "./Portfolio.css";

const features = [
  {
    icon: "bi-rulers",
    title: "Customer profiles",
    description:
      "Keep client details and measurement history together, ready for the next fitting.",
  },
  {
    icon: "bi-bag-heart",
    title: "Made-to-order workflow",
    description:
      "Follow each custom order from request and design through stitching and completion.",
  },
  {
    icon: "bi-truck",
    title: "Deliveries and payments",
    description:
      "Track due dates, payment history, balances, and upcoming handoffs in one place.",
  },
  {
    icon: "bi-person-heart",
    title: "Customer portal",
    description:
      "Give clients a separate place to check their own order progress and details.",
  },
];

function PortfolioHome() {
  return (
    <main className="portfolio-page">
      <nav className="portfolio-nav" aria-label="Main navigation">
        <Link className="portfolio-brand" to="/">
          <span className="portfolio-brand-mark">
            <i className="bi bi-scissors" aria-hidden="true"></i>
          </span>
          BOUTIQ
        </Link>
        <div className="portfolio-nav-links">
          <a href="#features">What it does</a>
          <Link className="portfolio-nav-cta" to="/demo">
            Explore the demo <i className="bi bi-arrow-up-right" aria-hidden="true"></i>
          </Link>
        </div>
      </nav>

      <section className="portfolio-hero">
        <div className="portfolio-hero-copy">
          <span className="portfolio-eyebrow">
            <span className="portfolio-eyebrow-dot"></span>
            BOUTIQUE MANAGEMENT, THOUGHTFULLY MADE
          </span>
          <h1>Every fitting, order, and handoff in its place.</h1>
          <p>
            BOUTIQ is a boutique management system built to bring the everyday
            work of a tailoring studio into one calm, organized workspace.
          </p>
          <div className="portfolio-hero-actions">
            <Link className="portfolio-button portfolio-button-primary" to="/demo">
              Explore the interactive demo
              <i className="bi bi-arrow-right" aria-hidden="true"></i>
            </Link>
            <a className="portfolio-text-link" href="#features">
              See what you can manage
            </a>
          </div>
          <div className="portfolio-hero-note">
            <i className="bi bi-eye" aria-hidden="true"></i>
            No account needed. The demo uses fictional sample data.
          </div>
        </div>

        <div className="portfolio-preview-wrap" aria-label="Sample dashboard preview">
          <div className="portfolio-preview-glow"></div>
          <div className="portfolio-preview">
            <div className="portfolio-preview-top">
              <div>
                <span className="portfolio-preview-kicker">STUDIO OVERVIEW</span>
                <h2>Today at the atelier</h2>
              </div>
              <span className="portfolio-preview-icon">
                <i className="bi bi-stars" aria-hidden="true"></i>
              </span>
            </div>
            <div className="portfolio-preview-stats">
              <div>
                <span>Open orders</span>
                <strong>18</strong>
                <small><i className="bi bi-arrow-up-right"></i> 4 due this week</small>
              </div>
              <div>
                <span>Fittings booked</span>
                <strong>06</strong>
                <small>Across 3 designers</small>
              </div>
            </div>
            <div className="portfolio-preview-list-title">
              <span>UP NEXT</span>
              <span>THIS WEEK</span>
            </div>
            <div className="portfolio-preview-order">
              <span className="portfolio-preview-order-icon"><i className="bi bi-bag"></i></span>
              <span><strong>Custom occasion wear</strong><small>Sample client · Final fitting</small></span>
              <b>Today</b>
            </div>
            <div className="portfolio-preview-order">
              <span className="portfolio-preview-order-icon"><i className="bi bi-scissors"></i></span>
              <span><strong>Everyday blouse set</strong><small>Sample client · In progress</small></span>
              <b>Thu</b>
            </div>
            <div className="portfolio-preview-caption">
              <i className="bi bi-info-circle" aria-hidden="true"></i>
              Illustrative preview with fictional data
            </div>
          </div>
          <div className="portfolio-floating-note">
            <span><i className="bi bi-check2" aria-hidden="true"></i></span>
            A clearer view of every order
          </div>
        </div>
      </section>

      <section className="portfolio-features" id="features">
        <div className="portfolio-section-heading">
          <span className="portfolio-eyebrow">MADE FOR THE WHOLE JOURNEY</span>
          <h2>From the first measurement to the final delivery.</h2>
          <p>
            The details that usually live across notebooks, messages, and
            spreadsheets are connected in one practical workflow.
          </p>
        </div>
        <div className="portfolio-feature-grid">
          {features.map((feature, index) => (
            <article className="portfolio-feature-card" key={feature.title}>
              <span className="portfolio-feature-number">0{index + 1}</span>
              <span className="portfolio-feature-icon">
                <i className={`bi ${feature.icon}`} aria-hidden="true"></i>
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="portfolio-build">
        <div>
          <span className="portfolio-eyebrow">BUILT AS A FULL-STACK PRODUCT</span>
          <h2>A connected experience for owners, staff, and customers.</h2>
        </div>
        <div className="portfolio-stack" aria-label="Technology stack">
          <span>React</span><span>Node.js</span><span>Express</span><span>MongoDB</span><span>JWT</span>
        </div>
      </section>

      <footer className="portfolio-footer">
        <Link className="portfolio-brand" to="/">
          <span className="portfolio-brand-mark"><i className="bi bi-scissors" aria-hidden="true"></i></span>
          BOUTIQ
        </Link>
        <span>Portfolio preview · Sample data only</span>
        <Link to="/login">Owner / staff sign in</Link>
      </footer>
    </main>
  );
}

export default PortfolioHome;
