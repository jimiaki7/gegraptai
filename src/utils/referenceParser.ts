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

    // Updated regex to handle cross-chapter ranges like "1:1-2:2" or "1-2"
    // Groups:
    // 1: Book name
    // 2: Start Chapter
    // 3: Start Verse (optional)
    // 4: End Chapter (optional, for ranges like 1:1-2:2)
    // 5: End Verse (optional)
    //
    // Pattern explanation:
    // 1. (.+?)             - Book name (captured)
    // 2. \s*               - Optional space
    // 3. (\d+)             - Start Chapter (captured)
    // 4. (?: ... )?        - Optional Start Verse block
    //    [:\.]\s*(\d+)     - Separator and Start Verse (captured)
    // 5. (?: ... )?        - Optional Range block
    //    [\s-–—]+          - Range separator (space, hyphen, endash, emdash)
    //    (?:(\d+)\s*[:\.])?\s* - Optional End Chapter (captured) and separator
    //    (\d+)             - End Verse OR End Chapter (captured)
    const pattern = /^(.+?)\s*(\d+)(?:[:\.]\s*(\d+))?(?:\s*[\-–—\s]+\s*(?:(\d+)\s*[:\.]\s*)?(\d+))?$/;
    const match = trimmed.match(pattern);

    if (!match) {
        return null;
    }

    const [, bookStr, ch1, v1, ch2, v2] = match;

    // Clean up book string
    const cleanBookStr = bookStr.trim().replace(/\.$/, '');
    const book = getBookByAbbrev(cleanBookStr);

    if (!book) {
        return null;
    }

    const chapter = parseInt(ch1, 10);
    let startVerse = 1;
    let endChapter: number | undefined = undefined;
    let endVerse: number | null = null;

    if (v1) {
        startVerse = parseInt(v1, 10);
        if (ch2 && v2) {
            // "1:1-2:2"
            endChapter = parseInt(ch2, 10);
            endVerse = parseInt(v2, 10);
        } else if (v2) {
            // "1:1-5"
            endVerse = parseInt(v2, 10);
        } else {
            // "1:1"
            endVerse = startVerse;
        }
    } else {
        startVerse = 1;
        if (v2) {
            // "1-2"
            endChapter = parseInt(v2, 10);
            endVerse = null;
        } else {
            // "1"
            endVerse = null;
        }
    }

    return {
        bookId: book.id,
        chapter,
        startVerse,
        endChapter,
        endVerse,
    };
}

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

        const parsed = parseReference(trimmed);
        if (parsed) {
            results.push(parsed);
            lastBookId = parsed.bookId;
            lastChapter = parsed.chapter;
            lastWasWholeChapter = (parsed.endVerse === null && !parsed.endChapter);
            continue;
        }

        if (lastBookId) {
            // Case A: Contextual "Chapter:Verse" or "Chapter:Verse-End" or "Chapter:Verse-Ch:End"
            const chVPattern = /^(\d+)\s*[:\.]\s*(\d+)(?:\s*[\-–—\s]+\s*(?:(\d+)\s*[:\.]\s*)?(\d+))?$/;
            const chVMatch = trimmed.match(chVPattern);

            if (chVMatch) {
                const chapter = parseInt(chVMatch[1], 10);
                const startVerse = parseInt(chVMatch[2], 10);
                let endChapter: number | undefined = undefined;
                let endVerse: number | null = null;

                if (chVMatch[3] && chVMatch[4]) {
                    endChapter = parseInt(chVMatch[3], 10);
                    endVerse = parseInt(chVMatch[4], 10);
                } else if (chVMatch[4]) {
                    endVerse = parseInt(chVMatch[4], 10);
                } else {
                    endVerse = startVerse;
                }

                results.push({
                    bookId: lastBookId,
                    chapter,
                    startVerse,
                    endChapter,
                    endVerse
                });
                lastChapter = endChapter || chapter;
                lastWasWholeChapter = false;
                continue;
            }

            // Case B: Contextual "Verse" or "Verse-Verse" or "Chapter" or "Chapter-Chapter"
            const numPattern = /^(\d+)(?:\s*[\-–—\s]+\s*(\d+))?$/;
            const numMatch = trimmed.match(numPattern);

            if (numMatch) {
                const firstNum = parseInt(numMatch[1], 10);
                const secondNum = numMatch[2] ? parseInt(numMatch[2], 10) : null;

                if (lastWasWholeChapter) {
                    // "Ps 23, 24-25" -> Psalm 23, then Chapter 24 to 25
                    results.push({
                        bookId: lastBookId,
                        chapter: firstNum,
                        startVerse: 1,
                        endChapter: secondNum !== null ? secondNum : undefined,
                        endVerse: null
                    });
                    lastChapter = secondNum || firstNum;
                } else if (lastChapter !== null) {
                    // "Gen 1:1, 5-10" -> Gen 1:1, then Gen 1:5 to 10
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
