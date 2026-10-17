(() => {
  initTicker();
  initLocations();
  initNavigation();
  initDialogs();

  function initTicker() {
    const group = document.querySelector('main>aside>p');
    group.append(...[...group.children].map(item => item.cloneNode(true)));
    group.after(group.cloneNode(true));
  }

  function initLocations() {
    const section = document.getElementById('locations');
    const list = section.querySelector('fieldset');
    const buttons = [...list.querySelectorAll('button')];
    const routes = section.querySelector('figure>svg>g:nth-of-type(2)');
    const nodes = section.querySelector('figure>svg>g:last-of-type');
    const map = section.querySelector('figure');
    const mapLabel = map.querySelector('figcaption');
    const label = mapLabel.querySelector('output');
    const globe = map.querySelector(':scope>svg');
    const origin = globe.querySelector(':scope>circle:last-of-type');
    const start = [origin.cx.baseVal.value, origin.cy.baseVal.value];
    const svg = (tag, attributes) => {
      const element = document.createElementNS(globe.namespaceURI, tag);
      Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
      return element;
    };
    const locations = buttons.map((button, index) => {
      const angle = index * 2.399963;
      const radius = 75 + (index * 47) % 105;
      const [x, y, cx, cy] = button.dataset.mapPosition?.split(',').map(Number) ?? [
        300 + Math.cos(angle) * radius, 260 + Math.sin(angle) * radius * 0.8,
        290 + Math.cos(angle + 0.8) * radius * 0.65, 155 + Math.sin(angle) * 75,
      ];
      const name = button.lastChild.textContent.trim();
      const route = svg('path', { d: `M${start} Q${cx} ${cy} ${x} ${y}` });
      const flag = button.querySelector('svg');
      const node = flag ? flag.cloneNode(true) : svg('circle', { cx: x, cy: y, r: 5 });
      if (flag) Object.entries({ x: x - 13, y: y - 9, width: 26, height: 18 }).forEach(([key, value]) => node.setAttribute(key, value));
      return { button, name, flag, route, node, x, y };
    });
    routes.replaceChildren(...locations.map(({ route }) => route));
    nodes.replaceChildren(...locations.map(({ node }) => node));
    let current = -1;
    let timer;
    function positionLabel() {
      const location = locations[current];
      const matrix = globe.getScreenCTM();
      if (!location || !matrix) return;
      const point = new DOMPoint(location.x, location.y).matrixTransform(matrix);
      const bounds = map.getBoundingClientRect();
      const half = mapLabel.offsetWidth / 2;
      const x = Math.max(half + 8, Math.min(bounds.width - half - 8, point.x - bounds.left));
      mapLabel.style.left = `${x}px`;
      mapLabel.style.top = `${point.y - bounds.top + 12}px`;
    }
    function select(index) {
      locations.forEach(({ button, route, node }, i) => {
        button.setAttribute('aria-pressed', String(i === index));
        [route, node].forEach(element => {
          if (i === index) element.setAttribute('aria-current', 'true');
          else element.removeAttribute('aria-current');
        });
      });
      if (current !== index && current >= 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        label.getAnimations().forEach(animation => animation.cancel());
        label.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
      }
      current = index;
      const location = locations[index];
      label.replaceChildren(...(location?.flag ? [location.flag.cloneNode(true)] : []),
        document.createTextNode(location?.name ?? section.querySelector('template').content.textContent));
      positionLabel();
    }
    function restart() {
      clearInterval(timer);
      if (buttons.length > 1 && !document.hidden) {
        timer = setInterval(() => select((current + 1) % buttons.length), Number(section.dataset.rotateInterval));
      }
    }
    list.addEventListener('click', ({ target }) => {
      const index = buttons.indexOf(target.closest('button'));
      if (index < 0) return;
      select(index);
      restart();
    });
    document.addEventListener('visibilitychange', restart);
    select(buttons.length ? Math.max(0, buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true')) : -1);
    restart();
    new ResizeObserver(positionLabel).observe(globe);
    document.fonts.ready.then(positionLabel);
  }

  function initNavigation() {
    const menu = document.querySelector('body>header>details');
    const mobile = matchMedia('(width <= 900px)');
    const reset = () => { menu.open = !mobile.matches; };
    menu.addEventListener('click', ({ target }) => {
      if (mobile.matches && target.closest('a')) menu.open = false;
    });
    document.addEventListener('click', ({ target }) => {
      if (mobile.matches && !menu.contains(target)) menu.open = false;
    });
    document.addEventListener('keydown', ({ key }) => {
      if (key !== 'Escape' || !mobile.matches || !menu.open) return;
      menu.open = false;
      menu.querySelector('summary').focus();
    });
    mobile.addEventListener('change', reset);
    reset();
  }

  function initDialogs() {
    // Older browsers still need an opener; closing uses native dialog forms.
    if (!('commandForElement' in HTMLButtonElement.prototype)) {
      document.addEventListener('click', ({ target }) => {
        const trigger = target.closest('button[commandfor]');
        if (!trigger) return;
        const dialog = document.getElementById(trigger.getAttribute('commandfor'));
        if (trigger.getAttribute('command') === 'show-modal') dialog.showModal();
        else if (trigger.getAttribute('command') === 'close') dialog.close();
      });
    }
    document.querySelectorAll('dialog').forEach(dialog => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dialog.addEventListener('click', event => {
          if (event.target !== dialog) return;
          const { left, right, top, bottom } = dialog.getBoundingClientRect();
          if (event.clientX < left || event.clientX > right || event.clientY < top || event.clientY > bottom) dialog.close();
        });
      }
      dialog.addEventListener('close', () => {
        if (dialog.returnValue !== 'accept') return;
        document.querySelector(dialog.dataset.acceptTarget)?.scrollIntoView();
        dialog.returnValue = '';
      });
    });
  }
})();
