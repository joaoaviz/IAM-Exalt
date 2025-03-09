import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck size={32} />
            <h1 className="text-2xl font-bold">Défi IAM</h1>
          </div>
          <p className="text-indigo-200">Apprenez la Sécurité en Pratique</p>
        </div>
      </div>
    </header>
  );
};