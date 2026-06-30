(function () {
  'use strict';

  /* ─── Header: scroll state ─── */
  const header  = document.querySelector('.header');
  const menuBtn = document.querySelector('.header__menu-btn');
  const nav     = document.querySelector('.header__nav');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('header--scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ─── Mobile menu toggle ─── */
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = nav.classList.toggle('header__nav--open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('header__nav--open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('header__nav--open') &&
          !nav.contains(e.target) &&
          !menuBtn.contains(e.target)) {
        nav.classList.remove('header__nav--open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ─── Smooth scroll for all anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '68',
        10
      );
      var top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ─── Project filter tabs ─── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const workGridCards = document.querySelectorAll('#project-grid .project-card');
  const projectCards  = document.querySelectorAll('.project-card[data-modal-type]');

  if (filterBtns.length && workGridCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('filter-btn--active'); });
        btn.classList.add('filter-btn--active');

        var filter = btn.getAttribute('data-filter');
        workGridCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          card.classList.toggle('is-hidden', filter !== 'all' && category !== filter);
        });
      });
    });
  }

  /* ─── Project Modal ─── */
  var modal          = document.getElementById('project-modal');
  var modalBody      = document.getElementById('modal-body');
  var modalTag       = document.getElementById('modal-tag');
  var modalTitle     = document.getElementById('modal-title');
  var modalClose     = document.getElementById('modal-close');
  var backdrop       = document.getElementById('modal-backdrop');
  var modalContainer = modal ? modal.querySelector('.modal__container') : null;

  function openModal(card) {
    var type  = card.getAttribute('data-modal-type');
    var title = card.getAttribute('data-modal-title') || '';
    var tag   = card.getAttribute('data-modal-tag')   || '';

    modalTag.textContent   = tag;
    modalTitle.textContent = title;
    modalBody.innerHTML    = '';

    if (type === 'video') {
      var videoId = card.getAttribute('data-modal-id');
      var iframe  = document.createElement('iframe');
      iframe.src  = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
      iframe.allow           = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy  = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.title           = title;
      modalBody.appendChild(iframe);
      modalContainer.classList.add('modal__container--video');
    } else {
      var src = card.getAttribute('data-modal-src');
      var img = document.createElement('img');
      img.src = src;
      img.alt = title;
      modalBody.appendChild(img);
      modalContainer.classList.remove('modal__container--video');
    }

    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('modal-open');
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    /* Stop video by clearing iframe src after transition */
    setTimeout(function () {
      modalBody.innerHTML = '';
      if (modalContainer) modalContainer.classList.remove('modal__container--video');
    }, 350);
  }

  if (modal) {
    projectCards.forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    modalClose.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  /* ─── Scroll-reveal: IntersectionObserver ─── */
  const animatedEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window && animatedEls.length) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animatedEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    animatedEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
