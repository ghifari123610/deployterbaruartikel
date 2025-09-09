// Tag page JavaScript for filtering articles by category

document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.getElementById('main-content');
    const urlParams = new URLSearchParams(window.location.search);
    const tag = urlParams.get('tag');

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
        // Fetch articles from API
        const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        let articles = data.data || [];

        // Filter articles by category
        const filteredArticles = articles.filter(article =>
            article.kategori && article.kategori.toLowerCase() === tag.toLowerCase()
        );

        // Sort by id descending
        filteredArticles.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // Get unique tags for sidebar
        const tags = [...new Set(articles.map(a => a.kategori).filter(k => k))];

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
