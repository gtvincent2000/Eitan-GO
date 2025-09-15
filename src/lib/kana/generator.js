import { shuffle, uid } from "@/lib/kana/utils";

/**
 * Distractors: prefer same column (vowel) or same row
 */
function pickDistractors(pool, correct, count = 3) {
  const sameCol = pool.filter(
    (i) => i.col === correct.col && i.kana !== correct.kana && i.romaji !== correct.romaji
  );
  const sameRow = pool.filter(
    (i) => i.row === correct.row && i.kana !== correct.kana && i.romaji !== correct.romaji
  );
  const others = pool.filter(
    (i) => i.kana !== correct.kana && i.romaji !== correct.romaji
  );

  let candidates = shuffle(sameCol).concat(shuffle(sameRow), shuffle(others));
  // de-dup by kana+romaji
  const seen = new Set();
  const unique = [];
  for (const it of candidates) {
    const key = it.kana + "|" + it.romaji;
    if (!seen.has(key)) {
      unique.push(it);
      seen.add(key);
    }
  }
  return unique.slice(0, count);
}

export function makeKanaToRomajiQuestion(pool) {
  const item = pool[Math.floor(Math.random() * pool.length)];
  const distractors = pickDistractors(pool, item, 3);

  const choices = shuffle(
    [
      { id: uid(), label: item.romaji, value: item.romaji },
      ...distractors.map((d) => ({ id: uid(), label: d.romaji, value: d.romaji })),
    ]
  );

  return {
    id: uid(),
    mode: "kana→romaji",
    prompt: item.kana,           // show kana
    correctValue: item.romaji,   // expect romaji
    choices,
    meta: { script: item.script, row: item.row, col: item.col, kana: item.kana, romaji: item.romaji },
  };
}

export function makeRomajiToKanaQuestion(pool) {
  const item = pool[Math.floor(Math.random() * pool.length)];
  const distractors = pickDistractors(pool, item, 3);

  const choices = shuffle(
    [
      { id: uid(), label: item.kana, value: item.kana },
      ...distractors.map((d) => ({ id: uid(), label: d.kana, value: d.kana })),
    ]
  );

  return {
    id: uid(),
    mode: "romaji→kana",
    prompt: item.romaji,         // show romaji
    correctValue: item.kana,     // expect kana
    choices,
    meta: { script: item.script, row: item.row, col: item.col, kana: item.kana, romaji: item.romaji },
  };
}

export function makeTypingQuestion(pool) {
  const item = pool[Math.floor(Math.random() * pool.length)];
  return {
    id: uid(),
    mode: "typing",
    prompt: item.kana,           // show kana
    correctValue: item.romaji,   // expect romaji
    choices: undefined,
    meta: { script: item.script, row: item.row, col: item.col, kana: item.kana, romaji: item.romaji },
  };
}

/**
 * Make a batch of questions from enabled modes
 * config.modes is an array like ["kana→romaji","typing"]
 */
export function makeQuestions(pool, config, count = 10) {
  const generators = [];
  if (config.modes.includes("kana→romaji")) generators.push(makeKanaToRomajiQuestion);
  if (config.modes.includes("romaji→kana")) generators.push(makeRomajiToKanaQuestion);
  if (config.modes.includes("typing")) generators.push(makeTypingQuestion);

  const out = [];
  for (let i = 0; i < count; i++) {
    const g = generators[i % generators.length];         // round-robin for now
    out.push(g(pool));
  }
  return shuffle(out); // light shuffle so order isn’t predictable
}
