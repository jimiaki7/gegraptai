
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/data');
const OUT_DIR = path.join(DATA_DIR, 'books');

// Load data
console.log('Loading NT data...');
const ntData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'nt.json'), 'utf-8'));

console.log('Loading OT data...');
const otData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'ot.json'), 'utf-8'));

const allData = { ...ntData, ...otData };

console.log('Splitting data into books...');

if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
}

for (const [bookId, bookData] of Object.entries(allData)) {
    const filePath = path.join(OUT_DIR, `${bookId}.json`);
    console.log(`Writing ${bookId}...`);
    fs.writeFileSync(filePath, JSON.stringify(bookData, null, 0)); // Minified
}

console.log('Done!');
