import { Verse, Word } from '../types';
import { getVerseId, getWordId } from '../utils/referenceParser';

// Import generated Bible data
import ntData from './nt.json';
import otData from './ot.json';

// Type definitions for imported data
interface WordData {
    t: string;  // text
    l: string;  // lemma
    m: string;  // morph
}

interface BibleData {
    [bookId: string]: {
        [chapter: string]: {
            [verse: string]: WordData[];
        };
    };
}

const NT_DATA = ntData as BibleData;
const OT_DATA = otData as BibleData;

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

// Daniel has Aramaic portions (chapters 2:4b-7:28)
const ARAMAIC_PORTIONS: { [bookId: string]: { startChapter: number; endChapter: number }[] } = {
    'DAN': [{ startChapter: 2, endChapter: 7 }],
    'EZR': [{ startChapter: 4, endChapter: 7 }],
};



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
 * Get verses for a given book and chapter
 */
export function getVerses(
    bookId: string,
    chapter: number,
    startVerse: number,
    endVerse: number | null,
    _langHint?: 'hebrew' | 'aramaic' | 'greek'
): Verse[] {
    const isOT = OT_BOOKS.has(bookId);
    const data = isOT ? OT_DATA : NT_DATA;

    const chapterData = data[bookId]?.[chapter.toString()];
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
        if (endVerse !== null) {
            if (verseNum < startVerse || verseNum > endVerse) {
                continue;
            }
        }

        const wordsData = chapterData[verseNum.toString()];
        if (!wordsData || wordsData.length === 0) continue;

        const verseId = getVerseId(bookId, chapter, verseNum);
        const words: Word[] = wordsData.map((w, idx) => ({
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
}

/**
 * Get available books
 */
export function getAvailableBooks(): { id: string; testament: 'OT' | 'NT' }[] {
    const books: { id: string; testament: 'OT' | 'NT' }[] = [];

    for (const bookId of Object.keys(OT_DATA)) {
        books.push({ id: bookId, testament: 'OT' });
    }

    for (const bookId of Object.keys(NT_DATA)) {
        books.push({ id: bookId, testament: 'NT' });
    }

    return books;
}

/**
 * Get available chapters for a book
 */
export function getAvailableChapters(bookId: string): number[] {
    const isOT = OT_BOOKS.has(bookId);
    const data = isOT ? OT_DATA : NT_DATA;

    const bookData = data[bookId];
    if (!bookData) return [];

    return Object.keys(bookData)
        .map(c => parseInt(c, 10))
        .sort((a, b) => a - b);
}
