// Article page JavaScript for static HTML version
// Handles individual article display and related functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Article page loaded successfully!');

    // API Configuration
    const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        showErrorState('ID artikel tidak ditemukan');
        return;
    }

    // Initialize the page
    initializeArticlePage();

    async function initializeArticlePage() {
        try {
            // Show loading state
            showLoadingState();

            // Fetch all articles from API
            const response = await fetch(API_BASE_URL);
            const data = await response.json();

            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid API response');
            }

            const allArticles = data.data;
            const article = allArticles.find(a => a.id == articleId);

            if (!article) {
                showErrorState('Artikel tidak ditemukan');
                return;
            }

            // Get related articles (same category, excluding current article)
            const relatedArticles = allArticles
                .filter(a => a.id != articleId && a.kategori === article.kategori)
                .slice(0, 8);

            // Render article content
            renderArticle(article, relatedArticles);

            // Load categories for search dropdown
            loadCategories(allArticles);

            // Initialize search functionality
            initializeSearch();

        } catch (error) {
            console.error('Error loading article:', error);
            showErrorState('Gagal memuat artikel. Silakan coba lagi nanti.');
        }
    }

    function renderArticle(article, relatedArticles) {
        const articleContent = document.getElementById('article-content');
        const loadingState = document.getElementById('loading-state');

        // Hide loading state
        loadingState.style.display = 'none';
        articleContent.style.display = 'block';

        // Update page title and meta
        document.title = `${article.title} - Pondok Informatika News`;
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', article.description || 'Baca artikel lengkap di Pondok Informatika News');
        }

        // Render article content
        articleContent.innerHTML = `
            <div class="row">
                <div class="col-lg-8">
                    <!-- Article Header -->
                    <div class="mb-4">
                        <!-- Article Image -->
                        ${article.image_url ? `
                            <div class="mb-4">
                                <img src="${article.image_url}" alt="${article.title}" class="img-fluid rounded w-100" style="height: 400px; object-fit: cover;">
                            </div>
                        ` : ''}

                        <h1 class="fw-bold mb-3" style="font-size: 2.5rem; line-height: 1.2;">
                            ${article.title}
                        </h1>

                        <!-- Article Information - Moved below title -->
                        <div class="d-flex align-items-center mb-4">
                            <span class="badge bg-primary me-3">${article.kategori || 'Umum'}</span>
                            <small class="text-muted">
                                <i class="far fa-clock me-1"></i>${article.created_at || article.date || 'Hari ini'}
                            </small>
                            <small class="text-muted ms-3">
                                <i class="fas fa-user me-1"></i>${article.nama_lengkap_santri || article.author || 'Admin'}
                            </small>
                        </div>
                    </div>

                    <!-- Article Content -->
                    <div class="article-content">
                        ${article.content || article.description || 'Konten artikel tidak tersedia.'}
                    </div>

                    <!-- Article Footer -->
                    <div class="mt-4 pt-4 border-top">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="share-buttons">
                                <span class="text-muted me-2">Bagikan:</span>
                                <a href="https://wa.me/?text=${encodeURIComponent(window.location.href)}" class="btn btn-sm btn-success me-2" target="_blank">
                                    <i class="fab fa-whatsapp"></i>
                                </a>
                                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}" class="btn btn-sm btn-primary me-2" target="_blank">
                                    <i class="fab fa-facebook"></i>
                                </a>
                                <a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}" class="btn btn-sm btn-info" target="_blank">
                                    <i class="fab fa-twitter"></i>
                                </a>
                            </div>
                            <a href="index.html" class="btn btn-outline-primary">
                                <i class="fas fa-arrow-left me-2"></i>Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <aside class="related-articles">
                        <h5 class="border-bottom border-danger pb-2 mb-3">
                            <i class="fas fa-newspaper me-2"></i>Artikel Terkait
                        </h5>
                        <ul class="list-unstyled">
                            ${relatedArticles.length > 0 ? relatedArticles.map(relArticle => `
                                <li class="mb-3">
                                    <a href="article.html?id=${relArticle.id}" class="text-decoration-none d-flex align-items-start">
                                        <img src="${relArticle.image_url || 'https://via.placeholder.com/80x60'}" class="img-fluid rounded me-3 flex-shrink-0" alt="${relArticle.title}" style="width: 80px; height: 60px; object-fit: cover;">
                                        <div>
                                            <h6 class="mb-1 text-dark fw-bold" style="font-size: 0.9rem; line-height: 1.3;">
                                                ${relArticle.title}
                                            </h6>
                                            <small class="text-muted">
                                                ${relArticle.created_at || relArticle.date || 'Hari ini'}
                                            </small>
                                        </div>
                                    </a>
                                </li>
                            `).join('') : `
                                <li class="text-center py-4">
                                    <i class="fas fa-newspaper fa-2x text-muted mb-2"></i>
                                    <p class="text-muted mb-0">Tidak ada artikel terkait</p>
                                </li>
                            `}
                        </ul>

                        <!-- Popular Tags -->
                        <div class="mt-4">
                            <h5 class="border-bottom border-danger pb-2 mb-3">
                                <i class="fas fa-tags me-2"></i>Kategori Populer
                            </h5>
                            <div id="popular-tags" class="tags">
                                <!-- Tags will be populated by JavaScript -->
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        `;

        // Load popular tags
        loadPopularTags();
    }

    function loadCategories(allArticles) {
        const categories = [...new Set(allArticles.map(a => a.kategori).filter(k => k))];
        const categoriesList = document.getElementById('categories-list');

        if (!categoriesList) return;

        categoriesList.innerHTML = '';

        if (categories.length === 0) {
            categoriesList.innerHTML = '<div class="text-center py-3"><small class="text-muted">Tidak ada kategori tersedia</small></div>';
            return;
        }

        categories.forEach(category => {
            const categoryItem = document.createElement('a');
            categoryItem.href = `tag.html?tag=${encodeURIComponent(category)}`;
            categoryItem.className = 'dropdown-item d-flex align-items-center py-2 px-3';
            categoryItem.innerHTML = `
                <i class="fas fa-tag me-2 text-primary"></i>
                <span>${category}</span>
                <small class="text-muted ms-auto">${allArticles.filter(a => a.kategori === category).length}</small>
            `;
            categoriesList.appendChild(categoryItem);
        });
    }

    function loadPopularTags() {
        // This would normally fetch from an API, but for now we'll use static data
        const popularTags = ['Teknologi', 'Pendidikan', 'Islam', 'Programming', 'Web Development'];
        const tagsContainer = document.getElementById('popular-tags');

        if (!tagsContainer) return;

        tagsContainer.innerHTML = popularTags.map(tag => `
            <a href="tag.html?tag=${encodeURIComponent(tag)}" class="badge bg-secondary text-decoration-none me-1 mb-1">
                <i class="fas fa-tag me-1"></i>${tag}
            </a>
        `).join('');
    }

    function initializeSearch() {
        const searchForm = document.getElementById('search-form');
        const mobileSearchForm = document.getElementById('mobile-search-form');
        const searchInput = document.getElementById('search-input');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        const searchDropdown = document.getElementById('search-dropdown');

        // Desktop search
        if (searchForm && searchInput) {
            searchInput.addEventListener('input', function() {
                if (this.value.trim().length > 0) {
                    searchDropdown.style.display = 'block';
                } else {
                    searchDropdown.style.display = 'none';
                }
            });

            searchInput.addEventListener('focus', function() {
                if (this.value.trim().length > 0) {
                    searchDropdown.style.display = 'block';
                }
            });

            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            });
        }

        // Mobile search
        if (mobileSearchForm && mobileSearchInput) {
            mobileSearchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const query = mobileSearchInput.value.trim();
                if (query) {
                    window.location.href = `search.html?q=${encodeURIComponent(query)}`;
                }
            });
        }

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (searchForm && !searchForm.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });
    }

    function showLoadingState() {
        const loadingState = document.getElementById('loading-state');
        const articleContent = document.getElementById('article-content');

        if (loadingState) loadingState.style.display = 'block';
        if (articleContent) articleContent.style.display = 'none';
    }

    function showErrorState(message) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h4 class="alert-heading">Oops!</h4>
                    <p>${message}</p>
                    <div class="mt-3">
                        <a href="index.html" class="btn btn-primary me-2">
                            <i class="fas fa-home me-2"></i>Kembali ke Beranda
                        </a>
                        <button class="btn btn-secondary" onclick="location.reload()">
                            <i class="fas fa-refresh me-2"></i>Coba Lagi
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
});
