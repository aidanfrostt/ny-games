import { useEffect, useMemo, useRef, useState } from "react";
import StrandsGrid from "./StrandsGrid";
import { isValidWord } from "../data/wordList";

function keyOf([r, c]) {
  return `${r},${c}`;
}

function isAdjacent(a, b) {
  const dr = Math.abs(a[0] - b[0]);
  const dc = Math.abs(a[1] - b[1]);
  return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
}

function arraysMatch(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export default function StrandsGame({ puzzle }) {
  const [selectedPath, setSelectedPath] = useState([]);
  const [foundWords, setFoundWords] = useState(new Set());
  const [hintedWords, setHintedWords] = useState(new Set());
  const [wrongSubmissions, setWrongSubmissions] = useState(0);
  const [wordsCountedForHints, setWordsCountedForHints] = useState(new Set());
  const [statusText, setStatusText] = useState("Find all words.");

  const placementById = useMemo(
    () => new Map(puzzle.placements.map((p) => [p.id, p])),
    [puzzle.placements]
  );

  const normalizedPlacements = useMemo(
    () =>
      puzzle.placements.map((placement) => {
        const keys = placement.path.map(keyOf);
        return {
          ...placement,
          keys,
          reverseKeys: [...keys].reverse(),
        };
      }),
    [puzzle.placements]
  );

  const nonSpangramIds = useMemo(
    () =>
      puzzle.placements
        .filter((p) => !p.isSpangram)
        .sort((a, b) => a.path.length - b.path.length)
        .map((p) => p.id),
    [puzzle.placements]
  );

  const allIds = useMemo(() => puzzle.placements.map((p) => p.id), [puzzle.placements]);
  const win = allIds.every((id) => foundWords.has(id));

  const pathRef = useRef([]);
  pathRef.current = selectedPath;
  const pointerDownRef = useRef(false);
  const submitSelectionRef = useRef(() => {});

  useEffect(() => {
    const release = () => {
      if (pointerDownRef.current) {
        pointerDownRef.current = false;
        submitSelectionRef.current(pathRef.current);
      }
    };
    const cancel = () => {
      if (pointerDownRef.current) {
        pointerDownRef.current = false;
        // On pointercancel (e.g. mobile scroll), don't clear selection - just end the gesture
        if (pathRef.current.length >= 2) {
          submitSelectionRef.current(pathRef.current);
        }
      }
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", cancel);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", cancel);
    };
  }, []);

  const currentSelectionString = selectedPath
    .map(([r, c]) => puzzle.grid[r][c])
    .join("");

  function onCellDown(r, c) {
    if (win) return;
    pointerDownRef.current = true;
    const point = [r, c];
    const pointKey = keyOf(point);
    setSelectedPath((prev) => {
      let next;
      if (prev.length === 0) {
        next = [[r, c]];
        pathRef.current = next;
      } else {
        const last = prev[prev.length - 1];
        const existingIdx = prev.findIndex((p) => keyOf(p) === pointKey);
        if (existingIdx >= 0) {
          if (existingIdx === prev.length - 2) {
            next = prev.slice(0, -1);
          } else {
            const subPath = prev.slice(0, existingIdx + 1);
            if (subPath.length >= 2) submitSelectionSync(subPath);
            next = [];
          }
        } else if (isAdjacent(last, point)) {
          next = [...prev, point];
        } else {
          if (prev.length >= 2) submitSelectionSync(prev);
          next = [[r, c]];
        }
      }
      pathRef.current = next;
      return next;
    });
  }

  function submitSelectionSync(path) {
    const keys = path.map(keyOf);
    const word = path.map(([r, c]) => puzzle.grid[r][c]).join("").toLowerCase();
    const match = normalizedPlacements.find(
      (p) => arraysMatch(keys, p.keys) || arraysMatch(keys, p.reverseKeys)
    );
    if (match && !foundWords.has(match.id)) {
      setFoundWords((prev) => new Set(prev).add(match.id));
      setStatusText(match.isSpangram ? "Spangram found!" : `Found: ${match.label}`);
    } else if (match && foundWords.has(match.id)) {
      setStatusText("Already found.");
    } else if (word.length >= 4 && isValidWord(word)) {
      if (wordsCountedForHints.has(word)) {
        setStatusText("Already found.");
      } else {
        setWordsCountedForHints((prev) => new Set(prev).add(word));
        setWrongSubmissions((n) => {
          const next = n + 1;
          const toward = next % 3 || 3;
          setStatusText(`Not a theme word. ${toward === 3 ? "Hint earned!" : `${toward} of 3 toward next hint.`}`);
          return next;
        });
      }
    } else if (isValidWord(word)) {
      setStatusText("Too short — 4+ letters count toward hints.");
    } else {
      setStatusText("Not a word.");
    }
  }

  function onCellEnter(r, c) {
    if (!pointerDownRef.current || win) return;
    setSelectedPath((prev) => {
      const next = [...prev];
      const point = [r, c];
      const last = next[next.length - 1];
      if (!last || !isAdjacent(last, point)) return prev;

      const pointKey = keyOf(point);
      const existingIndex = next.findIndex((p) => keyOf(p) === pointKey);

      if (existingIndex === -1) {
        next.push(point);
      } else if (existingIndex === next.length - 2) {
        next.pop();
      } else {
        return prev;
      }
      pathRef.current = next;
      return next;
    });
  }


  function submitSelection(path) {
    const keys = (path ?? pathRef.current).map(keyOf);
    if (keys.length < 2) {
      // Keep single letter selected so user can tap adjacent letters to extend
      return;
    }

    const word = (path ?? pathRef.current)
      .map(([r, c]) => puzzle.grid[r][c])
      .join("")
      .toLowerCase();
    const match = normalizedPlacements.find(
      (placement) =>
        arraysMatch(keys, placement.keys) || arraysMatch(keys, placement.reverseKeys)
    );

    if (match && !foundWords.has(match.id)) {
      setFoundWords((prev) => new Set(prev).add(match.id));
      setStatusText(match.isSpangram ? "Spangram found!" : `Found: ${match.label}`);
    } else if (match && foundWords.has(match.id)) {
      setStatusText("Already found.");
    } else if (word.length >= 4 && isValidWord(word)) {
      if (wordsCountedForHints.has(word)) {
        setStatusText("Already found.");
      } else {
        setWordsCountedForHints((prev) => new Set(prev).add(word));
        setWrongSubmissions((n) => {
          const next = n + 1;
          const toward = next % 3 || 3;
          setStatusText(`Not a theme word. ${toward === 3 ? "Hint earned!" : `${toward} of 3 toward next hint.`}`);
          return next;
        });
      }
    } else if (word.length >= 4) {
      setStatusText("Not a word.");
    } else if (isValidWord(word)) {
      setStatusText("Too short — 4+ letters count toward hints.");
    } else {
      setStatusText("Not a word.");
    }

    pathRef.current = [];
    setSelectedPath([]);
  }
  submitSelectionRef.current = submitSelection;

  const handleCellUp = () => {
    if (pointerDownRef.current) {
      pointerDownRef.current = false;
      submitSelection(pathRef.current);
    }
  };

  const hintsEarned = Math.floor(wrongSubmissions / 3);
  const hintsUsed = hintedWords.size;
  const hintsAvailable = Math.max(0, hintsEarned - hintsUsed);

  function useHint() {
    if (hintsAvailable <= 0) return;
    const nextTarget = nonSpangramIds.find(
      (id) => !foundWords.has(id) && !hintedWords.has(id)
    );
    if (!nextTarget) return;

    setHintedWords((prev) => new Set(prev).add(nextTarget));
    const label = placementById.get(nextTarget)?.label ?? "word";
    setStatusText(`Hint unlocked for ${label}.`);
  }

  const foundCellClassMap = useMemo(() => {
    const out = new Map();
    for (const placement of puzzle.placements) {
      if (foundWords.has(placement.id)) {
        for (const cell of placement.path) {
          out.set(keyOf(cell), placement.isSpangram ? "cell-spangram" : "cell-theme");
        }
      } else if (hintedWords.has(placement.id)) {
        for (const cell of placement.path) {
          if (!out.has(keyOf(cell))) out.set(keyOf(cell), "cell-hint");
        }
      }
    }
    return out;
  }, [puzzle.placements, foundWords, hintedWords]);

  const foundWordPaths = useMemo(
    () =>
      puzzle.placements
        .filter((p) => foundWords.has(p.id))
        .map((p) => ({ path: p.path, isSpangram: p.isSpangram })),
    [puzzle.placements, foundWords]
  );

  const wordsFound = foundWords.size;
  const totalWords = puzzle.placements.length;

  return (
    <section className="strands-shell">
      <div className="strands-game-layout">
        <div className="strands-info-panel">
          <div className="strands-theme-box">
            <div className="strands-theme-header">TODAY&apos;S THEME</div>
            <div className="strands-theme-text">{puzzle.theme}</div>
          </div>
          <p className="strands-progress">
            {wordsFound} of {totalWords} theme words found.
          </p>
        </div>

        <div className="strands-grid-wrapper">
          <StrandsGrid
            grid={puzzle.grid}
            foundCellClassMap={foundCellClassMap}
            foundWordPaths={foundWordPaths}
            selectedPath={selectedPath}
            onCellDown={onCellDown}
            onCellEnter={onCellEnter}
            onCellUp={handleCellUp}
            disabled={win}
            pointerDownRef={pointerDownRef}
          />
          <div className="selection-preview">{currentSelectionString || "—"}</div>
        </div>

        <div className="strands-hint-row">
          <button
            type="button"
            className="hint-btn strands-hint-below"
            onClick={useHint}
            disabled={hintsAvailable <= 0 || win}
          >
            Hint{hintsAvailable > 0 ? ` (${hintsAvailable})` : ""}
          </button>
          {!win && (
            <span className="hint-progress">
              {wrongSubmissions % 3} of 3 toward next hint
            </span>
          )}
        </div>
      </div>

      {win ? (
        <div className="win-overlay">
          <div className="win-banner">
            <h2 className="win-headline">Good Job, You did it!</h2>
            <p className="win-heart">I love you ♥</p>
            <p className="win-subtext">You found all the theme words!</p>
            <p className="win-subtext">Happy anniversary — what a great puzzle!</p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
