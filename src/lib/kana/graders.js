export function normalizeRomaji(s) {
  return String(s || "").trim().toLowerCase();
}
export function isCorrectChoice(given, correct) {
  return normalizeRomaji(given) === normalizeRomaji(correct);
}
