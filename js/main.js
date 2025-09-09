// Main JavaScript for Pondok Informatika News (Static Version)

document.addEventListener('DOMContentLoaded', function() {
    console.log('Pondok Informatika News loaded successfully!');

    // Mobile Sidebar functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    const mobileSidebarClose = document.getElementById('mobile-sidebar-close');

    // Function to open mobile sidebar
    function openMobileSidebar() {
        if (mobileSidebar && mobileSidebarOverlay) {
            mobileSidebar.classList.add('active');
            mobileSidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Function to close mobile sidebar
    function closeMobileSidebar() {
        if (mobileSidebar && mobileSidebarOverlay) {
            mobileSidebar.classList.remove('active');
            mobileSidebarOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Event listeners for mobile sidebar
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openMobileSidebar();
            loadTagsInSidebar();
        });
    }

    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }

    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('click', function() {
            closeMobileSidebar();
        });
    }

    // Close sidebar when clicking on navigation links
    const sidebarNavLinks = document.querySelectorAll('.mobile-sidebar .nav-link');
    sidebarNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileSidebar();
        });
    });

    // Close sidebar on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar && mobileSidebar.classList.contains('active')) {
            closeMobileSidebar();
        }
    });

    // Function to fetch tags from API and render in sidebar
    async function loadTagsInSidebar() {
        const sidebarArticles = document.getElementById('mobile-sidebar-articles');
        const sidebarLoading = document.getElementById('mobile-sidebar-loading');
        if (!sidebarArticles || !sidebarLoading) return;

        sidebarLoading.style.display = 'flex';
        sidebarArticles.innerHTML = '';

        try {
            const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const articles = data.data || [];

            // Extract unique tags from articles
            const tagsSet = new Set();
            articles.forEach(article => {
                if (article.kategori) {
                    tagsSet.add(article.kategori);
                }
            });
            const tags = Array.from(tagsSet);

            if (tags.length === 0) {
                sidebarArticles.innerHTML = `
                    <div class="text-center py-3">
                        <small class="text-light">Tidak ada tag artikel tersedia</small>
                    </div>
                `;
            } else {
                tags.forEach(tag => {
                    const tagItem = document.createElement('div');
                    tagItem.className = 'mobile-sidebar-article-item';
                    tagItem.textContent = tag;
                    tagItem.style.color = 'white';
                    tagItem.style.padding = '0.5rem 1rem';
                    tagItem.style.cursor = 'pointer';
                    tagItem.style.transition = 'background-color 0.2s ease';
                    tagItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.location.href = 'tag.html?tag=' + encodeURIComponent(tag);
                    });
                    tagItem.addEventListener('mouseenter', () => {
                        tagItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    });
                    tagItem.addEventListener('mouseleave', () => {
                        tagItem.style.backgroundColor = 'transparent';
                    });
                    sidebarArticles.appendChild(tagItem);
                });
            }
        } catch (error) {
            console.error('Error loading tags:', error);
            sidebarArticles.innerHTML = `
                <div class="text-center py-3">
                    <small class="text-light">Gagal memuat tag artikel</small>
                </div>
            `;
        } finally {
            sidebarLoading.style.display = 'none';
        }
    }

    // Mobile Search functionality
    const mobileSearchForm = document.getElementById('mobile-search-form');
    const mobileSearchInput = document.getElementById('mobile-search-input');

    if (mobileSearchForm && mobileSearchInput) {
        // Handle mobile search form submission
        mobileSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = mobileSearchInput.value.trim();
            if (query) {
                // Redirect to search page with query parameter
                window.location.href = 'search.html?q=' + encodeURIComponent(query);
            }
        });

        // Allow Enter key to submit mobile search
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = mobileSearchInput.value.trim();
                if (query) {
                    window.location.href = 'search.html?q=' + encodeURIComponent(query);
                }
            }
        });
    }

    // Search Form functionality
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    const categoriesList = document.getElementById('categories-list');

    let categories = [];
    let dropdownVisible = false;

    // Function to fetch categories
    async function fetchCategories() {
        try {
            const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const uniqueCategories = [...new Set(data.data.map(article => article.kategori).filter(k => k))];
            categories = uniqueCategories;
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    // Function to render categories in dropdown
    function renderCategories() {
        if (!categoriesList) return;

        categoriesList.innerHTML = '';

        if (categories.length === 0) {
            categoriesList.innerHTML = `
                <div class="text-center py-3">
                    <small class="text-muted">Tidak ada kategori tersedia</small>
                </div>
            `;
            return;
        }

        categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item px-3 py-2 hover-bg-light cursor-pointer border-bottom';
            categoryItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="fas fa-tag text-primary me-2"></i>
                    <span class="flex-grow-1">${category}</span>
                    <small class="text-muted">
                        <i class="fas fa-external-link-alt"></i>
                    </small>
                </div>
            `;

            categoryItem.addEventListener('click', function() {
                // Navigate to category page
                window.location.href = 'tag.html?tag=' + encodeURIComponent(category);
            });

            categoriesList.appendChild(categoryItem);
        });
    }

    // Function to show dropdown
    function showDropdown() {
        if (searchDropdown) {
            searchDropdown.style.display = 'block';
            dropdownVisible = true;

            // Fetch categories if not already loaded
            if (categories.length === 0) {
                fetchCategories().then(() => {
                    renderCategories();
                });
            } else {
                renderCategories();
            }
        }
    }

    // Function to hide dropdown
    function hideDropdown() {
        if (searchDropdown) {
            searchDropdown.style.display = 'none';
            dropdownVisible = false;
        }
    }

    if (searchForm && searchInput) {
        // Show dropdown when input is focused/clicked
        searchInput.addEventListener('focus', function() {
            showDropdown();
        });

        searchInput.addEventListener('click', function() {
            if (!dropdownVisible) {
                showDropdown();
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchForm.contains(e.target)) {
                hideDropdown();
            }
        });

        // Handle form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                hideDropdown();
                // Redirect to search page with query parameter
                window.location.href = 'search.html?q=' + encodeURIComponent(query);
            }
        });

        // Allow Enter key to submit search
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query) {
                    hideDropdown();
                    window.location.href = 'search.html?q=' + encodeURIComponent(query);
                }
            }
        });

        // Handle Escape key to hide dropdown
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideDropdown();
                searchInput.blur();
            }
        });
    }

    // Load More Button functionality
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        let currentPage = 1;
        const articlesPerPage = 10;

        loadMoreBtn.addEventListener('click', async () => {
            currentPage++;
            try {
                const response = await fetch(`https://santri.pondokinformatika.id/api/get/news`);
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const articles = data.data || [];
                const startIndex = (currentPage - 1) * articlesPerPage;
                const endIndex = currentPage * articlesPerPage;
                const paginatedArticles = articles.slice(startIndex, endIndex);

                if (paginatedArticles.length > 0) {
                    const container = document.querySelector('.main-content .row .col-lg-8 .row');
                    paginatedArticles.forEach(article => {
                        const articleCard = document.createElement('div');
                        articleCard.className = 'col-md-6 mb-4';
                        articleCard.innerHTML = `
                            <div class="card news-card h-100 border-0 shadow-sm">
                                <a href="article.html?id=${article.id}" class="text-decoration-none">
                                    <img src="${article.image_url || 'https://via.placeholder.com/400x250/DC3545/FFFFFF?text=News'}"
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
                    loadMoreBtn.disabled = true;
                    loadMoreBtn.textContent = 'Tidak ada artikel lagi';
                }
            } catch (error) {
                console.error('Error loading more articles:', error);
                loadMoreBtn.disabled = true;
                loadMoreBtn.textContent = 'Gagal memuat artikel';
            }
        });
    }
});
