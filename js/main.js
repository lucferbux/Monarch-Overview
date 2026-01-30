/**
 * Monarch Overview - Interactive Features
 * Vanilla JavaScript for GitHub Pages compatibility
 */

(function() {
    'use strict';

    // ============================================
    // Scroll Animation Observer
    // ============================================
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Check if this is a metric card for counter animation
                const metricValue = entry.target.querySelector('.metric-value[data-target]');
                if (metricValue && !metricValue.classList.contains('counted')) {
                    animateCounter(metricValue);
                    metricValue.classList.add('counted');
                }
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(el => {
            animationObserver.observe(el);
        });
    }

    // ============================================
    // Counter Animation
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        const easeOutQuad = t => t * (2 - t);

        let frame = 0;
        const startValue = 0;
        const counter = setInterval(() => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames);
            const currentValue = Math.round(startValue + (target - startValue) * progress);

            element.textContent = currentValue;

            if (frame === totalFrames) {
                clearInterval(counter);
                element.textContent = target;
            }
        }, frameDuration);
    }

    // ============================================
    // Smooth Scroll Navigation (Sidebar)
    // ============================================
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        const mastheadHeight = 72; // Match CSS --masthead-height

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const targetPosition = targetElement.offsetTop - mastheadHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Sidebar Scroll Spy - Active Link Highlight
    // ============================================
    function initSidebarScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const mastheadHeight = 72;

        // Create a map of section IDs to their sidebar links
        const linkMap = new Map();
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                linkMap.set(href.substring(1), link);
            }
        });

        function updateActiveLink() {
            const scrollPosition = window.scrollY + mastheadHeight + 100;

            let currentSection = null;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            // Update active states
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
            });

            if (currentSection && linkMap.has(currentSection)) {
                linkMap.get(currentSection).classList.add('active');
            }
        }

        // Throttle scroll events
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveLink();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initialize on load
        updateActiveLink();
    }

    // ============================================
    // Architecture Module Tooltips
    // ============================================
    function initTooltips() {
        const modules = document.querySelectorAll('.arch-module[data-tooltip]');

        modules.forEach(module => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = module.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(-8px);
                background: #151515;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s, visibility 0.2s;
                z-index: 1000;
                pointer-events: none;
            `;

            module.style.position = 'relative';
            module.appendChild(tooltip);

            module.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });

            module.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
    }

    // ============================================
    // Timeline Animation Enhancement
    // ============================================
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');

        timelineItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    // ============================================
    // Card Hover Effects
    // ============================================
    function initCardEffects() {
        const cards = document.querySelectorAll('.about-card, .kubeflow-card, .integration-card, .initiative-card, .value-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ============================================
    // Lazy Load Images
    // ============================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // Sidebar Toggle (Desktop & Mobile)
    // ============================================
    function initSidebarToggle() {
        const toggleBtn = document.querySelector('.sidebar-toggle');
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');

        if (!toggleBtn || !sidebar) return;

        // Track sidebar state
        let isCollapsed = false;

        toggleBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;

            // Toggle collapsed class on sidebar
            sidebar.classList.toggle('collapsed', isCollapsed);

            // Toggle class on main content for layout adjustment
            if (mainContent) {
                mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
            }

            // Update aria-expanded
            toggleBtn.setAttribute('aria-expanded', !isCollapsed);
        });

        // Handle mobile overlay for when sidebar is expanded on mobile
        const mastheadHeight = 72;

        // Add mobile-specific styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 992px) {
                .sidebar:not(.collapsed) {
                    display: block !important;
                    transform: translateX(0) !important;
                    position: fixed;
                    top: ${mastheadHeight}px;
                    left: 0;
                    bottom: 0;
                    width: 300px;
                    z-index: 1000;
                    box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
                }
                .sidebar.collapsed {
                    display: none !important;
                }
                .sidebar-overlay.visible {
                    position: fixed;
                    top: ${mastheadHeight}px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.3);
                    z-index: 999;
                }
            }
        `;
        document.head.appendChild(style);

        // Create overlay for mobile
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        // On mobile, clicking overlay closes sidebar
        overlay.addEventListener('click', () => {
            if (window.innerWidth <= 992 && !isCollapsed) {
                isCollapsed = true;
                sidebar.classList.add('collapsed');
                if (mainContent) mainContent.classList.add('sidebar-collapsed');
                toggleBtn.setAttribute('aria-expanded', 'false');
                overlay.classList.remove('visible');
            }
        });

        // Show/hide overlay on mobile based on sidebar state
        function updateOverlay() {
            if (window.innerWidth <= 992) {
                overlay.classList.toggle('visible', !isCollapsed);
            } else {
                overlay.classList.remove('visible');
            }
        }

        toggleBtn.addEventListener('click', updateOverlay);
        window.addEventListener('resize', updateOverlay);

        // Close sidebar when clicking a link on mobile
        sidebar.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992 && !isCollapsed) {
                    isCollapsed = true;
                    sidebar.classList.add('collapsed');
                    if (mainContent) mainContent.classList.add('sidebar-collapsed');
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    overlay.classList.remove('visible');
                }
            });
        });

        // On mobile, start with sidebar collapsed
        if (window.innerWidth <= 992) {
            isCollapsed = true;
            sidebar.classList.add('collapsed');
            if (mainContent) mainContent.classList.add('sidebar-collapsed');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        initScrollAnimations();
        initSmoothScroll();
        initSidebarScrollSpy();
        initTooltips();
        initTimelineAnimation();
        initCardEffects();
        initLazyLoading();
        initSidebarToggle();

        // Log initialization
        console.log('Monarch Overview initialized');
    }

    // Start
    init();

})();
