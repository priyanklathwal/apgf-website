/**
 * Knowledge Hub - Fetches and displays content from ASEAN Centre for Energy
 * Sections: Articles, Opinion Editorial, Official Documents, Publications
 */

(function() {
    var API_BASE = 'https://aseanenergy.org/search/suggest';

    init();

    function init() {
        fetchArticles();
        fetchOpinionEditorials();
        renderOfficialDocuments();
        fetchPublications();
    }

    // --- Articles ---
    function fetchArticles() {
        var queries = ['asean', 'energy', 'power grid'];
        fetchAndRender(queries, 'article', 'articlesGrid', 'articlesLoading', 6);
    }

    // --- Publications ---
    function fetchPublications() {
        var queries = ['asean', 'energy', 'climate', 'power'];
        fetchAndRender(queries, 'publication', 'publicationsGrid', 'publicationsLoading', 6);
    }

    // --- Opinion Editorial (scraped from page since no API type) ---
    function fetchOpinionEditorials() {
        var opinions = [
            {
                title: 'Energy Security in Transition: ASEAN\'s Path to Strategic Resilience',
                url: 'https://aseanenergy.org/opinion/energy-security-in-transition-aseans-path-to-strategic-resilience',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/opinion_editorial/medium/wide-angle-shot-many-electric-posts-dry-landscape-cloudy-sky-scaled_Avnx9PWeqzeql6B6zOJ3ruCVFIllvrwnvz6ssF8i.webp'
            },
            {
                title: 'Building a Resilient ASEAN Power Grid: A Review to Energy Dispute Settlement Framework',
                url: 'https://aseanenergy.org/opinion/building-a-resilient-asean-power-grid-a-review-to-energy-dispute-settlement-framework',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/opinion_editorial/medium/transmission-tower-scaled_PMKNKqykh2KEPiyBuPWAvXfY1Q7UnRYPFdb60J3y.webp'
            },
            {
                title: 'Why ASEAN\'s Coal Promises Keep Colliding with Reality',
                url: 'https://aseanenergy.org/opinion/why-aseans-coal-promises-keep-colliding-with-reality',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/opinion_editorial/medium/WhatsApp-Image-2025-11-07-at-09_59_43_1b59a686_fBRHzfca9pZoslMRKk8IDGYO38F1FfZAcvePsvp3.webp'
            },
            {
                title: 'Closing the Methane Emissions Gap in ASEAN\'s Oil and Gas Sector',
                url: 'https://aseanenergy.org/opinion/closing-the-methane-emissions-gap-in-aseans-oil-and-gas-sector-why-the-region-needs-a-regional-methane-target',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/opinion_editorial/medium/modern-factory-industrial-zone-blue-sky-scaled_WEaDYGzwJ9uwLkI66oY42avTHhokRP1yvi4KjaY5.webp'
            },
            {
                title: 'Leveraging Blended Finance Schemes for Derisking Energy Transition Investment in ASEAN',
                url: 'https://aseanenergy.org/opinion/leveraging-blended-finance-schemes-for-derisking-energy-transition-investment-in-asean',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/opinion_editorial/medium/coin-wooden-table-scaled_VRLg9dcd4L1BQ8V7O3Yv9d8zZCNXrsXL97FmE8iv.webp'
            },
            {
                title: 'Bringing GEDSI to the Core of ASEAN\'s Energy Blueprint',
                url: 'https://aseanenergy.org/opinion/bringing-gedsi-to-the-core-of-aseans-energy-blueprint',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/opinion_editorial/medium/medium-shot-engineer-wearing-protection-equipment-scaled_IPTHjRjIslWGt4zUXU7pW6d5eECeZ0XJXvAHmwrV.webp'
            }
        ];

        // Try to fetch fresh opinion content, fall back to static data
        fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent('https://aseanenergy.org/opinion'))
            .then(function(res) {
                if (!res.ok) throw new Error('fetch failed');
                return res.text();
            })
            .then(function(html) {
                var parsed = parseOpinionPage(html);
                if (parsed.length >= 3) {
                    renderCards('opinionGrid', parsed.slice(0, 6), 'Opinion');
                } else {
                    renderCards('opinionGrid', opinions.slice(0, 3), 'Opinion');
                }
                hide('opinionLoading');
            })
            .catch(function() {
                renderCards('opinionGrid', opinions.slice(0, 3), 'Opinion');
                hide('opinionLoading');
            });
    }

    function parseOpinionPage(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var items = [];
        var cards = doc.querySelectorAll('a[href*="/opinion/"]');
        var seen = {};
        cards.forEach(function(a) {
            var href = a.getAttribute('href');
            if (!href || href === 'https://aseanenergy.org/opinion' || seen[href]) return;
            // Find closest card-like parent
            var title = '';
            var img = '';
            var h = a.querySelector('h2, h3, h4, p');
            if (h) title = h.textContent.trim();
            if (!title) title = a.textContent.trim();
            if (!title || title.length < 10) return;
            var imgEl = a.querySelector('img');
            if (imgEl) img = imgEl.getAttribute('src') || '';
            seen[href] = true;
            items.push({ title: title, url: href, image: img });
        });
        return items;
    }

    // --- Official Documents (static, rarely changes) ---
    function renderOfficialDocuments() {
        var docs = [
            {
                title: 'ASEAN Plan of Action for Energy Cooperation (APAEC) 2026-2030',
                url: 'https://aseanenergy.org/publications/asean-plan-of-action-for-energy-cooperation-apaec-2026-2030',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/Screenshot-2025-10-13-084548_kVMTXWNinVKsidnmPoQoUQXsX58CPclYtT1TZv0I.webp'
            },
            {
                title: '(2021-2025) ASEAN Plan of Action for Energy Cooperation (APAEC) Phase II',
                url: 'https://aseanenergy.org/publications/asean-plan-of-action-for-energy-cooperation-apaec-phase-ii-2021-2025',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/Screenshot-2020-11-23-at-16_30_03_6Ok3Xy2fnZ0NhoxgaQm7KnpJYDaO55HS965wXJnY.webp'
            },
            {
                title: '(2016-2020) ASEAN Plan of Action for Energy Cooperation (APAEC) Phase I',
                url: 'https://aseanenergy.org/publications/2016-2025-asean-plan-of-action-for-energy-cooperation-apaec',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/thumbnail-2_x7WJLEJgWPEZdwXkuTcJzaX8LdTzSzquJhg6bFF.webp'
            },
            {
                title: '(2010-2015) ASEAN Plan of Action for Energy Cooperation (APAEC)',
                url: 'https://aseanenergy.org/publications/2010-2015-asean-plan-of-action-for-energy-cooperation-apaec',
                image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/APAEC-2010-2015_img_UXeNXDMJBpkMmEGWUyQvzPlEEMzjpuqQ6jwxeSis.webp'
            }
        ];

        var container = document.getElementById('officialDocsGrid');
        var html = '';
        docs.forEach(function(doc) {
            html +=
                '<a href="' + escapeHtml(doc.url) + '" target="_blank" rel="noopener" class="kh-doc-item">' +
                    '<div class="kh-doc-thumb">' +
                        '<img src="' + escapeHtml(doc.image) + '" alt="" loading="lazy">' +
                    '</div>' +
                    '<div class="kh-doc-info">' +
                        '<h3>' + escapeHtml(doc.title) + '</h3>' +
                        '<span class="kh-doc-link">Learn more &rarr;</span>' +
                    '</div>' +
                '</a>';
        });
        container.innerHTML = html;
    }

    // --- Generic fetch + render for API-powered sections ---
    function fetchAndRender(queries, type, gridId, loadingId, maxItems) {
        var promises = queries.map(function(q) {
            var url = API_BASE + '?q=' + encodeURIComponent(q) + '&type=' + encodeURIComponent(type);
            return fetch(url)
                .then(function(res) { return res.json(); })
                .then(function(data) {
                    return (data.success && data.results) ? data.results : [];
                })
                .catch(function() { return []; });
        });

        Promise.all(promises).then(function(resultsArray) {
            var seen = {};
            var items = [];
            resultsArray.forEach(function(results) {
                results.forEach(function(item) {
                    if (!seen[item.id]) {
                        seen[item.id] = true;
                        items.push({
                            title: item.title,
                            url: item.url,
                            image: item.featured_image_thumbnail || item.image || ''
                        });
                    }
                });
            });

            var label = type === 'publication' ? 'Publication' : 'Article';
            renderCards(gridId, items.slice(0, maxItems), label);
            hide(loadingId);
        });
    }

    // --- Render card grid ---
    function renderCards(gridId, items, typeLabel) {
        var container = document.getElementById(gridId);
        if (!items || items.length === 0) {
            container.innerHTML = '<p class="knowledge-empty">No resources found.</p>';
            return;
        }

        var html = '';
        items.forEach(function(item) {
            html +=
                '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener" class="kh-card">' +
                    '<div class="kh-card-image">' +
                        (item.image ? '<img src="' + escapeHtml(item.image) + '" alt="" loading="lazy">' : '<div class="kh-card-placeholder"></div>') +
                    '</div>' +
                    '<div class="kh-card-body">' +
                        '<h3>' + escapeHtml(item.title) + '</h3>' +
                        '<span class="kh-card-tag">' + typeLabel + '</span>' +
                    '</div>' +
                '</a>';
        });

        container.innerHTML = html;
    }

    function hide(id) {
        var el = document.getElementById(id);
        if (el) el.style.display = 'none';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
})();
