// Old Articles page JavaScript for displaying archived articles

document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.getElementById('main-content');
    const articlesPerPage = 10;
    let currentPage = 1;
    let articles = [];
    let tags = [];

    function renderArticlesPage(page) {
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = page * articlesPerPage;
        const paginatedArticles = articles.slice(startIndex, endIndex);

        let articlesHtml = '';
        if (paginatedArticles.length > 0) {
            paginatedArticles.forEach(article => {
                articlesHtml += `
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
                `;
            });
        } else {
            articlesHtml = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-archive fa-4x text-muted mb-4"></i>
                    <h4 class="text-muted mb-3">Belum ada artikel dalam arsip</h4>
                    <p class="text-muted mb-4">Arsip artikel akan muncul ketika ada artikel yang lebih lama</p>
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
            `;
        }

        const totalPages = Math.ceil(articles.length / articlesPerPage);

        mainContent.innerHTML = `
            <!-- Old Articles Page -->
            <section class="old-articles py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <h1 class="section-title border-bottom border-danger pb-2 mb-3">
                                        <i class="fas fa-history text-danger"></i> Berita Lama
                                    </h1>
                                    <p class="text-muted mb-0">
                                        Arsip artikel lama dari Pondok Informatika News
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
                                <strong>${articles.length}</strong> artikel tersedia dalam arsip
                            </div>

                            <div class="row">
                                ${articlesHtml}
                            </div>

                            <nav aria-label="Page navigation example" class="mt-4">
                                <ul class="pagination justify-content-center">
                                    <li class="page-item ${page === 1 ? 'disabled' : ''}">
                                        <a class="page-link" href="#" id="prev-page" tabindex="-1">Sebelumnya</a>
                                    </li>
                                    ${Array.from({ length: totalPages }, (_, i) => `
                                        <li class="page-item ${page === i + 1 ? 'active' : ''}">
                                            <a class="page-link page-number" href="#" data-page="${i + 1}">${i + 1}</a>
                                        </li>
                                    `).join('')}
                                    <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                                        <a class="page-link" href="#" id="next-page">Berikutnya</a>
                                    </li>
                                </ul>
                            </nav>

                            <!-- Archive Info -->
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="fas fa-info-circle text-info me-2"></i>Tentang Arsip
                                    </h5>
                                </div>
                                <div class="card-body">
                                    <p class="mb-0">
                                        Halaman ini menampilkan semua artikel yang tersedia dalam database kami,
                                        diurutkan dari artikel tertua ke terbaru. Artikel-artikel ini merupakan
                                        bagian dari arsip berita Pondok Informatika News.
                                    </p>
                                </div>
                            </div>

                            <!-- Popular Tags -->
                            ${tags && tags.length > 0 ? `
                            <div class="card mt-4">
                                <div class="card-header">
                                    <h5 class="mb-0">
                                        <i class="fas fa-tags text-danger me-2"></i>Cari Berdasarkan Kategori
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

        // Pagination event listeners
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        const pageNumberLinks = document.querySelectorAll('.page-number');

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    renderArticlesPage(currentPage);
                }
            });
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    renderArticlesPage(currentPage);
                }
            });
        }

        pageNumberLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page && page !== currentPage) {
                    currentPage = page;
                    renderArticlesPage(currentPage);
                }
            });
        });
    }

    try {
        // Fetch articles from API
        const response = await fetch('https://santri.pondokinformatika.id/api/get/news');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        articles = data.data || [];

        // Sort articles by id ascending (oldest first)
        articles.sort((a, b) => parseInt(a.id) - parseInt(b.id));

        // Get unique tags
        tags = [...new Set(articles.map(a => a.kategori).filter(k => k))];

        // Update page title
        document.title = 'Berita Lama - Pondok Informatika News';

        // Render first page
        renderArticlesPage(currentPage);

    } catch (error) {
        console.error('Error loading old articles:', error);
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Gagal memuat berita lama</h4>
                    <p class="text-muted">Terjadi kesalahan saat memuat arsip artikel. Silakan coba lagi nanti.</p>
                    <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    }
});
