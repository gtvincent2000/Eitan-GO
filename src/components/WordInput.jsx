import React from 'react';

const WordInput = ({ word, setWord, setSentence }) => {
  const handleChange = (e) => {
    setWord(e.target.value);
  };

  const handleSubmit = () => {
    // TODO: validate input
    // TODO: call OpenAI API later
    console.log(`Submitted word: ${word}`);

    // TEMP - simulate sentence generation
    setSentence(`${word} を使った例文です。`);

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
