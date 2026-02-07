
import { defineConfig } from 'vitepress'
import 'dotenv/config'

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

export default defineConfig({
    title: "NBIS Book Club",
    description: "A shared book collection for NBIS",
    base: '/book-club/', // Assuming repo name is book-club
    themeConfig: {
        logo: '/favicon.svg',
        cardsPerRow: 5, // Number of book cards per row (default: 4)
        
        // Field configuration for book display
        bookFields: {
            // Primary display fields (always shown if present)
            coverField: 'cover',           // Field containing cover image URL
            titleField: 'title',           // Field containing title
            authorField: 'author',         // Field containing author
            borrowedField: 'borrowed',     // Field indicating borrowed status
            
            // Fields displayed as tags in cards
            cardTags: [
                { field: 'language', label: 'Language', cssClass: 'language' },
                { field: 'owner', label: 'Owner', cssClass: 'owner' },
                { field: 'location', label: 'Location', cssClass: 'location' }
            ],
            
            // Fields displayed in modal (in order)
            modalFields: [
                { field: 'language', label: 'Language', cssClass: 'modal-field-language' },
                { field: 'owner', label: 'Owner', cssClass: 'modal-field-owner' },
                { field: 'location', label: 'Location', cssClass: 'modal-field-location' },
                { field: 'isbn', label: 'ISBN', cssClass: 'modal-field-isbn' },
                { field: 'notes', label: 'Notes', cssClass: 'modal-field-notes' }
            ],
            
            // Fields available for filtering
            filterFields: [
                { field: 'language', label: 'Language' },
                { field: 'owner', label: 'Owner' },
                { field: 'location', label: 'Location' }
            ],
            
            // Fields available for sorting
            sortFields: [
                { field: 'language', label: 'By Language' },
                { field: 'owner', label: 'By Owner' },
                { field: 'location', label: 'By Location' }
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
            message: 'NBIS Book Club',
            copyright: '2026 NBIS'
        },

        // Search removed as per user request
    },
    head: [
        ['link', { rel: 'icon', href: '/book-club/favicon.ico' }],
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/book-club/favicon.svg' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/book-club/favicon-96x96.png' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/book-club/favicon-180x180.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/book-club/favicon-192x192.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/book-club/favicon-512x512.png' }]
    ]
})
