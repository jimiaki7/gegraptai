/**
 * Convert MorphGNT and OSHB data to JSON format
 */

const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, 'bible-raw');
const OUTPUT_DIR = __dirname;

// Book mapping for Greek NT (MorphGNT)
const MORPHGNT_BOOKS = {
    '61': { id: 'MAT', name: 'Matthew', chapters: 28 },
    '62': { id: 'MRK', name: 'Mark', chapters: 16 },
    '63': { id: 'LUK', name: 'Luke', chapters: 24 },
    '64': { id: 'JHN', name: 'John', chapters: 21 },
    '65': { id: 'ACT', name: 'Acts', chapters: 28 },
    '66': { id: 'ROM', name: 'Romans', chapters: 16 },
    '67': { id: '1CO', name: '1 Corinthians', chapters: 16 },
    '68': { id: '2CO', name: '2 Corinthians', chapters: 13 },
    '69': { id: 'GAL', name: 'Galatians', chapters: 6 },
    '70': { id: 'EPH', name: 'Ephesians', chapters: 6 },
    '71': { id: 'PHP', name: 'Philippians', chapters: 4 },
    '72': { id: 'COL', name: 'Colossians', chapters: 4 },
    '73': { id: '1TH', name: '1 Thessalonians', chapters: 5 },
    '74': { id: '2TH', name: '2 Thessalonians', chapters: 3 },
    '75': { id: '1TI', name: '1 Timothy', chapters: 6 },
    '76': { id: '2TI', name: '2 Timothy', chapters: 4 },
    '77': { id: 'TIT', name: 'Titus', chapters: 3 },
    '78': { id: 'PHM', name: 'Philemon', chapters: 1 },
    '79': { id: 'HEB', name: 'Hebrews', chapters: 13 },
    '80': { id: 'JAS', name: 'James', chapters: 5 },
    '81': { id: '1PE', name: '1 Peter', chapters: 5 },
    '82': { id: '2PE', name: '2 Peter', chapters: 3 },
    '83': { id: '1JN', name: '1 John', chapters: 5 },
    '84': { id: '2JN', name: '2 John', chapters: 1 },
    '85': { id: '3JN', name: '3 John', chapters: 1 },
    '86': { id: 'JUD', name: 'Jude', chapters: 1 },
    '87': { id: 'REV', name: 'Revelation', chapters: 22 },
};

// OSHB book file mapping
const OSHB_BOOKS = {
    'Gen': { id: 'GEN', name: 'Genesis' },
    'Exod': { id: 'EXO', name: 'Exodus' },
    'Lev': { id: 'LEV', name: 'Leviticus' },
    'Num': { id: 'NUM', name: 'Numbers' },
    'Deut': { id: 'DEU', name: 'Deuteronomy' },
    'Josh': { id: 'JOS', name: 'Joshua' },
    'Judg': { id: 'JDG', name: 'Judges' },
    'Ruth': { id: 'RUT', name: 'Ruth' },
    '1Sam': { id: '1SA', name: '1 Samuel' },
    '2Sam': { id: '2SA', name: '2 Samuel' },
    '1Kgs': { id: '1KI', name: '1 Kings' },
    '2Kgs': { id: '2KI', name: '2 Kings' },
    '1Chr': { id: '1CH', name: '1 Chronicles' },
    '2Chr': { id: '2CH', name: '2 Chronicles' },
    'Ezra': { id: 'EZR', name: 'Ezra' },
    'Neh': { id: 'NEH', name: 'Nehemiah' },
    'Esth': { id: 'EST', name: 'Esther' },
    'Job': { id: 'JOB', name: 'Job' },
    'Ps': { id: 'PSA', name: 'Psalms' },
    'Prov': { id: 'PRO', name: 'Proverbs' },
    'Eccl': { id: 'ECC', name: 'Ecclesiastes' },
    'Song': { id: 'SNG', name: 'Song of Songs' },
    'Isa': { id: 'ISA', name: 'Isaiah' },
    'Jer': { id: 'JER', name: 'Jeremiah' },
    'Lam': { id: 'LAM', name: 'Lamentations' },
    'Ezek': { id: 'EZK', name: 'Ezekiel' },
    'Dan': { id: 'DAN', name: 'Daniel' },
    'Hos': { id: 'HOS', name: 'Hosea' },
    'Joel': { id: 'JOL', name: 'Joel' },
    'Amos': { id: 'AMO', name: 'Amos' },
    'Obad': { id: 'OBA', name: 'Obadiah' },
    'Jonah': { id: 'JON', name: 'Jonah' },
    'Mic': { id: 'MIC', name: 'Micah' },
    'Nah': { id: 'NAM', name: 'Nahum' },
    'Hab': { id: 'HAB', name: 'Habakkuk' },
    'Zeph': { id: 'ZEP', name: 'Zephaniah' },
    'Hag': { id: 'HAG', name: 'Haggai' },
    'Zech': { id: 'ZEC', name: 'Zechariah' },
    'Mal': { id: 'MAL', name: 'Malachi' },
};

/**
 * Parse MorphGNT file
 */
function parseMorphGNT(filePath, bookId) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim());

    const chapters = {};

    for (const line of lines) {
        const parts = line.split(' ');
        if (parts.length < 4) continue;

        const ref = parts[0];
        const pos = parts[1];
        const morph = parts[2];
        const textForm = parts[3];
        const lemma = parts[6]; // Last column seems to be lemma, but let's conform to the 7-column layout

        const morphCode = `${pos} ${morph}`;

        const chapter = parseInt(ref.slice(2, 4), 10);
        const verse = parseInt(ref.slice(4, 6), 10);

        if (!chapters[chapter]) {
            chapters[chapter] = {};
        }
        if (!chapters[chapter][verse]) {
            chapters[chapter][verse] = [];
        }

        // Clean up text form (remove punctuation markers)
        const cleanText = textForm.replace(/[⸀⸂⸃·,.;:!?'"()]/g, '').trim();

        chapters[chapter][verse].push({
            t: cleanText, // text
            l: lemma,     // lemma
            m: morphCode, // morph
        });
    }

    return chapters;
}

/**
 * Parse OSHB XML file
 */
function parseOSHB(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const chapters = {};

    // Simple regex-based XML parsing for word elements
    const chapterRegex = /<chapter[^>]*osisID="[^.]+\.(\d+)"[^>]*>([\s\S]*?)<\/chapter>/g;
    const verseRegex = /<verse[^>]*osisID="[^.]+\.\d+\.(\d+)"[^>]*>([\s\S]*?)<\/verse>/g;
    const wordRegex = /<w\s+lemma="([^"]*)"(?:\s+morph="([^"]*)")?[^>]*>([^<]+)<\/w>/g;

    let chapterMatch;
    while ((chapterMatch = chapterRegex.exec(content)) !== null) {
        const chapterNum = parseInt(chapterMatch[1], 10);
        const chapterContent = chapterMatch[2];
        chapters[chapterNum] = {};

        let verseMatch;
        const verseRegexLocal = new RegExp(verseRegex.source, 'g');
        while ((verseMatch = verseRegexLocal.exec(chapterContent)) !== null) {
            const verseNum = parseInt(verseMatch[1], 10);
            const verseContent = verseMatch[2];
            chapters[chapterNum][verseNum] = [];

            let wordMatch;
            const wordRegexLocal = new RegExp(wordRegex.source, 'g');
            while ((wordMatch = wordRegexLocal.exec(verseContent)) !== null) {
                const lemma = wordMatch[1] || '';
                const morph = wordMatch[2] || '';
                const text = wordMatch[3].trim();

                if (text) {
                    chapters[chapterNum][verseNum].push({
                        t: text,
                        l: lemma.replace(/\d+\s*/g, '').trim(),
                        m: morph.replace(/oshm:/g, ''),
                    });
                }
            }
        }
    }

    return chapters;
}

/**
 * Main conversion function
 */
async function main() {
    console.log('Starting Bible data conversion...\n');

    const ntData = {};
    const otData = {};

    // Process MorphGNT (New Testament)
    console.log('Processing New Testament (MorphGNT)...');
    const morphgntDir = path.join(RAW_DIR, 'sblgnt-master');

    for (const [fileNum, bookInfo] of Object.entries(MORPHGNT_BOOKS)) {
        const fileName = `${fileNum}-${bookInfo.name.split(' ')[0].slice(0, 2)}-morphgnt.txt`;
        const files = fs.readdirSync(morphgntDir).filter(f => f.startsWith(fileNum));

        if (files.length > 0) {
            const filePath = path.join(morphgntDir, files[0]);
            console.log(`  Processing ${bookInfo.name}...`);
            ntData[bookInfo.id] = parseMorphGNT(filePath, bookInfo.id);
        }
    }

    // Process OSHB (Old Testament)
    console.log('\nProcessing Old Testament (OSHB)...');
    const oshbDir = path.join(RAW_DIR, 'morphhb-master', 'wlc');

    for (const [fileName, bookInfo] of Object.entries(OSHB_BOOKS)) {
        const filePath = path.join(oshbDir, `${fileName}.xml`);

        if (fs.existsSync(filePath)) {
            console.log(`  Processing ${bookInfo.name}...`);
            otData[bookInfo.id] = parseOSHB(filePath);
        }
    }

    // Write output files
    console.log('\nWriting output files...');

    // Write NT data
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'nt.json'),
        JSON.stringify(ntData),
        'utf8'
    );
    console.log('  Created nt.json');

    // Write OT data
    fs.writeFileSync(
        path.join(OUTPUT_DIR, 'ot.json'),
        JSON.stringify(otData),
        'utf8'
    );
    console.log('  Created ot.json');

    // Calculate sizes
    const ntSize = (fs.statSync(path.join(OUTPUT_DIR, 'nt.json')).size / 1024 / 1024).toFixed(2);
    const otSize = (fs.statSync(path.join(OUTPUT_DIR, 'ot.json')).size / 1024 / 1024).toFixed(2);

    console.log(`\nDone!`);
    console.log(`  NT size: ${ntSize} MB`);
    console.log(`  OT size: ${otSize} MB`);
}

main().catch(console.error);
