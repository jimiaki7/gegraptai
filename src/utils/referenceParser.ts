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
 * Parses a string that may contain multiple Bible references.
 * Supports:
 * - Fully qualified: "Gen 1:1, Ps 23, John 3:16"
 * - Contextual verses: "Gen 1:1, 5, 10" (interprets 5 and 10 as verses in Gen 1)
 * - Contextual chapters: "Ps 23, 24" (interprets 24 as chapter 24 in Psalms)
 * - Contextual chapter:verse: "Ps 23, 24:1" (interprets 24:1 as Ps 24:1)
 * 
 * @param input The reference string to parse
 * @returns An array of BibleReference objects
 */
export function parseMultipleReferences(input: string): BibleReference[] {
    if (!input.trim()) return [];

    const parts = input.split(/[,;]/);
    const results: BibleReference[] = [];

    let lastBookId: string | null = null;
    let lastChapter: number | null = null;
    let lastWasWholeChapter = false;

    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // 1. Try standard parsing (complete reference)
        const parsed = parseReference(trimmed);
        if (parsed) {
            results.push(parsed);
            lastBookId = parsed.bookId;
            lastChapter = parsed.chapter;
            lastWasWholeChapter = (parsed.endVerse === null);
            continue;
        }

        // 2. Try contextual parsing if we have previous context
        if (lastBookId) {
            // Case A: Pattern for "Chapter:Verse" (e.g., "2:5")
            const chVPattern = /^(\d+):(\d+)(?:[\s-–]+(\d+))?$/;
            const chVMatch = trimmed.match(chVPattern);

            if (chVMatch) {
                const chapter = parseInt(chVMatch[1], 10);
                const startV = parseInt(chVMatch[2], 10);
                const endV = chVMatch[3] ? parseInt(chVMatch[3], 10) : startV;

                results.push({
                    bookId: lastBookId,
                    chapter,
                    startVerse: startV,
                    endVerse: endV
                });
                lastChapter = chapter;
                lastWasWholeChapter = false;
                continue;
            }

            // Case B: Pattern for "Number" or "Number-Number" (e.g., "10" or "10-12")
            const numPattern = /^(\d+)(?:[\s-–]+(\d+))?$/;
            const numMatch = trimmed.match(numPattern);

            if (numMatch) {
                const firstNum = parseInt(numMatch[1], 10);
                const secondNum = numMatch[2] ? parseInt(numMatch[2], 10) : null;

                if (lastWasWholeChapter) {
                    // Context was a whole chapter (e.g., "Gen 1"), so "2" means chapter 2
                    results.push({
                        bookId: lastBookId,
                        chapter: firstNum,
                        startVerse: 1,
                        endVerse: null
                    });
                    lastChapter = firstNum;
                } else if (lastChapter !== null) {
                    // Context was specific verses (e.g., "Gen 1:1"), so "5" means verse 5 in chapter 1
                    results.push({
                        bookId: lastBookId,
                        chapter: lastChapter,
                        startVerse: firstNum,
                        endVerse: secondNum !== null ? secondNum : firstNum
                    });
                }
                continue;
            }
        }
    }

    return results;
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
