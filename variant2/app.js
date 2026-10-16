// Native interactions for the static page. No framework or build step is needed.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

function setMenu(open) {
  mobileMenu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
}
menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden));
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', event => {
  if (!mobileMenu.hidden && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) {
    setMenu(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', event => {
  if (event.matches) setMenu(false);
});

const termsDialog = document.getElementById('terms-dialog');
let termsTrigger;
document.querySelectorAll('[data-terms]').forEach(button => button.addEventListener('click', () => {
  termsTrigger = mobileMenu.contains(button) ? menuToggle : button;
  setMenu(false);
  termsDialog.showModal();
  termsDialog.scrollTop = 0;
}));
termsDialog.querySelectorAll('[data-close-terms]').forEach(button => button.addEventListener('click', () => termsDialog.close()));
termsDialog.addEventListener('close', () => termsTrigger?.focus());
termsDialog.addEventListener('click', event => {
  if (event.target !== termsDialog) return;
  const box = termsDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) termsDialog.close();
});

const countries = document.querySelectorAll('[data-country]');
const locationMap = document.getElementById('location-map');
let selectedCountry = 'Германия';

function highlightCountry(active) {
  document.getElementById('active-location').textContent = active;
  document.querySelectorAll('[data-connection]').forEach(group => {
    const enabled = group.dataset.connection === active;
    group.classList.toggle('is-active', enabled);
    const base = group.querySelector('path');
    base.setAttribute('stroke', enabled ? 'rgba(200,255,46,0.25)' : 'rgba(255,255,255,0.08)');
    base.setAttribute('stroke-width', enabled ? '6' : '2');
  });
  locationMap.querySelectorAll('[data-country]').forEach(node => {
    const enabled = node.dataset.country === active;
    const outer = node.querySelector('[data-node-part="outer"]');
    outer.setAttribute('fill', enabled ? 'rgba(200,255,46,0.15)' : '#10101d');
    outer.setAttribute('stroke', enabled ? '#C8FF2E' : 'rgba(255,255,255,0.22)');
    node.querySelector('[data-node-part="inner"]').setAttribute('fill', enabled ? '#C8FF2E' : 'rgba(255,255,255,0.35)');
    node.querySelector('text').setAttribute('fill', enabled ? '#ffffff' : 'rgba(255,255,255,0.5)');
  });
}
function selectCountry(country) {
  selectedCountry = country;
  countries.forEach(node => node.setAttribute('aria-pressed', String(node.dataset.country === country)));
  locationMap.setAttribute('aria-label', `Схема соединений с локациями. Выбрана: ${country}`);
  highlightCountry(country);
}
countries.forEach(node => {
  node.addEventListener('click', () => selectCountry(node.dataset.country));
  node.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') highlightCountry(node.dataset.country);
  });
  node.addEventListener('pointerleave', () => highlightCountry(selectedCountry));
  if (node.tagName.toLowerCase() === 'g') {
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectCountry(node.dataset.country);
      }
    });
  }
});
selectCountry(selectedCountry);

const steps = Array.from(document.querySelectorAll('[data-step]'));
function activateStep(index) {
  const number = String(index + 1).padStart(2, '0');
  document.getElementById('step-count').textContent = `Шаг ${number} из 05`;
  document.getElementById('step-current').textContent = number;
  document.getElementById('step-title').textContent = steps[index].querySelector('h3').textContent;
  steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
  document.querySelectorAll('[data-step-bar]').forEach(bar => bar.classList.toggle('is-active', Number(bar.dataset.stepBar) <= index));
}
activateStep(0);

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('[data-reveal]').forEach(element => {
    if (element.closest('#hero')) return;
    element.classList.add('will-reveal');
    revealObserver.observe(element);
  });
}

const techList = document.getElementById('technology-list');
const techProgress = document.getElementById('technology-progress');
let scheduled = false;
function updateScroll() {
  scheduled = false;
  const middle = window.innerHeight * 0.5;
  let index = 0;
  let closest = Infinity;
  steps.forEach((step, i) => {
    const box = step.getBoundingClientRect();
    const distance = Math.abs(box.top + box.height / 2 - middle);
    if (distance < closest) { closest = distance; index = i; }
  });
  activateStep(index);
  if (techProgress) {
    const box = techList.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * 0.75 - box.top) / Math.max(1, box.height)));
    techProgress.style.transform = `scaleY(${reducedMotion.matches ? 1 : progress})`;
  }
}
function scheduleScroll() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
updateScroll();

const scene = document.getElementById('connection-scene');
const hero = document.getElementById('hero');
const sceneSvg = scene.querySelector('svg');
const nucleus = sceneSvg.querySelector('circle[r="26"]');
nucleus.classList.add('core-breathe');
sceneSvg.querySelectorAll('circle[r="42"], circle[r="302"]').forEach(circle => {
  circle.parentElement.classList.add('orbit-spin');
});
const svgNamespace = 'http://www.w3.org/2000/svg';
sceneSvg.querySelectorAll('ellipse').forEach(ellipse => {
  if (!ellipse.parentElement.matches('.orbit-spin, .orbit-spin-rev')) return;
  const rx = Number(ellipse.getAttribute('rx'));
  const ry = Number(ellipse.getAttribute('ry'));
  const group = document.createElementNS(svgNamespace, 'g');
  group.classList.add('orbit-pulse');
  const pulse = document.createElementNS(svgNamespace, 'circle');
  pulse.setAttribute('r', '4');
  pulse.setAttribute('fill', ellipse.getAttribute('stroke'));
  group.append(pulse);
  const motion = document.createElementNS(svgNamespace, 'animateMotion');
  motion.setAttribute('path', `M ${320 + rx} 320 A ${rx} ${ry} 0 1 0 ${320 - rx} 320 A ${rx} ${ry} 0 1 0 ${320 + rx} 320`);
  motion.setAttribute('dur', `${13 + rx % 5}s`);
  motion.setAttribute('repeatCount', 'indefinite');
  group.append(motion);
  ellipse.parentElement.append(group);
});
hero.addEventListener('pointermove', event => {
  if (reducedMotion.matches || event.pointerType !== 'mouse' || innerWidth < 768) return;
  const box = hero.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width - 0.5) * 30;
  const y = ((event.clientY - box.top) / box.height - 0.5) * 22;
  scene.style.transform = `translate(${x}px, ${y}px)`;
});
hero.addEventListener('pointerleave', () => { scene.style.transform = ''; });
reducedMotion.addEventListener('change', () => { scene.style.transform = ''; updateScroll(); });
