/* =========================================================
   SOLACE AT SUNDOWN — Main JavaScript
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // SKELETON LOADING
    // =============================================
    const skeletons = document.querySelectorAll('.skeleton, .skeleton-card');

    const hideSkeletons = () => {
        skeletons.forEach(skeleton => {
            skeleton.classList.add('skeleton-hidden');
        });
    };

    // Hide skeletons when all images are loaded OR after a timeout
    const images = document.querySelectorAll('img');
    let loadedImagesCount = 0;

    if (images.length === 0) {
        hideSkeletons();
    } else {
        images.forEach(img => {
            if (img.complete) {
                loadedImagesCount++;
                if (loadedImagesCount === images.length) hideSkeletons();
            } else {
                img.addEventListener('load', () => {
                    loadedImagesCount++;
                    if (loadedImagesCount === images.length) hideSkeletons();
                });
                img.addEventListener('error', () => {
                    loadedImagesCount++;
                    if (loadedImagesCount === images.length) hideSkeletons();
                });
            }
        });
    }

    // Fallback: hide skeletons after 4s max
    setTimeout(hideSkeletons, 4000);

    // =============================================
    // AOS INITIALIZATION
    // =============================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
        });
    }

    // =============================================
    // SWIPER HERO CAROUSEL
    // =============================================
    const heroSwiperEl = document.querySelector('.hero-swiper');
    if (heroSwiperEl && typeof Swiper !== 'undefined') {
        new Swiper('.hero-swiper', {
            loop: true,
            speed: 1200,
            autoplay: {
                delay: 6000,
                disableOnInteraction: false,
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            on: {
                slideChange: function () {
                    // Re-trigger hero content animations
                    const activeSlide = this.slides[this.activeIndex];
                    if (activeSlide) {
                        const elements = activeSlide.querySelectorAll('.hero-label, .hero-title, .hero-desc, .hero-buttons');
                        elements.forEach(el => {
                            el.style.animation = 'none';
                            el.offsetHeight; // trigger reflow
                            el.style.animation = '';
                        });
                    }
                }
            }
        });
    }

    // =============================================
    // STICKY NAVBAR
    // =============================================
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // =============================================
    // MOBILE MENU
    // =============================================
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        mobileNav.querySelectorAll('.nav-link, .btn').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // =============================================
    // FAQ ACCORDION
    // =============================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(other => {
                    other.classList.remove('active');
                    const otherAnswer = other.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                    }
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // =============================================
    // GALLERY FILTER
    // =============================================
    const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn[data-filter]');
    const galleryItems = document.querySelectorAll('.gallery-item[data-category]');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter items with animation
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // =============================================
    // LIGHTBOX
    // =============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let lightboxIndex = 0;
    let visibleItems = [];

    function updateVisibleItems() {
        visibleItems = Array.from(document.querySelectorAll('.gallery-item[data-category]'))
            .filter(item => item.style.display !== 'none');
    }

    function openLightbox(index) {
        updateVisibleItems();
        if (index < 0 || index >= visibleItems.length) return;
        lightboxIndex = index;
        const img = visibleItems[index].querySelector('img');
        if (img && lightbox && lightboxImage) {
            // Use higher resolution for lightbox
            lightboxImage.src = img.src.replace('w=600', 'w=1200');
            lightboxImage.alt = img.alt;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Gallery item clicks
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const visibleIndex = visibleItems.indexOf(item);
            openLightbox(visibleIndex >= 0 ? visibleIndex : 0);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(lightboxIndex - 1 < 0 ? visibleItems.length - 1 : lightboxIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox((lightboxIndex + 1) % visibleItems.length));

    // Keyboard nav
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
        if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
    });

    // Click outside
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // =============================================
    // SCROLL TO TOP
    // =============================================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }, { passive: true });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // PAGE TRANSITIONS (Removed in favor of Skeleton)
    // =============================================

    // =============================================
    // CONTACT FORM (UI feedback only)
    // =============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Collect form data
            const firstName = document.getElementById('firstName')?.value || '';
            const lastName  = document.getElementById('lastName')?.value  || '';
            const email     = document.getElementById('email')?.value     || '';
            const phone     = document.getElementById('phone')?.value     || '';
            const checkin   = document.getElementById('checkin')?.value   || '';
            const checkout  = document.getElementById('checkout')?.value  || '';
            const guests    = document.getElementById('guests')?.value    || '';
            const pkg       = document.getElementById('package')?.value   || '';
            const message   = document.getElementById('message')?.value   || '';

            // Build booking object
            const booking = {
                id: 'bk_' + Date.now(),
                name: `${firstName} ${lastName}`.trim(),
                email,
                phone,
                dates: checkin && checkout ? `${checkin} → ${checkout}` : checkin || '—',
                guests,
                package: pkg,
                message,
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: 'new'
            };

            // Save to localStorage
            const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));

            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Inquiry Sent!';
                submitBtn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 3000);
            }, 1500);
        });
    }

    // =============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // PARALLAX ON SCROLL (subtle)
    // =============================================
    const parallaxElements = document.querySelectorAll('.page-hero-bg, .cta-banner-bg');
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const rate = scrolled * 0.3;
                el.style.transform = `translateY(${rate}px)`;
            });
        }, { passive: true });
    }

    // =============================================
    // TYPING / COUNTER ANIMATION
    // =============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observerOptions = {
            threshold: 0.5,
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    counterObserver.unobserve(el);
                }
            });
        }, observerOptions);

        statNumbers.forEach(stat => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            stat.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            counterObserver.observe(stat);
        });
    }

    // =============================================
    // REVEAL ON SCROLL (extra refinement)
    // =============================================
    const revealElements = document.querySelectorAll('.service-card, .why-card, .package-card, .commitment-card, .about-value-card, .contact-info-card');
    revealElements.forEach(el => {
        el.style.opacity = el.style.opacity || '';
    });

    // =============================================
    // MOBILE APP NAV ACTIVE STATE
    // =============================================
    const appNavItems = document.querySelectorAll('.app-nav-item');
    if (appNavItems.length > 0) {
        let currentPath = window.location.pathname.split('/').pop() || 'index.html';
        appNavItems.forEach(item => {
            if (item.getAttribute('href') === currentPath) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // =============================================
    // NEW FEATURES: WEATHER & BOOKING
    // =============================================

    // 1. Weather Widget (Mock Shivapuri Weather)
    const weatherInfo = document.getElementById('weatherInfo');
    const weatherWidget = document.getElementById('weatherWidget');

    const updateWeather = () => {
        if (!weatherInfo) return;

        // Realistic Shivapuri weather simulation
        const hours = new Date().getHours();
        let temp = 22;
        let desc = "Clear Skies";
        let icon = "fa-cloud-sun";

        if (hours > 18 || hours < 6) {
            temp = 16;
            desc = "Cool Starry Night";
            icon = "fa-moon";
        } else if (hours > 14 && hours < 18) {
            temp = 24;
            desc = "Golden Sunset";
            icon = "fa-cloud-sun";
        }

        weatherInfo.textContent = `Shivapuri: ${temp}°C • ${desc}`;
        const iconEl = weatherWidget.querySelector('i');
        if (iconEl) iconEl.className = `fas ${icon} weather-icon`;
    };

    updateWeather();
    setInterval(updateWeather, 60000); // Update every minute

    // 2. Availability Checker Redirection
    window.checkAvailability = () => {
        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = document.getElementById('guests').value;

        if (!checkIn || !checkOut) {
            alert("Please select your stay dates.");
            return;
        }

        // Redirect to contact with parameters
        window.location.href = `contact.html?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}#booking-form`;
    };

    // 3. WhatsApp Float Visibility (Delayed Reveal)
    const whatsappFloat = document.querySelector('.whatsapp-float');
    if (whatsappFloat) {
        // Initial state
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
        whatsappFloat.style.transform = 'scale(0.5)';

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                whatsappFloat.style.opacity = '1';
                whatsappFloat.style.visibility = 'visible';
                whatsappFloat.style.transform = 'scale(1)';
            } else {
                whatsappFloat.style.opacity = '0';
                whatsappFloat.style.visibility = 'hidden';
                whatsappFloat.style.transform = 'scale(0.5)';
            }
        });
    }

    // =============================================
    // 4. PERSISTENT ADMIN VIEW LOGIC
    // =============================================
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const isAdminPage = window.location.pathname.includes('admin.html');

    if (isAdmin && !isAdminPage) {
        document.body.classList.add('admin-logged-in');

        // Inject Admin Styles with Cache Busting
        const adminStyles = document.createElement('link');
        adminStyles.rel = 'stylesheet';
        adminStyles.href = `admin-view.css?v=${new Date().getTime()}`;
        document.head.appendChild(adminStyles);

        // Inject Admin Toolbar
        if (!document.querySelector('.admin-toolbar')) {
            const toolbar = document.createElement('div');
            toolbar.className = 'admin-toolbar';
            toolbar.innerHTML = `
                <div class="admin-toolbar-brand">
                    <i class="fas fa-shield-alt"></i> <span>Manager</span> <span class="admin-badge">LIVE</span>
                </div>
                <div class="admin-toolbar-actions">
                    <a onclick="toggleSettingsModal()"><i class="fas fa-cog"></i> <span>Settings</span></a>
                    <a onclick="toggleDashboardPanel()" id="dashToggleBtn"><i class="fas fa-chart-line"></i> <span>Dashboard</span></a>
                    <a onclick="resetAllOverrides()" class="admin-reset-btn" title="Reset All Changes"><i class="fas fa-undo"></i></a>
                    <button onclick="logoutAdmin()" class="btn btn-outline" style="padding: 4px 12px; font-size: 0.65rem; border-color: rgba(247, 231, 206, 0.3);">Exit</button>
                </div>
            `;
            document.body.prepend(toolbar);
        }

        // Inject Settings Modal
        if (!document.getElementById('adminSettingsModal')) {
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'admin-modal-overlay';
            modalOverlay.id = 'adminSettingsModal';
            modalOverlay.innerHTML = `
                <div class="admin-modal">
                    <h2>Global Resort Settings</h2>
                    <div class="admin-modal-form">
                        <div class="admin-modal-group">
                            <label>Resort Name</label>
                            <input type="text" id="set_resortName" class="admin-modal-input" value="${localStorage.getItem('resortName') || 'Solace at Sundown'}" placeholder="Enter Resort Name">
                        </div>
                        <div class="admin-modal-group">
                            <label>Official Phone</label>
                            <input type="text" id="set_resortPhone" class="admin-modal-input" value="${localStorage.getItem('resortPhone') || '+977 9742590718'}" placeholder="Enter Phone Number">
                        </div>
                        <div class="admin-modal-group">
                            <label>Weather Condition (Override)</label>
                            <select id="set_weather" class="admin-modal-input">
                                <option value="auto" ${localStorage.getItem('forcedWeather') === 'auto' ? 'selected' : ''}>Automatic (Real-time)</option>
                                <option value="Clear Sky" ${localStorage.getItem('forcedWeather') === 'Clear Sky' ? 'selected' : ''}>Clear Sky</option>
                                <option value="Golden Hour" ${localStorage.getItem('forcedWeather') === 'Golden Hour' ? 'selected' : ''}>Golden Hour</option>
                                <option value="Rainy" ${localStorage.getItem('forcedWeather') === 'Rainy' ? 'selected' : ''}>Rainy</option>
                            </select>
                        </div>
                    </div>
                    <div class="admin-modal-btns">
                        <button class="btn btn-outline" onclick="toggleSettingsModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="saveGlobalSettings()">Save All Changes</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalOverlay);
        }
    }

    // --- ADMINISTRATIVE UTILITY FUNCTIONS ---

    window.toggleDashboardPanel = () => {
        let panel = document.getElementById('adminDashboardPanel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'adminDashboardPanel';
            panel.className = 'admin-side-panel';
            document.body.appendChild(panel);
        }

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const bookingItems = bookings.length > 0 ? bookings.slice(-5).reverse().map(b => `
            <div style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.8rem;">
                <div style="color:var(--color-gold); font-weight:bold;">${b.name}</div>
                <div style="color:var(--color-cream-muted); font-size:0.7rem;">${b.dates || 'TBD'} • ${b.id}</div>
            </div>
        `).join('') : '<div style="padding:20px; text-align:center; color:var(--color-cream-muted);">No recent inquiries.</div>';

        panel.innerHTML = `
            <div class="panel-header">
                <h3>Live Dashboard</h3>
                <a onclick="toggleDashboardPanel()" style="color:var(--color-gold); cursor:pointer;"><i class="fas fa-times"></i></a>
            </div>
            <div class="panel-body">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; text-align:center;">
                        <small style="display:block; opacity:0.6; font-size:0.6rem;">BOOKINGS</small>
                        <strong style="color:var(--color-gold); font-size:1.2rem;">${bookings.length}</strong>
                    </div>
                    <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; text-align:center;">
                        <small style="display:block; opacity:0.6; font-size:0.6rem;">VISITORS</small>
                        <strong style="color:var(--color-gold); font-size:1.2rem;">${Math.floor(Math.random() * 50) + 10}</strong>
                    </div>
                </div>
                <h4 style="font-size:0.8rem; text-transform:uppercase; color:var(--color-gold); margin-bottom:10px;">Recent Inquiries</h4>
                ${bookingItems}
                <button class="btn btn-outline" style="width:100%; margin-top:20px; font-size:0.7rem;" onclick="window.location.href='admin.html'">Open Full Dashboard</button>
            </div>
        `;

        panel.classList.toggle('active');
    };

    window.toggleSettingsModal = () => {
        const modal = document.getElementById('adminSettingsModal');
        modal.classList.toggle('active');
    };

    window.saveGlobalSettings = () => {
        const name = document.getElementById('set_resortName').value;
        const phone = document.getElementById('set_resortPhone').value;
        const weather = document.getElementById('set_weather').value;

        localStorage.setItem('resortName', name);
        localStorage.setItem('resortPhone', phone);
        localStorage.setItem('forcedWeather', weather);

        alert('Settings Saved Successfully! Reloading to apply changes...');
        window.location.reload();
    };

    window.resetAllOverrides = () => {
        if (confirm('CRITICAL: This will reset the entire website to its original design. Continue?')) {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('content_') || key.startsWith('live_content_') || key === 'resortName' || key === 'resortPhone' || key === 'forcedWeather') {
                    localStorage.removeItem(key);
                }
            });
            window.location.reload();
        }
    };

    // --- APPLY OVERRIDES ---
    const applyOverrides = () => {
        const customName = localStorage.getItem('resortName');
        if (customName) {
            document.querySelectorAll('.nav-logo-text, .footer-col h3, .hero-title, .hero-content h1').forEach(el => {
                const parts = customName.split(' ');
                const firstPart = parts[0];
                const restPart = parts.slice(1).join(' ');

                if (el.classList.contains('nav-logo-text') || el.classList.contains('hero-title') || el.tagName === 'H1') {
                    el.innerHTML = `${firstPart} <span>${restPart}</span>`;
                } else {
                    el.textContent = customName;
                }
            });
            document.title = `${customName} — Official Site`;
        }

        // 2. Apply Phone overrides
        const customPhone = localStorage.getItem('resortPhone');
        if (customPhone) {
            document.querySelectorAll('.footer-col .fa-phone + span, .whatsapp-float').forEach(el => {
                if (el.href && el.href.includes('wa.me')) {
                    const cleanPhone = customPhone.replace(/\D/g, '');
                    el.href = el.href.replace(/wa\.me\/\d+/, `wa.me/${cleanPhone}`);
                } else {
                    el.textContent = customPhone;
                }
            });
        }

        // 3. Apply Section/Live content overrides
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('live_content_')) {
                const cmsId = key.replace('live_content_', '');
                // Try to find by unique CMS ID attribute first
                let el = document.querySelector(`[data-cms-id="${cmsId}"]`);
                // Fallback to searching all contenteditable elements if needed after re-rendering
                if (!el) {
                    const editableTags = 'h1, h2, h3, h4, p, span, .nav-logo-text';
                    const candidates = document.querySelectorAll(editableTags);
                    candidates.forEach((cand, idx) => {
                        const candId = cand.id || `cms_${window.location.pathname.replace(/\//g, '_')}_${idx}`;
                        if (candId === cmsId) el = cand;
                    });
                }

                if (el) el.innerHTML = localStorage.getItem(key);
            }
        });

        // 4. Apply Media overrides (Hero background)
        const customHero = localStorage.getItem('hero_bg');
        const heroSection = document.querySelector('.hero, .page-hero');
        if (customHero && heroSection) {
            heroSection.style.backgroundImage = `linear-gradient(rgba(16, 44, 38, 0.4), rgba(16, 44, 38, 0.8)), url('${customHero}')`;
        }
    };

    applyOverrides();

    window.logoutAdmin = () => {
        localStorage.removeItem('isAdmin');
        window.location.reload();
    };

    // --- BOOKING CAPTURE ENGINE ---
    const setupBookingCapture = () => {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(contactForm);
                const booking = {
                    id: 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    timestamp: new Date().toLocaleString(),
                    name: formData.get('name') || formData.get('first-name') + ' ' + formData.get('last-name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    guests: formData.get('guests') || '2',
                    dates: formData.get('dates') || 'TBD',
                    message: formData.get('message'),
                    status: 'New'
                };

                let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                bookings.push(booking);
                localStorage.setItem('bookings', JSON.stringify(bookings));

                alert('Thank you! Your inquiry has been sent to our concierge.');
                contactForm.reset();
            });
        }

        // Intercept Availability Checker (Simple)
        const availBtn = document.querySelector('.check-btn');
        if (availBtn) {
            availBtn.addEventListener('click', () => {
                const checkIn = document.querySelector('input[placeholder="Check-in"]').value;
                if (checkIn) {
                    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
                    bookings.push({
                        id: 'INQ-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                        timestamp: new Date().toLocaleString(),
                        name: 'Web Visitor (Quick Inquiry)',
                        dates: checkIn,
                        status: 'Interested'
                    });
                    localStorage.setItem('bookings', JSON.stringify(bookings));
                }
            });
        }
    };

    setupBookingCapture();

});
