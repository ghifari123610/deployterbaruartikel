// Advanced Search Engine for Pondok Informatika News (Browser Version)
// Implements comprehensive search logic with relevance ranking

class SearchEngine {
    constructor() {
        this.articles = [];
    }

    // Main search function
    search(query, articles) {
        if (!query || !query.trim()) {
            return { results: [], suggestions: [], totalResults: 0 };
        }

        this.articles = articles || [];
        const searchQuery = query.toLowerCase().trim();
        const searchWords = searchQuery.split(/\s+/).filter(Boolean);

        // Score articles based on multiple relevance factors
        const scoredArticles = this.articles.map(article => {
            const title = (article.title || '').toLowerCase();
            const description = (article.description || '').toLowerCase();
            let score = 0;
            let matchDetails = [];

            // 1. Exact phrase match in title (highest priority)
            if (title.includes(searchQuery)) {
                score += 100;
                matchDetails.push('exact_phrase_title');
            }

            // 2. All search words present in title
            if (searchWords.every(word => title.includes(word))) {
                score += 50;
                if (!matchDetails.includes('exact_phrase_title')) {
                    matchDetails.push('all_words_title');
                }
            }

            // 3. Partial word matches in title
            const titleMatches = searchWords.filter(word => title.includes(word)).length;
            if (titleMatches > 0) {
                score += titleMatches * 10;
                if (matchDetails.length === 0) {
                    matchDetails.push('partial_title');
                }
            }

            // 4. Matches in description (lower weight)
            const descMatches = searchWords.filter(word => description.includes(word)).length;
            if (descMatches > 0) {
                score += descMatches * 3;
                if (matchDetails.length === 0) {
                    matchDetails.push('description');
                }
            }

            // 5. Recency boost (recent articles get higher ranking)
            const articleDate = new Date(article.created_at || article.date || '2000-01-01');
            const daysSincePublished = (new Date() - articleDate) / (1000 * 60 * 60 * 24);
            if (daysSincePublished < 1) score += 30; // Less than 1 day
            else if (daysSincePublished < 7) score += 20; // Less than 1 week
            else if (daysSincePublished < 30) score += 10; // Less than 1 month

            // 6. Word frequency boost
            const totalMatches = titleMatches + descMatches;
            score += totalMatches * 2;

            return {
                ...article,
                searchScore: score,
                matchDetails: matchDetails,
                relevanceScore: score
            };
        });

        // Filter articles with minimum relevance and sort by score
        const filteredArticles = scoredArticles
            .filter(article => article.searchScore > 0)
            .sort((a, b) => {
                // Primary sort: relevance score
                if (b.searchScore !== a.searchScore) {
                    return b.searchScore - a.searchScore;
                }
                // Secondary sort: recency (newer articles first)
                return parseInt(b.id) - parseInt(a.id);
            });

        // Generate search suggestions if no results
        let suggestions = [];
        if (filteredArticles.length === 0) {
            suggestions = this.generateSuggestions(searchWords);
        }

        return {
            results: filteredArticles,
            suggestions: suggestions,
            totalResults: filteredArticles.length,
            searchTime: Date.now()
        };
    }

    // Generate search suggestions when no results found
    generateSuggestions(searchWords) {
        const allWords = this.articles.flatMap(article =>
            (article.title + ' ' + (article.description || '')).toLowerCase().split(/\s+/)
        );
        const uniqueWords = [...new Set(allWords)];

        return uniqueWords
            .filter(word => word.length > 3 && searchWords.some(searchWord =>
                word.includes(searchWord) || searchWord.includes(word) ||
                this.calculateSimilarity(word, searchWord) > 0.6
            ))
            .slice(0, 8);
    }

    // Simple string similarity calculation
    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;

        if (longer.length === 0) return 1.0;

        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    // Levenshtein distance calculation
    levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    // Search with category filtering
    searchWithCategory(query, category, articles) {
        const allResults = this.search(query, articles);

        if (!category) {
            return allResults;
        }

        const filteredResults = allResults.results.filter(article =>
            article.kategori === category
        );

        return {
            ...allResults,
            results: filteredResults,
            totalResults: filteredResults.length
        };
    }
}

// Make it available globally
window.SearchEngine = SearchEngine;
