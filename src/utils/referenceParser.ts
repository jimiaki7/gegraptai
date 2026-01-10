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

    // Cleaner strategy:
    // 1. Extract book name and the rest of the string
    // 2. Parse the rest of the string for ch/v ranges

    // Regex for ch:v-ch:v or ch:v-v or ch-ch
    // Groups: 1:Book, 2:Ch1, 3:V1, 4:Ch2_or_V2, 5:V2
    // Supports:
    // "Gen 1"
    // "Gen 1:1"
    // "Gen 1:1-5"
    // "Gen 1-2"
    // "Gen 1:1-2:2"
    const pattern = /^(.+?)\s*(\d+)(?:\s*[:\.]\s*(\d+))?(?:\s*[\-–—\s]+\s*(\d+)(?:\s*[:\.]\s*(\d+))?)?$/;
    const match = trimmed.match(pattern);

    if (!match) {
        return null;
    }

    const [, bookStr, sCh, sV, m1, m2] = match;

    const book = getBookByAbbrev(bookStr);
    if (!book) {
        return null;
    }

    const chapter = parseInt(sCh, 10);
    let startVerse = 1;
    let endChapter: number | undefined = undefined;
    let endVerse: number | null = null;

    if (sV) {
        // We have a start verse (e.g. 1:1)
        startVerse = parseInt(sV, 10);
        if (m1 && m2) {
            // we have ch:v-ch:v (e.g. 1:1-2:2)
            endChapter = parseInt(m1, 10);
            endVerse = parseInt(m2, 10);
        } else if (m1) {
            // we have ch:v-v (e.g. 1:1-5)
            endVerse = parseInt(m1, 10);
        } else {
            // just 1:1
            endVerse = startVerse;
        }
    } else {
        // No start verse (e.g. 1 or 1-2)
        startVerse = 1;
        if (m1) {
            // we have ch-ch (e.g. 1-2)
            endChapter = parseInt(m1, 10);
            endVerse = null;
        } else {
            // just 1
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
