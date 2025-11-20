import React, { useState } from 'react';
import type { DailyNote } from '../types';

export const DailyNotesCard: React.FC<{ note: DailyNote; onSave: (date: string, content: string) => void; isCaregiver?: boolean }> = ({ note, onSave, isCaregiver }) => {
  const [content, setContent] = useState(note.content || '');
  const [saved, setSaved] = useState(false);
  
  const handleSave = () => {
    onSave(note.date, content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-green-500">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">📝 Notas do Dia</h3>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Adicione suas notas aqui..."
        className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
        rows={4}
      />
      {isCaregiver && (
        <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white font-semibold py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm sm:text-base whitespace-nowrap"
          >
            Salvar
          </button>
          {saved && <span className="text-xs sm:text-sm text-green-600 font-semibold">✓ Salvo!</span>}
        </div>
      )}
    </div>
  );
};
