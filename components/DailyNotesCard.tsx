import React, { useState, useEffect } from 'react';
import { DailyNote } from '../types';

interface DailyNotesCardProps {
    note: DailyNote;
    onSave: (date: string, content: string) => void;
    isCaregiver: boolean;
}

export const DailyNotesCard: React.FC<DailyNotesCardProps> = ({ note, onSave, isCaregiver }) => {
    const [content, setContent] = useState(note.content);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setContent(note.content);
    }, [note]);

    const handleSave = () => {
        onSave(note.date, content);
        setIsEditing(false);
    };

    const handleBlur = () => {
        if(content !== note.content) {
            handleSave();
        }
        setIsEditing(false);
    }
    
    return (
        <section>
            <h2 className="text-xl font-semibold mb-4">Anotações Gerais do Dia</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsEditing(true)}
                    onBlur={handleBlur}
                    readOnly={!isCaregiver}
                    rows={5}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow disabled:bg-gray-50"
                    placeholder={isCaregiver ? "Clique para adicionar notas sobre o dia (ex: humor, apetite, eventos importantes)..." : "Sem anotações para hoje."}
                    disabled={!isCaregiver}
                />
                {isEditing && isCaregiver && (
                    <div className="text-right mt-2">
                        <p className="text-xs text-gray-400">As alterações são salvas automaticamente.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
