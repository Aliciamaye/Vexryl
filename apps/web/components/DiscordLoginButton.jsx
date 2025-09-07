import React from "react";

export default function DiscordLoginButton() {
  const handleDiscordLogin = () => {
    window.location.href = "/api/auth/discord";
  };
  return (
    <button className="btn-discord w-full flex items-center justify-center gap-2" onClick={handleDiscordLogin}>
      <img src="/assets/discord-logo.svg" alt="Discord" className="h-5" />
      <span>Login with Discord</span>
    </button>
  );
}
