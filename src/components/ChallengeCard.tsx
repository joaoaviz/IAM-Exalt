import React from 'react';
import { Challenge } from '../types';
import { CheckCircle, Lock } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick: (challenge: Challenge) => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all hover:scale-105 ${
        challenge.completed ? 'border-green-500 border-2' : ''
      }`}
      onClick={() => onClick(challenge)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{challenge.title}</h3>
        {challenge.completed ? (
          <CheckCircle className="text-green-500" size={24} />
        ) : (
          <Lock className="text-gray-400" size={24} />
        )}
      </div>
      <p className="text-gray-600 mb-4">{challenge.description}</p>
      <div className="text-sm text-indigo-600 font-medium">
        {challenge.completed ? 'Complété' : 'À compléter'}
      </div>
    </div>
  );
};