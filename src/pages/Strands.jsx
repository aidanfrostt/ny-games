import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StrandsGame from "../components/StrandsGame";
import StrandsLogo from "../components/StrandsLogo";
import { strandsPuzzle } from "../data/strandsPuzzle";

export default function StrandsPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    document.body.style.background = isPlaying ? "#ffffff" : "#C6E2D9";
    return () => {
      document.body.style.background = "";
    };
  }, [isPlaying]);

  const date = strandsPuzzle.date ?? "March 18, 2026";
  const puzzleNo = strandsPuzzle.puzzleNo ?? 745;
  const author = strandsPuzzle.author ?? "Puzzle";
  const editor = strandsPuzzle.editor ?? "Edited";

  if (!isPlaying) {
    return (
      <main className="strands-intro">
        <div className="strands-intro-content">
          <StrandsLogo size={72} />
          <h1 className="strands-intro-title">Strands</h1>
          <p className="strands-intro-text">
            Find hidden words and uncover the day&apos;s theme.
          </p>
          <button
            type="button"
            className="strands-play-btn"
            onClick={() => setIsPlaying(true)}
          >
            Play
          </button>
          <p className="strands-intro-subtext">
            Want to access more games and features?
          </p>
          <div className="strands-intro-buttons">
            <button type="button" className="strands-btn strands-btn-primary">
              Log in
            </button>
            <button type="button" className="strands-btn strands-btn-outline">
              Subscribe
            </button>
          </div>
          <footer className="strands-intro-footer">
            <p>{date}</p>
            <p>No. {puzzleNo}</p>
            <p>{author}</p>
            <p>{editor}</p>
          </footer>
        </div>
      </main>
    );
  }

  return (
    <main className="game-page strands-page strands-page--playing">
      <header className="game-header strands-header">
        <Link to="/" className="back-link">
          Home
        </Link>
        <h1>Strands</h1>
      </header>
      <StrandsGame puzzle={strandsPuzzle} />
    </main>
  );
}
