import React from 'react';
import '../styles/main.css';

const MainPage = () => (
  <div className="main-bg">
    <header className="main-header">
      <div className="logo-title">
        <span className="logo">V</span>
        <span className="brand">Vexryl <span className="beta">BETA</span></span>
      </div>
      <nav className="main-nav">
        <a href="#features">Features</a>
        <a href="#how">How it Works</a>
        <a href="#examples">Examples</a>
        <a href="/login" className="sign-in">Sign In</a>
        <a href="/get-started" className="get-started">Get Started</a>
  <a href="/marketplace" className="main-btn">Marketplace</a>
  <a href="/tutorial" className="main-btn">Tutorial</a>
      </nav>
    </header>
    <section className="hero-section">
  <h1>Build Discord Bots <br />Without Code</h1>
  <p className="hero-desc">Create powerful Discord bots with our visual drag-and-drop builder. Export your bot data, connect your own hosting, and share builds. No coding required.</p>
      <div className="hero-btns">
        <a href="/builders" className="start-building">Start Building</a>
        <a href="#examples" className="view-examples">View Examples</a>
      </div>
      <div className="hero-tags">
  <span>100% Free</span>
  <span>Export Bot Data</span>
      </div>
    </section>
    <section className="features-section" id="features">
      <h2>Everything You Need</h2>
      <p>Build professional Discord bots with our powerful tools</p>
      <div className="features-grid">
        <div className="feature-card">
          <h3>Visual Builder</h3>
          <p>Drag and drop blocks to create commands, events, and workflows without writing code.</p>
        </div>
        <div className="feature-card">
          <h3>Bot Data Export</h3>
          <p>Export your bot’s configuration and data for easy migration or backup. Host anywhere you want.</p>
        </div>
        <div className="feature-card">
          <h3>Instant Preview</h3>
          <p>See your bot in action with real-time preview. Test commands before deployment.</p>
        </div>
      </div>
    </section>
  </div>
);

export default MainPage;
