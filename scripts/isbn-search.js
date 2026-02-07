import https from 'https';
import ISBN from 'isbn3';

const searchIsbn = (isbn) => {
    // Parse and validate ISBN using isbn3
    const parsedIsbn = ISBN.parse(isbn);
    
    if (!parsedIsbn) {
        console.error('Error: Invalid ISBN format. Please provide a valid 10 or 13 digit ISBN.');
        process.exit(1);
    }

    // Use ISBN-13 format for the API call
    const cleanIsbn = parsedIsbn.isbn13 || parsedIsbn.isbn10;

    const url = `https://openlibrary.org/isbn/${cleanIsbn}.json`;

    console.log(`Searching for ISBN: ${isbn}...`);

    https.get(url, (res) => {
        let data = '';

        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            console.log(`Redirecting to: ${res.headers.location}`);
            // OpenLibrary redirects to /books/ endpoint, fetch that directly
            https.get(res.headers.location, (redirectRes) => {
                let redirectData = '';
                redirectRes.on('data', (chunk) => redirectData += chunk);
                redirectRes.on('end', () => {
                    try {
                        const metadata = JSON.parse(redirectData);
                        displayResult(metadata, cleanIsbn);
                    } catch (error) {
                        console.error('Error parsing redirect response:', error.message);
                        process.exit(1);
                    }
                });
            }).on('error', (e) => {
                console.error(`Error: ${e.message}`);
                process.exit(1);
            });
            res.resume();
            return;
        }

        if (res.statusCode === 404) {
            console.error(`Error: ISBN ${isbn} not found.`);
            process.exit(1);
        }

        if (res.statusCode !== 200) {
            console.error(`Error: Request failed with status code ${res.statusCode}`);
            process.exit(1);
        }

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const metadata = JSON.parse(data);
                displayResult(metadata, cleanIsbn);
            } catch (error) {
                console.error('Error parsing response:', error.message);
                process.exit(1);
            }
        });

    }).on('error', (e) => {
        console.error(`Error: ${e.message}`);
        process.exit(1);
    });
};

// Helper function to format and display the result
const displayResult = (metadata, cleanIsbn) => {
    const result = {
        isbn: metadata.isbn_13 || metadata.isbn_10 || cleanIsbn,
        title: metadata.title,
        author: metadata.authors?.map(a => a.name).join(', ') || 'Unknown',
        publishDate: metadata.publish_date || 'Unknown',
        publisher: metadata.publishers?.map(p => p.name).join(', ') || 'Unknown',
        numberOfPages: metadata.number_of_pages || 'Unknown',
        language: metadata.languages?.map(l => l.key?.split('/').pop()).join(', ') || 'Unknown',
        coverUrl: `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`,
        openLibraryUrl: `https://openlibrary.org/isbn/${cleanIsbn}`,
        fullMetadata: metadata
    };

    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
};

// Get ISBN from command line argument
const isbn = process.argv[2];

if (!isbn) {
    console.error('Usage: node isbn-search.js <ISBN>');
    console.error('Example: node isbn-search.js 978-0-06-112008-4');
    process.exit(1);
}

searchIsbn(isbn);
