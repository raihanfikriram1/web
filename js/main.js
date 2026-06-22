
(function () {
  'use strict';

  /* ---- Preloader ---- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, 1500);
  });

  /* ---- Scroll Progress ---- */
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ---- Navbar ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  let lastScroll = 0;

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navMobile.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  /* Close mobile menu on link click */
  document.querySelectorAll('.navbar-mobile a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMobile.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ---- Smooth Scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) {
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 72;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal ---- */
  function initScrollReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---- FAQ Accordion ---- */
  function initFAQ() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var trigger = item.querySelector('.faq-trigger');
      var content = item.querySelector('.faq-content');
      if (!trigger || !content) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('active');

        /* Close all */
        items.forEach(function (other) {
          other.classList.remove('active');
          var otherContent = other.querySelector('.faq-content');
          if (otherContent) otherContent.style.maxHeight = '0';
        });

        /* Toggle current */
        if (!isOpen) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---- Form Validation & Submission ---- */
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var submitBtn = document.getElementById('submit-btn');
    var charCount = document.getElementById('char-count');
    var pesanField = document.getElementById('pesan');

    /* Character counter */
    if (pesanField && charCount) {
      pesanField.addEventListener('input', function () {
        charCount.textContent = this.value.length;
      });
    }

    /* Validation */
    function validateField(input) {
      var group = input.closest('.form-group');
      var errorEl = group ? group.querySelector('.error-msg') : null;
      var valid = true;
      var msg = '';

      if (input.required && !input.value.trim()) {
        valid = false;
        msg = 'Field ini wajib diisi.';
      } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        valid = false;
        msg = 'Email tidak valid.';
      } else if (input.id === 'telepon' && input.value && !/^0[0-9]{9,12}$/.test(input.value.replace(/\s/g, ''))) {
        valid = false;
        msg = 'Nomor telepon tidak valid (contoh: 08123456789).';
      } else if (input.id === 'tahun') {
        var val = parseInt(input.value);
        if (input.value && (val < 2013 || val > 2026)) {
          valid = false;
          msg = 'Tahun motor harus 2013-2026.';
        }
      }

      if (group) {
        if (!valid) {
          group.classList.add('has-error');
          input.classList.add('error');
          if (errorEl) errorEl.textContent = msg;
        } else {
          group.classList.remove('has-error');
          input.classList.remove('error');
          if (errorEl) errorEl.textContent = '';
        }
      }
      return valid;
    }

    /* Live validation on blur */
    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(this);
      });
      input.addEventListener('input', function () {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });

    /* Submit */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var allValid = true;
      form.querySelectorAll('input[required], select[required]').forEach(function (input) {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) return;

      /* Show loading */
      var btnText = submitBtn.querySelector('.btn-text');
      var btnLoading = submitBtn.querySelector('.btn-loading');
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      if (btnText) btnText.style.opacity = '0';
      if (btnLoading) btnLoading.style.display = 'flex';

      /* Submit via fetch */
      var formData = new FormData(form);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })
        .then(function () {
          window.location.href = 'thank-you.html';
        })
        .catch(function () {
          /* Fallback: submit normally */
          form.submit();
        });
    });
  }

  /* ---- Back to Top ---- */
  var backToTop = document.getElementById('back-to-top');
  function updateBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Calculator (BFI Lookup Table) ---- */
  function initCalculator() {
    var plafon = document.getElementById('calc-plafon');
    var plafonVal = document.getElementById('calc-plafon-val');
    var result = document.getElementById('calc-result');
    var tenorBtns = document.querySelectorAll('.calc-tenor-btn');
    if (!plafon || !result) return;

    var angsuranBFI = {
      3000000: { 6: 817500, 12: 424000, 18: 325500, 24: 275000 },
      3500000: { 6: 929500, 12: 488500, 18: 373500, 24: 316500 },
      4000000: { 6: 1029000, 12: 544500, 18: 415500, 24: 352000 },
      4500000: { 6: 1126500, 12: 599000, 18: 456500, 24: 386500 },
      5000000: { 6: 1266000, 12: 650000, 18: 499500, 24: 421500 },
      5500000: { 6: 1363500, 12: 704000, 18: 540000, 24: 456000 },
      6000000: { 6: 1462000, 12: 759000, 18: 582000, 24: 491000 },
      6500000: { 6: 1560500, 12: 813500, 18: 622500, 24: 525500 },
      7000000: { 6: 1657500, 12: 868000, 18: 664500, 24: 560500 },
      7500000: { 6: 1766500, 12: 931500, 18: 714000, 24: 603000 },
      8000000: { 6: 1864000, 12: 986500, 18: 756000, 24: 638000 },
      8500000: { 6: 1962500, 12: 1041000, 18: 796500, 24: 673500 },
      9000000: { 6: 2059500, 12: 1096000, 18: 838500, 24: 707500 },
      9500000: { 6: 2158000, 12: 1150000, 18: 879000, 24: 743000 },
      10000000: { 6: 2271000, 12: 1213500, 18: 927500, 24: 783000 },
      10500000: { 6: 2369500, 12: 1268000, 18: 970000, 24: 818500 },
      11000000: { 6: 2466500, 12: 1323000, 18: 1011000, 24: 852500 },
      11500000: { 6: 2565500, 12: 1377000, 18: 1053000, 24: 888000 },
      12000000: { 6: 2662500, 12: 1432000, 18: 1093500, 24: 922500 },
      12500000: { 6: 2761000, 12: 1486500, 18: 1136000, 24: 958000 },
      13000000: { 6: 2858500, 12: 1541500, 18: 1176500, 24: 992500 },
      13500000: { 6: 2961000, 12: 1595500, 18: 1220500, 24: 1029500 },
      14000000: { 6: 3058000, 12: 1653000, 18: 1261500, 24: 1063500 },
      14500000: { 6: 3155000, 12: 1707000, 18: 1302000, 24: 1098000 },
      15000000: { 6: 3252500, 12: 1761500, 18: 1343000, 24: 1132500 },
      15500000: { 6: 3350000, 12: 1815500, 18: 1384000, 24: 1166500 },
      16000000: { 6: 3447000, 12: 1869500, 18: 1424500, 24: 1201000 },
      16500000: { 6: 3548500, 12: 1924000, 18: 1468000, 24: 1237500 },
      17000000: { 6: 3645500, 12: 1982000, 18: 1508500, 24: 1271500 },
      17500000: { 6: 3742500, 12: 2036000, 18: 1549500, 24: 1306000 },
      18000000: { 6: 3840000, 12: 2090500, 18: 1590000, 24: 1340500 },
      18500000: { 6: 3935000, 12: 2144500, 18: 1631500, 24: 1375500 },
      19000000: { 6: 4033000, 12: 2196500, 18: 1673000, 24: 1410500 },
      19500000: { 6: 4131000, 12: 2251000, 18: 1714500, 24: 1445000 },
      20000000: { 6: 4229000, 12: 2305500, 18: 1756000, 24: 1480000 }
    };

    var plafonKeys = Object.keys(angsuranBFI).map(Number).sort(function(a, b) { return a - b; });
    var selectedTenor = 12;

    function formatRupiah(num) {
      return 'Rp ' + num.toLocaleString('id-ID');
    }

    function getNearestPlafon(val) {
      var closest = plafonKeys[0];
      for (var i = 0; i < plafonKeys.length; i++) {
        if (Math.abs(plafonKeys[i] - val) < Math.abs(closest - val)) {
          closest = plafonKeys[i];
        }
      }
      return closest;
    }

    function hitung() {
      var p = getNearestPlafon(parseInt(plafon.value));
      var angsuran = angsuranBFI[p][selectedTenor];
      plafonVal.textContent = formatRupiah(p);
      result.textContent = formatRupiah(angsuran);
    }

    plafon.addEventListener('input', hitung);

    tenorBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        tenorBtns.forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        selectedTenor = parseInt(btn.dataset.tenor);
        hitung();
      });
    });

    hitung();
  }

  /* ---- Scroll Handler ---- */
  function onScroll() {
    updateScrollProgress();
    updateNavbar();
    updateBackToTop();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initFAQ();
    initForm();
    initCalculator();
    onScroll();
  });

})();
