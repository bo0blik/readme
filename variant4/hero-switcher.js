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
  document.querySelectorAll('[data-setup]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.setup);
    document.querySelectorAll('[data-setup-card]').forEach(card => card.classList.toggle('active', Number(card.dataset.setupCard) === index));
    document.querySelectorAll('[data-setup]').forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    document.getElementById('setup-caption').textContent = captions[index];
  }));
  show(current, false);
})();
