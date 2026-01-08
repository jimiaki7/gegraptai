import { useState, useCallback, useMemo } from 'react';
import { ReferenceInput } from './components/ReferenceInput';
import { TextDisplay } from './components/TextDisplay';
import { DetailPanel } from './components/DetailPanel';
import { SettingsPanel, SettingsToggle } from './components/SettingsPanel';
import { useAnnotations } from './hooks/useAnnotations';
import { useSettings } from './hooks/useSettings';
import { parseReference } from './utils/referenceParser';
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
        exportAnnotations,
        importAnnotations,
    } = useAnnotations();

    // Custom helper if not exposed (it exposes updateAnnotation? No, looking at hook file, it exposes updateMorphTag and updateNote. 
    // And getAnnotation. But default useAnnotations also returns `updateMorphTag` which calls `updateAnnotation`.
    // Wait, I need to see if `updateAnnotation` is exposed. 
    // Looking at file content from previous step: 
    // return { annotations, getAnnotation, updateMorphTag, updateNote, exportAnnotations, importAnnotations }
    // It does NOT expose updateAnnotation generally. I need to modify useAnnotations.ts OR add updateHighlight there.
    // For now, I'll assume I'll fix useAnnotations.ts next.

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

        const ref = parseReference(input);

        if (!ref) {
            setError('無効な聖書箇所形式です');
            setVerses([]);
            setSelectedWordId(null);
            return;
        }

        const book = getBookById(ref.bookId);
        if (!book) {
            setError('書名が見つかりません');
            setVerses([]);
            setSelectedWordId(null);
            return;
        }

        const loadedVerses = getVerses(
            ref.bookId,
            ref.chapter,
            ref.startVerse,
            ref.endVerse,
            book.lang
        );

        setError(null);
        setVerses(loadedVerses);
        setSelectedWordId(null);
    }, []);

    const handleWordClick = useCallback((word: Word) => {
        setSelectedWordId(word.id);
    }, []);

    const handleShowMorphToggle = useCallback((show: boolean) => {
        updateSetting('showMorphUnderWords', show);
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
        <div className="app">
            <header className="app-header">
                <div className="app-logo">📖 Gegraptai</div>
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
                        title="印刷 / PDF出力"
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
                    <div style={{
                        padding: '12px 16px',
                        background: 'rgba(229, 57, 53, 0.1)',
                        borderRadius: '8px',
                        color: '#e53935',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
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
                onMorphTagChange={updateMorphTag}
                onNoteChange={updateNote}

                onShowMorphToggle={handleShowMorphToggle}
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
                Copyright &copy; {new Date().getFullYear()} Jimi Takaishi
            </footer>
        </div>
    );
}

export default App;
