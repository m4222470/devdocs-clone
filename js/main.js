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
    
    // Update toggle button
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
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
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
  }
}

// ===== Search Functionality =====
class Search {
  constructor() {
    this.searchInput = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');
    this.debounceTimer = null;
    this.init();
  }

  init() {
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
      this.searchInput.addEventListener('focus', () => this.showResults());
      document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }
  }

  handleSearch(e) {
    const query = e.target.value.trim();
    
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (query.length > 2) {
        this.performSearch(query);
      } else {
        this.clearResults();
      }
    }, 300);
  }

  performSearch(query) {
    // Simple local search - search through page content
    const searchableElements = document.querySelectorAll('.doc-content, .feature-card, .page-card');
    const results = [];
    
    searchableElements.forEach((element) => {
      const text = element.textContent.toLowerCase();
      const title = element.querySelector('h2, h3, h4')?.textContent.toLowerCase() || '';
      
      if (text.includes(query.toLowerCase()) || title.includes(query.toLowerCase())) {
        results.push({
          title: title || 'Untitled',
          snippet: this.createSnippet(element.textContent, query),
          element: element
        });
      }
    });
    
    this.displayResults(results);
  }

  createSnippet(text, query) {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + query.length + 50);
    let snippet = text.slice(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    return snippet;
  }

  displayResults(results) {
    if (!this.searchResults) return;
    
    if (results.length === 0) {
      this.searchResults.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }
    
    this.searchResults.innerHTML = results.map(result => `
      <div class="search-result" data-element="${result.element}">
        <h4 class="result-title">${result.title}</h4>
        <p class="result-snippet">${result.snippet}</p>
      </div>
    `).join('');
  }

  clearResults() {
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
    }
  }

  showResults() {
    if (this.searchResults && this.searchInput.value.trim()) {
      this.searchResults.style.display = 'block';
    }
  }

  handleOutsideClick(e) {
    if (this.searchResults && !this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
      this.searchResults.style.display = 'none';
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
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--primary-600), var(--primary-400));
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  setupBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 15V5M5 10L10 5L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    backToTop.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--primary-600);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      z-index: 999;
    `;
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
      } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
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

// ===== Code Syntax Highlighting =====
class SyntaxHighlighter {
  constructor() {
    this.init();
  }

  init() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => this.highlightBlock(block));
  }

  highlightBlock(block) {
    const code = block.textContent;
    const highlighted = this.highlight(code);
    block.innerHTML = highlighted;
  }

  highlight(code) {
    // Simple syntax highlighting
    return code
      // Comments
      .replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>')
      // Strings
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="code-string">$1</span>')
      // Keywords
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|new|this|typeof|instanceof)\b/g, '<span class="code-keyword">$1</span>')
      // Numbers
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>')
      // Functions
      .replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="code-function">$1</span>(')
      // Operators
      .replace(/([+\-*/%=<>!&|])/g, '<span class="code-operator">$1</span>');
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
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
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

// ===== Form Validation =====
class FormValidator {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }

  init() {
    this.forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
      this.addValidationListeners(form);
    });
  }

  addValidationListeners(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.required;
    
    // Clear previous error
    this.clearError(input);
    
    // Required check
    if (required && !value) {
      this.showError(input, 'This field is required');
      return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(input, 'Please enter a valid email address');
        return false;
      }
    }
    
    return true;
  }

  showError(input, message) {
    input.classList.add('error');
    
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    input.parentNode.appendChild(error);
  }

  clearError(input) {
    input.classList.remove('error');
    const error = input.parentNode.querySelector('.error-message');
    if (error) {
      error.remove();
    }
  }

  handleSubmit(e) {
    const form = e.target;
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      e.preventDefault();
    }
  }
}

// ===== Copy Code Button =====
class CopyCode {
  constructor() {
    this.buttons = document.querySelectorAll('.copy-code');
    this.init();
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('click', () => this.copyCode(button));
    });
  }

  copyCode(button) {
    const codeBlock = button.closest('.code-block').querySelector('code');
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    });
  }
}

// ===== Lazy Load Images =====
class LazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      this.images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      this.images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  }
}

// ===== Tabs Component =====
class Tabs {
  constructor() {
    this.tabContainers = document.querySelectorAll('.tabs');
    this.init();
  }

  init() {
    this.tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab-btn');
      const panels = container.querySelectorAll('.tab-panel');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const target = tab.dataset.tab;
          
          // Remove active from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          // Add active to clicked tab
          tab.classList.add('active');
          
          // Hide all panels
          panels.forEach(p => p.classList.remove('active'));
          // Show target panel
          document.getElementById(target)?.classList.add('active');
        });
      });
    });
  }
}

// ===== Accordion Component =====
class Accordion {
  constructor() {
    this.accordions = document.querySelectorAll('.accordion');
    this.init();
  }

  init() {
    this.accordions.forEach(accordion => {
      const items = accordion.querySelectorAll('.accordion-item');
      
      items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        header?.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          
          // Close all items
          items.forEach(i => {
            i.classList.remove('open');
            i.querySelector('.accordion-content')?.style.setProperty('max-height', '0');
          });
          
          // Open clicked item if it was closed
          if (!isOpen) {
            item.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    });
  }
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  new ThemeManager();
  new MobileNav();
  new Search();
  new ScrollAnimations();
  new SyntaxHighlighter();
  new SmoothScroll();
  new FormValidator();
  new CopyCode();
  new LazyLoad();
  new Tabs();
  new Accordion();
  
  // Add skip link for accessibility
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.prepend(skipLink);
  
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
      setTimeout(() => inThrottle = limit);
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
