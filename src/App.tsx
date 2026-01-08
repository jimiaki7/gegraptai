import { useState, useCallback, useMemo } from 'react';
import { ReferenceInput } from './components/ReferenceInput';
import { TextDisplay } from './components/TextDisplay';
import { DetailPanel } from './components/DetailPanel';
import { SettingsPanel, SettingsToggle } from './components/SettingsPanel';
import { useAnnotations } from './hooks/useAnnotations';
import { useSettings } from './hooks/useSettings';
import { parseMultipleReferences } from './utils/referenceParser';
import { getVerses } from './data/bibleData';
import { getBookById } from './data/bookMapping';
import { Verse, Word } from './types';


function App() {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const {
        annotations,
        getAnnotation,
        updateMorphTag,
        updateNote,
        updateColor,
        exportAnnotations,
        importAnnotations,
    } = useAnnotations();


    const {
        settings,
        setTheme,
        setFontSizeHebrew,
        setFontSizeGreek,
        setFontFamilyHebrew,
        setFontFamilyGreek,
        setLineHeight,
        updateSetting
    } = useSettings();

    const handleReferenceSubmit = useCallback((input: string) => {
        if (!input.trim()) {
            setVerses([]);
            setError(null);
            setSelectedWordId(null);
            return;
        }

        const refs = parseMultipleReferences(input);

        if (refs.length === 0) {
            setError('Invalid Bible passage format (無効な聖書箇所形式です) Ex: Gen 1:1, Ps 23');
            setVerses([]);
            setSelectedWordId(null);
            return;
        }

        const allVerses: Verse[] = [];
        let hasError = false;

        for (const ref of refs) {
            const book = getBookById(ref.bookId);
            if (!book) {
                // Should not happen if parser is correct, but for safety
                continue;
            }

            const loadedVerses = getVerses(
                ref.bookId,
                ref.chapter,
                ref.startVerse,
                ref.endVerse,
                book.lang
            );

            if (loadedVerses.length === 0) {
                hasError = true;
            } else {
                allVerses.push(...loadedVerses);
            }
        }

        if (allVerses.length === 0 && hasError) {
            setError('Not Found: 指定された範囲に節が見つかりません');
            setVerses([]);
        } else {
            setError(null);
            setVerses(allVerses);
        }

        setSelectedWordId(null);
    }, []);

    const handleWordClick = useCallback((word: Word) => {
        setSelectedWordId(word.id);
    }, []);

    const handleClearSelection = useCallback(() => {
        setSelectedWordId(null);
    }, []);

    const handleShowMorphToggle = useCallback((show: boolean) => {
        updateSetting('showMorphUnderWords', show);
    }, [updateSetting]);

    const handleShowHighlightsToggle = useCallback((show: boolean) => {
        updateSetting('showHighlights', show);
    }, [updateSetting]);

    const handlePrint = useCallback(() => {
        window.print();
    }, []);

    const selectedWord = useMemo(() => {
        if (!selectedWordId) return null;
        for (const verse of verses) {
            const word = verse.words.find(w => w.id === selectedWordId);
            if (word) return word;
        }
        return null;
    }, [verses, selectedWordId]);

    const currentAnnotation = useMemo(() => {
        if (!selectedWordId) return undefined;
        return getAnnotation(selectedWordId);
    }, [selectedWordId, getAnnotation]);

    return (
        <div className="app" onClick={handleClearSelection}>
            <header className="app-header" onClick={(e) => e.stopPropagation()}>
                <div className="app-logo">📖 <span>Gegraptai</span></div>
                <ReferenceInput onSubmit={handleReferenceSubmit} error={error} />
                <div className="header-actions">
                    <a
                        href="https://www.buymeacoffee.com/tzkOt5b5yf"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', height: '40px' }}
                    >
                        <img
                            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=tzkOt5b5yf&button_colour=676767&font_colour=ffffff&font_family=Cookie&outline_colour=ffffff&coffee_colour=FFDD00"
                            alt="Buy me a coffee"
                            style={{ height: '100%', borderRadius: '8px' }}
                        />
                    </a>
                    <button
                        className="print-button"
                        onClick={handlePrint}
                        title="Print / PDF Export"
                        disabled={verses.length === 0}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9V2h12v7" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect x="6" y="14" width="12" height="8" />
                        </svg>
                    </button>
                    <SettingsToggle onClick={() => setSettingsOpen(true)} />
                </div>
            </header>

            <main className="app-main">
                {error && (
                    <div className="app-error-message">
                        {error}
                    </div>
                )}
                <TextDisplay
                    verses={verses}
                    selectedWordId={selectedWordId}
                    settings={settings}
                    annotations={annotations}
                    onWordClick={handleWordClick}
                />
            </main>

            <DetailPanel
                selectedWord={selectedWord}
                annotation={currentAnnotation}
                showMorphUnderWords={settings.showMorphUnderWords}
                showHighlights={settings.showHighlights}
                onMorphTagChange={updateMorphTag}
                onNoteChange={updateNote}

                onShowMorphToggle={handleShowMorphToggle}
                onShowHighlightsToggle={handleShowHighlightsToggle}
                onColorChange={updateColor}
            />

            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                settings={settings}
                onThemeChange={setTheme}
                onFontSizeHebrewChange={setFontSizeHebrew}
                onFontSizeGreekChange={setFontSizeGreek}
                onFontFamilyHebrewChange={setFontFamilyHebrew}
                onFontFamilyGreekChange={setFontFamilyGreek}
                onLineHeightChange={setLineHeight}
                onExportAnnotations={exportAnnotations}
                onImportAnnotations={importAnnotations}
            />

            <footer className="app-footer">
                <div className="footer-content">
                    <p>Copyright &copy; {new Date().getFullYear()} Jimi Takaishi</p>
                    <div className="footer-citations">
                        <p>
                            OSHB (Open Scriptures Hebrew Bible) {' '}
                            <a href="https://hb.openscriptures.org/index.html" target="_blank" rel="noopener noreferrer">
                                https://hb.openscriptures.org/index.html
                            </a>
                        </p>
                        <p>
                            Tauber, J. K., ed. (2017) MorphGNT: SBLGNT Edition. Version 6.12 [Data set]. {' '}
                            <a href="https://github.com/morphgnt/sblgnt" target="_blank" rel="noopener noreferrer">
                                https://github.com/morphgnt/sblgnt
                            </a> {' '}
                            DOI: 10.5281/zenodo.376200
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
