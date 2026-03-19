import wordExists from "word-exists";

/** Fallback: common 4+ letter words in case word-exists has issues when bundled for browser */
const FALLBACK_WORDS = new Set([
  "take", "make", "like", "have", "been", "with", "from", "this", "that", "they",
  "were", "what", "when", "where", "which", "who", "will", "over", "more", "some",
  "come", "same", "home", "name", "game", "time", "give", "live", "love", "move",
  "here", "there", "these", "those", "about", "after", "again", "before", "being",
  "could", "first", "found", "great", "their", "would", "other", "water", "think",
  "place", "right", "small", "still", "under", "while", "world", "years", "going",
  "know", "into", "just", "long", "much", "only", "such", "then", "them", "very",
  "back", "down", "each", "even", "good", "high", "last", "look", "most", "must",
  "need", "next", "once", "open", "part", "read", "seen", "side", "sort", "took",
  "walk", "want", "well", "went", "work", "also", "call", "came", "does", "done",
  "drew", "grew", "held", "help", "keep", "left", "line", "mean", "near", "real",
  "rest", "room", "said", "show", "talk", "told", "warm", "word", "area",
  "best", "book", "both", "city", "done", "door", "five", "form", "full", "hand",
  "hard", "head", "hour", "kind", "life", "line", "mile", "miss", "none", "pass",
  "plan", "play", "ship", "size", "song", "star", "sure", "tree", "true", "turn",
  "used", "week", "wish", "able", "away", "beat", "best", "blue", "born", "both",
  "cell", "cost", "dark", "date", "dear", "diet", "draw", "drop", "east", "easy",
  "else", "face", "fact", "fail", "fall", "farm", "fast", "fish", "five", "flat",
  "four", "free", "gold", "grow", "half", "hill", "hold", "hope", "huge", "idea",
  "join", "jump", "keep", "lack", "land", "lead", "list", "mail", "main", "make",
  "mark", "mass", "math", "meal", "meet", "milk", "mind", "miss", "move", "need",
  "note", "page", "paid", "pain", "pair", "park", "past", "path", "plan", "play",
  "poor", "pull", "push", "race", "rain", "rate", "read", "rest", "ride", "ring",
  "rise", "risk", "road", "rock", "role", "roll", "room", "rule", "safe", "sale",
  "salt", "save", "seat", "seed", "seek", "sell", "send", "ship", "shop", "shot",
  "sick", "sign", "sing", "site", "size", "skin", "slip", "slow", "snow", "soft",
  "soil", "sold", "some", "song", "soon", "sort", "soul", "spot", "star", "stay",
  "step", "stop", "suit", "sure", "take", "talk", "tall", "task", "team", "term",
  "test", "than", "that", "then", "they", "this", "thus", "time", "tiny", "told",
  "tone", "tool", "town", "tree", "trip", "true", "turn", "twice", "type", "unit",
  "upon", "used", "user", "vary", "very", "view", "wait", "walk", "wall", "want",
  "warm", "wash", "wave", "week", "well", "went", "were", "west", "what", "when",
  "whip", "wide", "wife", "will", "wind", "wish", "with", "wood", "word", "work",
  "worn", "wrap", "yard", "year", "your",
]);

/** Check if a string is a valid English word. Used for hint-earning (4+ letters required in caller). */
export function isValidWord(text) {
  if (typeof text !== "string" || !text.trim()) return false;
  const word = text.trim().toLowerCase();
  if (word.length < 2) return false;
  if (FALLBACK_WORDS.has(word)) return true;
  try {
    return wordExists(word);
  } catch {
    return false;
  }
}
