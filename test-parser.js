
const BOOKS = [
    { id: 'GEN', name: 'Genesis', abbrev: 'Gen', lang: 'hebrew', testament: 'OT' },
    { id: 'PSA', name: 'Psalms', abbrev: 'Ps', lang: 'hebrew', testament: 'OT' },
];

function getBookByAbbrev(abbrev) {
    const clean = abbrev.trim().toLowerCase().replace(/\.$/, '');
    if (clean === 'gen' || clean === 'genesis') return BOOKS[0];
    if (clean === 'ps' || clean === 'psa' || clean === 'psalms') return BOOKS[1];
    return null;
}

function parseReference(input) {
    const trimmed = input.trim();
    if (!trimmed) return null;

    const pattern = /^(.+?)\s*(\d+)(?:[:\.]\s*(\d+))?(?:\s*[\-–—\s]+\s*(?:(\d+)\s*[:\.]\s*)?(\d+))?$/;
    const match = trimmed.match(pattern);

    if (!match) return null;

    const [, bookStr, ch1, v1, ch2, v2] = match;
    const book = getBookByAbbrev(bookStr);
    if (!book) return null;

    const chapter = parseInt(ch1, 10);
    let startVerse = 1;
    let endChapter = undefined;
    let endVerse = null;

    if (v1) {
        startVerse = parseInt(v1, 10);
        if (ch2 && v2) {
            endChapter = parseInt(ch2, 10);
            endVerse = parseInt(v2, 10);
        } else if (v2) {
            endVerse = parseInt(v2, 10);
        } else {
            endVerse = startVerse;
        }
    } else {
        startVerse = 1;
        if (v2) {
            endChapter = parseInt(v2, 10);
            endVerse = null;
        } else {
            endVerse = null;
        }
    }

    return { bookId: book.id, chapter, startVerse, endChapter, endVerse };
}

console.log('Gen 1-2:', parseReference('Gen 1-2'));
console.log('Gen1-2:', parseReference('Gen1-2'));
console.log('Gen 1:1-2:2:', parseReference('Gen 1:1-2:2'));
console.log('Ps 23-24:', parseReference('Ps 23-24'));
console.log('Gen 1:1-5:', parseReference('Gen 1:1-5'));
console.log('Gen 1:', parseReference('Gen 1'));
