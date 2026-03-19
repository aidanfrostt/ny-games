import GameCard from "../components/GameCard";

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-masthead">
        <h1 className="home-masthead-title">Anniversary NYT Games</h1>
      </header>

      <header className="hero">
        <p className="nyt-kicker">Play the Daily Puzzles</p>
        <h1>Choose Your Game</h1>
        <p>Word games, crosswords and more.</p>
      </header>

      <section className="cards-grid">
        <GameCard
          to="/strands"
          title="Strands"
          subtitle="Uncover hidden words"
          type="strands"
        />
        <GameCard
          to="/crossword"
          title="Crossword"
          subtitle="Daily puzzle preview"
          type="crossword"
        />
        <GameCard
          to="/connections"
          title="Connections"
          subtitle="Group words by theme"
          type="connections"
        />
      </section>
    </main>
  );
}
