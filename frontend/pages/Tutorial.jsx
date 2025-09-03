import React from 'react';
import '../styles/tutorial.css';

export default function Tutorial() {
  return (
    <div className="tutorial-container">
      <h1>Getting Started with Vexryl</h1>
      <ol className="tutorial-steps">
        <li>
          <strong>Sign Up & Login:</strong> Use Discord to sign up and log in securely.
        </li>
        <li>
          <strong>Create Your Bot:</strong> Go to the Dashboard and click "Create Bot". Name your bot and set its avatar.
        </li>
        <li>
          <strong>Add Commands & Events:</strong> Use the Builder to drag, drop, and configure blocks for commands and events.
        </li>
        <li>
          <strong>Enable Modules:</strong> Add features like automod, logging, moderation, and more from the Modules section.
        </li>
        <li>
          <strong>Import Builds:</strong> Browse the Marketplace and import builds to your bots for instant features.
        </li>
        <li>
          <strong>Connect Hosting:</strong> Link your Railway or Heroku account in the Dashboard to host your bot for free.
        </li>
        <li>
          <strong>Manage & Monitor:</strong> Start, stop, and monitor your bot from the Dashboard. View logs and stats.
        </li>
        <li>
          <strong>Share Your Build:</strong> Publish your custom commands/events to the Marketplace for others to use.
        </li>
        <li>
          <strong>Advanced Settings:</strong> Edit bot details, limits, and module configs anytime.
        </li>
      </ol>
      <div className="tutorial-note">
        <strong>Tip:</strong> All features work with free hosting and no credit card required!
      </div>
    </div>
  );
}
