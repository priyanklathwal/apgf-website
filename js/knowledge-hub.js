/**
 * Knowledge Hub - Displays content from ASEAN Centre for Energy
 * Uses CORS proxy to fetch live data, with static fallback for reliability.
 */

(function() {
    var PROXY = 'https://api.allorigins.win/raw?url=';
    var API_BASE = 'https://aseanenergy.org/search/suggest';

    // --- Static fallback data (sourced from ACE, Jan 2026) ---

    var FALLBACK_ARTICLES = [
        {
            title: 'Stakeholder Consultation Webinar to Develop the Regional Roadmap for Passive Cooling in ASEAN',
            url: 'https://aseanenergy.org/articles/stakeholder-consultation-webinar-to-develop-the-regional-roadmap-for-passive-cooling-in-asean',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/article/medium/Screenshot_2026-01-20_094053_9TVq6UiX89vO3ptkyYhRKX0SoJjyeXgO81bQzvOf.webp'
        },
        {
            title: 'Business Model Options for Financing Transmission Infrastructure Resilience in ASEAN',
            url: 'https://aseanenergy.org/blogs/business-model-options-for-financing-transmission-infrastructure-resilience-in-asean',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/blog_post/medium/93293_ZuGa5vvIgFFzzZhvmvkAsZmV5KfFe2VHuywr2Eg4.webp'
        },
        {
            title: 'Beyond Electricity: The Socioeconomic Side of the ASEAN Power Grid',
            url: 'https://aseanenergy.org/blogs/beyond-electricity-the-socioeconomic-side-of-the-asean-power-grid',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/blog_post/medium/18252_ObWPG4jYS53dpStj8T8gO8m5QHIRY3KFerMdm2E6.webp'
        },
        {
            title: 'Centring People in the ASEAN Power Grid (APG)',
            url: 'https://aseanenergy.org/blogs/centring-people-in-the-asean-power-grid-apg',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/blog_post/medium/16594_ikUJAGuGTj8L3gVShfRutgKf6GoQAhLfVb9xtDcr.webp'
        },
        {
            title: 'ASEAN Centre for Energy Signs the ACE Inclusivity Pledge',
            url: 'https://aseanenergy.org/articles/asean-centre-for-energy-signs-the-ace-inclusivity-pledge-aligning-aseans-inclusive-energy-agenda-with-aces-organisational-culture',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/article/medium/Screenshot_2026-01-13_094928_KJGRERZhWGzo6kQFPy0xgfGt9M5jbJHe9qwciZud.webp'
        },
        {
            title: 'High-Level Consultative Meeting with the Ministry of Energy Transition and Water Transformation of Malaysia',
            url: 'https://aseanenergy.org/articles/high-level-consultative-meeting-with-the-ministry-of-energy-transition-and-water-transformation-of-malaysia',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/article/medium/Screenshot_2026-01-20_094053_9TVq6UiX89vO3ptkyYhRKX0SoJjyeXgO81bQzvOf.webp'
        }
    ];

    var FALLBACK_OPINIONS = [
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
        }
    ];

    var FALLBACK_PUBLICATIONS = [
        {
            title: 'Fostering the Cleantech Innovation and Entrepreneurship Ecosystem in ASEAN: Key Policy Analysis',
            url: 'https://aseanenergy.org/publications/fostering-the-cleantech-innovation-and-entrepreneurship-ecosystem-in-asean',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/Screenshot-2025-10-13-084548_kVMTXWNinVKsidnmPoQoUQXsX58CPclYtT1TZv0I.webp'
        },
        {
            title: 'Learning from the Iberian Peninsula Blackout: Importance of Emergency Information Exchange for APG',
            url: 'https://aseanenergy.org/publications/learning-from-the-iberian-peninsula-blackout',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/Screenshot-2020-11-23-at-16_30_03_6Ok3Xy2fnZ0NhoxgaQm7KnpJYDaO55HS965wXJnY.webp'
        },
        {
            title: 'Powering ASEAN Smart Cities: Energy as the Backbone of Urban Innovation',
            url: 'https://aseanenergy.org/publications/powering-asean-smart-cities-energy-as-the-backbone-of-urban-innovation',
            image: 'https://storage.googleapis.com/aceweb-bucket-261225/images/publication/medium/thumbnail-2_x7WJLEJgWPEZdwXkuTcJzaX8LdTzSzquJhg6bFF.webp'
        }
    ];

    var OFFICIAL_DOCS = [
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

    init();

    function init() {
        renderSection('article', 'articlesGrid', 'articlesLoading', FALLBACK_ARTICLES, 'Articles');
        renderSection('opinion', 'opinionGrid', 'opinionLoading', FALLBACK_OPINIONS, 'Opinion');
        renderOfficialDocuments();
        renderSection('publication', 'publicationsGrid', 'publicationsLoading', FALLBACK_PUBLICATIONS, 'Publications');
    }

    function renderSection(type, gridId, loadingId, fallback, label) {
        var queries = ['asean', 'energy', 'power grid'];
        var promises = queries.map(function(q) {
            var apiUrl = API_BASE + '?q=' + encodeURIComponent(q) + '&type=' + encodeURIComponent(type);
            var url = PROXY + encodeURIComponent(apiUrl);
            return fetch(url, { signal: AbortSignal.timeout(5000) })
                .then(function(res) {
                    if (!res.ok) throw new Error('not ok');
                    return res.json();
                })
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

            if (items.length >= 3) {
                renderCards(gridId, items.slice(0, 6), label);
            } else {
                renderCards(gridId, fallback, label);
            }
            hide(loadingId);
        });
    }

    function renderOfficialDocuments() {
        var container = document.getElementById('officialDocsGrid');
        var html = '';
        OFFICIAL_DOCS.forEach(function(doc) {
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
