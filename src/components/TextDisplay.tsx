import { Verse as VerseType, Word as WordType, UserSettings, Annotation } from '../types';
import { Word } from './Word';

interface TextDisplayProps {
    verses: VerseType[];
    selectedWordId: string | null;
    settings: UserSettings;
    annotations: Record<string, Annotation>;
    onWordClick: (word: WordType) => void;
}

export function TextDisplay({ verses, selectedWordId, settings, annotations, onWordClick }: TextDisplayProps) {
    if (verses.length === 0) {
        return (
            <div className="text-display">
                <div className="text-display-empty">
                    <div className="text-display-empty-icon">📖</div>
                    <div className="text-display-empty-text">聖書箇所を入力してください</div>
                    <div className="text-display-hint">
                        例: Gen. 1:1-5, Ps. 23, John 1:1-5, Rom. 12:1-2
                    </div>
                </div>
            </div>
        );
    }

    // Determine language from first word
    const language = verses[0]?.words[0]?.language || 'hebrew';
    const isRTL = language === 'hebrew' || language === 'aramaic';
    const fontSize = language === 'greek' ? settings.fontSizeGreek : settings.fontSizeHebrew;

    return (
        <div className="text-display">
            {verses.map((verse) => {
                return (
                    <div key={verse.reference} className="verse-container">
                        <div className="verse">
                            <div className={`verse-content ${isRTL ? 'rtl' : 'ltr'}`}>
                                <span className="verse-number">{verse.verse}</span>
                                {verse.words.map((word) => (
                                    <Word
                                        key={word.id}
                                        word={word}
                                        isSelected={word.id === selectedWordId}
                                        fontSize={fontSize}
                                        morphTag={annotations[word.id]?.morphTag}
                                        showMorph={settings.showMorphUnderWords}
                                        onClick={onWordClick}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
