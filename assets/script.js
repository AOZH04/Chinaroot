// Мобильное меню
(function () {
    var toggle = document.getElementById('nav_toggle');
    var nav = document.getElementById('main_nav');
    if (!toggle || !nav) return;

    function closeMenu() {
        nav.classList.remove('is_open');
        toggle.classList.remove('is_open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is_open');
        toggle.classList.toggle('is_open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Закрываем меню после клика по ссылке
    nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeMenu();
    });

    // Закрываем при возврате на десктоп
    window.addEventListener('resize', function () {
        if (window.innerWidth > 850) closeMenu();
    });

    // Закрываем при скролле страницы
    window.addEventListener('scroll', function () {
        if (nav.classList.contains('is_open')) closeMenu();
    }, { passive: true });
})();

// Слайдер-coverflow: активный слайд по центру, соседние тусклые по бокам
// (переиспользуется для «Наши работы» и «Как идёт работа»)
function initCarousel(o) {
    var slider = document.getElementById(o.slider);
    if (!slider) return;
    var viewport = slider.querySelector(o.viewport);
    var track = document.getElementById(o.track);
    var slides = Array.prototype.slice.call(track.children);
    var prev = document.getElementById(o.prev);
    var next = document.getElementById(o.next);
    var curEl = document.getElementById(o.cur);
    var i = 0;

    // размытый фон-дубликат под каждым слайдом (из картинки или постера видео)
    slides.forEach(function (sl) {
        var media = sl.querySelector('.' + o.mediaClass);
        if (!media) return;
        var src = media.tagName === 'VIDEO' ? media.getAttribute('poster') : media.getAttribute('src');
        if (!src) return;
        var host = o.bgHost ? sl.querySelector(o.bgHost) : sl;
        if (!host) return;
        var bg = document.createElement('span');
        bg.className = o.bgClass;
        bg.style.backgroundImage = 'url("' + src + '")';
        host.insertBefore(bg, host.firstChild);
    });

    function render() {
        var slide = slides[i];
        var tx = viewport.clientWidth / 2 - (slide.offsetLeft + slide.offsetWidth / 2);
        track.style.transform = 'translateX(' + tx + 'px)';
        slides.forEach(function (sl, idx) {
            var active = idx === i;
            sl.classList.toggle('is_active', active);
            var v = sl.querySelector('video');
            if (v) {
                if (active) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
                else { v.pause(); }
            }
        });
        if (curEl) curEl.textContent = i + 1;
    }
    function go(n) { i = (n + slides.length) % slides.length; render(); }

    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    slides.forEach(function (sl, idx) {
        sl.addEventListener('click', function () { if (idx !== i) go(idx); });
    });
    window.addEventListener('resize', render);
    window.addEventListener('load', render);
    render();
}

initCarousel({
    slider: 'works_slider', viewport: '.works_viewport', track: 'works_track',
    prev: 'works_prev', next: 'works_next', cur: 'works_cur',
    mediaClass: 'works_media', bgClass: 'works_bg'
});
initCarousel({
    slider: 'flow_slider', viewport: '.flow_viewport', track: 'flow_track',
    prev: 'flow_prev', next: 'flow_next', cur: 'flow_cur',
    mediaClass: 'flow_media', bgClass: 'flow_bg', bgHost: '.flow_slide_media'
});

// Прячем плавающие мессенджеры у подвала и на первом экране (моб.)
(function () {
    var floats = document.querySelector('.float_messengers');
    var footer = document.querySelector('.site_footer');
    var hero = document.getElementById('hero');
    if (!floats || !('IntersectionObserver' in window)) return;

    var atFooter = false;
    var atHero = false;

    function update() {
        var hideForHero = atHero && window.matchMedia('(max-width: 850px)').matches;
        floats.classList.toggle('is_hidden', atFooter || hideForHero);
    }

    if (footer) {
        new IntersectionObserver(function (e) { atFooter = e[0].isIntersecting; update(); }).observe(footer);
    }
    if (hero) {
        new IntersectionObserver(function (e) { atHero = e[0].isIntersecting; update(); }).observe(hero);
    }
    window.addEventListener('resize', update);
})();
