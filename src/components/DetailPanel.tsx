import { useCallback, ChangeEvent } from 'react';
import { Word, Annotation } from '../types';

interface DetailPanelProps {
    selectedWord: Word | null;
    annotation: Annotation | undefined;
    showMorphUnderWords: boolean;
    onMorphTagChange: (wordId: string, value: string) => void;
    onNoteChange: (wordId: string, value: string) => void;
    onColorChange: (wordId: string, value: string) => void;
    showHighlights: boolean;
    onShowMorphToggle: (show: boolean) => void;
    onShowHighlightsToggle: (show: boolean) => void;
}

export function DetailPanel({
    selectedWord,
    annotation,
    showMorphUnderWords,
    onMorphTagChange,
    onNoteChange,
    onColorChange,
    showHighlights,
    onShowMorphToggle,
    onShowHighlightsToggle,
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

    const handleShowHighlightsChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        onShowHighlightsToggle(e.target.checked);
    }, [onShowHighlightsToggle]);

    if (!selectedWord) {
        return (
            <div className="detail-panel is-empty" onClick={(e) => e.stopPropagation()}>
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
                            <span className="detail-checkbox-label">Show Tags</span>
                        </label>
                        <label className="detail-checkbox">
                            <input
                                type="checkbox"
                                checked={showHighlights}
                                onChange={handleShowHighlightsChange}
                            />
                            <span className="detail-checkbox-label">Highlight On/Off</span>
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    const languageClass = selectedWord.language;

    return (
        <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
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
                    <div className="detail-field-row">
                        <div className="detail-field is-flexible">
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
                            <label className="detail-field-label">Highlight Color</label>
                            <div className="color-picker-group">
                                {[
                                    { id: 'none', color: '', label: 'Default' },
                                    { id: 'red', color: '#e53935', label: 'Red' },
                                    { id: 'orange', color: '#fb8c00', label: 'Orange' },
                                    { id: 'gold', color: '#c5a000', label: 'Gold' },
                                    { id: 'green', color: '#2e7d32', label: 'Green' },
                                    { id: 'blue', color: '#4361ee', label: 'Blue' },
                                    { id: 'purple', color: '#8e24aa', label: 'Purple' },
                                    { id: 'pink', color: '#d81b60', label: 'Pink' },
                                ].map((opt) => (
                                    <label
                                        key={opt.id}
                                        className={`color-radio ${(!annotation?.highlightColor && opt.color === '') || annotation?.highlightColor === opt.color ? 'active' : ''}`}
                                        title={opt.label}
                                    >
                                        <input
                                            type="radio"
                                            name="highlight-color"
                                            value={opt.color}
                                            checked={(!annotation?.highlightColor && opt.color === '') || annotation?.highlightColor === opt.color}
                                            onChange={() => onColorChange(selectedWord.id, opt.color)}
                                        />
                                        <span className="color-swatch" style={{ backgroundColor: opt.color || 'var(--color-text-primary)' }}>
                                            {opt.color === '' && <span className="no-color-slash"></span>}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
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
                        <div className="detail-footer-row">
                            <label className="detail-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showMorphUnderWords}
                                    onChange={handleShowMorphChange}
                                />
                                <span className="detail-checkbox-label">Show Tags</span>
                            </label>

                            <label className="detail-checkbox">
                                <input
                                    type="checkbox"
                                    checked={showHighlights}
                                    onChange={handleShowHighlightsChange}
                                />
                                <span className="detail-checkbox-label">Highlight On/Off</span>
                            </label>

                            <span className="save-indicator" style={{
                                opacity: annotation?.updatedAt ? 1 : 0
                            }}>
                                ✓ Saved
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
