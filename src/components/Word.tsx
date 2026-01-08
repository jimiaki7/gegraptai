import { useMemo, CSSProperties } from 'react';
import { Word as WordType } from '../types';

interface WordProps {
    word: WordType;
    isSelected: boolean;
    fontSize: number;
    morphTag?: string;
    showMorph: boolean;

    onClick: (word: WordType) => void;
}

export function Word({ word, isSelected, fontSize, morphTag, showMorph, onClick }: WordProps) {
    const languageClass = useMemo(() => {
        return `word-${word.language}`;
    }, [word.language]);

    const style: CSSProperties = useMemo(() => ({
        fontSize: `${fontSize}px`,
    }), [fontSize]);

    const hasMorph = showMorph && morphTag && morphTag.trim() !== '';

    return (
        <span
            className={`word ${languageClass} ${isSelected ? 'selected' : ''} ${hasMorph ? 'with-morph' : ''}`}
            onClick={() => onClick(word)}
            style={style}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick(word);
                }
            }}
        >
            <span className="word-surface">{word.surfaceForm}</span>
            {hasMorph && (
                <span className="word-morph">{morphTag}</span>
            )}
        </span>
    );
}
