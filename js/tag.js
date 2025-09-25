// Tag page JavaScript for filtering articles by category

document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.getElementById('main-content');
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

    // API Configuration
    const API_BASE_URL = 'https://santri.pondokinformatika.id/api/get/news';

    // Helper function to safely get nested property or fallback
    function safeGet(obj, path, fallback = '') {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj) || fallback;
    }

    // Show loading state
    mainContent.innerHTML = `
        <div class="container py-4">
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p>Memuat artikel kategori...</p>
            </div>
        </div>
    `;

    if (!tag || !tag.trim()) {
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-tag fa-3x text-muted mb-3"></i>
                    <h4>Kategori tidak ditemukan</h4>
                    <p class="text-muted">Silakan pilih kategori yang valid.</p>
                    <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
        return;
    }

    try {
        // Fetch articles from API for accurate category filtering
        console.log('Fetching articles from API for tag filtering...');
        console.log('Tag parameter:', tag);
        console.log('API URL:', API_BASE_URL);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(API_BASE_URL, {
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        console.log('API Response status:', response.status);

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);

        if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
            console.warn('No articles found in API response');
            throw new Error('No articles found in API');
        }

        console.log('Total articles from API:', data.data.length);

        // Map API data to expected article format
        const allArticles = data.data.map(item => ({
            id: item.id,
            title: item.title,
            description: item.content ? item.content.replace(/<[^>]+>/g, '').substring(0, 150) : '',
            content: item.content,
            image_url: safeGet(item, 'image_url', 'https://picsum.photos/400/250?random=api'),
            kategori: item.kategori || 'Umum',
            created_at: item.created_at || item.date || '',
            date: item.date || item.created_at || ''
        }));

        // Debug: Log all categories found
        const allCategories = [...new Set(allArticles.map(a => a.kategori).filter(k => k))];
        console.log('All categories from API:', allCategories);
        console.log('Looking for category:', tag);

        // Filter articles by category
        const filteredArticles = allArticles.filter(article => {
            const articleCategory = article.kategori;
            const matches = articleCategory && articleCategory.toLowerCase() === tag.toLowerCase();
            if (matches) {
                console.log('Found matching article:', article.title, 'Category:', articleCategory);
            }
            return matches;
        });

        console.log('Filtered articles count:', filteredArticles.length);

        // Sort by id descending
        filteredArticles.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // Get unique tags for sidebar (from all articles)
        const tags = [...new Set(allArticles.map(a => a.kategori).filter(k => k))];
        console.log('Available tags for sidebar:', tags);

        // Update page title
        document.title = `Kategori: ${tag} - Pondok Informatika News`;

        // Render the content
        mainContent.innerHTML = `
            <!-- Tag Results Page -->
            <section class="tag-results py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <h1 class="section-title border-bottom border-danger pb-2 mb-3">
                                        <i class="fas fa-tag text-danger"></i> Kategori: ${tag}
                                    </h1>
                                    <p class="text-muted mb-0">
                                        Menampilkan artikel dengan kategori: "<strong>${tag}</strong>"
                                    </p>
                                </div>
                                <div class="text-end">
                                    <a href="index.html" class="btn btn-outline-primary">
                                        <i class="fas fa-arrow-left me-2"></i>Kembali ke Beranda
                                    </a>
                                </div>
                            </div>

                            <div class="alert alert-info mb-4">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>${filteredArticles.length}</strong> artikel ditemukan dalam kategori ini
                            </div>

                            <div class="row">
                                ${filteredArticles.length > 0 ? filteredArticles.map(article => `
                                <div class="col-md-6 mb-4">
                                    <div class="card news-card h-100 border-0 shadow-sm">
                                        <a href="article.html?id=${article.id}" class="text-decoration-none">
                                            <img src="${article.image_url || 'https://picsum.photos/400/250?random=article'}"
                                                 class="card-img-top" alt="${article.title}">
                                            <div class="card-body">
                                                <h5 class="card-title text-dark fw-bold mb-2">${article.title}</h5>
                                                <span class="badge bg-primary mb-2">${article.kategori || 'Umum'}</span>
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
                                </div>
                                `).join('') : `
                                <div class="col-12">
                                    <div class="text-center py-5">
                                        <i class="fas fa-tag fa-4x text-muted mb-4"></i>
                                        <h4 class="text-muted mb-3">Tidak ada artikel dalam kategori ini</h4>
                                        <p class="text-muted mb-4">Belum ada artikel yang dipublikasikan dalam kategori "${tag}"</p>
                                        <div class="d-flex justify-content-center gap-2">
                                            <a href="index.html" class="btn btn-primary">
                                                <i class="fas fa-home me-2"></i>Kembali ke Beranda
                                            </a>
                                            <button onclick="history.back()" class="btn btn-outline-secondary">
                                                <i class="fas fa-arrow-left me-2"></i>Kembali
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                `}
                            </div>

                            <!-- Other Categories -->
                            ${tags && tags.length > 0 ? `
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="fas fa-tags text-danger me-2"></i>Kategori Lainnya
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="tags">
                                        ${tags.filter(t => t !== tag).slice(0, 10).map(otherTag => `
                                            <a href="tag.html?tag=${encodeURIComponent(otherTag)}" class="badge bg-secondary text-decoration-none me-1 mb-1">
                                                <i class="fas fa-tag me-1"></i>${otherTag}
                                            </a>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </section>
        `;

    } catch (error) {
        console.error('Error loading tag articles:', error);
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Gagal memuat artikel</h4>
                    <p class="text-muted">Terjadi kesalahan saat memuat artikel kategori. Silakan coba lagi nanti.</p>
                    <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    }
});
