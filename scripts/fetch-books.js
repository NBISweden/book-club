
import 'dotenv/config'; // Load .env
import https from 'https';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
const OUTPUT_FILE = path.resolve('docs/public/books.json');

if (!SHEET_ID) {
    console.error('Error: GOOGLE_SHEET_ID is not defined in .env file');
    process.exit(1);
}

console.log(`Fetching data from Google Sheet ID: ${SHEET_ID}...`);

const fetchUrl = (url) => {
    https.get(url, (res) => {
        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log(`Redirecting to: ${res.headers.location}`);
            fetchUrl(res.headers.location);
            return;
        }

        let data = '';

        if (res.statusCode !== 200) {
            console.error(`Request Failed. Status Code: ${res.statusCode}.`);
            // Write empty array to signify "Books not available" or simply no data
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
            res.resume();
            return;
        }

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const records = parse(data, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                // Filter out rows that are entirely empty or missing title
                const validRecords = records.filter(book => book.Title && book.Title.trim() !== '');

                // Helper to clean formula strings (e.g. =IMAGE("url") or ="url")
                const cleanField = (val) => {
                    if (!val || typeof val !== 'string') return val;
                    // Handle =IMAGE("url")
                    const imgMatch = val.match(/^=IMAGE\s*\(\s*["']([^"']+)["']/i);
                    if (imgMatch) return imgMatch[1];
                    // Handle ="url"
                    if (val.startsWith('="') && val.endsWith('"')) {
                        return val.substring(2, val.length - 1);
                    }
                    return val;
                };

                // clean the Cover field specifically, or all fields if desired
                const cleanedRecords = validRecords.map(book => ({
                    ...book,
                    Cover: cleanField(book.Cover)
                }));

                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(cleanedRecords, null, 2));
                console.log(`Successfully saved ${cleanedRecords.length} books to ${OUTPUT_FILE}`);
                process.exit(0);
            } catch (error) {
                console.error('Error parsing CSV:', error.message);
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
                process.exit(1);
            }
        });

    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
        process.exit(1);
    });
};

fetchUrl(EXPORT_URL);
