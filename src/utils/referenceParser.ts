import { BibleReference } from '../types';
import { getBookByAbbrev } from '../data/bookMapping';

/**
 * Parse a Bible reference string into a structured reference object.
 * Supports formats like:
 * - "Gen. 1:1"
 * - "Gen 1:1-5"
 * - "Ps. 23"
 * - "Rom. 12:1-2"
 */
export function parseReference(input: string): BibleReference | null {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // Improved Regex to handle:
    // 1. Multiple words book names (1 Samuel, Song of Songs)
    // 2. Book names starting with digits (1Cor, 2 Kings)
    // 3. Optional period after book name
    // 4. Chapter only (Gen 1)
    // 5. Verse ranges (Gen 1:1-5)

    // Strategy: Split into "Book Part" and "Reference Part"
    // The reference part starts with the last number sequence that might be a chapter/verse

    // Try to match situations where the input ends with digits (verse or chapter)
    // Regex explanation:
    // ^(.+?)               - Capture group 1: Book name (lazy match)
    // \s*                  - Optional space
    // (\d+)                - Capture group 2: Chapter
    // (?:[:\.](\d+))?      - Non-capture, optional: Separator (: or .) and Capture group 3: Start Verse
    // (?:[\s-–]+(\d+))?    - Non-capture, optional: Separator (space, -, –) and Capture group 4: End Verse
    // $                    - End of string

    const pattern = /^(.+?)\s*(\d+)(?:[:\.]\s*(\d+)(?:[\s-–]+(\d+))?)?$/;
    const match = trimmed.match(pattern);

    if (!match) {
        return null;
    }

    const [, bookStr, chapterStr, startVerseStr, endVerseStr] = match;

    // Clean up book string (remove trailing periods, extra spaces)
    const cleanBookStr = bookStr.trim().replace(/\.$/, '');
    const book = getBookByAbbrev(cleanBookStr);

    if (!book) {
        return null;
    }

    const chapter = parseInt(chapterStr, 10);

    // If no start verse is specified, it means "Whole Chapter"
    // In our system, we represent whole chapter as startVerse=1, endVerse=null

    let startVerse = 1;
    let endVerse: number | null = null;

    if (startVerseStr) {
        startVerse = parseInt(startVerseStr, 10);
        if (endVerseStr) {
            endVerse = parseInt(endVerseStr, 10);
        } else {
            // Single verse specified (e.g. Gen 1:1) -> start=1, end=1
            endVerse = startVerse;
        }
    } else {
        // No verse specified -> Whole chapter (e.g. Gen 1) -> start=1, end=null
        startVerse = 1;
        endVerse = null;
    }

    return {
        bookId: book.id,
        chapter,
        startVerse,
        endVerse,
    };
}

/**
 * Format a BibleReference back to a readable string
 */
export function formatReference(ref: BibleReference, bookName?: string): string {
    const name = bookName || ref.bookId;

    if (ref.endVerse === null) {
        // Whole chapter
        return `${name} ${ref.chapter}`;
    } else if (ref.startVerse === ref.endVerse) {
        // Single verse
        return `${name} ${ref.chapter}:${ref.startVerse}`;
    } else {
        // Verse range
        return `${name} ${ref.chapter}:${ref.startVerse}-${ref.endVerse}`;
    }
}

/**
 * Generate a verse reference ID
 */
export function getVerseId(bookId: string, chapter: number, verse: number): string {
    return `${bookId}.${chapter}.${verse}`;
}

/**
 * Generate a word ID
 */
export function getWordId(verseId: string, position: number): string {
    return `${verseId}.${position}`;
}
