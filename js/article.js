// Article page JavaScript for loading and displaying individual articles

document.addEventListener('DOMContentLoaded', async function() {
    const mainContent = document.getElementById('main-content');
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>ID Artikel tidak ditemukan</h4>
                    <p class="text-muted">Artikel yang Anda cari tidak dapat ditemukan.</p>
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
        const articles = data.data || [];
        const article = articles.find(a => a.id == articleId);

        if (!article) {
            mainContent.innerHTML = `
                <div class="container py-4">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h4>Artikel tidak ditemukan</h4>
                        <p class="text-muted">Artikel yang Anda cari tidak dapat ditemukan di database kami.</p>
                        <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                    </div>
                </div>
            `;
            return;
        }

        // Clean HTML tags from content
        let cleanContent = article.content || article.description || 'Konten artikel tidak tersedia.';
        cleanContent = cleanContent
            .replace(/<\/?[^>]+(>|$)/g, "")
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&ldquo;/g, '"')
            .replace(/&rdquo;/g, '"')
            .replace(/&lsquo;/g, "'")
            .replace(/&rsquo;/g, "'")
            .replace(/&mdash;/g, '-')
            .replace(/&ndash;/g, '-')
            .replace(/\s+/g, ' ')
            .trim();

        // Shuffle articles for random display
        const shuffledArticles = [...articles]
            .filter(a => a.id != articleId) // Exclude current article
            .sort(() => Math.random() - 0.5); // Random shuffle

        // Update page title and meta
        document.title = article.title + ' - Pondok Informatika News';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', cleanContent.substring(0, 200) + '...');
        }

        // Render the article
        mainContent.innerHTML = `
            <section class="article-detail py-4">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8">
                            <article>
                                <!-- Gambar besar di atas -->
                                <div class="mb-4">
                                    ${article.image_url ? `
                                    <img src="${article.image_url}" alt="${article.title}" class="img-fluid rounded w-100" style="height: 400px; object-fit: cover;">
                                    ` : ''}
                                </div>

                                <!-- Judul artikel di bawah gambar -->
                                <h1 class="fw-bold mb-3" style="font-size: 2.5rem; line-height: 1.2;">${article.title}</h1>

                                <!-- Metadata -->
                                <div class="d-flex align-items-center mb-4 flex-wrap">
                                    <span class="badge bg-primary me-3 mb-2">${article.kategori || 'Umum'}</span>
                                    <p class="text-muted mb-0 me-4">
                                        <i class="far fa-clock"></i> ${article.created_at || article.date || 'Hari ini'}
                                    </p>
                                    <p class="text-muted mb-0">
                                        <i class="fas fa-user"></i> Di tulis oleh: ${article.nama_lengkap_santri || article.author || 'Admin'}
                                    </p>
                                </div>

                                <!-- Konten artikel -->
                                <div class="article-content">
                                    ${cleanContent}
                                </div>
                            </article>
                        </div>
                        <div class="col-lg-4">
                            <aside class="related-articles">
                                <h5 class="border-bottom border-danger pb-2 mb-3">Artikel Lainnya</h5>
                                <ul class="list-unstyled">
                                    <li class="mb-3">
                                        <a href="index.html" class="text-decoration-none">Kembali ke Beranda</a>
                                    </li>
                                </ul>
                                <ul class="list-unstyled">
                                    ${shuffledArticles.slice(0, 8).map(relArticle => `
                                        <li class="mb-3">
                                            <a href="article.html?id=${relArticle.id}" class="text-decoration-none d-flex align-items-start">
                                                <img src="${relArticle.image_url || 'https://via.placeholder.com/80x60'}" class="img-fluid rounded me-3 flex-shrink-0" alt="${relArticle.title}" style="width: 80px; height: 60px; object-fit: cover;">
                                                <div>
                                                    <h6 class="mb-1 text-dark fw-bold" style="font-size: 0.9rem; line-height: 1.3;">${relArticle.title}</h6>
                                                </div>
                                            </a>
                                        </li>
                                    `).join('')}
                                </ul>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        `;

    } catch (error) {
        console.error('Error loading article:', error);
        mainContent.innerHTML = `
            <div class="container py-4">
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4>Gagal memuat artikel</h4>
                    <p class="text-muted">Terjadi kesalahan saat memuat artikel. Silakan coba lagi nanti.</p>
                    <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
                </div>
            </div>
        `;
    }
});
