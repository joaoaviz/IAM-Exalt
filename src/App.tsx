import React, { useState } from 'react';
import { Header } from './components/Header';
import { ChallengeCard } from './components/ChallengeCard';
import { ProgressBar } from './components/ProgressBar';
import { LoginChallenge } from './components/challenges/LoginChallenge';
import { AuthorizationChallenge } from './components/challenges/AuthorizationChallenge';
import { PermissionsChallenge } from './components/challenges/PermissionsChallenge';
import { RBACChallenge } from './components/challenges/RBACChallenge';
import { LeastPrivilegeChallenge } from './components/challenges/LeastPrivilegeChallenge';
import { FederatedIdentityChallenge } from './components/challenges/FederatedIdentityChallenge';
import { challenges } from './data/challenges';
import { Challenge } from './types';

function App() {
  const [currentChallenges, setCurrentChallenges] = useState(challenges);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const progress = (currentChallenges.filter(c => c.completed).length / currentChallenges.length) * 100;

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleCompleteChallenge = () => {
    if (selectedChallenge) {
      setCurrentChallenges(prev =>
        prev.map(c =>
          c.id === selectedChallenge.id ? { ...c, completed: true } : c
        )
      );
      setSelectedChallenge(null);
    }
  };

  const renderChallengeContent = (challenge: Challenge) => {
    // If the challenge has a component, use it
    if (challenge.component) {
      const Component = challenge.component;
      return <Component onSuccess={handleCompleteChallenge} />;
    }

    // Otherwise, render the default content
    return (
      <div className="bg-indigo-50 p-6 rounded-lg mb-6">
        <p className="text-gray-800">{challenge.content?.intro}</p>
        <div className="mt-6">
          <h4 className="font-semibold text-gray-700 mb-2">Leçons à retenir:</h4>
          <ul className="list-disc pl-5 space-y-2">
            {(challenge.content?.lessons || []).map((lesson: string, index: number) => (
              <li key={index} className="text-gray-600">{lesson}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre Progression</h2>
          <ProgressBar progress={progress} />
        </div>

        {selectedChallenge ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">{selectedChallenge.title}</h2>
            <p className="text-gray-600 mb-6">{selectedChallenge.principle}</p>
            {renderChallengeContent(selectedChallenge)}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setSelectedChallenge(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Retour
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentChallenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={handleChallengeClick}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;