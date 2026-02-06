
import { defineConfig } from 'vitepress'
import 'dotenv/config'

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID

export default defineConfig({
    title: "NBIS Book Club",
    description: "A shared book collection for NBIS",
    base: '/book-club/', // Assuming repo name is book-club
    themeConfig: {
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
        ['link', { rel: 'icon', href: '/book-club/favicon.ico' }] // Optional
    ]
})
