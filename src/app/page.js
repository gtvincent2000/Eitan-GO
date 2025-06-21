'use client';
import { useState } from 'react';
import WordInput from '../components/WordInput';

export default function Home() {
  const [word, setWord] = useState('');
  const [sentence, setSentence] = useState('');

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Eitan-GO - 英単語ノート</h1>
      </section>

      {/* Word Input Section*/}
      <section>
      <WordInput word={word} setWord={setWord} setSentence={setSentence} />
      </section>

      {/* Sentence Generation Section */}
      <section className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Generated Sentence</h2>
          {sentence ? (
            <p>{sentence}</p>
          ) : (
            <p>Enter a word to generate a sentence.</p>
          )}
      </section>
    </main>
  );
}
