// Index page JavaScript for static HTML version
// Handles homepage functionality, article loading, and pagination

document.addEventListener('DOMContentLoaded', function() {
    console.log('Pondok Informatika News - Static Version loaded successfully!');

    // API Configuration
    const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

    // Helper function to safely get nested property or fallback
    function safeGet(obj, path, fallback = '') {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || fallback;
    }

    // Global variables
    let allArticles = [];
    let currentPage = 1;
    const articlesPerPage = 10;
    let categories = [];

    // Initialize the page by fetching data from API
    fetchRealData();

    async function fetchRealData() {
        try {
            console.log('Attempting to fetch real data from API...');

            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(API_BASE_URL, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            const data = await response.json();

            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                console.log('Real data fetched successfully, updating content...');
                // Map API data to expected article format
                allArticles = data.data.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 150) : '',
                    content: item.content,
                    image_url: safeGet(item, 'image_url', 'https://picsum.photos/400/250?random=api'),
                    kategori: item.kategori || 'Umum',
                    created_at: item.created_at || item.date || '',
                    date: item.date || item.created_at || ''
                })).sort((a, b) => parseInt(b.id) - parseInt(a.id));
                categories = [...new Set(allArticles.map(a => a.kategori).filter(k => k))];

                // Update content with real data
                loadCategories();
                renderHeroSection();
                renderMainContent();
                initializeSearch();
                console.log(`Loaded ${allArticles.length} articles from API`);
            } else {
                console.log('API returned empty or invalid data, keeping mock data');
            }
        } catch (error) {
            console.log('API fetch failed, keeping mock data:', error.message);
        }
    }

    function loadCategories() {
        // Load categories for search dropdown
        const categoriesList = document.getElementById('categories-list');
        if (categoriesList) {
            categoriesList.innerHTML = '';

            if (categories.length === 0) {
                categoriesList.innerHTML = '<div class="text-center py-3"><small class="text-muted">Tidak ada kategori tersedia</small></div>';
            } else {
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
        }

        // Load categories for sidebar
        const categoriesSidebar = document.getElementById('categories-sidebar');
        if (categoriesSidebar) {
            categoriesSidebar.innerHTML = '';

            if (categories.length === 0) {
                categoriesSidebar.innerHTML = '<div class="text-center py-3"><small class="text-muted">Tidak ada kategori tersedia</small></div>';
            } else {
                // Show only first 6 categories initially
                const visibleCategories = categories.slice(0, 6);
                const hiddenCategories = categories.slice(6);

                visibleCategories.forEach(category => {
                    const categoryItem = document.createElement('div');
                    categoryItem.className = 'tag-item';
                    categoryItem.innerHTML = `
                        <a href="tag.html?tag=${encodeURIComponent(category)}">
                            <i class="fas fa-tag tag-icon"></i>
                            <span class="tag-name">${category}</span>
                            <span class="badge">${allArticles.filter(a => a.kategori === category).length}</span>
                        </a>
                    `;
                    categoriesSidebar.appendChild(categoryItem);
                });

                // Add remaining categories (they will be scrollable)
                hiddenCategories.forEach(category => {
                    const categoryItem = document.createElement('div');
                    categoryItem.className = 'tag-item';
                    categoryItem.innerHTML = `
                        <a href="tag.html?tag=${encodeURIComponent(category)}">
                            <i class="fas fa-tag tag-icon"></i>
                            <span class="tag-name">${category}</span>
                            <span class="badge">${allArticles.filter(a => a.kategori === category).length}</span>
                        </a>
                    `;
                    categoriesSidebar.appendChild(categoryItem);
                });
            }
        }
    }

    function renderHeroSection() {
        if (allArticles.length === 0) return;

        const heroContent = document.getElementById('hero-content');
        const latestNews = document.getElementById('latest-news');

        // Render hero article
        heroContent.innerHTML = `
            <div class="hero-main">
                <a href="article.html?id=${allArticles[0].id}" class="text-decoration-none">
                    <div class="card hero-card border-0">
                        <img src="${allArticles[0].image_url || 'https://picsum.photos/800/400?random=fallback'}"
                             class="card-img-top" alt="${allArticles[0].title}">
                        <div class="card-body p-0 mt-3">
                            <span class="badge bg-danger mb-2">HEADLINE</span>
                            <h1 class="card-title h2 fw-bold text-dark">
                                ${allArticles[0].title}
                            </h1>
                            <p class="card-text text-muted">
                                ${allArticles[0].description ? allArticles[0].description.substring(0, 150) + '...' : 'Baca selengkapnya...'}
                            </p>
                            <small class="text-muted">
                                <i class="far fa-clock"></i> ${allArticles[0].created_at || allArticles[0].date || 'Hari ini'}
                            </small>
                        </div>
                    </div>
                </a>
            </div>
        `;

        // Render latest news in sidebar
        latestNews.innerHTML = allArticles.slice(1, 5).map(article => `
            <div class="mini-news mb-3">
                <a href="article.html?id=${article.id}" class="text-decoration-none">
                    <div class="row g-2">
                        <div class="col-4">
                            <img src="${article.image_url || 'https://picsum.photos/150/100?random=sidebar'}"
                                 class="img-fluid rounded" alt="${article.title}">
                        </div>
                        <div class="col-8">
                            <h6 class="mb-1 text-dark fw-bold">${article.title}</h6>
                            <p class="mb-0 text-muted small">
                                ${article.description ? article.description.substring(0, 80) + '...' : 'Baca selengkapnya...'}
                            </p>
                        </div>
                    </div>
                </a>
            </div>
        `).join('');
    }

    function renderMainContent() {
        // The HTML structure already exists, just populate the existing containers
        // Render initial articles
        renderArticlesPage(currentPage);

        // Setup pagination after articles are rendered
        setTimeout(() => {
            renderPagination();
        }, 100);
    }

    function renderArticlesPage(page) {
        const container = document.getElementById('articles-container');
        if (!container) return;

        let startIndex = (page - 1) * articlesPerPage;
        // Skip the first 5 articles on page 1 since they're shown in hero and sidebar
        if (page === 1 && allArticles.length > 0) {
            startIndex = 5;
        }
        const endIndex = startIndex + articlesPerPage;
        const articlesToShow = allArticles.slice(startIndex, endIndex);

        container.innerHTML = '';

        if (articlesToShow.length > 0) {
            articlesToShow.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'col-md-6 mb-4';
                articleCard.innerHTML = `
                    <div class="card news-card h-100 border-0 shadow-sm">
                        <a href="article.html?id=${article.id}" class="text-decoration-none">
                            <img src="${article.image_url || 'https://picsum.photos/400/250?random=article'}"
                                 class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <span class="badge bg-primary mb-2">${article.kategori || 'Umum'}</span>
                                <h5 class="card-title text-dark fw-bold">${article.title}</h5>
                                <p class="card-text text-muted">
                                    ${article.description ? article.description.substring(0, 100) + '...' : 'Baca selengkapnya...'}
                                </p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted">
                                        <i class="far fa-clock"></i> ${article.created_at || article.date || 'Hari ini'}
                                    </small>
                                    <small class="text-muted">
                                        <i class="far fa-eye"></i> ${Math.floor(Math.random() * 1000) + 100} views
                                    </small>
                                </div>
                            </div>
                        </a>
                    </div>
                `;
                container.appendChild(articleCard);
            });
        } else {
            container.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                        <h5>Tidak ada artikel tersedia</h5>
                        <p class="text-muted">Silakan coba lagi nanti</p>
                    </div>
                </div>
            `;
        }

        currentPage = page;
    }

    function renderPagination() {
        const totalPages = Math.ceil(allArticles.length / articlesPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'block';

        let paginationHtml = '';

        // Previous button
        paginationHtml += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" id="prev-page" tabindex="-1">Sebelumnya</a>
            </li>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page and ellipsis if needed
        if (startPage > 1) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link page-number" href="#" data-page="1">1</a>
                </li>
            `;
            if (startPage > 2) {
                paginationHtml += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${currentPage === i ? 'active' : ''}">
                    <a class="page-link page-number" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }

        // Last page and ellipsis if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `
                    <li class="page-item disabled">
                        <span class="page-link">...</span>
                    </li>
                `;
            }
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link page-number" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" id="next-page">Berikutnya</a>
            </li>
        `;

        pagination.innerHTML = paginationHtml;

        // Remove duplicated latest news below pagination
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            const duplicatedLatestNews = mainContent.querySelectorAll('.sidebar-news');
            if (duplicatedLatestNews.length > 1) {
                // Remove all but the first occurrence
                for (let i = 1; i < duplicatedLatestNews.length; i++) {
                    duplicatedLatestNews[i].remove();
                }
            }
        }

        // Add event listeners
        setupPaginationEventListeners();
    }

    function setupPaginationEventListeners() {
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        const pageNumberLinks = document.querySelectorAll('.page-number');

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    renderArticlesPage(currentPage);
                    renderPagination();
                    scrollToTop();
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const totalPages = Math.ceil(allArticles.length / articlesPerPage);
                if (currentPage < totalPages) {
                    currentPage++;
                    renderArticlesPage(currentPage);
                    renderPagination();
                    scrollToTop();
                }
            });
        }

        pageNumberLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.getAttribute('data-page'));
                const totalPages = Math.ceil(allArticles.length / articlesPerPage);
                if (page && page !== currentPage && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderArticlesPage(currentPage);
                    renderPagination();
                    scrollToTop();
                }
            });
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function initializeSearch() {
        const searchForm = document.getElementById('search-form');
        const mobileSearchForm = document.getElementById('mobile-search-form');
        const searchInput = document.getElementById('search-input');
        const mobileSearchInput = document.getElementById('mobile-search-input');
        const searchDropdown = document.getElementById('search-dropdown');

        // Desktop search
        if (searchForm && searchInput) {
            // Show dropdown on focus (when clicked), even if empty
            searchInput.addEventListener('focus', function() {
                if (categories.length > 0) {
                    searchDropdown.style.display = 'block';
                }
            });

            // Handle input changes
            searchInput.addEventListener('input', function() {
                const query = this.value.trim();
                if (query.length > 0) {
                    searchDropdown.style.display = 'block';
                    // Filter categories based on input
                    filterCategories(query);
                } else {
                    // Show all categories when input is empty
                    showAllCategories();
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
                if (searchDropdown) {
                    searchDropdown.style.display = 'none';
                }
            }
        });
    }

    function showAllCategories() {
        const categoriesList = document.getElementById('categories-list');
        if (categoriesList && categories.length > 0) {
            categoriesList.innerHTML = '';

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
    }

    function filterCategories(query) {
        const categoriesList = document.getElementById('categories-list');
        if (categoriesList) {
            categoriesList.innerHTML = '';

            const filteredCategories = categories.filter(category =>
                category.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredCategories.length > 0) {
                filteredCategories.forEach(category => {
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
            } else {
                categoriesList.innerHTML = '<div class="text-center py-3"><small class="text-muted">Tidak ada kategori yang cocok</small></div>';
            }
        }
    }

    function showLoadingState() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p>Memuat artikel...</p>
                </div>
            </div>
        `;
    }

    function showErrorState(message) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h4 class="alert-heading">Oops!</h4>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh me-2"></i>Coba Lagi
                    </button>
                </div>
            </div>
        `;
    }

    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
});
