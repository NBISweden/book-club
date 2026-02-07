
import { defineConfig } from 'vitepress'
import 'dotenv/config'

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

// Font configuration
const FONT_FAMILY = 'Montserrat' // Change this to use a different Google Font
const FONT_GOOGLE_URL = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'

export default defineConfig({
    title: "NBIS Book Club",
    description: "A shared book collection for NBIS",
    base: '/book-club/', // Assuming repo name is book-club
    themeConfig: {
        logo: '/favicon.svg',
        font: FONT_FAMILY, // Google Font family name
        cardsPerRow: 5, // Number of book cards per row (default: 4)
        
        // Field configuration for book display
        bookFields: {
            // Primary display fields (always shown if present)
            coverField: 'Cover',           // Field containing cover image URL
            titleField: 'Title',           // Field containing title
            authorField: 'Author',         // Field containing author
            borrowedField: 'Borrowed',     // Field indicating borrowed status
            
            // Fields displayed as tags in cards
            cardTags: [
                { field: 'Language', label: 'Language', cssClass: 'language' },
                { field: 'Owner', label: 'Owner', cssClass: 'owner' },
                { field: 'Location', label: 'Location', cssClass: 'location' }
            ],
            
            // Fields displayed in modal (in order)
            modalFields: [
                { field: 'Language', label: 'Language', cssClass: 'modal-field-language' },
                { field: 'Owner', label: 'Owner', cssClass: 'modal-field-owner' },
                { field: 'Location', label: 'Location', cssClass: 'modal-field-location' },
                { field: 'ISBN', label: 'ISBN', cssClass: 'modal-field-isbn' },
                { field: 'Notes', label: 'Notes', cssClass: 'modal-field-notes' }
            ],
            
            // Fields available for filtering
            filterFields: [
                { field: 'Language', label: 'Language' },
                { field: 'Owner', label: 'Owner' },
                { field: 'Location', label: 'Location' }
            ],
            
            // Fields available for sorting
            sortFields: [
                { field: 'Language', label: 'By Language' },
                { field: 'Owner', label: 'By Owner' },
                { field: 'Location', label: 'By Location' }
            ]
        },
        
        nav: [
            { text: 'Home', link: '/' },
            { text: 'About', link: '/about' },
            { text: 'Google Sheet', link: `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}` }
        ],

        socialLinks: [
            { icon: 'github', link: 'https://github.com/nbisweden/book-club' }
        ],

        footer: {
            message: (() => {
                const now = new Date();
                const date = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
                return `Last Updated: ${date} at ${time}`;
            })(),
            copyright: `${new Date().getFullYear()} NBIS Book Club`
        },
    },
    head: [
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
        ['link', { rel: 'stylesheet', href: FONT_GOOGLE_URL }],
        ['link', { rel: 'icon', href: '/book-club/favicon.ico' }],
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/book-club/favicon.svg' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/book-club/favicon-96x96.png' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/book-club/favicon-180x180.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/book-club/favicon-192x192.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/book-club/favicon-512x512.png' }]
    ]
})
