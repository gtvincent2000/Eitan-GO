import OpenAI from "openai";
import { formatRomaji } from "@/app/utils/romajiFormatter"; // adjust path if needed


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
                    - DO NOT use kanji for any reason.
                    - The sentence must use the given word.
                    - Keep it short and simple for beginners.`
        },
        {
          role: "user",
          content: `Use the word "${word}" in a short sentence.`,
        },
      ],
      max_tokens: 80,
    });

    const content = response.choices[0].message.content.trim();
    console.log("Raw OpenAI content:", content);

    const lines = content.split("\n");
    let japanese = "";
    let english = "";

    for (const line of lines) {
      if (line.toLowerCase().startsWith("japanese:")) {
        japanese = line.replace(/japanese:/i, "").trim();
      } else if (line.toLowerCase().startsWith("english:")) {
        english = line.replace(/english:/i, "").trim();
      }
    }

    const romaji = await formatRomaji(japanese); // Format romaji after parsing

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



