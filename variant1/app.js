const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Content stays visible when scripting or intersection observers are unavailable.
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
}

const countryButtons = document.querySelectorAll('.country');
countryButtons.forEach(button => button.addEventListener('click', () => {
  for (const country of countryButtons) {
    const active = country === button;
    country.classList.toggle('active', active);
    country.setAttribute('aria-pressed', String(active));
  }
  document.getElementById('selected-country').textContent = button.dataset.country;
  document.querySelectorAll('[data-route]').forEach(route => {
    route.classList.toggle('active', route.dataset.route === button.dataset.country);
  });
}));

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}
menuButton.addEventListener('click', () => {
  mobileNav.hidden = !mobileNav.hidden;
  menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden));
  menuButton.setAttribute('aria-label', mobileNav.hidden ? 'Открыть меню' : 'Закрыть меню');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

document.querySelectorAll('[data-dialog]').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialog);
    dialog.showModal();
    dialog.scrollTop = 0;
    dialog.addEventListener('close', () => trigger.focus(), { once: true });
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
  });
});
document.getElementById('accept-terms').addEventListener('click', () => {
  document.getElementById('terms').close();
  document.getElementById('order').scrollIntoView({ behavior: reduceMotion.matches ? 'instant' : 'smooth' });
});

if ('IntersectionObserver' in window) {
  const stepsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('active', entry.isIntersecting));
  }, { threshold: 0.8, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.step').forEach(step => stepsObserver.observe(step));
}

const art = document.querySelector('.hero-art');
art.addEventListener('pointermove', event => {
  if (reduceMotion.matches || event.pointerType !== 'mouse' || window.innerWidth < 761) return;
  const bounds = art.getBoundingClientRect();
  art.style.setProperty('--mx', `${(event.clientX - bounds.left - bounds.width / 2) * 0.025}px`);
  art.style.setProperty('--my', `${(event.clientY - bounds.top - bounds.height / 2) * 0.025}px`);
});
art.addEventListener('pointerleave', () => {
  art.style.setProperty('--mx', '0px');
  art.style.setProperty('--my', '0px');
});
