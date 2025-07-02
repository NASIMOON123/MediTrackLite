import React, { useEffect, useState } from 'react';
import "../css/themes.css";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.body.classList.add('dark-theme');
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <label className="form-check form-switch text-white m-0">
      <input
        className="form-check-input"
        type="checkbox"
        onChange={toggleTheme}
        checked={isDarkMode}
      />
      <span className="ms-2">{isDarkMode ? '🌙' : '☀️'}</span>
    </label>
  );
};

export default ThemeToggle;