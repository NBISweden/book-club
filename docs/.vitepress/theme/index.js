
import DefaultTheme from 'vitepress/theme';
import BookGallery from './BookGallery.vue';
import './style.css';

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('BookGallery', BookGallery);
    },
    setup() {
        // Apply custom font from config
        if (typeof window !== 'undefined') {
            import('vitepress').then(({ useData }) => {
                const { theme } = useData();
                if (theme.value?.font) {
                    document.documentElement.style.setProperty('--vp-font-family-base', `'${theme.value.font}', serif`);
                }
            });
        }
    }
};
