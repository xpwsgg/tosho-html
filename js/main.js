/**
 * ChapterTwo Landing Page - Main JavaScript
 * 功能：汉堡菜单交互、平滑滚动
 */

(function() {
  'use strict';

  // DOM 元素
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const overlay = document.getElementById('overlay');
  const navLinks = document.querySelectorAll('.header__nav-link');

  /**
   * 切换移动端菜单状态
   */
  function toggleMenu() {
    const isOpen = menuBtn.classList.contains('active');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  /**
   * 打开菜单
   */
  function openMenu() {
    menuBtn.classList.add('active');
    nav.classList.add('active');
    overlay.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  /**
   * 关闭菜单
   */
  function closeMenu() {
    menuBtn.classList.remove('active');
    nav.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  /**
   * 平滑滚动到锚点
   * @param {Event} e - 点击事件
   */
  function smoothScroll(e) {
    const href = this.getAttribute('href');

    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        // 关闭移动端菜单
        closeMenu();

        // 计算目标位置（考虑固定头部的高度）
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        // 平滑滚动
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }

  /**
   * 初始化事件监听
   */
  function init() {
    // 汉堡菜单按钮点击事件
    if (menuBtn) {
      menuBtn.addEventListener('click', toggleMenu);
    }

    // 遮罩层点击关闭菜单
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    // 导航链接平滑滚动
    navLinks.forEach(function(link) {
      link.addEventListener('click', smoothScroll);
    });

    // 窗口大小变化时关闭菜单
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 768) {
        closeMenu();
      }
    });

    // ESC 键关闭菜单
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /**
   * 滚动进度指示器（仅移动端）
   */
  function initScrollIndicator() {
    const indicator = document.getElementById('scrollIndicator');
    if (!indicator) return;

    const progress = indicator.querySelector('.scroll-indicator__progress');

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      progress.style.width = scrollPercent + '%';

      if (scrollTop > 100) {
        indicator.classList.add('visible');
      } else {
        indicator.classList.remove('visible');
      }
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateProgress();
  }

  /**
   * 图片懒加载功能
   */
  function initLazyLoad() {
    const lazyImages = document.querySelectorAll('img.lazy');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('lazy-loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  /**
   * 讲师轮播功能
   */
  function initInstructorCarousel() {
    const carousel = document.getElementById('instructorsCarousel');
    if (!carousel) return;

    const prevBtn = document.querySelector('.instructors__arrow--prev');
    const nextBtn = document.querySelector('.instructors__arrow--next');
    const pagination = document.getElementById('instructorsPagination');
    if (!pagination) return;

    const paginationDots = pagination.querySelectorAll('.instructors__pagination-dot');
    const instructors = carousel.querySelectorAll('.instructor');

    let currentIndex = 0;
    const totalInstructors = instructors.length;

    function updateCarousel() {
      const instructorWidth = instructors[0].offsetWidth;
      const gap = 32;
      const offset = -(currentIndex * (instructorWidth + gap));

      carousel.style.transform = 'translateX(' + offset + 'px)';

      paginationDots.forEach(function(dot, index) {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      if (prevBtn && nextBtn) {
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '0.6';
        prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        nextBtn.style.opacity = currentIndex === totalInstructors - 1 ? '0.3' : '0.6';
        nextBtn.style.cursor = currentIndex === totalInstructors - 1 ? 'not-allowed' : 'pointer';
      }
    }

    function prevInstructor() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    function nextInstructor() {
      if (currentIndex < totalInstructors - 1) {
        currentIndex++;
        updateCarousel();
      }
    }

    function goToInstructor(index) {
      currentIndex = index;
      updateCarousel();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', prevInstructor);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', nextInstructor);
    }

    paginationDots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        goToInstructor(index);
      });
    });

    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    carousel.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      e.preventDefault();
    }, { passive: false });

    carousel.addEventListener('touchend', function(e) {
      if (!isDragging) return;

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextInstructor();
        } else {
          prevInstructor();
        }
      }

      isDragging = false;
    });

    updateCarousel();
  }

  // 初始化所有功能
  if (window.innerWidth < 768) {
    initScrollIndicator();
  }
  initLazyLoad();
  initInstructorCarousel();

})();
