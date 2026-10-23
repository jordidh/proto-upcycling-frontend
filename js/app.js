/*
 * Reviu · lògica de l'aplicació (Vanilla JS, sense backend).
 * Les dades dels objectes es carreguen des de data.js.
 */
(() => {
  'use strict';

  const STORAGE_KEY = 'reviu:reserves';
  const HOLD_MS = 72 * 60 * 60 * 1000;
  const SLOTS = ['09:00 – 12:00', '12:00 – 15:00', '15:00 – 18:00', '18:00 – 20:00'];
  const ESTAT_CLASS = {
    'Funcional': 'ok',
    'Necessita reparació': 'warn',
    'Només peces / Desballestament': 'parts'
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const state = {
    filtres: { text: '', categoria: '', origen: '', estat: '', gratuits: false },
    reserves: {},
    focusAbans: null
  };

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const normalitza = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  const fmt = (n) => n.toLocaleString('ca-ES');
  const formatPreu = (p) => (p === 0 ? 'Gratuït' : `${p} €`);
  const isReservat = (id) => Boolean(state.reserves[id]);

  // ---------- Persistència (localStorage) ----------

  function carregaReserves() {
    try {
      const dades = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      return Object.fromEntries(Object.entries(dades).filter(([id]) => ITEMS.some((i) => i.id === id)));
    } catch {
      return {};
    }
  }

  function desaReserves() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.reserves));
    } catch {
      // Sense persistència (p. ex. navegació privada): la reserva segueix en memòria.
    }
  }

  // Allibera les reserves que han superat les 72 h sense recollida.
  function purgaExpirades() {
    const ara = Date.now();
    let canvis = false;
    for (const [id, r] of Object.entries(state.reserves)) {
      if (r.expiraEn <= ara) {
        delete state.reserves[id];
        canvis = true;
      }
    }
    return canvis;
  }

  // ---------- Filtres ----------

  function itemsFiltrats() {
    const { text, categoria, origen, estat, gratuits } = state.filtres;
    const q = normalitza(text);
    return ITEMS.filter((i) =>
      (!q || normalitza(`${i.titol} ${i.descripcio} ${i.origen_nom}`).includes(q)) &&
      (!categoria || i.categoria === categoria) &&
      (!origen || i.origen_tipus === origen) &&
      (!estat || i.estat_conservacio === estat) &&
      (!gratuits || i.preu === 0)
    );
  }

  function omplirSelects() {
    const opcions = (llista, etiqueta) =>
      `<option value="">${etiqueta}</option>` + llista.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
    $('#f-categoria').innerHTML = opcions(CATEGORIES, 'Totes les categories');
    $('#f-origen').innerHTML = opcions(ORIGIN_TYPES, 'Tots els orígens');
    $('#f-estat').innerHTML = opcions(STATES, 'Tots els estats');
  }

  function sincronitzaControls() {
    $('#f-text').value = state.filtres.text;
    $('#f-categoria').value = state.filtres.categoria;
    $('#f-origen').value = state.filtres.origen;
    $('#f-estat').value = state.filtres.estat;
    $('#f-gratuit').checked = state.filtres.gratuits;
  }

  function resetFiltres() {
    state.filtres = { text: '', categoria: '', origen: '', estat: '', gratuits: false };
    sincronitzaControls();
    renderCatalog();
  }

  // ---------- Render: catàleg ----------

  function cardHTML(i) {
    const reservat = isReservat(i.id);
    const bloquejat = reservat || !i.disponible;
    const etiqueta = reservat ? 'Ja Reservat' : !i.disponible ? 'No disponible' : 'Veure detalls / Reservar';
    const ariaLabel = bloquejat ? '' : `aria-label="Veure detalls i reservar: ${esc(i.titol)}"`;
    return `
      <article class="card${reservat ? ' card--reservat' : ''}">
        <div class="card__media">
          <img src="${i.imatge_url}" alt="" loading="lazy" width="400" height="300">
          ${reservat ? '<span class="card__ribbon">Reservat</span>' : ''}
        </div>
        <div class="card__body">
          <p class="card__cat">${esc(i.categoria)}</p>
          <h3 class="card__title">${esc(i.titol)}</h3>
          <ul class="badges" aria-label="Característiques">
            <li class="badge badge--origen">${esc(i.origen_tipus)}</li>
            <li class="badge badge--${ESTAT_CLASS[i.estat_conservacio]}">${esc(i.estat_conservacio)}</li>
            <li class="badge badge--co2">${i.co2_estalviat_kg} kg CO₂ estalviats</li>
          </ul>
          <p class="card__origin">${esc(i.origen_nom)} · ${esc(i.ubicacio)}</p>
          <div class="card__foot">
            <span class="price">${formatPreu(i.preu)}</span>
            <button type="button" class="btn ${bloquejat ? 'btn--disabled' : 'btn--primary'}"
              data-action="detalls" data-id="${i.id}" ${bloquejat ? 'disabled' : ''} ${ariaLabel}>${etiqueta}</button>
          </div>
        </div>
      </article>`;
  }

  function renderCatalog() {
    const llista = itemsFiltrats();
    $('#grid').innerHTML = llista.map(cardHTML).join('');
    $('#buit').hidden = llista.length > 0;
    $('#resultats').textContent = llista.length === 0
      ? 'Cap resultat amb aquests filtres'
      : `${llista.length} ${llista.length === 1 ? 'objecte trobat' : 'objectes trobats'}`;
  }

  // ---------- Render: baròmetre ----------

  function calculaImpacte() {
    const reservats = ITEMS.filter((i) => isReservat(i.id));
    return {
      objectes: IMPACTE_BASE.objectes + reservats.length,
      co2: Math.round(IMPACTE_BASE.co2_kg + reservats.reduce((s, i) => s + i.co2_estalviat_kg, 0))
    };
  }

  // Compta des del valor mostrat fins al nou valor; un token evita que animacions antigues trepitgin la nova.
  function animaNumero(el, valor) {
    const inici = Number(el.dataset.valor || 0);
    el.dataset.valor = valor;
    el._token = (el._token || 0) + 1;
    const token = el._token;
    if (reduceMotion || inici === valor) {
      el.textContent = fmt(valor);
      return;
    }
    const t0 = performance.now();
    const pas = (now) => {
      if (token !== el._token) return;
      const p = Math.min(1, (now - t0) / 600);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(inici + (valor - inici) * eased));
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  }

  function renderImpacte() {
    const { objectes, co2 } = calculaImpacte();
    animaNumero($('#stat-objectes'), objectes);
    animaNumero($('#stat-co2'), co2);
    $('#stat-cataleg').textContent = fmt(ITEMS.length);
  }

  function renderAll() {
    renderImpacte();
    renderCatalog();
  }

  // ---------- Modal ----------

  function diesLaborables(n) {
    const dies = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (dies.length < n) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) dies.push(new Date(d));
    }
    return dies;
  }

  // Opcions "dia · franja" per als tres propers dies laborables (a partir de demà).
  function opcionsFranja() {
    const grups = diesLaborables(3).map((d) => {
      const dia = d.toLocaleDateString('ca-ES', { weekday: 'long', day: 'numeric', month: 'long' });
      const etiqueta = dia.charAt(0).toUpperCase() + dia.slice(1);
      const opts = SLOTS.map((s) => `<option value="${etiqueta} · ${s}">${s}</option>`).join('');
      return `<optgroup label="${esc(etiqueta)}">${opts}</optgroup>`;
    });
    return `<option value="">Escull un dia i una franja…</option>` + grups.join('');
  }

  function detallHTML(i) {
    return `
      <div class="detail">
        <img class="detail__img" src="${i.imatge_url}" alt="">
        <div class="detail__info">
          <p class="card__cat">${esc(i.categoria)}</p>
          <h2 id="modal-title" class="detail__title" tabindex="-1">${esc(i.titol)}</h2>
          <p>${esc(i.descripcio)}</p>
          <dl class="facts">
            <div><dt>Origen</dt><dd>${esc(i.origen_tipus)} · ${esc(i.origen_nom)}</dd></div>
            <div><dt>Ubicació</dt><dd>${esc(i.ubicacio)}</dd></div>
            <div><dt>Estat</dt><dd>${esc(i.estat_conservacio)}</dd></div>
            <div><dt>Preu</dt><dd>${formatPreu(i.preu)}</dd></div>
            <div><dt>Impacte</dt><dd>${i.co2_estalviat_kg} kg de CO₂ estalviats</dd></div>
          </dl>
          <div class="callout">
            <strong>Instruccions de recollida</strong>
            <p>${esc(i.instruccions)}</p>
          </div>
        </div>
      </div>

      <form id="reserva-form" class="reserva" novalidate>
        <h3>Sol·licita la reserva</h3>
        <div class="field-group">
          <label class="field">
            <span>Nom de la persona interessada</span>
            <input name="nom" autocomplete="name" maxlength="80" aria-describedby="err-nom">
            <small class="field__error" id="err-nom"></small>
          </label>
          <label class="field">
            <span>Adreça electrònica</span>
            <input name="email" type="email" autocomplete="email" maxlength="120" aria-describedby="err-email">
            <small class="field__error" id="err-email"></small>
          </label>
          <label class="field field--wide">
            <span>Dia i franja de recollida</span>
            <select name="franja" aria-describedby="err-franja">${opcionsFranja()}</select>
            <small class="field__error" id="err-franja"></small>
          </label>
        </div>
        <p class="warning" role="note">⚠ Si no reculls l'article en 72 hores, tornarà a estar disponible per a la comunitat.</p>
        <div class="actions">
          <button type="button" class="btn btn--ghost" data-close>Cancel·la</button>
          <button type="submit" class="btn btn--accent">Confirma la reserva</button>
        </div>
      </form>`;
  }

  function obreModal(id) {
    const item = ITEMS.find((i) => i.id === id);
    if (!item || isReservat(id) || !item.disponible) return;
    state.focusAbans = document.activeElement;
    $('#modal-body').innerHTML = detallHTML(item);
    $('#reserva-form').addEventListener('submit', (e) => gestionaEnviament(e, item));
    const modal = $('#modal');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('#modal-title').focus();
  }

  function tancaModal() {
    const modal = $('#modal');
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    if (state.focusAbans) state.focusAbans.focus();
  }

  function valida({ nom, email, franja }) {
    const errors = {};
    if (nom.length < 2) errors.nom = 'Introdueix un nom de almenys 2 caràcters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Introdueix una adreça electrònica vàlida.';
    if (!franja) errors.franja = 'Escull un dia i una franja de recollida.';
    return errors;
  }

  function mostraErrors(form, errors) {
    ['nom', 'email', 'franja'].forEach((camp) => {
      const msg = errors[camp] || '';
      form.elements[camp].setAttribute('aria-invalid', String(Boolean(msg)));
      form.querySelector(`#err-${camp}`).textContent = msg;
    });
  }

  function generaCodi() {
    const usats = new Set(Object.values(state.reserves).map((r) => r.codi));
    let codi;
    do {
      codi = `REC-${Math.floor(10000 + Math.random() * 90000)}`;
    } while (usats.has(codi));
    return codi;
  }

  function gestionaEnviament(e, item) {
    e.preventDefault();
    const form = e.currentTarget;
    const dades = {
      nom: form.elements.nom.value.trim(),
      email: form.elements.email.value.trim(),
      franja: form.elements.franja.value
    };
    const errors = valida(dades);
    mostraErrors(form, errors);
    const primer = Object.keys(errors)[0];
    if (primer) {
      form.elements[primer].focus();
      return;
    }

    state.reserves[item.id] = {
      codi: generaCodi(),
      nom: dades.nom,
      email: dades.email,
      franja: dades.franja,
      expiraEn: Date.now() + HOLD_MS
    };
    desaReserves();
    renderAll();
    mostraExit(item, state.reserves[item.id]);
  }

  function mostraExit(item, reserva) {
    const limit = new Date(reserva.expiraEn).toLocaleString('ca-ES', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    $('#modal-body').innerHTML = `
      <div class="success" role="status">
        <p class="success__icon" aria-hidden="true">✓</p>
        <h2 id="modal-title" tabindex="-1">Reserva confirmada</h2>
        <p>Gràcies, <strong>${esc(reserva.nom)}</strong>. Presenta aquest codi a ${esc(item.origen_nom)} en la recollida:</p>
        <p class="code">${reserva.codi}</p>
        <p>Franja: <strong>${esc(reserva.franja)}</strong>.</p>
        <p>Tens 72 hores per recollir l'article (fins al ${limit}).</p>
        <p class="muted">Les dades es guarden només en aquest navegador. Un cop expirada la reserva, l'article torna a estar disponible.</p>
        <button type="button" class="btn btn--primary" data-close>Continua explorant</button>
      </div>`;
    $('#modal-title').focus();
  }

  // ---------- Esdeveniments ----------

  function bind() {
    $('#f-text').addEventListener('input', (e) => {
      state.filtres.text = e.target.value;
      renderCatalog();
    });
    $('#f-categoria').addEventListener('change', (e) => {
      state.filtres.categoria = e.target.value;
      renderCatalog();
    });
    $('#f-origen').addEventListener('change', (e) => {
      state.filtres.origen = e.target.value;
      renderCatalog();
    });
    $('#f-estat').addEventListener('change', (e) => {
      state.filtres.estat = e.target.value;
      renderCatalog();
    });
    $('#f-gratuit').addEventListener('change', (e) => {
      state.filtres.gratuits = e.target.checked;
      renderCatalog();
    });
    $('#f-reset').addEventListener('click', resetFiltres);
    document.querySelector('[data-action="reset"]').addEventListener('click', resetFiltres);

    $('#btn-repair').addEventListener('click', () => {
      state.filtres = { ...state.filtres, text: '', categoria: '', origen: 'Repair Cafè', estat: 'Necessita reparació' };
      sincronitzaControls();
      renderCatalog();
      $('#catalog').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });

    $('#grid').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="detalls"]');
      if (btn) obreModal(btn.dataset.id);
    });

    const modal = $('#modal');
    modal.addEventListener('click', (e) => {
      if (e.target.closest('[data-close]')) tancaModal();
    });

    document.addEventListener('keydown', (e) => {
      if (!$('#modal').classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        tancaModal();
        return;
      }
      if (e.key !== 'Tab') return;
      // Manté el focus dins del diàleg mentre està obert.
      const focusables = [...$('#dialog').querySelectorAll('button:not([disabled]), input, select, [href], [tabindex]:not([tabindex="-1"])')];
      if (focusables.length === 0) return;
      const primer = focusables[0];
      const ultim = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === primer) {
        e.preventDefault();
        ultim.focus();
      } else if (!e.shiftKey && document.activeElement === ultim) {
        e.preventDefault();
        primer.focus();
      }
    });

    // Allibera les reserves caducades mentre la pàgina està oberta.
    setInterval(() => {
      if (purgaExpirades()) {
        desaReserves();
        renderAll();
      }
    }, 60 * 1000);
  }

  // ---------- Inici ----------

  function init() {
    state.reserves = carregaReserves();
    if (purgaExpirades()) desaReserves();
    omplirSelects();
    sincronitzaControls();
    bind();
    renderAll();
  }

  init();
})();
