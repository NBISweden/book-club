
<script setup>
import { ref, computed, onMounted } from 'vue';
import { withBase } from 'vitepress';

const books = ref([]);
const searchQuery = ref('');
const selectedLanguage = ref('');
const selectedOwner = ref('');
const selectedLocation = ref('');
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

const getUniqueValues = (field) => {
  const values = books.value
    .map(book => book[field])
    .filter(val => val && val.trim().length > 0);
  return [...new Set(values)].sort();
};

const uniqueLanguages = computed(() => getUniqueValues('Language'));
const uniqueOwners = computed(() => getUniqueValues('Owner'));
const uniqueLocations = computed(() => getUniqueValues('Location'));

const filteredBooks = computed(() => {
  return books.value.filter(book => {
    // Text search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesSearch = Object.values(book).some(val => 
        String(val).toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Dropdown filters
    if (selectedLanguage.value && book.Language !== selectedLanguage.value) return false;
    if (selectedOwner.value && book.Owner !== selectedOwner.value) return false;
    if (selectedLocation.value && book.Location !== selectedLocation.value) return false;

    return true;
  }).reverse();
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
        placeholder="Search books..." 
        class="search-input"
      />
      
      <div class="filters-container">
        <div class="filter-group">
          <label for="language-filter" class="filter-label">Language</label>
          <select v-model="selectedLanguage" id="language-filter" class="filter-select">
            <option value="">All Languages</option>
            <option v-for="lang in uniqueLanguages" :key="lang" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="owner-filter" class="filter-label">Owner</label>
          <select v-model="selectedOwner" id="owner-filter" class="filter-select">
            <option value="">All Owners</option>
            <option v-for="owner in uniqueOwners" :key="owner" :value="owner">
              {{ owner }}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="location-filter" class="filter-label">Location</label>
          <select v-model="selectedLocation" id="location-filter" class="filter-select">
            <option value="">All Locations</option>
            <option v-for="location in uniqueLocations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>
      </div>
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
            <span v-if="book.Owner" class="tag owner">{{ book.Owner }}</span>
            <span v-if="book.Location" class="tag location">{{ book.Location }}</span>
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
