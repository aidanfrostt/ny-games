import { useEffect, useMemo, useState } from "react";

const COLOR_CLASSES = {
  yellow: "connections-group--yellow",
  green: "connections-group--green",
  blue: "connections-group--blue",
  purple: "connections-group--purple",
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ConnectionsGame({ puzzle }) {
  const [selected, setSelected] = useState(new Set());
  const [foundCategories, setFoundCategories] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [displayWords, setDisplayWords] = useState([]);

  const { categories, wordToCategory } = puzzle;
  const foundList = useMemo(
    () => categories.filter((c) => foundCategories.has(c.id)),
    [categories, foundCategories]
  );

  const remainingWords = useMemo(() => {
    const foundWords = new Set(
      categories.filter((c) => foundCategories.has(c.id)).flatMap((c) => c.words)
    );
    return puzzle.words.filter((w) => !foundWords.has(w));
  }, [puzzle.words, categories, foundCategories]);

  useEffect(() => {
    setDisplayWords([...remainingWords]);
  }, [remainingWords]);

  const win = foundCategories.size === 4;
  const lose = mistakes >= 4 && !win;
  const remainingMistakes = 4 - mistakes;

  function shuffleWords() {
    if (win || lose) return;
    setDisplayWords((prev) => shuffleArray(prev));
  }

  function toggleWord(word) {
    if (win || lose) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else if (next.size < 4) next.add(word);
      return next;
    });
  }

  function submitGuess() {
    if (selected.size !== 4) return;
    const selectedArr = [...selected];
    const firstId = wordToCategory.get(selectedArr[0].toLowerCase());
    const allMatch = selectedArr.every((w) => wordToCategory.get(w.toLowerCase()) === firstId);
    if (allMatch && firstId) {
      setFoundCategories((prev) => new Set(prev).add(firstId));
      const cat = categories.find((c) => c.id === firstId);
      setStatusText(`Correct! ${cat.label}`);
      setSelected(new Set());
    } else {
      setMistakes((m) => m + 1);
      setStatusText("Nope, that's not it. Try again!");
      setSelected(new Set());
    }
  }

  function deselectAll() {
    setSelected(new Set());
  }

  return (
    <section className="connections-shell">
      <div className="connections-game">
        <p className="connections-instructions">
          Create four groups of four!
        </p>

        {/* Found groups - shown in order discovered */}
        {foundList.length > 0 && (
          <div className="connections-found">
            {foundList.map((cat) => (
              <div
                key={cat.id}
                className={`connections-group ${COLOR_CLASSES[cat.color] ?? ""}`}
              >
                <span className="connections-group-label">{cat.label}</span>
                <div className="connections-group-words">
                  {cat.words.map((w) => (
                    <span key={w} className="connections-group-word">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main grid - remaining words (strict 4x4, max 16 tiles) */}
        {!win && displayWords.length > 0 && (
          <div className="connections-grid">
            {displayWords.filter(Boolean).slice(0, 16).map((word) => (
              <button
                key={word}
                type="button"
                className={`connections-cell ${selected.has(word) ? "connections-cell--selected" : ""}`}
                onClick={() => toggleWord(word)}
              >
                {word}
              </button>
            ))}
          </div>
        )}

        {/* Mistakes Remaining */}
        <div className="connections-mistakes" aria-label="Mistakes remaining">
          <span className="connections-mistakes-label">Mistakes Remaining:</span>
          <div className="connections-mistakes-circles">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`connections-mistake ${i < remainingMistakes ? "connections-mistake--remaining" : "connections-mistake--used"}`}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Buttons - always visible */}
        <div className="connections-submit-row">
          <button
            type="button"
            className="connections-btn connections-btn-shuffle"
            onClick={shuffleWords}
            disabled={win || lose || displayWords.length === 0}
            aria-disabled={win || lose || displayWords.length === 0}
          >
            Shuffle
          </button>
          <button
            type="button"
            className="connections-btn connections-btn-secondary"
            onClick={deselectAll}
            disabled={selected.size === 0 || win || lose}
            aria-disabled={selected.size === 0 || win || lose}
          >
            Deselect All
          </button>
          <button
            type="button"
            className="connections-btn connections-btn-primary"
            onClick={submitGuess}
            disabled={selected.size !== 4 || win || lose}
            aria-disabled={selected.size !== 4 || win || lose}
          >
            Submit
          </button>
        </div>

        <p className="connections-status">{statusText}</p>
      </div>

      {win && (
        <div className="connections-win">
          <p className="connections-win-title">You solved it!</p>
        </div>
      )}

      {lose && (
        <div className="connections-lose">
          <p className="connections-lose-title">Game Over</p>
          <p className="connections-lose-text">
            The categories were:{" "}
            {categories.map((c) => c.label).join(", ")}.
          </p>
        </div>
      )}
    </section>
  );
}
