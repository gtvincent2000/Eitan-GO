import React, { useState } from 'react';

const WordInput = ({ word, setWord, setSentence, setTranslation, loading, setLoading, setDefinition, setRomaji, setKanaWords, setRomajiWords,}) => {
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setWord(e.target.value);
    setError(""); // Clear error on input change
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
        const errorData = await response.json();
        const message = errorData?.error || "API returned an error";
        throw new Error(message);
    } 

      const data = await response.json();
      console.log("Generated sentence:", data.sentence);
      console.log("English translation:", data.translation);

      setSentence(data.sentence);
      setTranslation(data.translation);

      // Fetch romaji formatting from the new API route
      const formatRes = await fetch("/api/formatRomaji", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sentence: data.sentence }),
      });

      if (!formatRes.ok) {
        throw new Error("Romaji formatting API returned an error");
      }

      const formatData = await formatRes.json();
      console.log("Romaji formatting response:", formatData);

      setRomaji(formatData.formatted);
      setKanaWords(formatData.kanaWords);
      setRomajiWords(formatData.romajiWords);
      


      // TEMP: test definition fetch
      const defRes = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word }),
      });

      const defData = await defRes.json();
      console.log("Definition data:", defData);
      if (defData && defData.definition) {
        setDefinition(defData.definition);
      }

    } catch (error) {
      console.error("Error generating sentence:", error);
      setError(error.message || "Something went wrong.");
      setSentence("");
      setTranslation("");
      setRomaji("");
      setKanaWords([]);
      setRomajiWords([]);
      setDefinition(null);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4 items-start"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <label htmlFor="word-input" className="text-lg font-semibold">Enter a word:</label>
      <input
        id="wordInput"
        type="text"
        value={word}
        onChange={handleChange}
        placeholder="Type a Japanese word..."
        className="border border-gray-300 rounded px-3 py-2 w-full transition-colors duration-200"
        style={{
          background: "var(--input-bg)",
          color: "var(--foreground)"
        }}
      />
      <button onClick={handleSubmit} className="button-theme px-4 py-2 rounded font-semibold">
        Generate
      </button>

      {loading && (
        <div
          className="flex items-center gap-2 text-sm mt-1"
          style={{ color: "var(--foreground-secondary)" }}
        >
          <svg
            className="animate-spin h-4 w-4 text-blue-500"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          Generating sentence...
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default WordInput;
