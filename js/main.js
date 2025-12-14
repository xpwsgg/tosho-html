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
})();
