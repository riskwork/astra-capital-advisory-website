(function () {
  'use strict';
  var SITE = window.SITE || {};
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- fill details from js/site-config.js ----- */
  document.querySelectorAll('[data-site-text]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site-text')];
    if (v) el.textContent = v;
  });
  document.querySelectorAll('[data-site-mail]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site-mail')];
    if (v) { el.textContent = v; el.href = 'mailto:' + v; } else { el.removeAttribute('href'); }
  });
  document.querySelectorAll('[data-site-tel]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site-tel')];
    if (v) { el.textContent = v; el.href = 'tel:' + v.replace(/[^+\d]/g, ''); } else { el.removeAttribute('href'); }
  });
  document.querySelectorAll('[data-site-href]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site-href')];
    if (v) el.href = v;
  });
  var anySocial = false;
  document.querySelectorAll('[data-site-social]').forEach(function (li) {
    if (SITE[li.getAttribute('data-site-social')]) { li.hidden = false; anySocial = true; }
  });
  var socials = document.querySelector('[data-site-socials]');
  if (socials && anySocial) socials.hidden = false;

  /* ----- mobile menu ----- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
  }

  /* ----- hero video ----- */
  var video = document.querySelector('.hero-media');
  var btn = document.querySelector('[data-hero-toggle]');
  var todo = document.querySelector('[data-hero-todo]');
  var cfg = SITE.heroVideo || {};
  if (video && btn && cfg.enabled) {
    if (todo) todo.hidden = true;
    [[cfg.webm, 'video/webm'], [cfg.mp4, 'video/mp4']].forEach(function (s) {
      if (!s[0]) return;
      var src = document.createElement('source');
      src.src = s[0]; src.type = s[1];
      video.appendChild(src);
    });
    video.preload = 'auto';
    video.load();
    btn.disabled = false;
    var setPaused = function (paused) {
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    };
    video.addEventListener('play', function () { setPaused(false); });
    video.addEventListener('pause', function () { setPaused(true); });
    setPaused(true);
    if (!reduceMotion) {
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* autoplay blocked: stays paused, user can press play */ });
    }
    btn.addEventListener('click', function () {
      if (video.paused) { var q = video.play(); if (q && q.catch) q.catch(function () {}); } else { video.pause(); }
    });
    /* the clip's final ~3.5s dissolves into the logo card, which already carries the
       wordmark baked in, so hide the overlaid title text during that window */
    var centerLabel = document.querySelector('.hero-center');
    if (centerLabel) {
      video.addEventListener('timeupdate', function () {
        centerLabel.classList.toggle('is-hidden', video.currentTime > 7.8);
      });
    }
  } else if (btn) {
    btn.setAttribute('aria-label', 'Background video not available yet');
  }

  /* ----- consultation form ----- */
  var form = document.getElementById('consult-form');
  if (form) {
    var status = document.getElementById('form-status');
    var rules = {
      name: 'Please enter your full name.',
      email: 'Please enter a valid email address.',
      company: 'Please enter your company or organization.',
      service: 'Please select a service.',
      message: 'Please tell us a little about your venture.'
    };
    var check = function (field) {
      var err = document.getElementById('e-' + field.name);
      var value = field.value.trim();
      var ok = value.length > 0;
      if (ok && field.name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      field.setAttribute('aria-invalid', String(!ok));
      err.textContent = ok ? '' : rules[field.name];
      err.hidden = ok;
      return ok;
    };
    form.querySelectorAll('input, select, textarea').forEach(function (f) {
      f.addEventListener('blur', function () { check(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') check(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
      var bad = fields.filter(function (f) { return !check(f); });
      if (bad.length) { bad[0].focus(); return; }
      var data = {};
      fields.forEach(function (f) { data[f.name] = f.value.trim(); });
      var show = function (msg, isError) {
        status.textContent = msg;
        status.classList.toggle('form-status--error', !!isError);
        status.hidden = false;
      };
      if (!SITE.formEndpoint) {
        // TODO: connect a backend by setting formEndpoint in js/site-config.js
        show('Demo mode: the form is valid, but no backend is connected yet, so nothing was sent.');
        form.reset();
        return;
      }
      fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        show('Thank you. Your request has been received.');
        form.reset();
      }).catch(function () {
        show('Sorry, your request could not be sent. Please try again later.', true);
      });
    });
  }
})();
