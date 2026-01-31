// Made by Kulit
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('side-nav');
  var overlay = document.getElementById('nav-overlay');
  var body = document.body;

  function openNav() {
    body.classList.add('nav-open');
    if (btn) {
      btn.setAttribute('aria-label', 'Close menu');
      btn.setAttribute('aria-expanded', 'true');
    }
    document.documentElement.style.overflow = 'hidden';
  }

  function closeNav() {
    body.classList.remove('nav-open');
    if (btn) {
      btn.setAttribute('aria-label', 'Open menu');
      btn.setAttribute('aria-expanded', 'false');
    }
    document.documentElement.style.overflow = '';
  }

  function toggleNav() {
    if (body.classList.contains('nav-open')) closeNav();
    else openNav();
  }

  if (btn) {
    btn.addEventListener('click', toggleNav);
  }
  if (overlay) {
    overlay.addEventListener('click', closeNav);
  }

  // Function to show a content section
  function showSection(sectionId, updateUrl) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(function (section) {
      section.classList.remove('active');
    });
    
    // Show the selected section (fallback to home if section doesn't exist)
    var targetSection = document.getElementById(sectionId);
    if (!targetSection) {
      sectionId = 'home';
      targetSection = document.getElementById('home');
    }
    if (targetSection) {
      targetSection.classList.add('active');
      
      // Wait a moment for display to update, then scroll to top
      setTimeout(function() {
        var sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset;
        var offset = 20; // Small offset from top
        
        // Special handling for menu section (account for sticky tabs)
        if (sectionId === 'menu') {
          offset = 20; // Small padding for menu
        }
        
        window.scrollTo({
          top: sectionTop - offset,
          behavior: 'smooth'
        });
      }, 50); // Small delay to ensure section is visible
    }
    
    // Update active nav link
    document.querySelectorAll('.side-nav a').forEach(function (a) {
      a.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
    var activeLink = document.querySelector('.side-nav a[href="#' + sectionId + '"]');
    if (activeLink) {
      activeLink.classList.add('active');
    }
    
    // Update URL hash if requested
    if (updateUrl !== false && history.pushState) {
      history.pushState(null, null, '#' + sectionId);
    }
  }

  // Handle navigation link clicks
  if (nav) {
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        
        var href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          var sectionId = href.substring(1); // Remove the #
          showSection(sectionId);
          
          // Close mobile menu if open
          if (window.innerWidth <= 768) {
            closeNav();
          }
        }
      });
    });
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeNav();
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function () {
    var hash = window.location.hash.substring(1);
    if (hash) {
      showSection(hash, false); // Don't update URL since browser already did
    } else {
      showSection('home', false);
    }
  });

  // Check for hash on page load
  if (window.location.hash) {
    var hash = window.location.hash.substring(1);
    // Small delay to ensure page is fully loaded before scrolling
    setTimeout(function() {
      showSection(hash, false); // Don't update URL on initial load
    }, 100);
  } else {
    showSection('home', false); // Show home by default without updating URL
    // Scroll to top on initial load
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Menu/Products category tabs - scroll to sections
  var menuTabs = document.querySelectorAll('.menu-tab');
  var menuPanels = document.querySelectorAll('.menu-category-panel');
  var menuSection = document.getElementById('menu');
  
  if (menuTabs.length > 0) {
    menuTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var category = tab.getAttribute('data-category');
      if (!category) return;
      
      // Update tabs
      menuTabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Scroll to the target panel
      var targetPanel = document.getElementById('panel-' + category);
      if (targetPanel && menuSection) {
        // First, make sure we're on the menu section
        var menuSectionTop = menuSection.getBoundingClientRect().top + window.pageYOffset;
        var targetPanelTop = targetPanel.getBoundingClientRect().top + window.pageYOffset;
        
        // Calculate scroll position (small offset for spacing)
        var scrollOffset = 20;
        var scrollTo = targetPanelTop - scrollOffset;
        
        // Smooth scroll to the panel
        window.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    });
    });
  }
  
  // Update active tab based on scroll position
  function updateActiveTabOnScroll() {
    if (!menuSection) return;
    
    var menuTop = menuSection.getBoundingClientRect().top;
    var menuBottom = menuSection.getBoundingClientRect().bottom;
    
    // Only update if menu section is visible
    if (menuTop > window.innerHeight || menuBottom < 0) return;
    
    var scrollPosition = window.pageYOffset + 50; // Small offset
    
    menuPanels.forEach(function (panel) {
      var panelTop = panel.getBoundingClientRect().top + window.pageYOffset;
      var panelBottom = panelTop + panel.offsetHeight;
      
      if (scrollPosition >= panelTop && scrollPosition < panelBottom) {
        var category = panel.id.replace('panel-', '');
        menuTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        var activeTab = document.querySelector('.menu-tab[data-category="' + category + '"]');
        if (activeTab) {
          activeTab.classList.add('active');
          activeTab.setAttribute('aria-selected', 'true');
        }
      }
    });
  }
  
  // Throttle scroll event for performance
  var scrollTimeout;
  window.addEventListener('scroll', function () {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(updateActiveTabOnScroll, 100);
  });

  // Countdown Timer for Special Offer
  function updateCountdown() {
    var countdownTimer = document.getElementById('countdown-timer');
    if (!countdownTimer) return;

    // Set end date: February 14, 2026 at 11:59 PM
    var endDate = new Date('February 14, 2026 23:59:59').getTime();
    var now = new Date().getTime();
    var distance = endDate - now;

    var daysEl = document.getElementById('days');
    var hoursEl = document.getElementById('hours');
    var minutesEl = document.getElementById('minutes');
    var secondsEl = document.getElementById('seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance < 0) {
      // Offer has ended
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (countdownTimer && countdownTimer.parentElement) {
        var ended = document.createElement('p');
        ended.style.cssText = 'color: var(--valentine-rose); font-weight: 600;';
        ended.textContent = '⏰ This offer has ended';
        countdownTimer.innerHTML = '';
        countdownTimer.appendChild(ended);
      }
      return;
    }

    // Calculate time units
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update display with leading zeros
    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  // Update countdown immediately and then every second
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Back to Top Button
  var backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Check scroll position
    window.addEventListener('scroll', function() {
      toggleBackToTop();
    });

    // Initial check
    toggleBackToTop();
  }

  // Gallery & Product Image Lightbox (tap/click image to view bigger)
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    function openLightbox(src, caption) {
      lightboxImg.src = src;
      lightboxImg.alt = caption || 'Gallery image';
      lightboxCaption.textContent = caption || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
      document.documentElement.style.overflow = '';
    }

    // Open on gallery image click
    document.querySelectorAll('#gallery .gallery-item img').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        var src = img.currentSrc || img.getAttribute('src') || '';
        // If it’s an Unsplash thumbnail, load a higher-res version
        if (src.indexOf('images.unsplash.com') !== -1) {
          src = src.replace(/w=\d+/g, 'w=1400').replace(/h=\d+/g, 'h=1400');
        }
        openLightbox(src, img.getAttribute('alt') || '');
      });
    });

    // Open on menu product image click (click photo to view bigger)
    var menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.addEventListener('click', function (e) {
        var img = e.target.closest('.menu-product-img img') || e.target.closest('.menu-product-img');
        if (!img) return;
        var photo = img.tagName === 'IMG' ? img : img.querySelector('img');
        if (!photo) return;
        e.preventDefault();
        e.stopPropagation();
        var src = photo.currentSrc || photo.getAttribute('src') || '';
        if (!src) return;
        var card = photo.closest('.menu-product-card');
        var caption = '';
        if (card) {
          var heading = card.querySelector('.menu-product-body h3');
          if (heading) caption = heading.textContent.replace(/\s+/g, ' ').trim();
        }
        if (!caption) caption = photo.getAttribute('alt') || 'Product';
        openLightbox(src, caption);
      });
      // Make all menu product image areas look clickable
      menuSection.querySelectorAll('.menu-product-img').forEach(function (el) {
        el.style.cursor = 'pointer';
        el.setAttribute('title', 'Click to view larger');
      });
    }

    // Open on Home Best Sellers image click (click photo to view bigger)
    var homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.addEventListener('click', function (e) {
        var media = e.target.closest('.best-seller-media img') || e.target.closest('.best-seller-media');
        if (!media) return;
        var photo = media.tagName === 'IMG' ? media : media.querySelector('img');
        if (!photo) return;
        e.preventDefault();
        e.stopPropagation();
        var src = photo.currentSrc || photo.getAttribute('src') || '';
        if (!src) return;
        if (src.indexOf('images.unsplash.com') !== -1) {
          src = src.replace(/w=\d+/g, 'w=1400').replace(/h=\d+/g, 'h=1400');
        }
        var card = photo.closest('.best-seller-card');
        var caption = '';
        if (card) {
          var heading = card.querySelector('.best-seller-info h3');
          if (heading) caption = heading.textContent.replace(/\s+/g, ' ').trim();
        }
        if (!caption) caption = photo.getAttribute('alt') || 'Best Seller';
        openLightbox(src, caption);
      });
      homeSection.querySelectorAll('.best-seller-media').forEach(function (el) {
        el.style.cursor = 'pointer';
        el.setAttribute('title', 'Click to view larger');
      });
    }

    // Close on backdrop / close button
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        closeLightbox();
      });
    });

    // Close on ESC
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLightbox);
  } else {
    initLightbox();
  }
})();
