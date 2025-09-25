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

    // Function to load tags in sidebar from API
    async function loadTagsInSidebar() {
        const sidebarArticles = document.getElementById('mobile-sidebar-articles');
        const sidebarLoading = document.getElementById('mobile-sidebar-loading');
        if (!sidebarArticles || !sidebarLoading) return;

        try {
            const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
            const data = await response.json();
            let tags = [];
            if (data.data && Array.isArray(data.data)) {
                tags = [...new Set(data.data.map(article => article.kategori).filter(k => k))];
            } else {
                tags = ['Teknologi', 'Pendidikan', 'Islam']; // Fallback
            }

            sidebarLoading.style.display = 'none'; // Hide loading

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
            console.error('Error loading sidebar tags:', error);
            sidebarLoading.style.display = 'none';
            // Fallback to static tags
            const tags = ['Teknologi', 'Pendidikan', 'Islam'];
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

    // Function to fetch categories from API
    async function fetchCategories() {
        try {
            const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
            const data = await response.json();
            if (data.data && Array.isArray(data.data)) {
                categories = [...new Set(data.data.map(article => article.kategori).filter(k => k))];
            } else {
                categories = ['Teknologi', 'Pendidikan', 'Islam']; // Fallback
            }
            return categories;
        } catch (error) {
            console.error('Error fetching categories:', error);
            categories = ['Teknologi', 'Pendidikan', 'Islam']; // Fallback
            return categories;
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

    // Load More Button functionality (simplified for faster loading)
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        let currentPage = 1;
        const articlesPerPage = 10;

        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            // Show message that no more articles available for faster loading
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Tidak ada artikel lagi';
        });
    }
});
