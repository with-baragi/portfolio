/* Keep Noah's original menu and Owl Carousel, with controls for keyboard users. */
$(function () {
  const menu = document.querySelector('#colorlib-main-nav');
  const page = document.querySelector('#colorlib-page');
  const opener = page.querySelector('.js-colorlib-nav-toggle');
  const closer = menu.querySelector('.js-colorlib-nav-toggle');
  let scrollBeforeMenu = 0;

  function setMenuAccessibility(open) {
    menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    opener.setAttribute('aria-expanded', String(open));
    page.inert = open;
  }

  function closeMenu(restoreFocus) {
    document.body.classList.remove('menu-show');
    closer.classList.remove('show');
    setMenuAccessibility(false);
    if (restoreFocus) {
      window.scrollTo(0, scrollBeforeMenu);
      opener.focus({ preventScroll: true });
    }
  }

  opener.addEventListener('click', () => {
    scrollBeforeMenu = window.scrollY;
  }, { capture: true });
  opener.addEventListener('click', () => {
    setMenuAccessibility(true);
    menu.querySelector('ul a').focus();
  });
  closer.addEventListener('click', () => closeMenu(true));
  menu.addEventListener('click', event => {
    if (event.target.closest('a[href^="#"]:not([href="#"])')) closeMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-show')) closeMenu(true);
  });
  [opener, closer].forEach(button => {
    button.setAttribute('role', 'button');
    button.addEventListener('keydown', event => {
      if (event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    });
  });

  const portraits = $('#portrait-carousel');
  const carousel = portraits.data('owlCarousel');
  const controls = document.querySelector('.portrait-controls');
  const selectors = [...controls.querySelectorAll('.portrait-select')];
  const pause = controls.querySelector('.portrait-pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let playing = true;

  function updateSelection() {
    const active = carousel.relative(carousel.current());
    selectors.forEach((button, index) => button.setAttribute('aria-pressed', String(index === active)));
    portraits.find('.owl-item').each(function () {
      this.setAttribute('aria-hidden', String(!this.classList.contains('active')));
    });
  }

  function setPlaying(enabled) {
    playing = enabled;
    portraits.trigger(enabled ? 'play.owl.autoplay' : 'stop.owl.autoplay');
    pause.textContent = enabled ? '자동 전환 멈춤' : '자동 전환 시작';
  }

  portraits.on('translated.owl.carousel', updateSelection);
  selectors.forEach((button, index) => button.addEventListener('click', () => {
    setPlaying(false);
    carousel.to(index, undefined, true);
  }));
  pause.addEventListener('click', () => setPlaying(!playing));
  reducedMotion.addEventListener('change', event => {
    if (event.matches) setPlaying(false);
  });
  if (reducedMotion.matches) setPlaying(false);
  updateSelection();
  controls.hidden = false;
  document.querySelector('#year').textContent = String(new Date().getFullYear());
});
