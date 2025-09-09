// Index page JavaScript for loading and displaying articles

document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.getElementById('main-content');

    try {
        // Fetch articles from API
        const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        let articles = data.data || [];

        // Sort articles by id descending
        articles.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // Get unique tags
        const tags = [...new Set(articles.map(a => a.kategori).filter(k => k))];

        // Paginate articles for initial page load
        const page = 1;
        const limit = 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedArticles = articles.slice(startIndex, endIndex);

        // Render the content
        mainContent.innerHTML = `
            <!-- Hero Section -->
            <section class="hero-section py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8">
                            ${paginatedArticles.length > 0 ? `
                            <div class="hero-main">
                                <a href="article.html?id=${paginatedArticles[0].id}" class="text-decoration-none">
                                    <div class="card hero-card border-0">
                                        <img src="${paginatedArticles[0].image_url || 'https://via.placeholder.com/800x400/DC3545/FFFFFF?text=Pondok+Informatika'}"
                                             class="card-img-top" alt="${paginatedArticles[0].title}">
                                        <div class="card-body p-0 mt-3">
                                            <span class="badge bg-danger mb-2">HEADLINE</span>
                                            <h1 class="card-title h2 fw-bold text-dark">
                                                ${paginatedArticles[0].title}
                                            </h1>
                                            <p class="card-text text-muted">
                                                ${paginatedArticles[0].description ? paginatedArticles[0].description.substring(0, 150) + '...' : 'Baca selengkapnya...'}
                                            </p>
                                            <small class="text-muted">
                                                <i class="far fa-clock"></i> ${paginatedArticles[0].date || 'Hari ini'}
                                            </small>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            ` : ''}
                        </div>
                        <div class="col-lg-4">
                            <div class="sidebar-news">
                                <h5 class="border-bottom border-danger pb-2 mb-3">Berita Terbaru</h5>
                                ${paginatedArticles.length > 1 ? paginatedArticles.slice(1, 5).map(article => `
                                <div class="mini-news mb-3">
                                    <a href="article.html?id=${article.id}" class="text-decoration-none">
                                        <div class="row g-2">
                                            <div class="col-4">
                                                <img src="${article.image_url || 'https://via.placeholder.com/150x100/6C757D/FFFFFF?text=News'}"
                                                     class="img-fluid rounded" alt="${article.title}">
                                            </div>
                                            <div class="col-8">
                                                <h6 class="mb-1 text-dark fw-bold">${article.title}</h6>
                                                <small class="text-muted">${article.date || 'Hari ini'}</small>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                `).join('') : ''}
                            </div>

                            <!-- Tombol Akses Berita Lama -->
                            <div class="text-center mt-5">
                                <a href="old-articles.html" class="btn btn-outline-primary btn-lg">
                                    <i class="fas fa-history me-2"></i>Lihat Berita Lama
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Main Content -->
            <section class="main-content py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8">
                            <h4 class="section-title border-bottom border-danger pb-2 mb-4">
                                <i class="fas fa-fire text-danger"></i> Berita Populer
                            </h4>

                            <div class="row">
                                ${paginatedArticles.map(article => `
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
                                                        <i class="far fa-clock"></i> ${article.date || 'Hari ini'}
                                                    </small>
                                                    <small class="text-muted">
                                                        <i class="far fa-eye"></i> ${Math.floor(Math.random() * 1000) + 100} views
                                                    </small>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                `).join('')}
                            </div>

                            <!-- Load More Button -->
                            <div id="load-more-container" class="text-center mt-4">
                                <button id="loadMoreBtn" class="btn btn-primary btn-lg">
                                    <i class="fas fa-plus me-2"></i>Muat Lebih Banyak
                                </button>
                            </div>
                        </div>

                        <div class="col-lg-4">
                            <!-- Sidebar -->
                            <div class="sidebar">
                                <!-- Popular Tags -->
                                <div class="widget mb-4">
                                    <h5 class="widget-title border-bottom border-danger pb-2 mb-3">
                                        <i class="fas fa-tags"></i> Kategori
                                    </h5>
                                    <div class="tags">
                                        ${tags.length > 0 ? tags.map(category => `
                                            <a href="tag.html?tag=${encodeURIComponent(category)}" class="badge bg-secondary text-decoration-none me-1 mb-1">${category}</a>
                                        `).join('') : '<span class="text-muted">Tidak ada kategori tersedia</span>'}
                                    </div>
                                </div>

                                <!-- Newsletter -->
                                <div class="widget mb-4">
                                    <h5 class="widget-title border-bottom border-danger pb-2 mb-3">
                                        <i class="fas fa-envelope"></i> Newsletter
                                    </h5>
                                    <p>Dapatkan update berita terbaru langsung ke email Anda</p>
                                    <form class="newsletter-form">
                                        <div class="mb-3">
                                            <input type="email" class="form-control" placeholder="Email Anda" required>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

    } catch (error) {
        console.error('Error loading articles:', error);
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Gagal memuat artikel</h4>
                    <p class="text-muted">Terjadi kesalahan saat memuat artikel. Silakan coba lagi nanti.</p>
                    <a href="index.html" class="btn btn-primary">Muat Ulang</a>
                </div>
            </div>
        `;
    }
});
