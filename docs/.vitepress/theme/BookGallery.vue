
<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { withBase, useData } from 'vitepress';

const { theme } = useData();

const books = ref([]);
const searchQuery = ref('');
const filterValues = reactive({});
const selectedSort = ref('reverse');
const loading = ref(true);
const selectedBook = ref(null);
const showModal = ref(false);
const selectedBookIndex = ref(null);

const cardsPerRow = computed(() => theme.value.cardsPerRow || 4);

// Get language colors from theme
const languageColors = computed(() => theme.value.languageColors || []);

// Get field configuration from theme
const bookFields = computed(() => theme.value.bookFields || {});
const coverField = computed(() => bookFields.value.coverField || 'Cover');
const titleField = computed(() => bookFields.value.titleField || 'Title');
const authorField = computed(() => bookFields.value.authorField || 'Author');
const borrowedField = computed(() => bookFields.value.borrowedField || 'Borrowed');
const cardTags = computed(() => bookFields.value.cardTags || []);
const modalFields = computed(() => bookFields.value.modalFields || []);
const filterFields = computed(() => bookFields.value.filterFields || []);
const sortFields = computed(() => bookFields.value.sortFields || []);

// Create a color map for languages
const languageColorMap = computed(() => {
  const uniqueLanguages = [...new Set(books.value
    .map(book => book.Language)
    .filter(val => val && String(val).trim().length > 0)
  )];
  
  const colorMap = {};
  uniqueLanguages.forEach((lang, index) => {
    if (index < languageColors.value.length) {
      colorMap[lang] = languageColors.value[index];
    }
  });
  return colorMap;
});

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
  
  window.addEventListener('keydown', handleKeydown);
});

const getUniqueValues = (field) => {
  const values = books.value
    .map(book => book[field])
    .filter(val => val && String(val).trim().length > 0);
  return [...new Set(values)].sort();
};

// Dynamically get unique values for each filter field
const uniqueFilterValues = computed(() => {
  const result = {};
  filterFields.value.forEach(filter => {
    result[filter.field] = getUniqueValues(filter.field);
  });
  return result;
});

const filteredBooks = computed(() => {
  let result = books.value.filter(book => {
    // Text search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      const matchesSearch = Object.values(book).some(val => 
        String(val).toLowerCase().includes(query)
      );
      if (!matchesSearch) return false;
    }

    // Dynamic dropdown filters
    for (const field in filterValues) {
      if (filterValues[field] && book[field] !== filterValues[field]) {
        return false;
      }
    }

    return true;
  });

  // Apply sorting dynamically
  if (selectedSort.value && selectedSort.value !== 'default' && selectedSort.value !== 'reverse') {
    const sortField = selectedSort.value;
    result.sort((a, b) => (a[sortField] || '').toString().localeCompare((b[sortField] || '').toString()));
  } else if (selectedSort.value === 'reverse') {
    result.reverse();
  }
  // else: default keeps the order as-is from books.json

  return result;
});

const isBorrowed = (book) => {
  const borrowedValue = book[borrowedField.value];
  return borrowedValue && String(borrowedValue).trim().length > 0;
};

const getCover = (book) => {
  const coverValue = book[coverField.value];
  if (coverValue && String(coverValue).trim() !== '') {
    return coverValue;
  }
  return withBase('/cover-placeholder.jpg');
};

const getFieldValue = (book, field) => {
  return book[field] || '';
};

const getLanguageTagColor = (language) => {
  return languageColorMap.value[language] || '#808080';
};

const handleImageError = (e) => {
  e.target.src = withBase('/cover-placeholder.jpg');
};

const toTitleCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
};

const openModal = (book) => {
  selectedBook.value = book;
  selectedBookIndex.value = filteredBooks.value.indexOf(book);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedBook.value = null;
  selectedBookIndex.value = null;
};

const navigateToBook = (book) => {
  selectedBook.value = book;
  selectedBookIndex.value = filteredBooks.value.indexOf(book);
};

const navigatePrevious = () => {
  if (selectedBookIndex.value === null || selectedBookIndex.value === 0) return;
  const newIndex = selectedBookIndex.value - 1;
  navigateToBook(filteredBooks.value[newIndex]);
};

const navigateNext = () => {
  if (selectedBookIndex.value === null || selectedBookIndex.value >= filteredBooks.value.length - 1) return;
  const newIndex = selectedBookIndex.value + 1;
  navigateToBook(filteredBooks.value[newIndex]);
};

const handleKeydown = (event) => {
  if (!showModal.value) return;
  
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    navigatePrevious();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    navigateNext();
  } else if (event.key === 'Escape') {
    closeModal();
  }
};
</script>

<template>
  <div class="gallery-container">
    <div class="search-wrapper">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search for books..." 
        class="search-input"
      />
      
      <div class="filters-container">
        <!-- Dynamic filter dropdowns -->
        <div 
          v-for="filter in filterFields" 
          :key="filter.field" 
          class="filter-group"
        >
          <label :for="`${filter.field}-filter`" class="filter-label">{{ filter.label }}</label>
          <select v-model="filterValues[filter.field]" :id="`${filter.field}-filter`" class="filter-select">
            <option value="">All {{ filter.label }}s</option>
            <option 
              v-for="value in uniqueFilterValues[filter.field]" 
              :key="value" 
              :value="value"
            >
              {{ value }}
            </option>
          </select>
        </div>

        <!-- Dynamic sort dropdown -->
        <div class="filter-group">
          <label for="sort-filter" class="filter-label">Sort</label>
          <select v-model="selectedSort" id="sort-filter" class="filter-select">
            <option value="default">Default</option>
            <option 
              v-for="sort in sortFields" 
              :key="sort.field" 
              :value="sort.field"
            >
              {{ sort.label }}
            </option>
            <option value="reverse">Reverse</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading library...</div>

    <div v-else class="book-grid" :style="{ '--cards-per-row': cardsPerRow }">
      <div 
        v-for="(book, index) in filteredBooks" 
        :key="index" 
        class="book-card"
        :class="{ 'borrowed': isBorrowed(book) }"
        @click="openModal(book)"
      >
        <div class="book-cover-wrapper">
          <img 
            :src="getCover(book)" 
            @error="handleImageError"
            :alt="getFieldValue(book, titleField)" 
            class="book-cover" 
            loading="lazy" 
          />
          <div v-if="isBorrowed(book)" class="borrowed-badge">
            Borrowed by {{ getFieldValue(book, borrowedField) }}
          </div>
        </div>
        
        <div class="book-details">
          <div class="book-title">{{ getFieldValue(book, titleField) }}</div>
          <div class="book-author">{{ getFieldValue(book, authorField) }}</div>
          
          <div class="tags">
            <template v-for="tag in cardTags" :key="tag.field">
              <span 
                v-if="getFieldValue(book, tag.field)" 
                class="tag"
                :class="tag.cssClass"
                :style="tag.field === 'Language' ? { backgroundColor: getLanguageTagColor(getFieldValue(book, tag.field)) } : {}"
              >
                {{ getFieldValue(book, tag.field) }}
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && books.length > 0" class="results-count">
      {{ filteredBooks.length }} of {{ books.length }} books
    </div>
    
    <div v-if="!loading && books.length === 0" class="no-results">
        Library currently unavailable!
    </div>

    <div v-else-if="!loading && filteredBooks.length === 0" class="no-results">
        No books found matching filters.
    </div>

    <!-- Modal -->
    <transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <!-- Navigation buttons -->
          <button 
            class="modal-nav-button modal-nav-prev"
            :disabled="selectedBookIndex === null || selectedBookIndex === 0"
            @click="navigatePrevious"
            aria-label="Previous book"
            title="Previous book (Left arrow)"
          >
            <span class="nav-arrow"></span>
          </button>
          
          <button 
            class="modal-nav-button modal-nav-next"
            :disabled="selectedBookIndex === null || selectedBookIndex >= filteredBooks.length - 1"
            @click="navigateNext"
            aria-label="Next book"
            title="Next book (Right arrow)"
          >
            <span class="nav-arrow"></span>
          </button>
          
          <div class="modal-body" v-if="selectedBook">
            <div class="modal-left">
              <img 
                :src="getCover(selectedBook)" 
                @error="handleImageError"
                :alt="getFieldValue(selectedBook, titleField)" 
                class="modal-cover" 
              />
            </div>
            
            <div class="modal-right">
              <div class="modal-title">{{ toTitleCase(getFieldValue(selectedBook, titleField)) }}</div>
              <div class="modal-author">{{ getFieldValue(selectedBook, authorField) }}</div>
              
              <div class="modal-info">
                <!-- Borrowed status displayed separately if present -->
                <div v-if="isBorrowed(selectedBook)" class="modal-field modal-field-status borrowed-info">
                  <div class="modal-key">Status</div>
                  <div class="modal-value">Borrowed by {{ getFieldValue(selectedBook, borrowedField) }}</div>
                </div>
                
                <!-- Dynamic modal fields from configuration -->
                <template v-for="field in modalFields" :key="field.field">
                  <div 
                    v-if="getFieldValue(selectedBook, field.field)" 
                    class="modal-field"
                    :class="field.cssClass"
                  >
                    <div class="modal-key">{{ field.label }}</div>
                    <div class="modal-value">{{ getFieldValue(selectedBook, field.field) }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
