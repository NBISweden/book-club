
import DefaultTheme from 'vitepress/theme';
import BookGallery from './BookGallery.vue';
import './style.css';

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.component('BookGallery', BookGallery);
    }
};
