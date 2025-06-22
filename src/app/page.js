'use client';
import { useState } from 'react';
import WordInput from '../components/WordInput';

export default function Home() {
  const [word, setWord] = useState('');
  const [sentence, setSentence] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [definition, setDefinition] = useState(null);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">Eitan-GO - 英単語ノート</h1>
      </section>

      {/* Word Input Section*/}
      <section>
        <WordInput 
          word={word} 
          setWord={setWord} 
          setSentence={setSentence} 
          setTranslation={setTranslation}
          loading={loading}
          setLoading={setLoading}
          setDefinition={setDefinition}
        />
      </section>

      {/* Sentence Generation Section */}
      <section className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Generated Sentence</h2>
        {loading ? (
          <p className="text-gray-500 italic">Generating sentence...</p>
        ) : sentence ? (
          <>
            <p className="mb-2">{sentence}</p>
            {translation && (
              <>
                <h3 className="text-lg font-medium mt-2">English Translation</h3>
                <p>{translation}</p>
              </>
            )}
          </>
        ) : (
          <p>Enter a word to generate a sentence.</p>
        )}
      </section>
      {/* Definition Section */}
      {definition && (
        <section className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Definition</h2>
          <p>
            <strong>Word:</strong> {definition.word}
          </p>
          <p>
            <strong>Reading:</strong> {definition.reading}
          </p>
          <p>
            <strong>Meaning(s):</strong>
          </p>
          <ul className="list-disc list-inside ml-4">
            {definition.meanings.map((meaning, index) => (
              <li key={index}>{meaning}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
