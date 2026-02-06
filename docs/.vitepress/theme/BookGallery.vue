
<script setup>
import { ref, computed, onMounted } from 'vue';
import { withBase } from 'vitepress';

const books = ref([]);
const searchQuery = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    // Try fetching with base path considerations
    // We'll try to determine the base path or just try relative
    const response = await fetch(withBase('/books.json'));
    if (!response.ok) throw new Error('Failed to load books');
    books.value = await response.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});

const filteredBooks = computed(() => {
  if (!searchQuery.value) return books.value;
  const query = searchQuery.value.toLowerCase();
  return books.value.filter(book => {
    return Object.values(book).some(val => 
      String(val).toLowerCase().includes(query)
    );
  });
});

const isBorrowed = (book) => {
  return book.Borrowed && book.Borrowed.trim().length > 0;
};

const getCover = (book) => {
  if (book.Cover && book.Cover.trim() !== '') {
    return book.Cover;
  }
  return withBase('/cover-placeholder.svg');
};

const handleImageError = (e) => {
  e.target.src = withBase('/cover-placeholder.svg');
};
</script>

<template>
  <div class="gallery-container">
    <div class="search-wrapper">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search books, authors, owners..." 
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">Loading library...</div>

    <div v-else class="book-grid">
      <div 
        v-for="(book, index) in filteredBooks" 
        :key="index" 
        class="book-card"
        :class="{ 'borrowed': isBorrowed(book) }"
      >
        <div class="book-cover-wrapper">
<img 
            :src="getCover(book)" 
            @error="handleImageError"
            :alt="book.Title" 
            class="book-cover" 
            loading="lazy" 
          />
          <div v-if="isBorrowed(book)" class="borrowed-badge">Borrowed by {{ book.Borrowed }}</div>
        </div>
        
        <div class="book-details">
          <h3 class="book-title">{{ book.Title }}</h3>
          <p class="book-author">by {{ book.Author }}</p>
          
          <div class="tags">
            <span v-if="book.Language" class="tag language">{{ book.Language }}</span>
            <span v-if="book.Owner" class="tag owner">Owner: {{ book.Owner }}</span>
            <span v-if="book.Location" class="tag location">Loc: {{ book.Location }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!loading && books.length === 0" class="no-results">
        Library currently unavailable!
    </div>

    <div v-else-if="!loading && filteredBooks.length === 0" class="no-results">
        No books found matching "{{ searchQuery }}"
    </div>
  </div>
</template>
