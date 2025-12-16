/**
 * ChapterTwo SP Landing Page - 交互脚本
 * 功能：汉堡菜单、平滑滚动、讲师轮播、图片懒加载、滚动指示器
 */

(function() {
  'use strict';

  // DOM 元素
  const menuBtn = document.getElementById('spMenuBtn');
  const nav = document.getElementById('spNav');
  const overlay = document.getElementById('spOverlay');
  const navLinks = document.querySelectorAll('.sp-nav__link');

  /**
   * 汉堡菜单功能
   */
  function initMenu() {
    if (!menuBtn || !nav || !overlay) return;

    function toggleMenu() {
      const isOpen = menuBtn.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function openMenu() {
      menuBtn.classList.add('active');
      nav.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    // ESC 键关闭菜单
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /**
   * 平滑滚动功能
   */
  function initSmoothScroll() {
    navLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            // 关闭菜单
            if (nav) {
              nav.classList.remove('active');
              overlay.classList.remove('active');
              menuBtn.classList.remove('active');
              document.body.style.overflow = '';
            }

            // 计算目标位置
            const headerHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            // 平滑滚动
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /**
   * 讲师轮播功能
   */
  function initCarousel() {
    const carousel = document.getElementById('spInstructorsCarousel');
    if (!carousel) return;

    const prevBtn = document.querySelector('.sp-instructors__arrow--prev');
    const nextBtn = document.querySelector('.sp-instructors__arrow--next');
    const pagination = document.getElementById('spInstructorsPagination');
    if (!pagination) return;

    const paginationDots = pagination.querySelectorAll('.sp-instructors__pagination-dot');
    const instructors = carousel.querySelectorAll('.sp-instructor');

    let currentIndex = 0;
    const totalInstructors = instructors.length;

    function updateCarousel() {
      const offset = -(currentIndex * 330);
      carousel.style.transform = 'translateX(' + offset + 'px)';

      // 更新分页点
      paginationDots.forEach(function(dot, index) {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // 更新箭头状态
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

    // 触摸滑动支持
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
      // Fallback: 立即加载所有图片
      lazyImages.forEach(function(img) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
      });
    }
  }

  /**
   * 滚动进度指示器
   */
  function initScrollIndicator() {
    const indicator = document.querySelector('.sp-scroll-indicator');
    if (!indicator) return;

    const progress = indicator.querySelector('.sp-scroll-indicator__progress');

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
   * 初始化所有功能
   */
  function init() {
    initMenu();
    initSmoothScroll();
    initCarousel();
    initLazyLoad();
    initScrollIndicator();
  }

  // DOM 加载完成后初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
