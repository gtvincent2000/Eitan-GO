import kuromoji from "kuromoji";
import { toRomaji } from "wanakana";
import path from "path";

// Global tokenizer cache
let tokenizer = null;

async function loadTokenizer() {
  if (tokenizer) return tokenizer;

  return new Promise((resolve, reject) => {
    kuromoji.builder({
      dicPath: path.join(process.cwd(), "node_modules/kuromoji/dict"),
    }).build((err, builtTokenizer) => {
      if (err) reject(err);
      else {
        tokenizer = builtTokenizer;
        resolve(tokenizer);
      }
    });
  });
}

export async function POST(request) {
  const body = await request.json();
  const sentence = body.sentence;

  console.log("Formatting sentence:", sentence);

  if (!sentence || typeof sentence !== "string") {
    return Response.json({ error: "Invalid sentence input" }, { status: 400 });
  }

  try {
    const tokenizer = await loadTokenizer();
    const tokens = tokenizer.tokenize(sentence);

    const kanaWords = tokens.map(t => t.surface_form);
    const romajiWords = tokens.map(t => toRomaji(t.surface_form));
    const formatted = romajiWords.join(" ");

    return Response.json({
      kanaWords,
      romajiWords,
      formatted,
    });
  } catch (err) {
    console.error("Romaji formatting error:", err);
    return Response.json({ error: "Failed to format sentence" }, { status: 500 });
  }
}
