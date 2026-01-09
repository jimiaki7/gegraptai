import { useState, useCallback, useMemo, useEffect } from 'react';
import { TextDisplay } from './components/TextDisplay';
import { DetailPanel } from './components/DetailPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { Header } from './components/Header';
import { useAnnotations } from './hooks/useAnnotations';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { parseMultipleReferences } from './utils/referenceParser';
import { getVerses } from './data/bibleData';
import { getBookById } from './data/bookMapping';
import { Verse, Word } from './types';
import { AuthModal } from './components/AuthModal';
import { WelcomeModal } from './components/WelcomeModal';

const WELCOME_SHOWN_KEY = 'gegraptai-welcome-shown';

function App() {
    const [verses, setVerses] = useState<Verse[]>([]);
    const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
    const { user, logout, isAuthenticated, isInit } = useAuth();
    const {
        settings,
        updateSetting,
        setTheme,
        setFontSizeHebrew,
        setFontSizeGreek,
        setFontFamilyHebrew,
        setFontFamilyGreek,
        setLineHeight
    } = useSettings();
    const {
        annotations,
        updateMorphTag,
        updateNote,
        updateColor,
        getAnnotation,
        exportAnnotations,
        importAnnotations,
        isSyncing,
        isLoading
    } = useAnnotations(user);

    const login = useCallback(() => {
        setIsAuthModalOpen(true);
    }, []);

    // Initial display: Load Genesis 1:1 and John 1:1 on first render
    useEffect(() => {
        if (!isInit) return;

        const loadInitialData = async () => {
            try {
                // Load initial verses: Genesis 1:1 and John 1:1
                const genVerse = await getVerses('GEN', 1, 1, 1, 'hebrew');
                const johnVerse = await getVerses('JHN', 1, 1, 1, 'greek');
                setVerses([...genVerse, ...johnVerse]);
            } catch (e) {
                console.error("Failed to load initial verses", e);
            }
        };

        loadInitialData();

        // Show welcome modal on first visit
        const hasSeenWelcome = localStorage.getItem(WELCOME_SHOWN_KEY);
        if (!hasSeenWelcome) {
            setIsWelcomeModalOpen(true);
        }
    }, [isInit]);

    const handleWelcomeClose = useCallback(() => {
        setIsWelcomeModalOpen(false);
        localStorage.setItem(WELCOME_SHOWN_KEY, 'true');
    }, []);

    const handleReferenceSubmit = useCallback(async (input: string) => {
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

            try {
                const loadedVerses = await getVerses(
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
            } catch (e) {
                hasError = true;
                console.error("Error loading verses", e);
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
            <Header
                isAuthenticated={isAuthenticated}
                onLogin={login}
                onLogout={logout}
                onPrint={handlePrint}
                onOpenSettings={() => setSettingsOpen(true)}
                onReferenceSubmit={handleReferenceSubmit}
                error={error}
                disablePrint={verses.length === 0}
            />

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
                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
                <WelcomeModal
                    isOpen={isWelcomeModalOpen}
                    onClose={handleWelcomeClose}
                    onLoginClick={login}
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
                isSyncing={isSyncing}
                isLoading={isLoading}
                isAuthenticated={isAuthenticated}
                onLogin={login}
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
                <a
                    href="https://www.buymeacoffee.com/tzkOt5b5yf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="coffee-link"
                >
                    <img
                        src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=tzkOt5b5yf&button_colour=676767&font_colour=ffffff&font_family=Cookie&outline_colour=ffffff&coffee_colour=FFDD00"
                        alt="Buy me a coffee"
                    />
                </a>
            </footer>
        </div>
    );
}

export default App;
