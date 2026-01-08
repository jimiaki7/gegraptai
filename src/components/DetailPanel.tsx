import { useCallback, ChangeEvent } from 'react';
import { Word, Annotation } from '../types';

interface DetailPanelProps {
    selectedWord: Word | null;
    annotation: Annotation | undefined;
    showMorphUnderWords: boolean;
    onMorphTagChange: (wordId: string, value: string) => void;
    onNoteChange: (wordId: string, value: string) => void;
    onShowMorphToggle: (show: boolean) => void;
}

export function DetailPanel({
    selectedWord,
    annotation,
    showMorphUnderWords,
    onMorphTagChange,
    onNoteChange,
    onShowMorphToggle,
}: DetailPanelProps) {
    const handleMorphChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (selectedWord) {
            onMorphTagChange(selectedWord.id, e.target.value);
        }
    }, [selectedWord, onMorphTagChange]);

    const handleNoteChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        if (selectedWord) {
            onNoteChange(selectedWord.id, e.target.value);
        }
    }, [selectedWord, onNoteChange]);

    const handleShowMorphChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onShowMorphToggle(e.target.checked);
    }, [onShowMorphToggle]);



    if (!selectedWord) {
        return (
            <div className="detail-panel">
                <div className="detail-panel-empty">
                    <div className="detail-panel-hint">
                        Click a word to enter tags and exegetical notes (単語をクリックすると、パースと釈義ノートを入力できます)
                    </div>
                    <div className="detail-panel-options">
                        <label className="detail-checkbox">
                            <input
                                type="checkbox"
                                checked={showMorphUnderWords}
                                onChange={handleShowMorphChange}
                            />
                            <span className="detail-checkbox-label">Show tags under words</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    const languageClass = selectedWord.language;

    return (
        <div className="detail-panel">
            <div className="detail-panel-content">
                <div className="detail-word-display">
                    <div className={`detail-word-text ${languageClass}`}>
                        {selectedWord.surfaceForm}
                    </div>
                    <div className="detail-word-ref">
                        {selectedWord.verseRef} • pos {selectedWord.position + 1}
                    </div>
                </div>

                <div className="detail-fields">
                    <div className="detail-field">
                        <label className="detail-field-label" htmlFor="morph-tag">
                            Morphological Tag (パース)
                        </label>
                        <input
                            id="morph-tag"
                            type="text"
                            className="detail-field-input"
                            placeholder={selectedWord.language === 'greek' ? 'Ex: Pres Ind Act 3s' : 'Ex: Qal pf 3ms'}
                            value={annotation?.morphTag || ''}
                            onChange={handleMorphChange}
                        />
                    </div>

                    <div className="detail-field">
                        <label className="detail-field-label" htmlFor="exegetical-note">
                            Exegetical Notes (釈義ノート)
                        </label>
                        <textarea
                            id="exegetical-note"
                            className="detail-field-input detail-field-textarea"
                            placeholder="Syntax, usage, theological value, etc. (語義、用例、神学的含意など...)"
                            value={annotation?.exegeticalNote || ''}
                            onChange={handleNoteChange}
                        />
                    </div>

                    <div className="detail-field">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="detail-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showMorphUnderWords}
                                    onChange={handleShowMorphChange}
                                />
                                <span className="detail-checkbox-label">Show tags under words</span>
                            </label>

                            <span className="save-indicator" style={{
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                                opacity: annotation?.updatedAt ? 1 : 0,
                                transition: 'opacity 0.3s'
                            }}>
                                ✓ Saved!
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
