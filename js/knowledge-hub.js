/**
 * Knowledge Hub - Fetches and displays content from ASEAN Centre for Energy
 * Source: https://aseanenergy.org/search/suggest API
 */

(function() {
    var API_BASE = 'https://aseanenergy.org/search/suggest';
    var allResources = [];
    var currentFilter = 'all';

    // Search queries to get a broad range of content
    var queries = [
        { q: 'asean', type: 'publication' },
        { q: 'energy', type: 'publication' },
        { q: 'power', type: 'publication' },
        { q: 'asean', type: 'article' },
        { q: 'energy', type: 'article' },
        { q: 'power', type: 'article' },
        { q: 'grid', type: 'article' },
        { q: 'climate', type: 'publication' }
    ];

    init();

    function init() {
        setupFilters();
        fetchAllContent();
    }

    function setupFilters() {
        var filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                filterBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderResources();
            });
        });
    }

    function fetchAllContent() {
        var promises = queries.map(function(query) {
            var url = API_BASE + '?q=' + encodeURIComponent(query.q) + '&type=' + encodeURIComponent(query.type);
            return fetch(url)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    if (data.success && data.results) {
                        return data.results;
                    }
                    return [];
                })
                .catch(function() { return []; });
        });

        Promise.all(promises).then(function(resultsArray) {
            // Flatten and deduplicate by id
            var seen = {};
            resultsArray.forEach(function(results) {
                results.forEach(function(item) {
                    if (!seen[item.id]) {
                        seen[item.id] = true;
                        allResources.push(item);
                    }
                });
            });

            // Sort by date, newest first
            allResources.sort(function(a, b) {
                return new Date(b.created_at) - new Date(a.created_at);
            });

            hideLoading();
            renderResources();
        });
    }

    function hideLoading() {
        var loader = document.getElementById('knowledgeLoading');
        if (loader) loader.style.display = 'none';
    }

    function renderResources() {
        var filtered = currentFilter === 'all'
            ? allResources
            : allResources.filter(function(r) { return r.type === currentFilter; });

        renderFeatured(filtered[0]);
        renderGrid(filtered.slice(1));
    }

    function renderFeatured(item) {
        var container = document.getElementById('featuredResource');
        if (!item) {
            container.innerHTML = '';
            return;
        }

        var date = formatDate(item.created_at);
        var imgSrc = item.featured_image_thumbnail || item.image || '';
        var typeLabel = item.type === 'publication' ? 'Publication' : 'Article';

        container.innerHTML =
            '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener" class="featured-card">' +
                (imgSrc ? '<div class="featured-card-image"><img src="' + escapeHtml(imgSrc) + '" alt="" loading="lazy"></div>' : '') +
                '<div class="featured-card-content">' +
                    '<span class="resource-type resource-type--' + item.type + '">' + typeLabel + '</span>' +
                    '<h2>' + escapeHtml(item.title) + '</h2>' +
                    '<span class="resource-date">' + date + '</span>' +
                    '<span class="featured-link">Read on ASEAN Centre for Energy &rarr;</span>' +
                '</div>' +
            '</a>';
    }

    function renderGrid(items) {
        var container = document.getElementById('knowledgeGrid');
        if (!items || items.length === 0) {
            container.innerHTML = '<p class="knowledge-empty">No resources found for this category.</p>';
            return;
        }

        var html = '';
        items.forEach(function(item) {
            var date = formatDate(item.created_at);
            var imgSrc = item.featured_image_thumbnail || item.image || '';
            var typeLabel = item.type === 'publication' ? 'Publication' : 'Article';

            html +=
                '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener" class="knowledge-card">' +
                    '<div class="knowledge-card-image">' +
                        (imgSrc ? '<img src="' + escapeHtml(imgSrc) + '" alt="" loading="lazy">' : '<div class="knowledge-card-placeholder"></div>') +
                    '</div>' +
                    '<div class="knowledge-card-body">' +
                        '<span class="resource-type resource-type--' + item.type + '">' + typeLabel + '</span>' +
                        '<h3>' + escapeHtml(item.title) + '</h3>' +
                        '<span class="resource-date">' + date + '</span>' +
                    '</div>' +
                '</a>';
        });

        container.innerHTML = html;
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        var d = new Date(dateStr);
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
})();
