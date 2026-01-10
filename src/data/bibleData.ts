import { Verse, Word } from '../types';
import { getVerseId, getWordId } from '../utils/referenceParser';

// Type definitions for imported data
interface WordData {
    t: string;  // text
    l: string;  // lemma
    m: string;  // morph
}

// Book data structure (single book)
interface BookData {
    [chapter: string]: {
        [verse: string]: WordData[];
    };
}

// OT Books (Hebrew/Aramaic)
const OT_BOOKS = new Set([
    'GEN', 'EXO', 'LEV', 'NUM', 'DEU',
    'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI',
    '1CH', '2CH', 'EZR', 'NEH', 'EST',
    'JOB', 'PSA', 'PRO', 'ECC', 'SNG',
    'ISA', 'JER', 'LAM', 'EZK', 'DAN',
    'HOS', 'JOL', 'AMO', 'OBA', 'JON', 'MIC',
    'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL'
]);

// NT Books
const NT_BOOKS = new Set([
    'MAT', 'MRK', 'LUK', 'JHN', 'ACT',
    'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL',
    '1TH', '2TH', '1TI', '2TI', 'TIT', 'PHM',
    'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV'
]);

// Daniel has Aramaic portions (chapters 2:4b-7:28)
const ARAMAIC_PORTIONS: { [bookId: string]: { startChapter: number; endChapter: number }[] } = {
    'DAN': [{ startChapter: 2, endChapter: 7 }],
    'EZR': [{ startChapter: 4, endChapter: 7 }],
};

// Dynamic imports map
const bookModules = import.meta.glob('./books/*.json');

/**
 * Determine language for a book/chapter
 */
function getLanguage(bookId: string, chapter: number): 'hebrew' | 'aramaic' | 'greek' {
    if (!OT_BOOKS.has(bookId)) {
        return 'greek';
    }

    // Check for Aramaic portions
    const aramaicRanges = ARAMAIC_PORTIONS[bookId];
    if (aramaicRanges) {
        for (const range of aramaicRanges) {
            if (chapter >= range.startChapter && chapter <= range.endChapter) {
                return 'aramaic';
            }
        }
    }

    return 'hebrew';
}

/**
 * Get verses for a given book and chapter (Async)
 */
export async function getVerses(
    bookId: string,
    chapter: number,
    startVerse: number,
    endVerse: number | null,
    _langHint?: 'hebrew' | 'aramaic' | 'greek'
): Promise<Verse[]> {
    const importFn = bookModules[`./books/${bookId}.json`];

    if (!importFn) {
        console.error(`Data for book ${bookId} not found`);
        return [];
    }

    try {
        // Force cast to any first to avoid complex union type issues with dynamic imports
        const module = await importFn() as any;
        const bookData = ('default' in module ? module.default : module) as BookData;

        const chapterData = bookData[chapter.toString()];

        if (!chapterData) {
            return [];
        }

        const language = getLanguage(bookId, chapter);
        const verses: Verse[] = [];

        // Get all verse numbers and sort them
        const verseNumbers = Object.keys(chapterData)
            .map(v => parseInt(v, 10))
            .sort((a, b) => a - b);

        for (const verseNum of verseNumbers) {
            // Apply verse range filter
            if (verseNum < startVerse) {
                continue;
            }
            if (endVerse !== null && verseNum > endVerse) {
                continue;
            }

            const wordsData: WordData[] = chapterData[verseNum.toString()];
            if (!wordsData || wordsData.length === 0) continue;

            const verseId = getVerseId(bookId, chapter, verseNum);
            const words: Word[] = wordsData.map((w: WordData, idx: number) => ({
                id: getWordId(verseId, idx),
                verseRef: verseId,
                position: idx,
                surfaceForm: w.t,
                lemma: w.l,
                language,
            }));

            verses.push({
                reference: verseId,
                chapter,
                verse: verseNum,
                words,
            });
        }

        return verses;

    } catch (error) {
        console.error(`Failed to load data for ${bookId}:`, error);
        return [];
    }
}

/**
 * Get available books
 */
export function getAvailableBooks(): { id: string; testament: 'OT' | 'NT' }[] {
    const books: { id: string; testament: 'OT' | 'NT' }[] = [];

    OT_BOOKS.forEach(bookId => {
        books.push({ id: bookId, testament: 'OT' });
    });

    NT_BOOKS.forEach(bookId => {
        books.push({ id: bookId, testament: 'NT' });
    });

    return books;
}

/**
 * Get available chapters for a book
 * NOTE: This function previously relied on loaded data. 
 * Since we don't want to load data just to check chapters, 
 * we might need a separate metadata file or just return a generic range/allow all.
 * For now, implementing a simplified version or async version.
 * 
 * Ideally we should have a metadata.json with chapter counts.
 * For this refactor, we will make it async and load the book data.
 */
export async function getAvailableChapters(bookId: string): Promise<number[]> {
    const importFn = bookModules[`./books/${bookId}.json`];

    if (!importFn) {
        return [];
    }

    try {
        const module = await importFn() as { default: BookData } | BookData;
        const bookData = 'default' in module ? module.default : module;

        return Object.keys(bookData)
            .map(c => parseInt(c, 10))
            .sort((a, b) => a - b);
    } catch (e) {
        return [];
    }
}

