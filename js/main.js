/**
 * APGF Website - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = navLinks.classList.contains('active')
                    ? index === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : index === 1 ? 'opacity: 0'
                    : 'rotate(-45deg) translate(5px, -5px)'
                    : '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to header
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            }
        });
    }

    // News Ticker - Fetch from ASEAN.org RSS feed
    const tickerContainer = document.getElementById('tickerItems');
    if (tickerContainer) {
        fetchTickerNews();
    }
});

function fetchTickerNews() {
    const RSS_URL = 'https://asean.org/feed/';
    const PROXY_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(RSS_URL);
    const tickerContainer = document.getElementById('tickerItems');

    fetch(PROXY_URL)
        .then(function(response) {
            if (!response.ok) throw new Error('Network error');
            return response.text();
        })
        .then(function(xmlText) {
            var parser = new DOMParser();
            var xml = parser.parseFromString(xmlText, 'text/xml');
            var items = xml.querySelectorAll('item');
            var headlines = [];

            items.forEach(function(item, index) {
                if (index >= 15) return;
                var title = item.querySelector('title') ? item.querySelector('title').textContent : '';
                var link = item.querySelector('link') ? item.querySelector('link').textContent : '#';
                if (title) {
                    headlines.push({ title: title, link: link });
                }
            });

            if (headlines.length > 0) {
                renderTicker(headlines);
            } else {
                renderFallbackTicker();
            }
        })
        .catch(function() {
            renderFallbackTicker();
        });
}

function renderTicker(headlines) {
    var tickerContainer = document.getElementById('tickerItems');
    var html = '';

    // Duplicate headlines for seamless infinite scroll
    for (var round = 0; round < 2; round++) {
        headlines.forEach(function(item, index) {
            html += '<span class="news-ticker-item">';
            if (index > 0 || round > 0) {
                html += '<span class="news-ticker-dot"></span>';
            }
            html += '<a href="' + item.link + '" target="_blank" rel="noopener">' + item.title + '</a>';
            html += '</span>';
        });
    }

    tickerContainer.innerHTML = html;
}

function renderFallbackTicker() {
    var fallback = [
        { title: 'ASEAN Power Grid targets full integration by 2045', link: '#' },
        { title: '17.6 GW cross-border capacity goal set for 2040', link: '#' },
        { title: 'APGF launched at 42nd ASEAN Ministers on Energy Meeting', link: '#' },
        { title: 'USD 800 billion in potential savings from energy integration', link: '#' },
        { title: 'PACE partnership brings together multilateral banks and private financiers', link: '#' },
        { title: '10 ASEAN Member States working towards shared energy future', link: '#' }
    ];
    renderTicker(fallback);
}
