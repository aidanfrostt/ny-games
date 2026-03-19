import { useState } from "react";
import { Link } from "react-router-dom";

const CROSSWORD_PASSWORD = "Pretty girl";

export default function CrosswordPage() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handlePasswordSubmit(e) {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (trimmed.toLowerCase() === CROSSWORD_PASSWORD.toLowerCase()) {
      setIsUnlocked(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Try again.");
    }
  }

  if (!isUnlocked) {
    return (
      <main className="connections-password">
        <div className="connections-password-content">
          <h1 className="connections-password-title">Crossword</h1>
          <p className="connections-password-text">
            Enter the password to play.
          </p>
          <form onSubmit={handlePasswordSubmit} className="connections-password-form">
            <input
              type="text"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="connections-password-input"
              autoComplete="off"
            />
            <button type="submit" className="connections-play-btn">
              Enter
            </button>
          </form>
          {passwordError && (
            <p className="connections-password-error">{passwordError}</p>
          )}
          <Link to="/" className="connections-password-back">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="placeholder-page">
      <Link to="/" className="back-link">
        Home
      </Link>
      <h1>Crossword</h1>
      <p>Coming soon. This page is scaffolded and ready for implementation.</p>
    </main>
  );
}
