/**
 * Connections puzzle - 4 categories of 4 words each.
 * Order = difficulty: yellow (easiest) -> green -> blue -> purple (hardest)
 */
const categories = [
  {
    id: "tv-shows",
    label: "Our TV shows",
    color: "yellow",
    words: ["Friends", "Island", "Elementary", "SLOMW"],
  },
  {
    id: "gifts",
    label: "Gifts",
    color: "green",
    words: ["Flowers", "Poster", "Starbucks", "Infinite"],
  },
  {
    id: "nicknames",
    label: "Nicknames",
    color: "blue",
    words: ["Love", "Dani", "Ketamine", "Mrs. Linguistics"],
  },
  {
    id: "valentines-poster",
    label: "Poster from Valentine's Day",
    color: "purple",
    words: ["Puzzle", "Kona", "Cedar", "Mini Golf"],
  },
];

// Build word -> categoryId map for checking answers
const wordToCategory = new Map();
categories.forEach((cat) => {
  cat.words.forEach((w) => wordToCategory.set(w.toLowerCase(), cat.id));
});

// Shuffle all words for display (but deterministic per day for consistency)
const allWords = categories.flatMap((c) => c.words);
const seed = new Date().toDateString();
function seededRandom(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return () => ((h = (h >>> 0) * 16807) >>> 0) / 2147483647;
}
const rng = seededRandom(seed);
function shuffleSeeded(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const connectionsPuzzle = {
  categories,
  words: shuffleSeeded(allWords),
  wordToCategory,
  date: "March 18, 2026",
};
