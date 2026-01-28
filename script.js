// Made by Kulit
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('side-nav');
  var overlay = document.getElementById('nav-overlay');
  var body = document.body;

  function openNav() {
    body.classList.add('nav-open');
    btn.setAttribute('aria-label', 'Close menu');
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
  }

  function closeNav() {
    body.classList.remove('nav-open');
    btn.setAttribute('aria-label', 'Open menu');
    btn.setAttribute('aria-expanded', 'false');
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
    
    // Show the selected section
    var targetSection = document.getElementById(sectionId);
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

  // Floating Hearts Animation
  function createFloatingHeart() {
    var heartsContainer = document.getElementById('floating-hearts');
    if (!heartsContainer) return;

    var heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    // Random heart color
    var colors = ['heart-red', 'heart-pink', 'heart-light'];
    heart.classList.add(colors[Math.floor(Math.random() * colors.length)]);
    
    // Random starting position anywhere on screen
    var isMobile = window.innerWidth <= 768;
    var minX = isMobile ? 5 : 20; // Avoid sidebar area on desktop
    var maxX = 95; // Don't go too far right
    var startX = Math.random() * (maxX - minX) + minX;
    
    // Random Y position (from 20% to 80% of screen height)
    var startY = Math.random() * 60 + 20; // 20% to 80%
    
    heart.style.left = startX + '%';
    heart.style.top = startY + '%';
    heart.style.bottom = 'auto';
    
    // Calculate float distance (always float upward by viewport height + extra)
    var viewportHeight = window.innerHeight;
    var floatDistance = viewportHeight + 200; // Always float up by full viewport + 200px
    heart.style.setProperty('--float-distance', floatDistance + 'px');
    
    // Random size
    var size = Math.random() * 1.2 + 0.8; // 0.8x to 2x
    heart.style.fontSize = (size * 2) + 'rem';
    
    // Random horizontal drift (more drift for balloon effect)
    var drift = (Math.random() - 0.5) * 150; // -75px to +75px
    heart.style.setProperty('--drift', drift + 'px');
    
    // Random animation duration for variety (longer since hearts stay visible)
    var duration = Math.random() * 2 + 5; // 5-7 seconds
    heart.style.animationDuration = duration + 's';
    
    // Heart emoji (variety)
    var hearts = ['💝', '💖', '💗', '💕', '💓'];
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.setAttribute('aria-hidden', 'true');
    
    // Add click/touch handler to pop the heart
    var popHeart = function(e) {
      e.stopPropagation();
      if (heart.classList.contains('pop')) return; // Already popping
      
      // Get heart position for splash effect
      var rect = heart.getBoundingClientRect();
      var heartX = rect.left + rect.width / 2;
      var heartY = rect.top + rect.height / 2;
      var heartColor = window.getComputedStyle(heart).color;
      
      // Create splash particles
      var particleCount = 16;
      var particles = ['💝', '💖', '💗', '💕', '💓', '✨', '⭐', '💫', '🌟', '💞'];
      
      for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.className = 'heart-splash';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = heartX + 'px';
        particle.style.top = heartY + 'px';
        particle.style.color = heartColor;
        particle.style.position = 'fixed';
        particle.style.zIndex = '9999';
        
        // Random direction for splash (360 degrees)
        var angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        var distance = 100 + Math.random() * 60; // 100-160px distance
        var splashX = Math.cos(angle) * distance;
        var splashY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--splash-x', splashX + 'px');
        particle.style.setProperty('--splash-y', splashY + 'px');
        
        // Random size and delay
        var size = 0.7 + Math.random() * 0.8;
        particle.style.fontSize = (size * 1.3) + 'rem';
        particle.style.animationDelay = (Math.random() * 0.1) + 's';
        
        // Random rotation
        var rotation = Math.random() * 720 - 360; // -360 to 360 degrees
        particle.style.setProperty('--splash-rotate', rotation + 'deg');
        
        document.body.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(function() {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 800);
      }
      
      // Stop the float animation and start pop animation
      heart.style.animation = 'none';
      heart.offsetHeight; // Force reflow
      heart.classList.add('pop');
      
      // Remove heart after pop animation completes
      setTimeout(function() {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 500); // Pop animation duration
    };
    
    heart.addEventListener('click', popHeart);
    heart.addEventListener('touchstart', popHeart, { passive: true });
    
    heartsContainer.appendChild(heart);
    
    // Remove heart after float animation completes (if not popped)
    setTimeout(function() {
      if (heart.parentNode && !heart.classList.contains('pop')) {
        heart.parentNode.removeChild(heart);
      }
    }, duration * 1000);
  }

  // Create hearts periodically
  function startHeartAnimation() {
    // Create first heart after 1 second
    setTimeout(function() {
      createFloatingHeart();
      
      // Then create hearts every 2-4 seconds
      var createNextHeart = function() {
        var delay = Math.random() * 2000 + 2000; // 2-4 seconds
        setTimeout(function() {
          createFloatingHeart();
          createNextHeart();
        }, delay);
      };
      createNextHeart();
    }, 1000);
  }

  // Start animation when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHeartAnimation);
  } else {
    startHeartAnimation();
  }

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
      if (countdownTimer.parentElement) {
        countdownTimer.innerHTML = '<p style="color: var(--valentine-rose); font-weight: 600;">⏰ This offer has ended</p>';
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
})();
