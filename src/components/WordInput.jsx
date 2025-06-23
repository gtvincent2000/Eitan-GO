import React from 'react';
import { formatRomaji } from "../app/utils/romajiFormatter";

const WordInput = ({ word, setWord, setSentence, setTranslation, loading, setLoading, setDefinition, setRomaji,}) => {
  const handleChange = (e) => {
    setWord(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Submitted word: ${word}`);

    // Exception handling API call
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error("API returned an error");
      }

      const data = await response.json();
      console.log("Generated sentence:", data.sentence);
      console.log("English translation:", data.translation);

      setSentence(data.sentence);
      setTranslation(data.translation);

      setRomaji(data.romaji);
      

      // setRomaji("dummy romaji output");


      // TEMP: test definition fetch
      const defRes = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const defData = await defRes.json();
      console.log("Definition data:", defData);
      setDefinition(defData);

    } catch (error) {
      console.error("Error generating sentence:", error);
      setSentence("Failed to generate sentence. Please try again.");
      setTranslation("");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4 items-start">
      <label htmlFor="word-input" className="text-lg font-semibold">Enter a word:</label>
      <input
        type="text"
        id="word-input"
        value={word}
        onChange={handleChange}
        placeholder="Type a Japanese word..."
        className="border border-gray-300 rounded px-3 py-2 w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default WordInput;
