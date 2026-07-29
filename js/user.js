// js/user.js - User Panel JavaScript for Kuje Connect
// Powers all user dashboard pages. Reads from global DB (data/data.js).

// ===== Current User =====
function getCurrentUser() {
    return DB.users.find(function(u) { return u.id === 'u6'; }) || DB.users[0];
}

// ===== User Businesses =====
function getUserBusinesses(userId) {
    return DB.businesses.filter(function(b) { return b.ownerId === userId; });
}

// ===== User Favorites with Business Details =====
function getUserFavorites(userId) {
    return DB.favorites.filter(function(f) { return f.userId === userId; }).map(function(f) {
        var biz = DB.businesses.find(function(b) { return b.id === f.businessId; });
        return Object.assign({}, f, { business: biz });
    }).filter(function(f) { return f.business; });
}

// ===== User Notifications =====
function getUserNotifications(userId) {
    return DB.notifications.filter(function(n) { return n.userId === userId; });
}

// ===== Unread Notification Count =====
function getUnreadNotifCount(userId) {
    return DB.notifications.filter(function(n) { return n.userId === userId && !n.read; }).length;
}

// ===== User Conversations =====
function getUserConversations(userId) {
    return DB.conversations.filter(function(c) { return c.participants.indexOf(userId) !== -1; });
}

// ===== Conversation Messages =====
function getConversationMessages(convId) {
    return DB.messages.filter(function(m) { return m.conversationId === convId; });
}

// ===== User Reviews =====
function getUserReviews(userId) {
    return DB.reviews.filter(function(r) { return r.userId === userId; });
}

// ===== Send Message =====
function sendMessage(convId, senderId, text, type, fileUrl) {
    var msg = {
        id: 'm' + (DB.messages.length + 1),
        conversationId: convId,
        senderId: senderId,
        text: text,
        timestamp: new Date().toISOString(),
        read: false,
        type: type || 'text',
        fileUrl: fileUrl || null
    };
    DB.messages.push(msg);
    var conv = DB.conversations.find(function(c) { return c.id === convId; });
    if (conv) {
        conv.lastMessage = text;
        conv.lastMessageTime = msg.timestamp;
    }
    return msg;
}

// ===== Toggle Favorite =====
function toggleFavorite(userId, businessId) {
    var idx = DB.favorites.findIndex(function(f) {
        return f.userId === userId && f.businessId === businessId;
    });
    if (idx >= 0) {
        DB.favorites.splice(idx, 1);
        return false;
    } else {
        DB.favorites.push({
            userId: userId,
            businessId: businessId,
            dateAdded: new Date().toISOString()
        });
        return true;
    }
}

// ===== Is Favorited =====
function isFavorited(userId, businessId) {
    return DB.favorites.some(function(f) {
        return f.userId === userId && f.businessId === businessId;
    });
}

// ===== Mark Notification Read =====
function markNotifRead(notifId) {
    var n = DB.notifications.find(function(n) { return n.id === notifId; });
    if (n) n.read = true;
}

// ===== Mark All Notifications Read =====
function markAllNotifsRead(userId) {
    DB.notifications.forEach(function(n) {
        if (n.userId === userId) n.read = true;
    });
}

// ===== Delete Notification =====
function deleteNotification(notifId) {
    var idx = DB.notifications.findIndex(function(n) { return n.id === notifId; });
    if (idx >= 0) DB.notifications.splice(idx, 1);
}

// ===== Save Business =====
function saveBusiness(bizData, existingId) {
    if (existingId) {
        var idx = DB.businesses.findIndex(function(b) { return b.id === existingId; });
        if (idx >= 0) {
            Object.assign(DB.businesses[idx], bizData);
            return DB.businesses[idx];
        }
    } else {
        var newBiz = Object.assign({
            id: 'b' + (DB.businesses.length + 1),
            status: 'pending',
            verified: false,
            featured: false,
            rating: 0,
            reviewCount: 0,
            dateAdded: new Date().toISOString()
        }, bizData);
        DB.businesses.push(newBiz);
        return newBiz;
    }
}

// ===== Delete Business =====
function deleteBusiness(bizId) {
    var idx = DB.businesses.findIndex(function(b) { return b.id === bizId; });
    if (idx >= 0) DB.businesses.splice(idx, 1);
}

// ===== Update User Profile =====
function updateProfile(userId, data) {
    var user = DB.users.find(function(u) { return u.id === userId; });
    if (user) Object.assign(user, data);
    return user;
}

// ===== Format Currency =====
function formatCurrency(amount) {
    return '\u20A6' + Number(amount).toLocaleString();
}

// ===== Format Date =====
function formatDate(d) {
    if (!d) return '';
    var date = new Date(d);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}

// ===== Time Ago =====
function timeAgo(d) {
    if (!d) return '';
    var now = new Date();
    var date = new Date(d);
    var seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'Just now';
    var minutes = Math.floor(seconds / 60);
    if (minutes < 60) return minutes + 'm ago';
    var hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + 'h ago';
    var days = Math.floor(hours / 24);
    if (days < 7) return days + 'd ago';
    var weeks = Math.floor(days / 7);
    if (weeks < 4) return weeks + 'w ago';
    var months = Math.floor(days / 30);
    if (months < 12) return months + 'mo ago';
    var years = Math.floor(days / 365);
    return years + 'y ago';
}

// ===== Get Initials =====
function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(function(w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
}

// ===== Escape HTML =====
function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ===== Toast Notification =====
function showToast(msg, type) {
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = msg;

    var bg = '#1e3a5f';
    if (type === 'success') bg = '#16a34a';
    else if (type === 'error') bg = '#dc2626';
    else if (type === 'warning') bg = '#d97706';

    toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:' + bg + ';color:#fff;padding:14px 24px;border-radius:12px;z-index:10000;font-size:0.9rem;box-shadow:0 4px 20px rgba(0,0,0,0.25);animation:slideInRight 0.3s ease;';
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
}

// ===== Render Star Rating =====
function renderStars(rating) {
    var html = '';
    var full = Math.floor(rating);
    var half = rating % 1 >= 0.3;
    var empty = 5 - full - (half ? 1 : 0);
    for (var i = 0; i < full; i++) {
        html += '<i class="fas fa-star"></i>';
    }
    if (half) {
        html += '<i class="fas fa-star-half-alt"></i>';
    }
    for (var j = 0; j < empty; j++) {
        html += '<i class="far fa-star"></i>';
    }
    return html;
}

// ===== Render Business Card =====
function renderBusinessCard(biz) {
    var cat = DB.categories.find(function(c) { return c.slug === biz.category; });
    var catName = cat ? cat.name : biz.category;
    var catIcon = cat ? cat.icon : 'fa-store';
    var imgBg = getCatColor(biz.category);
    var verifiedBadge = biz.verified ? ' <i class="fas fa-check-circle" style="color:var(--primary);font-size:0.75rem;"></i>' : '';
    var fav = isFavorited(getCurrentUser().id, biz.id);
    var favIcon = fav ? 'fa-heart' : 'fa-heart';
    var favClass = fav ? 'fas active' : 'far';

    return '<div class="business-card" data-biz-id="' + biz.id + '">' +
        '<div class="business-card-img" style="background:' + imgBg + ';">' +
            '<i class="fas ' + catIcon + '"></i>' +
            '<button class="wishlist-btn ' + (fav ? 'active' : '') + '" data-biz-id="' + biz.id + '" title="Favorite">' +
                '<i class="' + favClass + ' ' + favIcon + '"></i>' +
            '</button>' +
            (biz.featured ? '<span class="featured-badge"><i class="fas fa-crown"></i> Featured</span>' : '') +
        '</div>' +
        '<div class="business-card-body">' +
            '<h4>' + escapeHtml(biz.name) + verifiedBadge + '</h4>' +
            '<p class="business-card-category"><i class="fas ' + catIcon + '"></i> ' + escapeHtml(catName) + '</p>' +
            '<p class="business-card-location"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(biz.location) + '</p>' +
            '<div class="business-card-rating">' +
                '<span class="stars">' + renderStars(biz.rating) + '</span>' +
                '<span>' + biz.rating + ' (' + biz.reviewCount + ')</span>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ===== Category Color Map =====
function getCatColor(slug) {
    var colors = {
        'food-and-restaurants': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
        'fashion-and-clothing': 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
        'phones-and-electronics': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
        'home-and-furniture': 'linear-gradient(135deg,#fef3c7,#fde68a)',
        'beauty-and-personal-care': 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
        'automobile': 'linear-gradient(135deg,#e5e7eb,#d1d5db)',
        'event-and-rentals': 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
        'construction': 'linear-gradient(135deg,#fef3c7,#fde68a)',
        'health-and-medical': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
        'technology': 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
        'education': 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
        'agriculture': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
        'professional-services': 'linear-gradient(135deg,#e5e7eb,#d1d5db)',
        'real-estate': 'linear-gradient(135deg,#fef3c7,#fde68a)',
        'logistics-and-transport': 'linear-gradient(135deg,#e5e7eb,#d1d5db)',
        'creative-and-media': 'linear-gradient(135deg,#ede9fe,#ddd6fe)',
        'retail-and-trading': 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
        'services': 'linear-gradient(135deg,#fef3c7,#fde68a)'
    };
    return colors[slug] || 'linear-gradient(135deg,#e5e7eb,#d1d5db)';
}

// ===== Get Category Icon Color =====
function getCatIconColor(slug) {
    var colors = {
        'food-and-restaurants': 'var(--primary)',
        'fashion-and-clothing': '#db2777',
        'phones-and-electronics': '#2563eb',
        'home-and-furniture': '#d97706',
        'beauty-and-personal-care': '#db2777',
        'automobile': '#6b7280',
        'event-and-rentals': '#7c3aed',
        'construction': '#d97706',
        'health-and-medical': '#2563eb',
        'technology': '#2563eb',
        'education': '#7c3aed',
        'agriculture': 'var(--primary)',
        'professional-services': '#6b7280',
        'real-estate': '#d97706',
        'logistics-and-transport': '#6b7280',
        'creative-and-media': '#7c3aed',
        'retail-and-trading': 'var(--primary)',
        'services': '#d97706'
    };
    return colors[slug] || '#6b7280';
}

// ===== Confirm Action =====
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// ===== Initialize User Sidebar =====
function initUserSidebar() {
    var user = getCurrentUser();
    if (!user) return;

    var initials = getInitials(user.name);
    var roleLabel = user.role === 'business_owner' ? 'Business Owner' : 'Customer';
    var roleIcon = user.role === 'business_owner' ? 'fa-briefcase' : 'fa-user';

    document.querySelectorAll('.user-sidebar-header').forEach(function(header) {
        var avatar = header.querySelector('.user-avatar');
        var name = header.querySelector('h4');
        var badge = header.querySelector('.user-badge');
        if (avatar) avatar.textContent = initials;
        if (name) name.textContent = user.name;
        if (badge) badge.innerHTML = '<i class="fas ' + roleIcon + '"></i> ' + roleLabel;
    });

    var currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'dashboard';
    document.querySelectorAll('.user-nav-item').forEach(function(link) {
        var href = link.getAttribute('href');
        if (href) {
            var page = href.replace('.html', '');
            if (page === currentPage) {
                link.classList.add('active');
            }
        }
    });
}

// ===== Initialize User Dropdown (topbar) =====
function initUserDropdown() {
    var btn = document.querySelector('.topbar-user-btn');
    var dropdown = document.querySelector('.user-dropdown');
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

// ===== Dashboard Page Init =====
function initDashboard() {
    var user = getCurrentUser();
    if (!user) return;

    var businesses = getUserBusinesses(user.id);
    var conversations = getUserConversations(user.id);
    var favorites = getUserFavorites(user.id);
    var reviews = getUserReviews(user.id);

    var totalMessages = 0;
    conversations.forEach(function(c) {
        totalMessages += getConversationMessages(c.id).length;
    });

    var stats = document.querySelectorAll('.stats-grid .stat-card h3');
    if (stats.length >= 4) {
        stats[0].textContent = businesses.length;
        stats[1].textContent = totalMessages;
        stats[2].textContent = favorites.length;
        stats[3].textContent = reviews.length;
    }

    var welcomeH2 = document.querySelector('.page-header h2');
    if (welcomeH2) {
        var firstName = user.name.split(' ')[0];
        welcomeH2.textContent = 'Welcome back, ' + firstName + '!';
    }

    var activityList = document.querySelector('.activity-list');
    if (activityList) {
        var activities = buildRecentActivity(user.id);
        activityList.innerHTML = activities.map(function(a) {
            return '<div class="activity-item">' +
                '<div class="activity-dot" style="background:' + a.color + ';"></div>' +
                '<span class="activity-text">' + a.text + '</span>' +
                '<span class="activity-time">' + timeAgo(a.time) + '</span>' +
            '</div>';
        }).join('');
    }
}

// ===== Build Recent Activity =====
function buildRecentActivity(userId) {
    var items = [];
    var user = getCurrentUser();
    var businesses = getUserBusinesses(userId);
    var notifications = getUserNotifications(userId);

    businesses.forEach(function(b) {
        items.push({
            color: 'var(--primary)',
            text: 'Your business <strong>' + escapeHtml(b.name) + '</strong> is ' + b.status,
            time: b.dateAdded
        });
    });

    var recentNotifs = notifications.slice(0, 10);
    recentNotifs.forEach(function(n) {
        var color = '#2563eb';
        if (n.type === 'business_approved') color = 'var(--primary)';
        else if (n.type === 'review') color = '#d97706';
        else if (n.type === 'message') color = '#2563eb';
        else if (n.type === 'promo') color = '#db2777';
        items.push({
            color: color,
            text: n.message,
            time: n.timestamp
        });
    });

    items.sort(function(a, b) {
        return new Date(b.time) - new Date(a.time);
    });

    return items.slice(0, 8);
}

// ===== My Businesses Page Init =====
function initMyBusinesses() {
    var user = getCurrentUser();
    if (!user) return;

    var businesses = getUserBusinesses(user.id);
    var container = document.querySelector('.user-main');

    if (!container) return;

    var existingCards = container.querySelectorAll('.user-card[data-biz-id]');
    existingCards.forEach(function(card) { card.remove(); });

    if (businesses.length === 0) {
        var empty = document.createElement('div');
        empty.className = 'user-card';
        empty.style.cssText = 'text-align:center;padding:40px;';
        empty.innerHTML = '<i class="fas fa-store" style="font-size:2.5rem;color:var(--gray-light);margin-bottom:12px;display:block;"></i>' +
            '<h4 style="color:var(--gray);margin-bottom:8px;">No businesses yet</h4>' +
            '<p style="color:var(--gray-light);font-size:0.9rem;margin-bottom:16px;">Start by adding your first business listing.</p>' +
            '<a href="add-business" class="btn-sm btn-primary"><i class="fas fa-plus"></i> Add Business</a>';
        container.appendChild(empty);
        return;
    }

    businesses.forEach(function(biz) {
        var cat = DB.categories.find(function(c) { return c.slug === biz.category; });
        var catName = cat ? cat.name : biz.category;
        var catIcon = cat ? cat.icon : 'fa-store';
        var iconColor = getCatIconColor(biz.category);
        var statusClass = biz.status === 'active' ? 'status-active' : (biz.status === 'pending' ? 'status-pending' : 'status-inactive');
        var statusText = biz.status === 'active' ? 'Active' : (biz.status === 'pending' ? 'Pending Review' : 'Inactive');
        var ratingText = biz.rating > 0 ? '<i class="fas fa-star" style="color:#f59e0b;"></i> ' + biz.rating : 'New';

        var card = document.createElement('div');
        card.className = 'user-card';
        card.setAttribute('data-biz-id', biz.id);
        card.style.cssText = 'display:flex;align-items:center;gap:18px;margin-bottom:14px;';

        card.innerHTML =
            '<div style="width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;background:' + getCatColor(biz.category) + ';color:' + iconColor + ';">' +
                '<i class="fas ' + catIcon + '"></i>' +
            '</div>' +
            '<div style="flex:1;">' +
                '<h4 style="font-size:0.95rem;font-weight:600;color:var(--dark);margin-bottom:3px;">' + escapeHtml(biz.name) + '</h4>' +
                '<div style="display:flex;align-items:center;gap:14px;font-size:0.83rem;color:var(--gray);">' +
                    '<span><i class="fas fa-tag"></i> ' + escapeHtml(catName) + '</span>' +
                    '<span>' + ratingText + '</span>' +
                    '<span><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(biz.location) + '</span>' +
                '</div>' +
            '</div>' +
            '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
            '<div style="display:flex;gap:6px;">' +
                '<button class="btn-sm edit-biz-btn" data-biz-id="' + biz.id + '" title="Edit"><i class="fas fa-pen"></i></button>' +
                '<a href="../public/business?id=' + biz.id + '" class="btn-sm" title="View"><i class="fas fa-eye"></i></a>' +
                '<button class="btn-sm btn-danger delete-biz-btn" data-biz-id="' + biz.id + '" title="Delete"><i class="fas fa-trash"></i></button>' +
            '</div>';

        container.appendChild(card);
    });

    document.querySelectorAll('.delete-biz-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var bizId = this.getAttribute('data-biz-id');
            var biz = DB.businesses.find(function(b) { return b.id === bizId; });
            var name = biz ? biz.name : 'this business';
            confirmAction('Are you sure you want to delete "' + name + '"? This action cannot be undone.', function() {
                deleteBusiness(bizId);
                showToast('Business deleted successfully', 'success');
                initMyBusinesses();
            });
        });
    });

    document.querySelectorAll('.edit-biz-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var bizId = this.getAttribute('data-biz-id');
            window.location.href = 'add-business?edit=' + bizId;
        });
    });
}

// ===== Favorites Page Init =====
function initFavorites() {
    var user = getCurrentUser();
    if (!user) return;

    var favorites = getUserFavorites(user.id);
    var grid = document.querySelector('.favorites-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (favorites.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;">' +
            '<i class="fas fa-heart" style="font-size:2.5rem;color:var(--gray-light);margin-bottom:12px;display:block;"></i>' +
            '<h4 style="color:var(--gray);margin-bottom:8px;">No favorites yet</h4>' +
            '<p style="color:var(--gray-light);font-size:0.9rem;">Browse businesses and save your favorites here.</p>' +
        '</div>';
        return;
    }

    favorites.forEach(function(fav) {
        var biz = fav.business;
        var cat = DB.categories.find(function(c) { return c.slug === biz.category; });
        var catName = cat ? cat.name : biz.category;
        var catIcon = cat ? cat.icon : 'fa-store';
        var imgBg = getCatColor(biz.category);
        var iconColor = getCatIconColor(biz.category);

        var card = document.createElement('div');
        card.className = 'fav-card';
        card.setAttribute('data-fav-biz', biz.id);

        card.innerHTML =
            '<div class="fav-card-img" style="background:' + imgBg + ';color:' + iconColor + ';">' +
                '<i class="fas ' + catIcon + '"></i>' +
                '<button class="fav-remove" data-biz-id="' + biz.id + '" title="Remove from favorites"><i class="fas fa-heart-broken"></i></button>' +
            '</div>' +
            '<div class="fav-card-body">' +
                '<h4>' + escapeHtml(biz.name) + '</h4>' +
                '<div class="fav-card-category">' + escapeHtml(catName) + '</div>' +
                '<div class="fav-card-rating">' +
                    '<span class="stars">' + renderStars(biz.rating) + '</span>' +
                    '<span>' + biz.rating + ' (' + biz.reviewCount + ' reviews)</span>' +
                '</div>' +
                '<div class="fav-card-footer">' +
                    '<a href="../public/business?id=' + biz.id + '" class="btn-view">View Business</a>' +
                    '<a href="#" class="btn-remove remove-fav-btn" data-biz-id="' + biz.id + '"><i class="fas fa-heart-broken"></i> Remove</a>' +
                '</div>' +
            '</div>';

        grid.appendChild(card);
    });

    grid.querySelectorAll('.fav-remove, .remove-fav-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var bizId = this.getAttribute('data-biz-id');
            toggleFavorite(user.id, bizId);
            showToast('Removed from favorites');
            initFavorites();
        });
    });
}

// ===== Notifications Page Init =====
function initNotifications() {
    var user = getCurrentUser();
    if (!user) return;

    var notifications = getUserNotifications(user.id);
    var container = document.querySelector('.user-main');
    if (!container) return;

    var listCard = container.querySelector('.user-card');
    if (!listCard) return;

    listCard.innerHTML = '';

    if (notifications.length === 0) {
        listCard.innerHTML = '<div style="text-align:center;padding:40px;">' +
            '<i class="fas fa-bell-slash" style="font-size:2.5rem;color:var(--gray-light);margin-bottom:12px;display:block;"></i>' +
            '<h4 style="color:var(--gray);margin-bottom:8px;">No notifications</h4>' +
            '<p style="color:var(--gray-light);font-size:0.9rem;">You\'re all caught up!</p>' +
        '</div>';
        return;
    }

    notifications.forEach(function(n) {
        var iconInfo = getNotifIcon(n.type);
        var unreadClass = n.read ? '' : ' unread';
        var dotHtml = n.read ? '' : '<div class="notif-dot"></div>';

        var item = document.createElement('div');
        item.className = 'notif-item' + unreadClass;
        item.setAttribute('data-notif-id', n.id);

        item.innerHTML =
            '<div class="notif-icon" style="background:' + iconInfo.bg + ';color:' + iconInfo.color + ';">' +
                '<i class="fas ' + iconInfo.icon + '"></i>' +
            '</div>' +
            '<div class="notif-content">' +
                '<p>' + escapeHtml(n.message) + '</p>' +
                '<div class="notif-time">' + timeAgo(n.timestamp) + '</div>' +
            '</div>' +
            dotHtml;

        item.addEventListener('click', function() {
            markNotifRead(n.id);
            this.classList.remove('unread');
            var dot = this.querySelector('.notif-dot');
            if (dot) dot.remove();
            updateNotifBadge();
            if (n.link) {
                window.location.href = n.link;
            }
        });

        listCard.appendChild(item);
    });
}

// ===== Notification Icon Helper =====
function getNotifIcon(type) {
    switch (type) {
        case 'business_approved':
            return { icon: 'fa-check-circle', bg: '#dcfce7', color: 'var(--primary)' };
        case 'message':
            return { icon: 'fa-envelope', bg: '#dbeafe', color: '#2563eb' };
        case 'review':
            return { icon: 'fa-star', bg: '#fef3c7', color: '#d97706' };
        case 'promo':
            return { icon: 'fa-heart', bg: '#fce7f3', color: '#db2777' };
        case 'system':
            return { icon: 'fa-cog', bg: '#e5e7eb', color: '#6b7280' };
        default:
            return { icon: 'fa-bell', bg: '#dbeafe', color: '#2563eb' };
    }
}

// ===== Update Notification Badge in Sidebar =====
function updateNotifBadge() {
    var user = getCurrentUser();
    if (!user) return;
    var count = getUnreadNotifCount(user.id);
    var badges = document.querySelectorAll('.notif-badge');
    badges.forEach(function(badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? '' : 'none';
    });
}

// ===== Messages Page Init =====
function initMessages() {
    var user = getCurrentUser();
    if (!user) return;

    var conversations = getUserConversations(user.id);
    var convList = document.querySelector('.conversations-list');
    if (!convList) return;

    var header = convList.querySelector('.conversations-header');
    convList.innerHTML = '';
    if (header) convList.appendChild(header);

    if (conversations.length === 0) {
        var empty = document.createElement('div');
        empty.style.cssText = 'text-align:center;padding:40px 20px;';
        empty.innerHTML = '<i class="fas fa-comments" style="font-size:2rem;color:var(--gray-light);margin-bottom:10px;display:block;"></i>' +
            '<p style="color:var(--gray);font-size:0.9rem;">No conversations yet.</p>';
        convList.appendChild(empty);
        return;
    }

    conversations.sort(function(a, b) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    var activeConvId = null;

    conversations.forEach(function(conv) {
        var otherId = conv.participants.find(function(p) { return p !== user.id; });
        var other = DB.users.find(function(u) { return u.id === otherId; });
        var otherName = other ? other.name : 'Unknown User';
        var initials = getInitials(otherName);
        var colors = ['#f59e0b,#d97706', '#3b82f6,#2563eb', '#8b5cf6,#7c3aed', '#ec4899,#db2777', '#10b981,#059669'];
        var colorIdx = conv.participants.indexOf(user.id) % colors.length;

        var item = document.createElement('div');
        item.className = 'conversation-item';
        item.setAttribute('data-conv-id', conv.id);

        item.innerHTML =
            '<div class="conv-avatar" style="background:linear-gradient(135deg,' + colors[colorIdx] + ');">' + initials + '</div>' +
            '<div class="conv-info">' +
                '<div class="conv-name">' + escapeHtml(otherName) + '</div>' +
                '<div class="conv-preview">' + escapeHtml(conv.lastMessage) + '</div>' +
            '</div>' +
            '<span class="conv-time">' + timeAgo(conv.lastMessageTime) + '</span>';

        item.addEventListener('click', function() {
            document.querySelectorAll('.conversation-item').forEach(function(ci) {
                ci.classList.remove('active');
            });
            this.classList.add('active');
            activeConvId = conv.id;
            renderMessageArea(conv, user, otherName, colors[colorIdx]);
        });

        convList.appendChild(item);
    });

    if (conversations.length > 0) {
        var firstConv = conversations[0];
        var firstOtherId = firstConv.participants.find(function(p) { return p !== user.id; });
        var firstOther = DB.users.find(function(u) { return u.id === firstOtherId; });
        var firstName = firstOther ? firstOther.name : 'Unknown User';
        var firstItem = convList.querySelector('.conversation-item');
        if (firstItem) firstItem.classList.add('active');
        var firstColors = ['#f59e0b,#d97706', '#3b82f6,#2563eb', '#8b5cf6,#7c3aed', '#ec4899,#db2777', '#10b981,#059669'];
        var firstColorIdx = firstConv.participants.indexOf(user.id) % firstColors.length;
        renderMessageArea(firstConv, user, firstName, firstColors[firstColorIdx]);
    }
}

// ===== Render Message Area =====
function renderMessageArea(conv, user, otherName, colorGradient) {
    var messageArea = document.querySelector('.message-area');
    if (!messageArea) return;

    var initials = getInitials(otherName);
    var messages = getConversationMessages(conv.id);

    var headerHtml = '<div class="message-header">' +
        '<div class="conv-avatar" style="width:36px;height:36px;font-size:0.8rem;background:linear-gradient(135deg,' + colorGradient + ');">' + initials + '</div>' +
        '<div>' +
            '<h4>' + escapeHtml(otherName) + '</h4>' +
            '<span>Online</span>' +
        '</div>' +
    '</div>';

    var bodyHtml = '<div class="message-body" id="messageBody">';
    messages.forEach(function(msg) {
        var isSent = msg.senderId === user.id;
        var bubbleClass = isSent ? 'msg-sent' : 'msg-received';
        var time = new Date(msg.timestamp);
        var timeStr = time.getHours() + ':' + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes();

        if (msg.type === 'image' && msg.fileUrl) {
            bodyHtml += '<div class="msg-bubble ' + bubbleClass + '">' +
                '<img src="' + escapeHtml(msg.fileUrl) + '" alt="Image" style="max-width:200px;border-radius:8px;margin-bottom:4px;">' +
                (msg.text ? '<div>' + escapeHtml(msg.text) + '</div>' : '') +
                '<div class="msg-time">' + timeStr + '</div>' +
            '</div>';
        } else {
            bodyHtml += '<div class="msg-bubble ' + bubbleClass + '">' +
                escapeHtml(msg.text) +
                '<div class="msg-time">' + timeStr + '</div>' +
            '</div>';
        }
    });
    bodyHtml += '</div>';

    var inputHtml = '<div class="message-input">' +
        '<input type="text" id="msgInput" placeholder="Type a message...">' +
        '<button class="btn-send" id="sendBtn"><i class="fas fa-paper-plane"></i></button>' +
    '</div>';

    messageArea.innerHTML = headerHtml + bodyHtml + inputHtml;

    var msgBody = document.getElementById('messageBody');
    if (msgBody) msgBody.scrollTop = msgBody.scrollHeight;

    var msgInput = document.getElementById('msgInput');
    var sendBtn = document.getElementById('sendBtn');

    function doSend() {
        var text = msgInput.value.trim();
        if (!text) return;
        sendMessage(conv.id, user.id, text, 'text', null);
        msgInput.value = '';
        renderMessageArea(conv, user, otherName, colorGradient);
        showToast('Message sent', 'success');
    }

    if (sendBtn) sendBtn.addEventListener('click', doSend);
    if (msgInput) {
        msgInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') doSend();
        });
        msgInput.focus();
    }
}

// ===== Profile Page Init =====
function initProfile() {
    var user = getCurrentUser();
    if (!user) return;

    var initials = getInitials(user.name);

    document.querySelectorAll('.user-avatar').forEach(function(avatar) {
        var parent = avatar.closest('.user-sidebar-header') || avatar.closest('.user-card');
        if (parent) avatar.textContent = initials;
    });

    var nameEl = document.querySelector('.user-card h2');
    if (nameEl) nameEl.textContent = user.name;

    var emailEls = document.querySelectorAll('.user-card p');
    emailEls.forEach(function(el) {
        if (el.textContent.indexOf('@') !== -1) el.textContent = user.email;
    });

    var fullNameInput = document.getElementById('fullName');
    var emailInput = document.getElementById('email');
    var phoneInput = document.getElementById('phone');
    var locationInput = document.getElementById('location');
    var bioInput = document.getElementById('bio');

    if (fullNameInput) fullNameInput.value = user.name;
    if (emailInput) emailInput.value = user.email;
    if (phoneInput) phoneInput.value = user.phone || '';
    if (locationInput) locationInput.value = user.location || '';
    if (bioInput) bioInput.value = user.bio || '';

    var saveBtn = document.querySelector('.user-card .btn-primary');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            var data = {};
            if (fullNameInput) data.name = fullNameInput.value.trim();
            if (emailInput) data.email = emailInput.value.trim();
            if (phoneInput) data.phone = phoneInput.value.trim();
            if (locationInput) data.location = locationInput.value.trim();
            if (bioInput) data.bio = bioInput.value.trim();

            if (!data.name) {
                showToast('Name is required', 'error');
                return;
            }

            updateProfile(user.id, data);
            initUserSidebar();
            showToast('Profile updated successfully', 'success');
        });
    }
}

// ===== Settings Page Init =====
function initSettings() {
    var passwordBtn = document.querySelector('.user-card .btn-primary');
    var checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');

    document.querySelectorAll('.user-card .btn-primary').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var card = this.closest('.user-card');
            if (!card) return;

            var h3 = card.querySelector('h3');
            if (h3 && h3.textContent.indexOf('Password') !== -1) {
                var current = document.getElementById('currentPassword');
                var newPass = document.getElementById('newPassword');
                var confirm = document.getElementById('confirmPassword');

                if (!current || !newPass || !confirm) return;

                if (!current.value || !newPass.value || !confirm.value) {
                    showToast('Please fill in all password fields', 'error');
                    return;
                }
                if (newPass.value !== confirm.value) {
                    showToast('New passwords do not match', 'error');
                    return;
                }
                if (newPass.value.length < 6) {
                    showToast('Password must be at least 6 characters', 'error');
                    return;
                }

                current.value = '';
                newPass.value = '';
                confirm.value = '';
                showToast('Password updated successfully', 'success');
            } else if (h3 && h3.textContent.indexOf('Notification') !== -1) {
                showToast('Notification preferences saved', 'success');
            }
        });
    });

    var dangerBtn = document.querySelector('.danger-zone .btn-danger');
    if (dangerBtn) {
        dangerBtn.addEventListener('click', function() {
            confirmAction('Are you absolutely sure you want to delete your account? This action cannot be undone.', function() {
                showToast('Account deletion is not available in demo mode', 'warning');
            });
        });
    }
}

// ===== Add Business Page Init =====
function initAddBusiness() {
    var user = getCurrentUser();
    if (!user) return;

    document.querySelectorAll('.day-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    var uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            showToast('Photo upload is simulated in demo mode');
        });
    }

    var urlParams = new URLSearchParams(window.location.search);
    var editId = urlParams.get('edit');

    if (editId) {
        var biz = DB.businesses.find(function(b) { return b.id === editId; });
        if (biz) {
            var titleH2 = document.querySelector('.page-header h2');
            if (titleH2) titleH2.textContent = 'Edit Business';

            var nameInput = document.getElementById('bizName');
            var categorySelect = document.getElementById('bizCategory');
            var descInput = document.getElementById('bizDesc');
            var addressInput = document.getElementById('bizAddress');
            var phoneInput = document.getElementById('bizPhone');
            var emailInput = document.getElementById('bizEmail');
            var websiteInput = document.getElementById('bizWebsite');

            if (nameInput) nameInput.value = biz.name || '';
            if (descInput) descInput.value = biz.description || '';
            if (addressInput) addressInput.value = biz.address || '';
            if (phoneInput) phoneInput.value = biz.phone || '';
            if (emailInput) emailInput.value = biz.email || '';
            if (websiteInput) websiteInput.value = biz.website || '';

            if (categorySelect) {
                var cat = DB.categories.find(function(c) { return c.slug === biz.category; });
                if (cat) {
                    for (var i = 0; i < categorySelect.options.length; i++) {
                        if (categorySelect.options[i].text === cat.name) {
                            categorySelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }
        }
    }

    var form = document.querySelector('.user-main form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var name = document.getElementById('bizName');
            var category = document.getElementById('bizCategory');
            var desc = document.getElementById('bizDesc');
            var address = document.getElementById('bizAddress');
            var phone = document.getElementById('bizPhone');

            if (!name || !name.value.trim()) {
                showToast('Business name is required', 'error');
                return;
            }
            if (!category || !category.value) {
                showToast('Please select a category', 'error');
                return;
            }
            if (!desc || !desc.value.trim()) {
                showToast('Business description is required', 'error');
                return;
            }
            if (!address || !address.value.trim()) {
                showToast('Address is required', 'error');
                return;
            }
            if (!phone || !phone.value.trim()) {
                showToast('Phone number is required', 'error');
                return;
            }

            var catOption = category.options[category.selectedIndex];
            var catSlug = getSlugFromCategoryName(catOption.text);

            var activeDays = [];
            document.querySelectorAll('.day-chip.active').forEach(function(chip) {
                activeDays.push(chip.textContent);
            });

            var openTime = document.getElementById('openTime');
            var closeTime = document.getElementById('closeTime');
            var hours = 'Mon-' + activeDays[activeDays.length - 1] + ': ' +
                (openTime ? openTime.value : '08:00') + ' - ' +
                (closeTime ? closeTime.value : '20:00');

            var bizData = {
                ownerId: user.id,
                name: name.value.trim(),
                category: catSlug,
                subcategory: catOption.text,
                description: desc.value.trim(),
                location: user.location || 'Kuje',
                address: address.value.trim(),
                phone: phone.value.trim(),
                email: document.getElementById('bizEmail') ? document.getElementById('bizEmail').value.trim() : '',
                website: document.getElementById('bizWebsite') ? document.getElementById('bizWebsite').value.trim() : null,
                images: ['https://picsum.photos/seed/' + name.value.replace(/\s+/g, '') + '1/800/600'],
                openingHours: hours,
                status: 'pending'
            };

            saveBusiness(bizData, editId);
            showToast(editId ? 'Business updated successfully' : 'Business submitted for review', 'success');
            setTimeout(function() {
                window.location.href = 'my-businesses';
            }, 1000);
        });
    }
}

// ===== Get Slug From Category Name =====
function getSlugFromCategoryName(name) {
    var cat = DB.categories.find(function(c) { return c.name === name; });
    if (cat) return cat.slug;
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ===== Notification Tab Filtering =====
function initNotifTabs() {
    var tabs = document.querySelectorAll('.notif-tab');
    var user = getCurrentUser();
    if (!user || !tabs.length) return;

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');

            var filter = tab.textContent.trim().toLowerCase();
            var items = document.querySelectorAll('.notif-item');

            items.forEach(function(item) {
                var notifId = item.getAttribute('data-notif-id');
                var notif = DB.notifications.find(function(n) { return n.id === notifId; });
                if (!notif) return;

                if (filter === 'all') {
                    item.style.display = '';
                } else if (filter === 'messages') {
                    item.style.display = notif.type === 'message' ? '' : 'none';
                } else if (filter === 'reviews') {
                    item.style.display = notif.type === 'review' ? '' : 'none';
                } else if (filter === 'business') {
                    item.style.display = (notif.type === 'business_approved' || notif.type === 'promo') ? '' : 'none';
                }
            });
        });
    });
}

// ===== Mark All Notifications Read =====
function initMarkAllRead() {
    var btn = document.querySelector('.page-header .btn-sm');
    if (!btn) return;

    var h2 = document.querySelector('.page-header h2');
    if (!h2 || h2.textContent.indexOf('Notification') === -1) return;

    btn.addEventListener('click', function() {
        var user = getCurrentUser();
        if (!user) return;
        markAllNotifsRead(user.id);
        document.querySelectorAll('.notif-item').forEach(function(item) {
            item.classList.remove('unread');
            var dot = item.querySelector('.notif-dot');
            if (dot) dot.remove();
        });
        updateNotifBadge();
        showToast('All notifications marked as read', 'success');
    });
}

// ===== Favorite Toggle on Business Cards =====
function initFavoriteButtons() {
    document.addEventListener('click', function(e) {
        var btn = e.target.closest('.wishlist-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();

        var bizId = btn.getAttribute('data-biz-id');
        if (!bizId) return;

        var user = getCurrentUser();
        if (!user) return;

        var added = toggleFavorite(user.id, bizId);
        var icon = btn.querySelector('i');
        if (icon) {
            if (added) {
                icon.className = icon.className.replace('far', 'fas');
                btn.classList.add('active');
                showToast('Added to favorites!', 'success');
            } else {
                icon.className = icon.className.replace('fas', 'far');
                btn.classList.remove('active');
                showToast('Removed from favorites');
            }
        }
    });
}

// ===== Sidebar Mobile Toggle =====
function initUserSidebarMobile() {
    var hamburger = document.querySelector('.topbar-hamburger');
    var sidebar = document.querySelector('.user-sidebar');
    var main = document.querySelector('.user-main');

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

// ===== Logout Handler =====
function initLogout() {
    document.querySelectorAll('.user-nav-item.logout').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            confirmAction('Are you sure you want to logout?', function() {
                showToast('Logged out successfully');
                setTimeout(function() {
                    window.location.href = '../..';
                }, 500);
            });
        });
    });
}

// ===== Page Router =====
function initUserPage() {
    var path = window.location.pathname;
    var page = path.split('/').pop().replace('.html', '') || 'dashboard';

    initUserSidebar();
    initUserSidebarMobile();
    initUserDropdown();
    initFavoriteButtons();
    initLogout();
    updateNotifBadge();

    switch (page) {
        case 'dashboard':
            initDashboard();
            break;
        case 'my-businesses':
            initMyBusinesses();
            break;
        case 'favorites':
            initFavorites();
            break;
        case 'notifications':
            initNotifications();
            initNotifTabs();
            initMarkAllRead();
            break;
        case 'messages':
            initMessages();
            break;
        case 'profile':
            initProfile();
            break;
        case 'settings':
            initSettings();
            break;
        case 'add-business':
            initAddBusiness();
            break;
    }
}

// ===== Auto-Initialize =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserPage);
} else {
    initUserPage();
}
