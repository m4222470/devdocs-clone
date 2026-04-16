/**
 * Devdocs X - Pure JavaScript
 * No external dependencies, no tracking
 */

// ===== Theme Management =====
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.setTheme(this.theme);
    this.bindEvents();
  }

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle button aria-label
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  toggle() {
    this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  bindEvents() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => this.toggle());
    }

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }
}

// ===== Mobile Navigation =====
class MobileNav {
  constructor() {
    this.toggle = document.getElementById('mobileMenuToggle');
    this.nav = document.getElementById('mobileNav');
    this.isOpen = false;
    this.init();
  }

  init() {
    if (this.toggle && this.nav) {
      this.toggle.addEventListener('click', () => this.toggleMenu());
      document.addEventListener('click', (e) => this.handleOutsideClick(e));
      
      // Close on link click
      const links = this.nav.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => this.close());
      });
    }
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.nav.classList.toggle('active', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
    
    // Animate hamburger
    const spans = this.toggle.querySelectorAll('span');
    if (this.isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }

  handleOutsideClick(e) {
    if (this.isOpen && !this.nav.contains(e.target) && !this.toggle.contains(e.target)) {
      this.toggleMenu();
    }
  }

  close() {
    this.isOpen = false;
    this.nav.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset hamburger
    const spans = this.toggle?.querySelectorAll('span');
    if (spans) {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }
}

// ===== Scroll Animations =====
class ScrollAnimations {
  constructor() {
    this.animatedElements = [];
    this.init();
  }

  init() {
    this.setupAnimatedElements();
    this.setupIntersectionObserver();
    this.setupScrollProgress();
    this.setupBackToTop();
  }

  setupAnimatedElements() {
    this.animatedElements = document.querySelectorAll(
      '.feature-card, .page-card, .section-header, .hero-content, .hero-visual'
    );
    
    this.animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback for older browsers
      this.animatedElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.animatedElements.forEach((el, index) => {
      el.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(el);
    });
  }

  setupScrollProgress() {
    const existing = document.querySelector('.scroll-progress');
    if (existing) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
          progressBar.style.width = scrolled + '%';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupBackToTop() {
    const existing = document.querySelector('.back-to-top');
    if (existing) return;

    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 15V5M5 10L10 5L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
          } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    backToTop.addEventListener('mouseenter', () => {
      backToTop.style.transform = 'translateY(-5px)';
    });

    backToTop.addEventListener('mouseleave', () => {
      backToTop.style.transform = 'translateY(0)';
    });
  }
}

// ===== Smooth Scroll =====
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const header = document.querySelector('.header');
          const headerHeight = header?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ===== Lazy Load Images =====
class LazyLoad {
  constructor() {
    this.init();
  }

  init() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              delete img.dataset.src;
            }
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  new ThemeManager();
  new MobileNav();
  new ScrollAnimations();
  new SmoothScroll();
  new LazyLoad();
  
  // Add skip link for accessibility
  if (!document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
  }
  
  // Log initialization
  console.log('Devdocs X initialized successfully');
});

// ===== Utility Functions =====

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Get scroll position
function getScrollPosition() {
  return {
    x: window.scrollX || document.documentElement.scrollLeft,
    y: window.scrollY || document.documentElement.scrollTop
  };
}

// Scroll to element
function scrollToElement(element, offset = 0) {
  const position = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: position,
    behavior: 'smooth'
  });
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ===== Export for use in other files =====
window.DevdocsUtils = {
  debounce,
  throttle,
  getScrollPosition,
  scrollToElement,
  isInViewport
};