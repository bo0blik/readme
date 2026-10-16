// Apply a saved palette before the first paint; storage may be blocked in private mode.
(() => {
  const palettes = [
    ['original', 'На своей волне', '#cdff68', '#b79aef', '#ffab91'],
    ['lagoon', 'Лагуна', '#78edce', '#91b8ff', '#ffc69b'],
    ['sunset', 'Закат', '#ffb28e', '#c5acff', '#ffe69a'],
    ['sakura', 'Сакура', '#ffadd5', '#b9b0ff', '#9de7d1'],
    ['arctic', 'Арктика', '#a6d9ff', '#c6bcf4', '#9ce6e1'],
    ['sage', 'Шалфей', '#bce3a3', '#e3cfac', '#efbca8'],
    ['mango', 'Манго', '#ffdc7c', '#b5a0ee', '#ffb4a4'],
    ['ocean', 'Океан', '#7de4f5', '#a6bcff', '#ffb39c'],
    ['iris', 'Ирис', '#c7b0ff', '#f2b7d9', '#a6e5ce'],
    ['graphite', 'Графит', '#e4e5d8', '#bcc7d6', '#ddbb9f'],
  ];
  const key = 'vless-color-theme';
  let selected = 'original';
  try {
    const saved = localStorage.getItem(key);
    if (palettes.some(palette => palette[0] === saved)) selected = saved;
  } catch { /* The selector also works without persistent storage. */ }
  function apply(id) {
    document.documentElement.dataset.theme = id;
    document.documentElement.classList.toggle('theme-custom', id !== 'original');
    const palette = palettes.find(item => item[0] === id);
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    document.querySelectorAll('[data-palette]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.palette === id));
    });
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.title = `Цветовая тема: ${palette[1]}`;
  }
  apply(selected);
  document.addEventListener('DOMContentLoaded', () => {
    const picker = document.getElementById('theme-picker');
    const toggle = document.getElementById('theme-toggle');
    const panel = document.getElementById('theme-panel');
    const options = document.getElementById('theme-options');
    const buttons = palettes.map(([id, name, ...colors]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'theme-option';
      button.dataset.palette = id;
      button.setAttribute('aria-label', name);
      const swatches = document.createElement('span');
      swatches.className = 'theme-swatches';
      swatches.setAttribute('aria-hidden', 'true');
      colors.forEach(color => {
        const dot = document.createElement('i');
        dot.style.background = color;
        swatches.append(dot);
      });
      const label = document.createElement('span');
      label.textContent = name;
      button.append(swatches, label);
      button.addEventListener('click', () => {
        selected = id;
        apply(id);
        try { localStorage.setItem(key, id); } catch { /* Optional persistence. */ }
      });
      options.append(button);
      return button;
    });
    apply(selected);
    function setOpen(open, returnFocus = false) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) buttons.find(button => button.dataset.palette === selected).focus();
      else if (returnFocus) toggle.focus();
    }
    toggle.addEventListener('click', () => setOpen(panel.hidden));
    document.addEventListener('click', event => {
      if (!panel.hidden && !picker.contains(event.target)) setOpen(false);
    });
    picker.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !panel.hidden) {
        event.preventDefault();
        setOpen(false, true);
      }
      if (panel.hidden || !['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const current = buttons.indexOf(document.activeElement);
      let next = current;
      if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;
      else next = (current + (event.key === 'ArrowDown' ? 2 : event.key === 'ArrowUp' ? -2 : event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
    });
    picker.addEventListener('focusout', () => {
      requestAnimationFrame(() => {
        if (!picker.contains(document.activeElement)) setOpen(false);
      });
    });
    window.addEventListener('storage', event => {
      if (event.key === key && palettes.some(palette => palette[0] === event.newValue)) {
        selected = event.newValue;
        apply(selected);
      }
    });
  });
})();
