(function() {
    function getBaseUrl() {
        var scripts = document.querySelectorAll('script');
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src && scripts[i].src.indexOf('includes.js') !== -1) {
                return scripts[i].src.replace(/js\/includes\.js.*$/, '');
            }
        }
        var current = document.currentScript;
        if (current && current.src) {
            return current.src.replace(/js\/includes\.js.*$/, '');
        }
        return window.location.origin + '/';
    }

    var BASE = getBaseUrl();
    window.KC_BASE = BASE;

    function getPageName() {
        var path = window.location.pathname;
        if (path === '/' || path.charAt(path.length - 1) === '/') return 'index';
        var segments = path.split('/').filter(Boolean);
        var last = segments.pop() || 'index';
        return last.replace('.html', '');
    }

    function setActiveNav() {
        var page = getPageName();
        var fullPath = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(function(link) {
            var href = link.getAttribute('href').replace('.html', '').replace(/\/+$/, '');
            if (href === page || href === fullPath || (page === 'index' && href === '')) {
                link.parentElement.classList.add('active');
            }
        });
    }

    function initDesktopDropdown() {
        var dropdowns = document.querySelectorAll('.nav-links .nav-dropdown');
        if (!dropdowns.length) return;

        dropdowns.forEach(function(dropdown) {
            var trigger = dropdown.querySelector('.nav-dropdown-trigger');
            if (!trigger) return;

            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                dropdowns.forEach(function(d) {
                    if (d !== dropdown) d.classList.remove('open');
                });
                dropdown.classList.toggle('open');
            });

            dropdown.addEventListener('mouseenter', function() {
                dropdown.classList.add('open');
            });
            dropdown.addEventListener('mouseleave', function() {
                dropdown.classList.remove('open');
            });
        });

        document.addEventListener('click', function(e) {
            dropdowns.forEach(function(dropdown) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdowns.forEach(function(d) { d.classList.remove('open'); });
            }
        });
    }

    function initCatDropdown() {
        var trigger = document.getElementById('catTrigger');
        var mega = document.getElementById('catMega');
        if (!trigger || !mega) return;

        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mega.classList.toggle('open');
        });

        var wrapper = trigger.closest('.cat-wrapper');
        wrapper.addEventListener('mouseenter', function() {
            mega.classList.add('open');
        });
        wrapper.addEventListener('mouseleave', function() {
            mega.classList.remove('open');
        });

        document.addEventListener('click', function(e) {
            if (!wrapper.contains(e.target)) {
                mega.classList.remove('open');
            }
        });

        document.querySelectorAll('.cat-mega-item > a').forEach(function(link) {
            link.addEventListener('click', function(e) {
                var parent = this.parentElement;
                var sub = parent.querySelector('.sub-cats');
                if (sub && sub.children.length > 0) {
                    e.preventDefault();
                    var alreadyOpen = parent.classList.contains('open');
                    document.querySelectorAll('.cat-mega-item.open').forEach(function(item) {
                        item.classList.remove('open');
                    });
                    if (!alreadyOpen) {
                        parent.classList.add('open');
                    }
                }
            });
        });
    }

    function initRequestPanel() {
        var btn = document.getElementById('requestBtn');
        var panel = document.getElementById('requestPanel');
        var overlay = document.getElementById('requestPanelOverlay');
        var closeBtn = document.getElementById('requestPanelClose');
        if (!btn || !panel || !overlay) return;

        function openPanel() {
            panel.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closePanel() {
            panel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        btn.addEventListener('click', openPanel);
        if (closeBtn) closeBtn.addEventListener('click', closePanel);
        overlay.addEventListener('click', closePanel);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && panel.classList.contains('active')) closePanel();
        });

        var reqBtns = document.querySelectorAll('[data-open-request]');
        reqBtns.forEach(function(b) {
            b.addEventListener('click', function(e) {
                e.preventDefault();
                var type = b.dataset.openRequest;
                openPanel();
                if (type) {
                    var sel = document.getElementById('reqType');
                    if (sel) sel.value = type;
                }
            });
        });
    }

    function submitRequest() {
        var name = document.getElementById('reqName').value.trim();
        var email = document.getElementById('reqEmail').value.trim();
        var type = document.getElementById('reqType').value;
        var message = document.getElementById('reqMessage').value.trim();
        if (!name || !email || !type || !message) return;

        var panel = document.getElementById('requestPanel');
        var body = panel.querySelector('.panel-body');
        body.innerHTML = '<div style="text-align:center;padding:40px 20px;"><div style="font-size:3rem;color:var(--primary);margin-bottom:16px;"><i class="fas fa-check-circle"></i></div><h3 style="font-weight:600;margin-bottom:8px;">Request Submitted!</h3><p style="color:var(--gray);font-size:0.9rem;">Thank you, ' + name + '. We will review your request and get back to you within 24 hours.</p></div>';
        var footer = panel.querySelector('.panel-footer');
        if (footer) footer.style.display = 'none';

        showToast('Request submitted successfully!');
    }

    function initMobileMenu() {
        var hamburger = document.getElementById('hamburger');
        var overlay = document.getElementById('mobileMenuOverlay');
        var menu = document.getElementById('mobileMenu');
        var closeBtn = document.getElementById('mobileMenuClose');

        if (!hamburger || !menu) return;

        function openMenu() {
            hamburger.classList.add('active');
            overlay.classList.add('active');
            menu.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('mobile-menu-open');
        }

        function closeMenu() {
            hamburger.classList.remove('active');
            overlay.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
            document.body.classList.remove('mobile-menu-open');
            document.querySelectorAll('.mobile-submenu').forEach(function(s) {
                s.classList.remove('active');
            });
        }

        hamburger.addEventListener('click', openMenu);
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        if (overlay) overlay.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-nav-trigger').forEach(function(trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                var parent = this.closest('.mobile-nav-dropdown');
                var submenu = parent.querySelector('.mobile-submenu');
                if (submenu) submenu.classList.add('active');
            });
        });

        document.querySelectorAll('.mobile-back-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                this.closest('.mobile-submenu').classList.remove('active');
            });
        });

        document.querySelectorAll('.mobile-nav-list a:not(.mobile-nav-trigger)').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });

        document.querySelectorAll('.mobile-submenu-search input').forEach(function(input) {
            input.addEventListener('input', function() {
                var query = this.value.toLowerCase();
                var list = this.closest('.mobile-submenu').querySelector('.mobile-submenu-list');
                list.querySelectorAll('li').forEach(function(li) {
                    var text = li.textContent.toLowerCase();
                    li.style.display = text.includes(query) ? '' : 'none';
                });
            });
        });
    }

    function initHeaderSearch() {
        var input = document.getElementById('headerSearchInput');
        var btn = document.getElementById('headerSearchBtn');
        if (!input || !btn) return;

        function doSearch() {
            var q = input.value.trim();
            if (q) {
                window.location.href = (BASE || '/') + 'services?q=' + encodeURIComponent(q);
            }
        }

        btn.addEventListener('click', doSearch);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') doSearch();
        });
    }

    function initAuthModal() {
        var modal = document.getElementById('authModal');
        if (!modal) return;

        var closeBtn = document.getElementById('authModalClose');
        var title = document.getElementById('authModalTitle');
        var subtitle = document.getElementById('authModalSubtitle');
        var tabs = modal.querySelectorAll('[data-auth-tab]');
        var loginForm = modal.querySelector('[data-auth-form="login"]');
        var registerForm = modal.querySelector('[data-auth-form="register"]');
        var typeOptions = modal.querySelectorAll('.auth-type-option');
        var businessFields = document.getElementById('modalBusinessFields');

        function openAuth(tab) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            switchTab(tab || 'login');
        }

        function closeAuth() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function switchTab(tab) {
            tabs.forEach(function(t) {
                t.classList.toggle('active', t.dataset.authTab === tab);
            });
            if (tab === 'login') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                title.textContent = 'Welcome Back';
                subtitle.textContent = 'Login to your account to continue';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
                title.textContent = 'Create Account';
                subtitle.textContent = 'Join Kuje Connect and start connecting';
            }
        }

        document.querySelectorAll('[data-auth-open]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                openAuth(btn.dataset.authOpen);
            });
        });

        closeBtn.addEventListener('click', closeAuth);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeAuth();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeAuth();
        });

        tabs.forEach(function(tab) {
            tab.addEventListener('click', function() {
                switchTab(tab.dataset.authTab);
            });
        });

        typeOptions.forEach(function(opt) {
            opt.addEventListener('click', function() {
                typeOptions.forEach(function(o) { o.classList.remove('active'); });
                opt.classList.add('active');
                if (businessFields) {
                    businessFields.style.display = opt.dataset.type === 'business' ? 'block' : 'none';
                }
            });
        });

        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Login successful!');
                closeAuth();
            });
        }
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showToast('Account created successfully!');
                closeAuth();
            });
        }
    }

    function showToast(message) {
        var existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:#16a34a;color:#fff;padding:14px 24px;border-radius:12px;z-index:10000;font-size:0.9rem;box-shadow:0 4px 20px rgba(0,0,0,0.25);';
        document.body.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(function() { toast.remove(); }, 300);
        }, 2500);
    }

    function hidePageLoader() {
        var loader = document.getElementById('pageLoader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(function() { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 600);
        }
    }

    function fixHtmlPaths(html) {
        html = html.replace(/(src|href)="(?!http)(?!\/)(?!\#)(?!data-)([^"]+)"/g, '$1="' + BASE + '$2"');
        return html;
    }

    var headerEl = document.getElementById('site-header');
    if (headerEl) {
        fetch(BASE + 'includes/header.html')
            .then(function(r) { return r.text(); })
            .then(function(html) {
                html = fixHtmlPaths(html);
                headerEl.innerHTML = html;
                setActiveNav();
                initDesktopDropdown();
                initCatDropdown();
                initRequestPanel();
                initMobileMenu();
                initHeaderSearch();
                hidePageLoader();
            })
            .catch(function() { hidePageLoader(); });
    }

    var footerEl = document.getElementById('site-footer');
    if (footerEl) {
        fetch(BASE + 'includes/footer.html')
            .then(function(r) { return r.text(); })
            .then(function(html) {
                html = fixHtmlPaths(html);
                footerEl.innerHTML = html;
            });
    }

    fetch(BASE + 'includes/auth-modal.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            document.body.insertAdjacentHTML('beforeend', html);
            initAuthModal();
        });

    fetch(BASE + 'includes/newsletter-popup.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            document.body.insertAdjacentHTML('beforeend', html);
            initNewsletterPopup();
        });

    fetch(BASE + 'includes/ad-popup.html')
        .then(function(r) { return r.text(); })
        .then(function(html) {
            document.body.insertAdjacentHTML('beforeend', html);
            initAdPopup();
        });

    var loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(hidePageLoader, 3000);
    }

    function showNewsletterPopup() {
        var overlay = document.getElementById('newsletterPopupOverlay');
        var popup = document.getElementById('newsletterPopup');
        if (overlay && popup) {
            overlay.classList.add('active');
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function initNewsletterPopup() {
        if (localStorage.getItem('kc_newsletter_dismissed') === 'true') return;
        setTimeout(function() {
            if (adPopupShowing) {
                var waitForAd = setInterval(function() {
                    if (!adPopupShowing) {
                        clearInterval(waitForAd);
                        setTimeout(showNewsletterPopup, 3000);
                    }
                }, 500);
            } else {
                showNewsletterPopup();
            }
        }, 20000);
        var closeBtn = document.getElementById('newsletterPopupClose');
        var overlay = document.getElementById('newsletterPopupOverlay');
        if (closeBtn) closeBtn.addEventListener('click', closeNewsletterPopup);
        if (overlay) overlay.addEventListener('click', closeNewsletterPopup);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeNewsletterPopup();
        });
    }

    function closeNewsletterPopup() {
        var overlay = document.getElementById('newsletterPopupOverlay');
        var popup = document.getElementById('newsletterPopup');
        if (overlay) overlay.classList.remove('active');
        if (popup) popup.classList.remove('active');
        document.body.style.overflow = '';
    }

    window.newsletterPopupSubscribe = function() {
        var name = document.getElementById('newsletterPopupName').value.trim();
        var email = document.getElementById('newsletterPopupEmail').value.trim();
        if (!name || !email) { alert('Please fill in all fields.'); return; }
        var btn = document.querySelector('.newsletter-popup-form .btn');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        btn.disabled = true;
        setTimeout(function() {
            alert('Thank you for subscribing, ' + name + '!');
            closeNewsletterPopup();
            if (document.getElementById('newsletterPopupDontShow').checked) {
                localStorage.setItem('kc_newsletter_dismissed', 'true');
            }
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe Now';
            btn.disabled = false;
        }, 1000);
    };

    var adPopupTimer = null;
    var adPopupShowing = false;
    var adPopupData = [
        { name: 'Green Valley Poultry Farm', desc: 'Premium broilers, layers and day-old chicks. Farm-fresh eggs supplied daily.', addr: 'Kuje Town', price: '\u20A65,000 - \u20A650,000', phone: '0803 111 2222', about: 'We specialise in high-quality poultry products including broilers, layers, and day-old chicks. Our farm is known for healthy, well-fed birds and fresh eggs delivered daily across Kuje and environs.', seed: 'greenfarmaf', slug: 'green-valley-poultry-farm' },
        { name: 'Kuje Auto Mart', desc: 'Wide selection of quality used cars. Toyota, Honda, Nissan, Mercedes. Financing available.', addr: 'Kuje Town', price: '\u20A6500,000 - \u20A65,000,000', phone: '0805 444 5555', about: 'Kuje Auto Mart offers a broad inventory of inspected, pre-owned vehicles. We provide financing options, vehicle history reports, and after-sales support to ensure you drive away satisfied.', seed: 'kujeauto', slug: 'kuje-auto-mart' },
        { name: 'Glamour Beauty Salon', desc: 'Full-service salon. Haircuts, braiding, styling, threading, and treatments.', addr: 'Kuje Town', price: '\u20A61,000 - \u20A610,000', phone: '0806 777 8888', about: 'Glamour Beauty Salon is your one-stop destination for all beauty needs. From haircuts and braiding to threading and skincare treatments, our experienced stylists ensure you leave looking and feeling your best.', seed: 'glamsalon', slug: 'glamour-beauty-salon' },
        { name: 'Kuje Building Mart', desc: 'Cement, iron rods, gravel, sand, blocks, and building materials at wholesale prices.', addr: 'Kuje Town', price: '\u20A62,000 - \u20A6200,000', phone: '0809 111 3333', about: 'We supply top-grade building materials at competitive wholesale prices. Whether you are building a home or a commercial property, Kuje Building Mart has everything you need from cement to roofing.', seed: 'buildmartk', slug: 'kuje-building-mart' },
        { name: 'Amina Kitchen', desc: 'Delicious local and continental dishes. Fresh food, fast delivery, great atmosphere.', addr: 'Kuje Town', price: '\u20A6500 - \u20A65,000', phone: '0701 234 5678', about: 'Amina Kitchen serves freshly prepared local and continental dishes in a warm, inviting atmosphere. From jollof rice to grilled chicken, every meal is made with love and the freshest ingredients.', seed: 'aminakitchen', slug: 'amina-kitchen' },
        { name: 'Kuje Car Rentals', desc: 'Self-drive and chauffeur car rentals. Well-maintained fleet for all occasions.', addr: 'Kuje Town', price: '\u20A610,000 - \u20A6100,000', phone: '0803 555 6666', about: 'We offer reliable self-drive and chauffeur-driven car rental services for corporate, leisure, and special occasions. Our well-maintained fleet ensures safety, comfort, and affordability.', seed: 'kujerental', slug: 'kuje-car-rentals' },
        { name: 'Zen Spa Kuje', desc: 'Full-body massage, sauna, steam bath, aromatherapy, and facials.', addr: 'Kuje Town', price: '\u20A65,000 - \u20A630,000', phone: '0807 222 4444', about: 'Zen Spa Kuje offers premium relaxation and wellness services including full-body massage, sauna, steam bath, aromatherapy, and rejuvenating facials. Escape the stress of everyday life.', seed: 'zenspak', slug: 'zen-spa-kuje' },
        { name: 'Kuje Mega Mart', desc: 'Everything under one roof. Food, drinks, household items, toiletries, and more.', addr: 'Rubochi', price: '\u20A6500 - \u20A620,000', phone: '0901 234 5678', about: 'Kuje Mega Mart is your one-stop shopping destination offering groceries, beverages, household essentials, toiletries, and more. Quality products at affordable prices with friendly service.', seed: 'kujemegamr', slug: 'kuje-mega-mart' },
        { name: 'CodeCraft Kuje', desc: 'Custom software development. Web apps, mobile apps, APIs, and cloud solutions.', addr: 'Rubochi', price: '\u20A650,000 - \u20A6500,000', phone: '0802 333 4444', about: 'CodeCraft Kuje builds custom software solutions including web apps, mobile applications, APIs, and cloud infrastructure. Our experienced developers turn your ideas into powerful digital products.', seed: 'codecraftk', slug: 'codecraft-kuje' },
        { name: 'Savannah Grill', desc: 'Grilled meats, Nigerian dishes, jollof rice, suya, and chilled drinks.', addr: 'Rubochi', price: '\u20A6500 - \u20A65,000', phone: '0806 111 2222', about: 'Savannah Grill is the go-to spot for delicious grilled meats, authentic Nigerian dishes, and refreshing drinks in Rubochi. Our suya and jollof rice are customer favorites.', seed: 'savgrillk', slug: 'savannah-grill' },
        { name: 'Alheri Medical Centre', desc: 'General hospital with emergency, maternity, pediatrics, and laboratory services.', addr: 'Rubochi', price: '\u20A62,000 - \u20A620,000', phone: '0804 555 6666', about: 'Alheri Medical Centre is a full-service hospital offering emergency care, maternity, pediatrics, laboratory diagnostics, and outpatient services. Your health and well-being are our priority.', seed: 'alherimc', slug: 'alheri-medical-centre' },
        { name: 'Kuje Furniture Mart', desc: 'Living room, bedroom, and dining furniture. Modern designs at wholesale prices.', addr: 'Rubochi', price: '\u20A610,000 - \u20A6500,000', phone: '0803 777 8888', about: 'Kuje Furniture Mart offers a wide selection of modern living room, bedroom, and dining furniture at factory-direct prices. Quality craftsmanship meets affordable elegance.', seed: 'kujefurnmr', slug: 'kuje-furniture-mart' },
        { name: 'Kuje Property Link', desc: 'Land and property sales, rentals, lease agreements, and property management.', addr: 'Rubochi', price: '\u20A6500,000 - \u20A610,000,000', phone: '0809 555 6666', about: 'Kuje Property Link connects you with the best land and property deals in and around Kuje. We handle sales, rentals, lease agreements, and property management with integrity and transparency.', seed: 'proplinkk', slug: 'kuje-property-link' },
        { name: 'Gadget Hub Kuje', desc: 'New and used phones, tablets, and accessories. Repairs, unlocking, and software.', addr: 'Rubochi', price: '\u20A65,000 - \u20A6300,000', phone: '0703 111 2222', about: 'Gadget Hub Kuje is your destination for the latest phones, tablets, and accessories. We also offer expert repairs, unlocking, and software services at competitive prices.', seed: 'gadgethubk', slug: 'gadget-hub-kuje' },
        { name: 'Kuje Spare Parts Depot', desc: 'Genuine and OEM spare parts for all car brands.', addr: 'Kuje Market', price: '\u20A61,000 - \u20A650,000', phone: '0805 222 3333', about: 'We stock a comprehensive range of genuine and OEM spare parts for all popular car brands. Our knowledgeable staff will help you find the right part quickly and at the best price.', seed: 'sparedepot', slug: 'kuje-spare-parts-depot' },
    ];

    function initAdPopup() {
        var closeBtn = document.getElementById('adPopupClose');
        var overlay = document.getElementById('adPopupOverlay');
        var laterBtn = document.getElementById('adPopupLaterBtn');
        if (!closeBtn || !overlay) return;

        closeBtn.addEventListener('click', closeAdPopup);
        overlay.addEventListener('click', closeAdPopup);
        if (laterBtn) laterBtn.addEventListener('click', closeAdPopup);
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeAdPopup();
        });

        // Show first ad shortly after page load
        setTimeout(function() {
            if (!adPopupShowing) openAdPopup();
        }, 2000);
    }

    function openAdPopup() {
        var overlay = document.getElementById('adPopupOverlay');
        var popup = document.getElementById('adPopup');
        if (!overlay || !popup) return;

        var ad = adPopupData[Math.floor(Math.random() * adPopupData.length)];
        var base = window.KC_BASE || BASE;

        document.getElementById('adPopupImgSrc').src = 'https://picsum.photos/seed/' + ad.seed + '/640/480';
        document.getElementById('adPopupImgSrc').alt = ad.name;
        document.getElementById('adPopupTitle').textContent = ad.name;
        document.getElementById('adPopupDesc').textContent = ad.desc;
        document.getElementById('adPopupLocation').textContent = ad.addr + ', Kuje';
        document.getElementById('adPopupPrice').textContent = ad.price;
        if (document.getElementById('adPopupRating')) document.getElementById('adPopupRating').textContent = '4.5 (' + (Math.floor(Math.random() * 50) + 10) + ' reviews)';
        if (document.getElementById('adPopupPhone')) document.getElementById('adPopupPhone').textContent = ad.phone;
        if (document.getElementById('adPopupAbout')) document.getElementById('adPopupAbout').textContent = ad.about;
        document.getElementById('adPopupLink').href = base + 'business/' + ad.slug;

        overlay.classList.add('active');
        popup.classList.add('active');
        adPopupShowing = true;
        document.body.style.overflow = 'hidden';

        // 6-second countdown on close button
        var closeBtn = document.getElementById('adPopupClose');
        var laterBtn = document.getElementById('adPopupLaterBtn');
        var countdown = 6;
        closeBtn.disabled = true;
        closeBtn.innerHTML = '6';
        closeBtn.style.cursor = 'not-allowed';
        if (laterBtn) { laterBtn.disabled = true; laterBtn.style.opacity = '0.5'; laterBtn.style.cursor = 'not-allowed'; }
        var cd = setInterval(function() {
            countdown--;
            closeBtn.innerHTML = countdown;
            if (countdown <= 0) {
                clearInterval(cd);
                closeBtn.disabled = false;
                closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                closeBtn.style.cursor = '';
                if (laterBtn) { laterBtn.disabled = false; laterBtn.style.opacity = ''; laterBtn.style.cursor = ''; }
            }
        }, 1000);
    }

    function closeAdPopup() {
        var overlay = document.getElementById('adPopupOverlay');
        var popup = document.getElementById('adPopup');
        if (overlay) overlay.classList.remove('active');
        if (popup) popup.classList.remove('active');
        adPopupShowing = false;
        document.body.style.overflow = '';
        clearTimeout(adPopupTimer);
        adPopupTimer = setTimeout(function() {
            if (!adPopupShowing) {
                var nl = document.getElementById('newsletterPopup');
                if (nl && nl.classList.contains('active')) return;
                openAdPopup();
            }
        }, 60000);
    }

    window.submitRequest = submitRequest;
})();
