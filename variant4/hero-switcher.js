(() => {
  const concepts = [
    { id: 'gaze', name: 'Взгляд рыси', kicker: 'ХАРАКТЕР В ДЕТАЛЯХ. СВОБОДА В СОЕДИНЕНИИ.', title: 'Твоя сеть.<br>Твоя<br><span class="lime-text territory-word">территория.</span>' },
    { id: 'leap', name: 'Рывок', kicker: 'СВОБОДА ДВИЖЕНИЯ — В ТВОЕЙ ПРИРОДЕ.', title: 'Двигайся<br><span class="lime-text">свободно.</span><br>Без границ.' },
    { id: 'type', name: 'VLESS как знак', kicker: 'МЕНЬШЕ ШУМА. БОЛЬШЕ ХАРАКТЕРА.', title: 'Своя сеть.<br>Свои<br><span class="lime-text">правила.</span>' },
    { id: 'terrain', name: 'Своя территория', kicker: 'ТВОЙ МАРШРУТ В ЦИФРОВОМ МИРЕ.', title: 'Твоя сеть.<br>Твоя<br><span class="lime-text territory-word">территория.</span>' },
    { id: 'setup', name: 'От QR-кода до подключения', kicker: 'ОТ ПЕРВОГО ШАГА ДО СВОБОДНОГО СОЕДИНЕНИЯ.', title: 'Твой VPN.<br><span class="lime-text">Пара минут —</span><br>и готово.' },
  ];
  const root = document.getElementById('hero-lab');
  const key = 'vless-lynx-hero';
  const query = new URLSearchParams(location.search).get('hero');
  let current = 0;
  if (/^[1-5]$/.test(query || '')) current = Number(query) - 1;
  else {
    try {
      const saved = localStorage.getItem(key);
      const index = concepts.findIndex(concept => concept.id === saved);
      if (index >= 0) current = index;
    } catch { /* Selection still works when storage is unavailable. */ }
  }
  function show(index, announce = true) {
    current = (index + concepts.length) % concepts.length;
    const concept = concepts[current];
    root.dataset.hero = concept.id;
    document.querySelectorAll('[data-scene]').forEach(scene => { scene.hidden = scene.dataset.scene !== concept.id; });
    document.getElementById('hero-title').innerHTML = concept.title;
    document.getElementById('hero-kicker').textContent = concept.kicker;
    document.getElementById('hero-concept-name').textContent = concept.name;
    document.getElementById('hero-counter').textContent = `${String(current + 1).padStart(2, '0')} / 05`;
    document.querySelectorAll('[data-hero-index]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.heroIndex) === current)));
    document.querySelectorAll('.lynx-logo').forEach(image => { image.src = current === 0 || current === 2 ? 'images/lynx-mark.svg' : 'images/lynx.png'; });
    document.querySelector('.concept-art').setAttribute('aria-label', `Концепция: ${concept.name}`);
    if (announce) {
      document.getElementById('hero-announcement').textContent = `Вариант ${current + 1} из 5: ${concept.name}`;
      try { localStorage.setItem(key, concept.id); } catch { /* Optional persistence. */ }
      try {
        const url = new URL(location.href);
        url.searchParams.set('hero', String(current + 1));
        history.replaceState(null, '', url);
      } catch { /* Direct file opening may restrict URL updates. */ }
    }
  }
  document.getElementById('hero-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('hero-next').addEventListener('click', () => show(current + 1));
  document.querySelectorAll('[data-hero-index]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.heroIndex))));
  document.querySelector('.hero-selector').addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  const locations = {
    'Германия': [470, 190], 'Финляндия': [400, 140], 'Россия': [525, 240],
    'США': [310, 140], 'Нидерланды': [360, 200], 'Эстония': [450, 140], 'Армения': [490, 285],
  };
  document.getElementById('hero-location').addEventListener('change', event => {
    const country = event.target.value;
    const [x, y] = locations[country];
    const path = `M140 330Q240 380 315 268T${x} ${y}`;
    document.getElementById('hero-route').setAttribute('d', path);
    document.querySelector('.terrain-route-shadow').setAttribute('d', path);
    document.getElementById('terrain-destination').setAttribute('transform', `translate(${x} ${y})`);
    document.getElementById('hero-route-label').textContent = `${country} ↗`;
  });
  const captions = ['Наглядная схема. Подключение и покупка — в Telegram-боте.', 'Получите QR-код от бота и используйте его для настройки.', 'Следуйте инструкции для своего устройства. При сложностях поможем.'];
  const deck = document.querySelector('.setup-cards');
  const cards = Array.from(deck.querySelectorAll('[data-setup-card]'));
  const controls = Array.from(document.querySelectorAll('[data-setup]'));
  let selectedStep = 0;
  let hoveredStep = null;
  let focusedStep = null;
  function renderStep() {
    const index = hoveredStep ?? focusedStep ?? selectedStep;
    cards.forEach(card => {
      const active = Number(card.dataset.setupCard) === index;
      card.classList.toggle('active', active);
      card.classList.toggle('is-previewed', active && (focusedStep !== null || hoveredStep !== null));
      card.setAttribute('aria-pressed', String(active));
    });
    controls.forEach(control => control.setAttribute('aria-pressed', String(Number(control.dataset.setup) === index)));
    document.getElementById('setup-caption').textContent = captions[index];
  }
  // Track the stable deck rather than each moving card to avoid hover flicker.
  deck.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse') return;
    const card = event.target.closest('[data-setup-card]');
    if (card && deck.contains(card)) {
      hoveredStep = Number(card.dataset.setupCard);
      renderStep();
    }
  });
  deck.addEventListener('pointerleave', () => { hoveredStep = null; renderStep(); });
  cards.forEach((card, index) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Показать шаг ${index + 1}: ${card.querySelector('strong').textContent.trim()}`);
    card.addEventListener('focus', () => { hoveredStep = null; focusedStep = index; renderStep(); });
    card.addEventListener('blur', () => { focusedStep = null; renderStep(); });
    card.addEventListener('click', () => { selectedStep = index; renderStep(); });
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectedStep = index;
        renderStep();
      }
    });
  });
  controls.forEach(button => button.addEventListener('click', () => {
    selectedStep = Number(button.dataset.setup);
    hoveredStep = null;
    focusedStep = null;
    renderStep();
  }));
  renderStep();
  show(current, false);
})();
