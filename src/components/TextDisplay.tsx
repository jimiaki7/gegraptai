import { Verse as VerseType, Word as WordType, UserSettings, Annotation } from '../types';
import { Word } from './Word';
import { getBookById } from '../data/bookMapping';

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
                    <div className="text-display-empty-text">Enter biblical reference (聖書箇所を入力してください)</div>
                    <div className="text-display-hint">
                        Example: Gen 1:1-5; Ps 23; John 3:16
                    </div>
                </div>
            </div>
        );
    }

    let lastBookId: string | null = null;
    let lastChapter: number | null = null;

    return (
        <div className="text-display">
            {verses.map((verse) => {
                // Determine layout per verse to support mixed languages
                const language = verse.words[0]?.language || 'hebrew';
                const isRTL = language === 'hebrew' || language === 'aramaic';
                const fontSize = language === 'greek' ? settings.fontSizeGreek : settings.fontSizeHebrew;

                // Extract bookId from reference (e.g., "GEN.1.1")
                const bookId = verse.reference.split('.')[0];
                const showHeader = bookId !== lastBookId || verse.chapter !== lastChapter;

                if (showHeader) {
                    lastBookId = bookId;
                    lastChapter = verse.chapter;
                }

                const book = getBookById(bookId);
                const bookName = book ? book.name : bookId;

                return (
                    <div key={verse.reference} className="verse-container">
                        {showHeader && (
                            <div className="text-display-header">
                                <span className="text-display-header-book">{bookName}</span>
                                <span className="text-display-header-chapter">{verse.chapter}</span>
                            </div>
                        )}
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
                                        highlightColor={annotations[word.id]?.highlightColor}
                                        showMorph={settings.showMorphUnderWords}
                                        showHighlights={settings.showHighlights}
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
