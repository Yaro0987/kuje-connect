// js/admin.js - Shared Admin Panel Functions

function initAdminSidebar() {
    var toggle = document.querySelector('.sidebar-toggle');
    var sidebar = document.querySelector('.admin-sidebar');
    var main = document.querySelector('.admin-main');

    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            if (main) {
                if (sidebar.classList.contains('collapsed')) {
                    main.style.marginLeft = 'var(--sidebar-collapsed)';
                } else {
                    main.style.marginLeft = 'var(--sidebar-width)';
                }
            }
        });
    }

    document.querySelectorAll('.sidebar-nav-link[data-toggle="submenu"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var item = this.closest('.sidebar-nav-item');
            if (item) {
                item.classList.toggle('open');
            }
        });
    });

    var currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    document.querySelectorAll('.sidebar-nav-link').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href) {
            var page = href.replace('.html', '');
            if (page === currentPage || (currentPage === '' && page === 'dashboard')) {
                var item = link.closest('.sidebar-nav-item');
                if (item) {
                    item.classList.add('active');
                    var parent = item.parentElement;
                    if (parent && parent.classList.contains('sidebar-submenu')) {
                        parent.closest('.sidebar-nav-item').classList.add('open');
                    }
                }
            }
        }
    });

    var hamburger = document.querySelector('.topbar-hamburger');
    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
            var overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:none;';
                document.body.appendChild(overlay);
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('mobile-open');
                    overlay.style.display = 'none';
                });
            }
            overlay.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
        });
    }
}

function initAdminDropdown() {
    var btn = document.querySelector('.topbar-admin-btn');
    var dropdown = document.querySelector('.admin-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', function() {
        dropdown.classList.remove('active');
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') dropdown.classList.remove('active');
    });
}

function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

function formatCurrency(amount) {
    return '\u20A6' + Number(amount).toLocaleString();
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
