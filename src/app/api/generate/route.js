import OpenAI from "openai";
import { formatRomaji } from "@/lib/romajiFormatter";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function containsKanji(text) {
  return /[\u4e00-\u9faf]/.test(text);
}


export async function POST(request) {
  const body = await request.json();
  const word = body.word;

  console.log("word received from frontend:", word);

  if (!word || typeof word !== "string" || word.trim() === "") {
    return Response.json(
      { error: "Invalid input. Please provide a valid word." },
      { status: 400 }
    );
  }

  try {
    let japanese = "";
    let english = "";
    let attempts = 0;
    let success = false;
    let content = "";

    while (attempts < 3 && !success) {
      attempts++;
      console.log(`Attempt ${attempts}...`);

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant for beginner Japanese learners. 
    All Japanese must be written using only hiragana and katakana — absolutely no kanji at all. 
    Even common words like "食べる" must be written as たべる.
    Respond only in the following format:

    Japanese: <your kana-only sentence>
    English: <your English translation>

    Important rules:
    - DO NOT use kanji for any reason. Even if the word is commonly written in kanji,
      always use hiragana or katakana.
    - The sentence must use the given word.
    - Keep it short and simple for beginners.`
          },
          {
            role: "user",
            content: `Use the word "${word}" in a short sentence.`,
          },
        ],
        max_tokens: 180,
      });

      content = response.choices[0].message.content.trim();
      console.log("Raw OpenAI content:", content);

      const lines = content.split("\n");
      for (const line of lines) {
        if (line.toLowerCase().startsWith("japanese:")) {
          japanese = line.replace(/japanese:/i, "").trim();
        } else if (line.toLowerCase().startsWith("english:")) {
          english = line.replace(/english:/i, "").trim();
        }
      }

      if (!containsKanji(japanese)) {
        success = true;
      } else {
        console.warn("Retrying due to kanji:", japanese);
      }
    }

    if (!success) {
      return Response.json(
        { error: "Failed to generate a kana-only sentence after 3 attempts." },
        { status: 422 }
      );
    }

    const romaji = await formatRomaji(japanese);

    console.log("Parsed Japanese:", japanese);
    console.log("Parsed English:", english);

    return Response.json({
      sentence: japanese,
      translation: english,
      romaji: romaji,
    });
  } catch (error) {
    console.error("Error generating sentence:", error);
    return Response.json(
      { error: "Failed to generate sentence. Please try again." },
      { status: 500 }
    );
  }
}



