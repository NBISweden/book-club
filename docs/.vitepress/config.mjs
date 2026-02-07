
import { defineConfig } from 'vitepress'
import 'dotenv/config'

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

export default defineConfig({
    title: "NBIS Book Club",
    description: "A shared book collection for NBIS",
    base: '/book-club/', // Assuming repo name is book-club
    themeConfig: {
        logo: '/favicon.svg',
        cardsPerRow: 4, // Number of book cards per row (default: 4)
        nav: [
            { text: 'Home', link: '/' },
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
