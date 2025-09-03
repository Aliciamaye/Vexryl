import React, { useState } from 'react';

const Login = () => {
  const [darkMode, setDarkMode] = useState(true);
  return (
    <div className={darkMode ? 'login-container' : 'login-container light-mode'}>
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <h2>Login with Discord</h2>
      <a href="/api/auth/discord" className="discord-login-btn">Login with Discord</a>
    </div>
  );
};

export default Login;
