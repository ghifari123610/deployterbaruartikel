// Search page JavaScript for handling search queries and displaying results

document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.getElementById('main-content');
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (!query || !query.trim()) {
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>Masukkan kata kunci pencarian</h4>
                    <p class="text-muted">Silakan masukkan kata kunci untuk mencari artikel.</p>
                    <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
        return;
    }

    try {
        const startTime = Date.now();

        // Fetch articles from API
        const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        let articles = data.data || [];

        // Use the advanced search engine
        const searchEngine = new SearchEngine();
        const searchResults = searchEngine.search(query, articles);
        const endTime = Date.now();
        const searchTime = endTime - startTime;

        // Get unique tags
        const tags = [...new Set(articles.map(a => a.kategori).filter(k => k))];

        // Update page title
        document.title = `Hasil Pencarian: ${query} - Pondok Informatika News`;

        // Render search results
        mainContent.innerHTML = `
            <!-- Search Results Page -->
            <section class="search-results py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <h1 class="section-title border-bottom border-danger pb-2 mb-3">
                                        <i class="fas fa-search text-danger"></i> Hasil Pencarian
                                    </h1>
                                    <p class="text-muted mb-0">
                                        Menampilkan hasil pencarian untuk: "<strong>${query}</strong>"
                                    </p>
                                </div>
                                <div class="text-end">
                                    <a href="index.html" class="btn btn-outline-primary">
                                        <i class="fas fa-arrow-left me-2"></i>Kembali ke Beranda
                                    </a>
                                </div>
                            </div>

                            ${searchResults.totalResults !== undefined ? `
                            <div class="alert alert-info mb-4">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <i class="fas fa-info-circle me-2"></i>
                                        <strong>${searchResults.totalResults}</strong> hasil ditemukan
                                    </div>
                                    <small class="text-muted">
                                        <i class="fas fa-clock me-1"></i>Pencarian dalam ${searchTime}ms
                                    </small>
                                </div>
                            </div>
                            ` : ''}

                            ${searchResults.suggestions && searchResults.suggestions.length > 0 ? `
                            <div class="alert alert-warning mb-4">
                                <i class="fas fa-lightbulb me-2"></i>
                                <strong>Mungkin maksud Anda:</strong>
                                ${searchResults.suggestions.slice(0, 5).map(suggestion => `
                                    <a href="search.html?q=${encodeURIComponent(suggestion)}" class="badge bg-warning text-dark me-1 mb-1">
                                        <i class="fas fa-search me-1"></i>${suggestion}
                                    </a>
                                `).join('')}
                            </div>
                            ` : ''}

                            <div class="row">
                                ${searchResults.results && searchResults.results.length > 0 ? searchResults.results.map(article => `
                                <div class="col-md-6 mb-4">
                                    <div class="card news-card h-100 border-0 shadow-sm">
                                        <a href="article.html?id=${article.id}" class="text-decoration-none">
                                            <img src="${article.image_url || 'https://via.placeholder.com/400x250/DC3545/FFFFFF?text=News'}"
                                                 class="card-img-top" alt="${article.title}">
                                            <div class="card-body">
                                                <div class="d-flex justify-content-between align-items-start mb-2">
                                                    <span class="badge bg-primary">${article.kategori || article.kategori || 'Umum'}</span>
                                                    ${article.searchScore ? `
                                                    <span class="badge bg-success">
                                                        <i class="fas fa-star me-1"></i>${Math.round(article.searchScore)}
                                                    </span>
                                                    ` : ''}
                                                </div>
                                                <h5 class="card-title text-dark fw-bold">${article.title}</h5>
                                                <p class="card-text text-muted">
                                                    ${article.description ? article.description.substring(0, 120) + '...' : 'Baca selengkapnya...'}
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
                                        <i class="fas fa-search fa-4x text-muted mb-4"></i>
                                        <h4 class="text-muted mb-3">Tidak ada artikel ditemukan</h4>
                                        <p class="text-muted mb-4">Coba gunakan kata kunci yang berbeda atau periksa ejaan Anda</p>
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

                            <!-- Search Tips -->
                            ${searchResults.results && searchResults.results.length === 0 ? `
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="fas fa-lightbulb text-warning me-2"></i>Tips Pencarian
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h6><i class="fas fa-check text-success me-2"></i>Cara yang Benar:</h6>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-dot-circle text-primary me-2"></i>Gunakan kata kunci spesifik</li>
                                                <li><i class="fas fa-dot-circle text-primary me-2"></i>Coba sinonim kata</li>
                                                <li><i class="fas fa-dot-circle text-primary me-2"></i>Gunakan kata dalam bahasa Indonesia</li>
                                            </ul>
                                        </div>
                                        <div class="col-md-6">
                                            <h6><i class="fas fa-times text-danger me-2"></i>Hindari:</h6>
                                            <ul class="list-unstyled">
                                                <li><i class="fas fa-times-circle text-danger me-2"></i>Kata yang terlalu umum</li>
                                                <li><i class="fas fa-times-circle text-danger me-2"></i>Ejaan yang salah</li>
                                                <li><i class="fas fa-times-circle text-danger me-2"></i>Simbol atau karakter khusus</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ` : ''}

                            <!-- Popular Tags -->
                            ${tags && tags.length > 0 ? `
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="fas fa-tags text-danger me-2"></i>Cari Berdasarkan Tagline
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <div class="tags">
                                        ${tags.slice(0, 10).map(tag => `
                                            <a href="tag.html?tag=${encodeURIComponent(tag)}" class="badge bg-secondary text-decoration-none me-1 mb-1">
                                                <i class="fas fa-tag me-1"></i>${tag}
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
        console.error('Error performing search:', error);
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Gagal melakukan pencarian</h4>
                    <p class="text-muted">Terjadi kesalahan saat melakukan pencarian artikel. Silakan coba lagi nanti.</p>
                    <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    }
});
