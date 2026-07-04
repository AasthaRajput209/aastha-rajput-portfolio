/* ==========================================================================
   Aastha Rajput Portfolio — JS Script (Structured Layout Version)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initScrollReveal();
  initVideoAutoplay();
  initLightbox();
  initPerformanceDashboard();
});

/**
 * Custom Cursor Logic (Ring and Dot follow)
 */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('ring');
  
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    cursor.style.opacity = 1;
    ring.style.opacity = 1;
  });

  function updateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(updateRing);
  }
  updateRing();

  // Scale cursor on hover targets
  const refreshHoverTargets = () => {
    const hoverTargets = document.querySelectorAll('a, button, .card-media-box, .brand-card, .hero-cta, .product-item-row:not(.table-head)');
    hoverTargets.forEach(target => {
      target.removeEventListener('mouseenter', addHoverClass);
      target.removeEventListener('mouseleave', removeHoverClass);
      target.addEventListener('mouseenter', addHoverClass);
      target.addEventListener('mouseleave', removeHoverClass);
    });
  };

  function addHoverClass() {
    document.body.classList.add('hover-active');
  }

  function removeHoverClass() {
    document.body.classList.remove('hover-active');
  }

  refreshHoverTargets();
  
  window.refreshCursor = refreshHoverTargets;
}

/**
 * Scroll Reveal Animations using IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal, .project-card');
  
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Intelligent Video Playback (Autoplay muted when visible / hovered)
 */
function initVideoAutoplay() {
  const videos = document.querySelectorAll('.autoplay-video');
  
  if (videos.length === 0) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.15 });

  videos.forEach(video => {
    video.muted = true;
    video.playsInline = true;
    videoObserver.observe(video);
    
    const wrapper = video.closest('.card-media-box');
    if (wrapper) {
      wrapper.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
      });
    }
  });
}

/**
 * Fullscreen Interactive Lightbox Component
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  
  if (!lightbox || !lightboxContent || !lightboxClose) return;

  function openLightbox(src, type, captionText) {
    const existingMedia = lightboxContent.querySelector('.lightbox-media');
    if (existingMedia) existingMedia.remove();
    
    let mediaEl;
    if (type === 'video') {
      mediaEl = document.createElement('video');
      mediaEl.src = src;
      mediaEl.className = 'lightbox-media';
      mediaEl.controls = true;
      mediaEl.autoplay = true;
      mediaEl.loop = true;
      mediaEl.muted = false;
    } else {
      mediaEl = document.createElement('img');
      mediaEl.src = src;
      mediaEl.className = 'lightbox-media';
    }
    
    lightboxContent.appendChild(mediaEl);
    lightboxCaption.textContent = captionText || '';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    const video = lightboxContent.querySelector('video');
    if (video) video.pause();
  }

  // Bind clicks to main portfolio work media (card-media-box inside project-card)
  const mediaWrappers = document.querySelectorAll('.card-media-box');
  mediaWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      // Exclude clicks if it's inside the PDF download anchor
      if (wrapper.querySelector('a')) return;

      const img = wrapper.querySelector('img');
      const video = wrapper.querySelector('video');
      const card = wrapper.closest('.project-card');
      
      const title = card ? card.querySelector('.card-title').textContent : '';
      const label = card ? card.querySelector('.card-label').textContent : '';
      const captionText = `${label} — ${title}`;
      
      if (video) {
        openLightbox(video.src, 'video', captionText);
      } else if (img) {
        openLightbox(img.src, 'image', captionText);
      }
    });
  });

  // Bind clicks to curated brand showcase cards
  const brandCards = document.querySelectorAll('.brand-card');
  brandCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) {
        const title = img.alt || `Curated Design ${idx + 1}`;
        openLightbox(img.src, 'image', `Curated Design — ${title}`);
      }
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxContent) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/**
 * Savyo Performance Marketing Campaign Dashboard Interactivity
 */
function initPerformanceDashboard() {
  const campaignData = {
    totalRevenue: 1126798.56,
    products: {
      "1l-washing-machine": {
        name: "1L Washing Machine",
        purchases: 353,
        spend: 206249.11,
        revenue: 759663.56,
        profit: 553414.45,
        roas: 3.68
      },
      "3l-washing-machine": {
        name: "3L Washing Machine",
        purchases: 75,
        spend: 53361.36,
        revenue: 218779.35,
        profit: 165417.99,
        roas: 4.10
      },
      "paw-cleaner": {
        name: "Paw Cleaner",
        purchases: 35,
        spend: 17491.98,
        revenue: 57166.56,
        profit: 39674.58,
        roas: 3.27
      },
      "selfie-monitor": {
        name: "Selfie Monitor",
        purchases: 15,
        spend: 15299.71,
        revenue: 47037.47,
        profit: 31737.76,
        roas: 3.07
      },
      "icerush-turbo-fan": {
        name: "Icerush Turbo Fan",
        purchases: 5,
        spend: 5046.00,
        revenue: 11782.46,
        profit: 6736.46,
        roas: 2.34
      },
      "smallest-hand-fan": {
        name: "Smallest Hand Fan",
        purchases: 6,
        spend: 6428.44,
        revenue: 11635.48,
        profit: 5207.04,
        roas: 1.81
      },
      "led-nail-clipper": {
        name: "LED Nail Clipper",
        purchases: 8,
        spend: 9077.02,
        revenue: 11099.89,
        profit: 2022.87,
        roas: 1.22
      },
      "cat-toy-scratcher": {
        name: "Cat Toy & Scratcher",
        purchases: 5,
        spend: 2233.99,
        revenue: 7282.81,
        profit: 5048.82,
        roas: 3.26
      },
      "bionic-massager": {
        name: "Bionic Massager",
        purchases: 1,
        spend: 929.24,
        revenue: 2350.98,
        profit: 1421.74,
        roas: 2.53
      }
    }
  };

  const rows = document.querySelectorAll('.product-item-row:not(.table-head)');
  const detailTitle = document.getElementById('detail-p-name');
  const statPurchases = document.getElementById('stat-purchases');
  const statSpend = document.getElementById('stat-spend');
  const statRevenue = document.getElementById('stat-revenue');
  const statProfit = document.getElementById('stat-profit');
  const statRoas = document.getElementById('stat-roas');
  const sharePct = document.getElementById('detail-share-pct');
  const barFill = document.getElementById('detail-bar-fill');

  if (!detailTitle || rows.length === 0) return;

  function formatINR(number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(number);
  }

  function updateDetailView(productId) {
    const product = campaignData.products[productId];
    if (!product) return;

    const share = ((product.revenue / campaignData.totalRevenue) * 100).toFixed(1);

    detailTitle.textContent = product.name;
    statPurchases.textContent = product.purchases;
    statSpend.textContent = formatINR(product.spend);
    statRevenue.textContent = formatINR(product.revenue);
    statProfit.textContent = formatINR(product.profit);
    statRoas.textContent = `${product.roas.toFixed(2)}x`;
    sharePct.textContent = `${share}%`;
    
    barFill.style.width = `${share}%`;
  }

  rows.forEach(row => {
    const id = row.getAttribute('data-product-id');
    
    row.addEventListener('mouseenter', () => {
      rows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      updateDetailView(id);
    });

    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');
      updateDetailView(id);
    });
  });

  const defaultRow = document.querySelector('.product-item-row[data-product-id="1l-washing-machine"]');
  if (defaultRow) {
    defaultRow.classList.add('active');
    updateDetailView('1l-washing-machine');
  }
}
