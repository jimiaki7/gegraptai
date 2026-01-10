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
    // Pattern breakdown:
    // ^(.+?)\s*                -> Book name
    // (\d+)                    -> Start Chapter
    // (?:[:\.]\s*(\d+))?       -> Optional Start Verse (separator : or .)
    // (?:                      -> Optional Range Part
    //   [\s-–]+(?:(\d+)[:\.])? -> Separator followed by optional End Chapter + colon
    //   (\d+)                  -> End Verse OR End Chapter (if no colon)
    // )?
    const pattern = /^(.+?)\s*(\d+)(?:[:\.]\s*(\d+))?(?:[\s-–]+(?:(\d+)[:\.])?(\d+))?$/;
    const match = trimmed.match(pattern);

    if (!match) {
        return null;
    }

    const [, bookStr, ch1, v1, ch2, v2] = match;

    // Clean up book string (remove trailing periods, extra spaces)
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
        // Formats: "1:1" or "1:1-5" or "1:1-2:2"
        startVerse = parseInt(v1, 10);
        if (ch2 && v2) {
            // "1:1-2:2" -> ch1:v1 - ch2:v2
            endChapter = parseInt(ch2, 10);
            endVerse = parseInt(v2, 10);
        } else if (v2) {
            // "1:1-5" -> ch1:v1 - ch1:v2 (v2 matches range end without chapter)
            endChapter = undefined;
            endVerse = parseInt(v2, 10);
        } else {
            // "1:1" -> ch1:v1 - ch1:v1
            endVerse = startVerse;
        }
    } else {
        // Formats: "1" or "1-2"
        startVerse = 1;
        if (v2) {
            // "1-2" -> ch1 - ch1:v2 (Wait, if no ch2, then v2 is end chapter)
            // In our regex, if no ch2, v2 captures the number after hyphen
            endChapter = parseInt(v2, 10);
            endVerse = null;
        } else {
            // "1" -> Whole chapter
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
