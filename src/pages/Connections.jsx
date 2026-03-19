import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConnectionsGame from "../components/ConnectionsGame";
import { connectionsPuzzle } from "../data/connectionsPuzzle";

const CONNECTIONS_PASSWORD = "Pretty girl";

export default function ConnectionsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.body.style.background = isPlaying ? "#ffffff" : "#f0e6d3";
    return () => {
      document.body.style.background = "";
    };
  }, [isPlaying]);

  function handlePasswordSubmit(e) {
    e.preventDefault();
    const trimmed = passwordInput.trim();
    if (trimmed.toLowerCase() === CONNECTIONS_PASSWORD.toLowerCase()) {
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
          <h1 className="connections-password-title">Connections</h1>
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

  if (!isPlaying) {
    return (
      <main className="connections-intro">
        <div className="connections-intro-content">
          <h1 className="connections-intro-title">Connections</h1>
          <p className="connections-intro-text">
            Find groups of four items that share something in common.
          </p>
          <button
            type="button"
            className="connections-play-btn"
            onClick={() => setIsPlaying(true)}
          >
            Play
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="game-page connections-page">
      <header className="game-header connections-header">
        <Link to="/" className="back-link">
          Home
        </Link>
        <h1>Anniversary NYT Games</h1>
      </header>
      <ConnectionsGame puzzle={connectionsPuzzle} />
    </main>
  );
}
