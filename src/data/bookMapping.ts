import { Book } from '../types';

// Book mappings with abbreviations
export const BOOKS: Book[] = [
    // Torah / Pentateuch
    { id: 'GEN', name: 'Genesis', abbrev: 'Gen', lang: 'hebrew', testament: 'OT' },
    { id: 'EXO', name: 'Exodus', abbrev: 'Exod', lang: 'hebrew', testament: 'OT' },
    { id: 'LEV', name: 'Leviticus', abbrev: 'Lev', lang: 'hebrew', testament: 'OT' },
    { id: 'NUM', name: 'Numbers', abbrev: 'Num', lang: 'hebrew', testament: 'OT' },
    { id: 'DEU', name: 'Deuteronomy', abbrev: 'Deut', lang: 'hebrew', testament: 'OT' },

    // Historical Books
    { id: 'JOS', name: 'Joshua', abbrev: 'Josh', lang: 'hebrew', testament: 'OT' },
    { id: 'JDG', name: 'Judges', abbrev: 'Judg', lang: 'hebrew', testament: 'OT' },
    { id: 'RUT', name: 'Ruth', abbrev: 'Ruth', lang: 'hebrew', testament: 'OT' },
    { id: '1SA', name: '1 Samuel', abbrev: '1Sam', lang: 'hebrew', testament: 'OT' },
    { id: '2SA', name: '2 Samuel', abbrev: '2Sam', lang: 'hebrew', testament: 'OT' },
    { id: '1KI', name: '1 Kings', abbrev: '1Kgs', lang: 'hebrew', testament: 'OT' },
    { id: '2KI', name: '2 Kings', abbrev: '2Kgs', lang: 'hebrew', testament: 'OT' },
    { id: '1CH', name: '1 Chronicles', abbrev: '1Chr', lang: 'hebrew', testament: 'OT' },
    { id: '2CH', name: '2 Chronicles', abbrev: '2Chr', lang: 'hebrew', testament: 'OT' },
    { id: 'EZR', name: 'Ezra', abbrev: 'Ezra', lang: 'hebrew', testament: 'OT' },
    { id: 'NEH', name: 'Nehemiah', abbrev: 'Neh', lang: 'hebrew', testament: 'OT' },
    { id: 'EST', name: 'Esther', abbrev: 'Esth', lang: 'hebrew', testament: 'OT' },

    // Poetry
    { id: 'PSA', name: 'Psalms', abbrev: 'Ps', lang: 'hebrew', testament: 'OT' },
    { id: 'PRO', name: 'Proverbs', abbrev: 'Prov', lang: 'hebrew', testament: 'OT' },
    { id: 'ECC', name: 'Ecclesiastes', abbrev: 'Eccl', lang: 'hebrew', testament: 'OT' },
    { id: 'SNG', name: 'Song of Songs', abbrev: 'Song', lang: 'hebrew', testament: 'OT' },
    { id: 'JOB', name: 'Job', abbrev: 'Job', lang: 'hebrew', testament: 'OT' },

    // Major Prophets
    { id: 'ISA', name: 'Isaiah', abbrev: 'Isa', lang: 'hebrew', testament: 'OT' },
    { id: 'JER', name: 'Jeremiah', abbrev: 'Jer', lang: 'hebrew', testament: 'OT' },
    { id: 'LAM', name: 'Lamentations', abbrev: 'Lam', lang: 'hebrew', testament: 'OT' },
    { id: 'EZK', name: 'Ezekiel', abbrev: 'Ezek', lang: 'hebrew', testament: 'OT' },
    { id: 'DAN', name: 'Daniel', abbrev: 'Dan', lang: 'aramaic', testament: 'OT' }, // Parts in Aramaic

    // Minor Prophets
    { id: 'HOS', name: 'Hosea', abbrev: 'Hos', lang: 'hebrew', testament: 'OT' },
    { id: 'JOL', name: 'Joel', abbrev: 'Joel', lang: 'hebrew', testament: 'OT' },
    { id: 'AMO', name: 'Amos', abbrev: 'Amos', lang: 'hebrew', testament: 'OT' },
    { id: 'OBA', name: 'Obadiah', abbrev: 'Obad', lang: 'hebrew', testament: 'OT' },
    { id: 'JON', name: 'Jonah', abbrev: 'Jona', lang: 'hebrew', testament: 'OT' },
    { id: 'MIC', name: 'Micah', abbrev: 'Mic', lang: 'hebrew', testament: 'OT' },
    { id: 'NAM', name: 'Nahum', abbrev: 'Nah', lang: 'hebrew', testament: 'OT' },
    { id: 'HAB', name: 'Habakkuk', abbrev: 'Hab', lang: 'hebrew', testament: 'OT' },
    { id: 'ZEP', name: 'Zephaniah', abbrev: 'Zeph', lang: 'hebrew', testament: 'OT' },
    { id: 'HAG', name: 'Haggai', abbrev: 'Hag', lang: 'hebrew', testament: 'OT' },
    { id: 'ZEC', name: 'Zechariah', abbrev: 'Zech', lang: 'hebrew', testament: 'OT' },
    { id: 'MAL', name: 'Malachi', abbrev: 'Mal', lang: 'hebrew', testament: 'OT' },

    // New Testament - Gospels
    { id: 'MAT', name: 'Matthew', abbrev: 'Matt', lang: 'greek', testament: 'NT' },
    { id: 'MRK', name: 'Mark', abbrev: 'Mark', lang: 'greek', testament: 'NT' },
    { id: 'LUK', name: 'Luke', abbrev: 'Luke', lang: 'greek', testament: 'NT' },
    { id: 'JHN', name: 'John', abbrev: 'John', lang: 'greek', testament: 'NT' },
    { id: 'ACT', name: 'Acts', abbrev: 'Acts', lang: 'greek', testament: 'NT' },

    // Pauline Epistles
    { id: 'ROM', name: 'Romans', abbrev: 'Rom', lang: 'greek', testament: 'NT' },
    { id: '1CO', name: '1 Corinthians', abbrev: '1Cor', lang: 'greek', testament: 'NT' },
    { id: '2CO', name: '2 Corinthians', abbrev: '2Cor', lang: 'greek', testament: 'NT' },
    { id: 'GAL', name: 'Galatians', abbrev: 'Gal', lang: 'greek', testament: 'NT' },
    { id: 'EPH', name: 'Ephesians', abbrev: 'Eph', lang: 'greek', testament: 'NT' },
    { id: 'PHP', name: 'Philippians', abbrev: 'Phil', lang: 'greek', testament: 'NT' },
    { id: 'COL', name: 'Colossians', abbrev: 'Col', lang: 'greek', testament: 'NT' },
    { id: '1TH', name: '1 Thessalonians', abbrev: '1Thess', lang: 'greek', testament: 'NT' },
    { id: '2TH', name: '2 Thessalonians', abbrev: '2Thess', lang: 'greek', testament: 'NT' },
    { id: '1TI', name: '1 Timothy', abbrev: '1Tim', lang: 'greek', testament: 'NT' },
    { id: '2TI', name: '2 Timothy', abbrev: '2Tim', lang: 'greek', testament: 'NT' },
    { id: 'TIT', name: 'Titus', abbrev: 'Titus', lang: 'greek', testament: 'NT' },
    { id: 'PHM', name: 'Philemon', abbrev: 'Phlm', lang: 'greek', testament: 'NT' },

    // General Epistles
    { id: 'HEB', name: 'Hebrews', abbrev: 'Heb', lang: 'greek', testament: 'NT' },
    { id: 'JAS', name: 'James', abbrev: 'Jas', lang: 'greek', testament: 'NT' },
    { id: '1PE', name: '1 Peter', abbrev: '1Pet', lang: 'greek', testament: 'NT' },
    { id: '2PE', name: '2 Peter', abbrev: '2Pet', lang: 'greek', testament: 'NT' },
    { id: '1JN', name: '1 John', abbrev: '1John', lang: 'greek', testament: 'NT' },
    { id: '2JN', name: '2 John', abbrev: '2John', lang: 'greek', testament: 'NT' },
    { id: '3JN', name: '3 John', abbrev: '3John', lang: 'greek', testament: 'NT' },
    { id: 'JUD', name: 'Jude', abbrev: 'Jude', lang: 'greek', testament: 'NT' },
    { id: 'REV', name: 'Revelation', abbrev: 'Rev', lang: 'greek', testament: 'NT' },
];

// Create lookup maps for efficient access
export const BOOK_BY_ID = new Map(BOOKS.map(b => [b.id, b]));

// Create abbreviation lookup (case-insensitive)
const abbrevMap = new Map<string, Book>();
BOOKS.forEach(book => {
    const lowerName = book.name.toLowerCase();
    const lowerAbbrev = book.abbrev.toLowerCase();

    // Automatic variations
    abbrevMap.set(lowerName, book);
    abbrevMap.set(lowerAbbrev, book);
    abbrevMap.set(lowerAbbrev.replace(/\.$/, ''), book); // e.g. "gen" from "gen."

    // Explicit manual mappings for common variations
    if (book.id === 'GEN') { abbrevMap.set('gn', book); abbrevMap.set('genesis', book); }
    if (book.id === 'EXO') { abbrevMap.set('ex', book); abbrevMap.set('exod', book); }
    if (book.id === 'LEV') { abbrevMap.set('lv', book); }
    if (book.id === 'NUM') { abbrevMap.set('nm', book); abbrevMap.set('nu', book); }
    if (book.id === 'DEU') { abbrevMap.set('dt', book); abbrevMap.set('deu', book); }
    if (book.id === 'JOS') { abbrevMap.set('josh', book); }
    if (book.id === 'JDG') { abbrevMap.set('judg', book); abbrevMap.set('jgs', book); }
    if (book.id === 'RUT') { abbrevMap.set('rth', book); }
    if (book.id === 'PRO') { abbrevMap.set('pro', book); }
    if (book.id === '1SA') { abbrevMap.set('1sa', book); abbrevMap.set('1sm', book); abbrevMap.set('1sam', book); abbrevMap.set('1 sam', book); abbrevMap.set('1 samuel', book); }
    if (book.id === '2SA') { abbrevMap.set('2sa', book); abbrevMap.set('2sm', book); abbrevMap.set('2sam', book); abbrevMap.set('2 sam', book); abbrevMap.set('2 samuel', book); }
    if (book.id === '1KI') { abbrevMap.set('1ki', book); abbrevMap.set('1kgs', book); abbrevMap.set('1 kgs', book); abbrevMap.set('1 kings', book); }
    if (book.id === '2KI') { abbrevMap.set('2ki', book); abbrevMap.set('2kgs', book); abbrevMap.set('2 kgs', book); abbrevMap.set('2 kings', book); }
    if (book.id === '1CH') { abbrevMap.set('1ch', book); abbrevMap.set('1chr', book); abbrevMap.set('1 chr', book); abbrevMap.set('1 chronicles', book); }
    if (book.id === '2CH') { abbrevMap.set('2ch', book); abbrevMap.set('2chr', book); abbrevMap.set('2 chr', book); abbrevMap.set('2 chronicles', book); }
    if (book.id === 'EZR') { abbrevMap.set('ezr', book); abbrevMap.set('ezra', book); }
    if (book.id === 'NEH') { abbrevMap.set('neh', book); abbrevMap.set('nehemiah', book); }
    if (book.id === 'EZK') { abbrevMap.set('ezk', book); }
    if (book.id === 'EST') { abbrevMap.set('est', book); abbrevMap.set('esth', book); abbrevMap.set('esther', book); }
    if (book.id === 'PSA') { abbrevMap.set('ps', book); abbrevMap.set('psa', book); abbrevMap.set('psalm', book); abbrevMap.set('pss', book); }
    if (book.id === 'JOB') { abbrevMap.set('jb', book); abbrevMap.set('job', book); }
    if (book.id === 'ECC') { abbrevMap.set('ecc', book); }
    if (book.id === 'AMO') { abbrevMap.set('ams', book); }
    if (book.id === 'SNG') { abbrevMap.set('song', book); abbrevMap.set('cant', book); abbrevMap.set('sos', book); abbrevMap.set('sgs', book); }
    if (book.id === 'MAT') { abbrevMap.set('mt', book); abbrevMap.set('matt', book); abbrevMap.set('matthew', book); }
    if (book.id === 'MRK') { abbrevMap.set('mk', book); abbrevMap.set('mrk', book); }
    if (book.id === 'LUK') { abbrevMap.set('lk', book); abbrevMap.set('luk', book); }
    if (book.id === 'JHN') { abbrevMap.set('jn', book); abbrevMap.set('jhn', book); }
    if (book.id === 'ACT') { abbrevMap.set('ac', book); abbrevMap.set('act', book); }
    if (book.id === 'ROM') { abbrevMap.set('rm', book); abbrevMap.set('romans', book); }
    if (book.id === '1CO') { abbrevMap.set('1co', book); abbrevMap.set('1cor', book); abbrevMap.set('1 cor', book); }
    if (book.id === '2CO') { abbrevMap.set('2co', book); abbrevMap.set('2cor', book); abbrevMap.set('2 cor', book); }
    if (book.id === 'PHP') { abbrevMap.set('phil', book); abbrevMap.set('php', book); }
    if (book.id === 'PHM') { abbrevMap.set('phlm', book); abbrevMap.set('philem', book); }
    if (book.id === '1TH') { abbrevMap.set('1th', book); abbrevMap.set('1thess', book); }
    if (book.id === '2TH') { abbrevMap.set('2th', book); abbrevMap.set('2thess', book); }
    if (book.id === '1TI') { abbrevMap.set('1ti', book); abbrevMap.set('1tim', book); }
    if (book.id === '2TI') { abbrevMap.set('2ti', book); abbrevMap.set('2tim', book); }
    if (book.id === '1PE') { abbrevMap.set('1pe', book); abbrevMap.set('1pet', book); }
    if (book.id === '2PE') { abbrevMap.set('2pe', book); abbrevMap.set('2pet', book); }
    if (book.id === '1JN') { abbrevMap.set('1jn', book); abbrevMap.set('1john', book); abbrevMap.set('1 jn', book); }
    if (book.id === '2JN') { abbrevMap.set('2jn', book); abbrevMap.set('2john', book); abbrevMap.set('2 jn', book); }
    if (book.id === '3JN') { abbrevMap.set('3jn', book); abbrevMap.set('3john', book); abbrevMap.set('3 jn', book); }
    if (book.id === 'JUD') { abbrevMap.set('jd', book); }
});

export const BOOK_BY_ABBREV = abbrevMap;

export function getBookByAbbrev(abbrev: string): Book | undefined {
    return BOOK_BY_ABBREV.get(abbrev.toLowerCase().replace(/\.$/, ''));
}

export function getBookById(id: string): Book | undefined {
    return BOOK_BY_ID.get(id);
}
