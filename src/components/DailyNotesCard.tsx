import React, { useState } from 'react';
import type { DailyNote } from '../types';

export const DailyNotesCard: React.FC<{ note: DailyNote; onSave: (date: string, content: string) => void; isCaregiver?: boolean }> = ({ note, onSave, isCaregiver }) => {
  const [content, setContent] = useState(note.content || '');
  return (
    <div className="p-3 border rounded">
      <h3>Notas</h3>
      <textarea value={content} onChange={e => setContent(e.target.value)} />
      {isCaregiver && <button onClick={() => onSave(note.date, content)}>Salvar</button>}
    </div>
  );
};
