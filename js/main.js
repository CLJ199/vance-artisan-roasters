/* ===== Vance Artisan Coffee Roasters: draft interactivity ===== */
(function () {
  'use strict';

  // ---- Data (from the client's product list; prices are placeholders) ----
  const COFFEES = [
    {
      id: 'athi-river',
      name: 'Athi River Single Origin',
      roast: 'Light',
      level: 1,
      notes: ['Jasmine', 'Citrus', 'Honey'],
      flavors: ['Floral', 'Fruity', 'Sweet'],
      origin: 'Single origin',
      retail: 185,
      wholesale: 265,
      image: 'photos/bag-athi-river.jpg'
    },
    {
      id: 'antioquia',
      name: 'Antioquia Reserve',
      roast: 'Medium',
      level: 2,
      notes: ['Dark Chocolate', 'Roasted Almond', 'Caramel'],
      flavors: ['Chocolatey', 'Nutty', 'Sweet'],
      origin: 'Reserve lot',
      retail: 175,
      wholesale: 245,
      image: 'photos/bag-antioquia.jpg'
    },
    {
      id: 'highland',
      name: 'Highland Espresso Blend',
      roast: 'Dark',
      level: 3,
      notes: ['Molasses', 'Cocoa Nib', 'Smoky Cedar'],
      flavors: ['Chocolatey', 'Smoky', 'Sweet'],
      origin: 'House espresso blend',
      retail: 165,
      wholesale: 225,
      image: 'photos/bag-highland.jpg'
    }
  ];

  const DELIVERY = {
    pickup: { label: 'Collect at roastery', fee: 0 },
    local: { label: 'Local delivery', fee: 150 },
    courier: { label: 'Courier', fee: 420 }
  };
  const WEEKS_PER_MONTH = 4.33;

  const rand = n => 'R' + Math.round(n).toLocaleString('en-ZA');

  // ---- Mobile nav ----
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', e => {
    if (e.target.closest('a') && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // ---- Bean catalog ----
  const grid = document.getElementById('bean-grid');
  const countEl = document.getElementById('results-count');
  const emptyEl = document.getElementById('empty-state');
  const state = { roast: 'all', flavor: 'all' };

  function cardHtml(c, i) {
    const dots = [1, 2, 3].map(n => `<i class="${n <= c.level ? 'on' : ''}"></i>`).join('');
    return `
      <article class="bean-card" style="animation-delay:${i * 60}ms" data-id="${c.id}">
        <div class="bean-art"><img src="assets/img/${c.image}" alt="${c.name} 250 g bag" width="1408" height="768" loading="lazy"></div>
        <div class="bean-body">
          <div class="roast-meter"><span>${c.roast} roast</span><span class="dots" aria-hidden="true">${dots}</span></div>
          <h3>${c.name}</h3>
          <p class="origin">${c.origin}</p>
          <ul class="tags" aria-label="Tasting notes">${c.notes.map(n => `<li>${n}</li>`).join('')}</ul>
          <div class="bean-foot">
            <span class="price">${rand(c.retail)} <small>/ 250 g</small></span>
            <a href="#wholesale" data-coffee="${c.id}">Wholesale &rarr;</a>
          </div>
        </div>
      </article>`;
  }

  function renderBeans() {
    const list = COFFEES.filter(c =>
      (state.roast === 'all' || c.roast === state.roast) &&
      (state.flavor === 'all' || c.flavors.includes(state.flavor))
    );
    grid.innerHTML = list.map(cardHtml).join('');
    emptyEl.hidden = list.length > 0;
    countEl.textContent = list.length === COFFEES.length
      ? `Showing all ${list.length} coffees`
      : `Showing ${list.length} of ${COFFEES.length} coffees`;
  }

  document.querySelectorAll('.filter-group').forEach(group => {
    group.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state[group.dataset.filter] = chip.dataset.value;
      group.querySelectorAll('.chip').forEach(c => {
        const on = c === chip;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
      renderBeans();
    });
  });

  document.getElementById('reset-filters').addEventListener('click', () => {
    state.roast = state.flavor = 'all';
    document.querySelectorAll('.filter-group').forEach(g => {
      g.querySelectorAll('.chip').forEach(c => {
        const on = c.dataset.value === 'all';
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });
    });
    renderBeans();
  });

  // ---- Wholesale calculator ----
  const form = document.getElementById('wholesale-form');
  const coffeeSel = document.getElementById('calc-coffee');
  const kgInput = document.getElementById('calc-kg');
  const kgOut = document.getElementById('calc-kg-out');
  const deliverySel = document.getElementById('calc-delivery');

  coffeeSel.innerHTML = COFFEES.map(c => `<option value="${c.id}">${c.name} (${c.roast})</option>`).join('');

  function discountFor(kg) {
    if (kg >= 25) return 0.10;
    if (kg >= 10) return 0.05;
    return 0;
  }

  function updateEstimate() {
    const coffee = COFFEES.find(c => c.id === coffeeSel.value);
    const kg = Number(kgInput.value);
    const disc = discountFor(kg);
    const delivery = DELIVERY[deliverySel.value];
    const pricePerKg = coffee.wholesale * (1 - disc);
    const monthlyKg = kg * WEEKS_PER_MONTH;
    const deliveries = WEEKS_PER_MONTH; // weekly baseline for the estimate
    const total = monthlyKg * pricePerKg + delivery.fee * deliveries;

    kgOut.textContent = `${kg} kg / week`;
    document.getElementById('est-monthly').textContent = rand(total);
    document.getElementById('est-coffee').textContent = coffee.name;
    document.getElementById('est-volume').textContent = `${kg} kg/wk (~${Math.round(monthlyKg)} kg/mo)`;
    document.getElementById('est-price').textContent = `${rand(pricePerKg)} / kg`;
    document.getElementById('est-discount').textContent = disc ? `${disc * 100}% off` : 'None yet (10 kg+ saves 5%)';
    document.getElementById('est-delivery').textContent =
      delivery.fee ? `${delivery.label}, ${rand(delivery.fee)} / drop` : delivery.label;
  }

  [coffeeSel, kgInput, deliverySel].forEach(el => el.addEventListener('input', updateEstimate));

  // "Wholesale ->" on a bean card pre-selects that coffee
  grid.addEventListener('click', e => {
    const link = e.target.closest('a[data-coffee]');
    if (!link) return;
    coffeeSel.value = link.dataset.coffee;
    updateEstimate();
  });

  // ---- Form validation + mock submit ----
  function validateField(input) {
    const field = input.closest('.field');
    const err = field && field.querySelector('.error');
    let msg = '';
    if (input.required && !input.value.trim()) msg = 'This field is required.';
    else if (input.type === 'email' && input.value && !/^\S+@\S+\.\S+$/.test(input.value)) msg = 'Please enter a valid email address.';
    if (err) err.textContent = msg;
    field && field.classList.toggle('invalid', Boolean(msg));
    return !msg;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const success = document.getElementById('form-success');
    const error = document.getElementById('form-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    const inputs = [...form.querySelectorAll('input[required]')];
    const ok = inputs.map(validateField).every(Boolean);
    success.hidden = true;
    error.hidden = true;
    if (!ok) {
      inputs.find(i => i.closest('.field').classList.contains('invalid')).focus();
      return;
    }

    const firstName = form.elements.name.value.trim().split(' ')[0];
    const endpoint = (form.dataset.endpoint || '').trim();

    if (!endpoint) {
      // No handler configured yet: demo mode, nothing leaves the browser.
      success.textContent = `Thanks ${firstName}! (Demo mode: nothing was sent. Set the form endpoint to go live.)`;
      success.hidden = false;
      return;
    }

    // Send the enquiry together with the estimate the visitor saw.
    const data = new FormData(form);
    data.set('coffee', COFFEES.find(c => c.id === coffeeSel.value).name);
    data.set('estimated_monthly_total', document.getElementById('est-monthly').textContent);
    data.set('_subject', `Wholesale inquiry from ${form.elements.business.value.trim()}`);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    try {
      const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Request failed: ' + res.status);
      success.textContent = `Thanks ${firstName}! We've received your inquiry and will reply by email shortly.`;
      success.hidden = false;
      form.reset();
      kgInput.value = 10;
      updateEstimate();
    } catch (err) {
      error.textContent = 'Sorry, something went wrong sending that. Please try again, or email elena@vanceartisanroasters.co.za directly.';
      error.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send wholesale inquiry';
    }
  });
  form.addEventListener('focusout', e => {
    if (e.target.matches('input[required]')) validateField(e.target);
  });

  // ---- Instagram placeholder grid ----
  // Square crops of the supplied photos, done with CSS so the originals stay intact
  const instaTiles = [
    { t: 'Roast day', s: 'Thursdays, 6am', img: 'photos/hero-roastery.jpg', style: 'object-position:70% 50%' },
    { t: 'Coffee cherries', s: 'Harvest season', img: 'photos/counter-espresso.jpg', style: 'object-position:100% 50%;transform:scale(2);transform-origin:100% 100%' },
    { t: 'Fresh bags', s: 'Just packed', img: 'photos/bag-antioquia.jpg', style: 'object-position:50% 50%' },
    { t: 'Pour-over', s: 'Brew guide', img: 'photos/craft-barista.jpg', style: 'object-position:40% 50%' },
    { t: 'Behind the roast', s: 'In the roastery', img: 'photos/hero-roastery.jpg', style: 'object-position:25% 50%' },
    { t: 'Café partner', s: 'Wholesale spotlight', img: 'photos/table-pourover.jpg', style: 'object-position:100% 50%' }
  ];
  document.getElementById('insta-grid').innerHTML = instaTiles.map(t =>
    `<a class="insta-tile" href="https://instagram.com/" target="_blank" rel="noopener">
      <img src="assets/img/${t.img}" alt="" loading="lazy" width="400" height="400" style="${t.style}">
      <span><strong>${t.t}</strong>${t.s}</span>
    </a>`).join('');

  // ---- Init ----
  document.getElementById('year').textContent = new Date().getFullYear();
  renderBeans();
  updateEstimate();
})();
