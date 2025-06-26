import OpenAI from "openai";
import { formatRomajiWithTokenizer } from "@/lib/romajiFormatter";

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
    let japanese = "";
    let english = "";
    let content = "";


    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for beginner Japanese learners.
                      Generate a short, simple Japanese sentence that uses the given word.

                      - You may use kanji, but keep the sentence appropriate for learners.
                      - The kanji should be common (JLPT N5/N4 level).
                      - Keep the sentence short and clear.
                      - Do not explain anything, just return the result.

                      Respond *only* in this exact format:

                      Japanese: <your sentence with kanji and kana>
                      English: <English translation of the sentence>`,
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

    const romaji = await formatRomajiWithTokenizer(japanese);

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



