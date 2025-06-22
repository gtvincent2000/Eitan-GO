import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


export async function POST(request) {
    // convert the request body to JSON
  const body = await request.json();

  // Extract the value of "word" key
  const word = body.word;

  console.log("word received from frontend:", word);

  // Validate the input
  if (!word || typeof word !== 'string' || word.trim() === '') {
    return Response.json({ error: 'Invalid input. Please provide a valid word.' }, { status: 400 });
  }

  // OpenAI API call to generate a sentence using the provided word
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for beginner Japanese learners. Your responses should always include:\n1. A simple sentence in Japanese using the given word (hiragana + katakana only).\n2. An English translation on the next line.\n\nFormat:\nJapanese: <kana sentence>\nEnglish: <translation>",
        },
        {
          role: "user",
          content: `Generate a short, natural Japanese sentence using the word "${word}". 
                    Output the result in the following format, using only hiragana and katakana for the Japanese sentence:
                    Japanese: [your Japanese sentence]
                    English: [English translation of the sentence]`
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

    console.log("Parsed Japanese:", japanese);
    console.log("Parsed English:", english);

    return Response.json({
      sentence: japanese,
      translation: english,
    });
  } catch (error) {
    console.error("Error generating sentence:", error);
    return Response.json({ error: 'Failed to generate sentence. Please try again.' }, { status: 500 });
  }

}
