/* ==========================================================================
   WIDGET FLOTANTE DE ACCESIBILIDAD UNIVERSAL · REDIIA UNED COSTA RICA
   WCAG 2.1 Nivel AA / AAA · Ley N.° 7600
   Reutilizable en todas las páginas del portal (index.html, accesibilidad.html)
   ========================================================================== */
(function () {
    'use strict';

    var STORAGE_KEY = 'uned_rediia_a11y_prefs_v1';
    var htmlEl = document.documentElement;

    var defaultState = {
        'font-lg': false,
        'font-xl': false,
        'high-contrast': false,
        'grayscale': false,
        'dyslexia': false,
        'spacing': false,
        'highlight-links': false,
        'reading-guide': false,
        'reduce-motion': false,
        'big-cursor': false
    };

    var a11yState = Object.assign({}, defaultState);
    var speechActive = false;

    function createEl(tag, attrs, text) {
        var el = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (k) {
                if (k === 'className') {
                    el.className = attrs[k];
                } else {
                    el.setAttribute(k, attrs[k]);
                }
            });
        }
        if (typeof text === 'string') {
            el.textContent = text;
        }
        return el;
    }

    function ensureInfrastructure() {
        var liveRegion = document.getElementById('a11y-live-region');
        if (!liveRegion) {
            liveRegion = createEl('div', {
                id: 'a11y-live-region',
                className: 'a11y-sr-only',
                'aria-live': 'polite',
                'aria-atomic': 'true'
            });
            document.body.insertBefore(liveRegion, document.body.firstChild);
        }

        var readingGuide = document.getElementById('a11y-reading-guide');
        if (!readingGuide) {
            readingGuide = createEl('div', {
                id: 'a11y-reading-guide',
                'aria-hidden': 'true'
            });
            document.body.insertBefore(readingGuide, liveRegion.nextSibling);
        }

        return { liveRegion: liveRegion, readingGuide: readingGuide };
    }

    function buildWidgetUI() {
        // Evitar duplicación si ya existe
        var existingToggle = document.getElementById('a11y-toggle-btn');
        if (existingToggle) {
            existingToggle.remove();
        }
        var existingPanel = document.getElementById('a11y-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        var isStatementPage = /accesibilidad\.html$/i.test(window.location.pathname || '');

        // Botón flotante inferior derecho
        var toggleBtn = createEl('button', {
            type: 'button',
            className: 'a11y-widget-toggle',
            id: 'a11y-toggle-btn',
            'aria-label': 'Abrir herramientas de accesibilidad universal (Atajo Alt + A)',
            'aria-expanded': 'false',
            'aria-controls': 'a11y-panel',
            'aria-haspopup': 'dialog',
            title: 'Accesibilidad Universal Ley 7600 (Alt + A)'
        });
        toggleBtn.appendChild(createEl('span', { className: 'a11y-toggle-icon', 'aria-hidden': 'true' }, '♿'));
        toggleBtn.appendChild(createEl('span', { className: 'a11y-toggle-label' }, 'Accesibilidad'));
        var countBadge = createEl('span', {
            className: 'a11y-active-count',
            id: 'a11y-active-count',
            'aria-hidden': 'true'
        }, '0');
        toggleBtn.appendChild(countBadge);

        // Panel flotante (diálogo no modal)
        var panel = createEl('aside', {
            className: 'a11y-panel',
            id: 'a11y-panel',
            role: 'dialog',
            'aria-modal': 'false',
            'aria-labelledby': 'a11y-panel-title',
            hidden: ''
        });

        // Header del panel
        var header = createEl('div', { className: 'a11y-panel-header' });
        var title = createEl('h2', {
            className: 'a11y-panel-title',
            id: 'a11y-panel-title',
            tabindex: '-1'
        }, 'Accesibilidad UNED (Alt + A)');
        var closeBtn = createEl('button', {
            type: 'button',
            className: 'a11y-close-btn',
            id: 'a11y-close-btn',
            'aria-label': 'Cerrar panel de accesibilidad'
        }, '✕');
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // Barra de escala de texto (100% / 115% / 130%)
        var fontBar = createEl('div', {
            className: 'a11y-fontsize-bar',
            role: 'group',
            'aria-label': 'Tamaño de texto'
        });
        [
            { key: 'font-normal', label: 'A 100%', aria: 'Tamaño de texto normal 100 por ciento' },
            { key: 'font-lg', label: 'A+ 115%', aria: 'Aumentar texto al 115 por ciento' },
            { key: 'font-xl', label: 'A++ 130%', aria: 'Aumentar texto al 130 por ciento' }
        ].forEach(function (item) {
            var b = createEl('button', {
                type: 'button',
                className: 'a11y-btn a11y-btn-center',
                'data-a11y': item.key,
                'aria-label': item.aria,
                'aria-pressed': item.key === 'font-normal' ? 'true' : 'false'
            }, item.label);
            fontBar.appendChild(b);
        });
        panel.appendChild(fontBar);

        // Cuadrícula de herramientas asistivas
        var grid = createEl('div', {
            className: 'a11y-grid',
            role: 'group',
            'aria-label': 'Herramientas visuales y cognitivas'
        });

        var tools = [
            { key: 'high-contrast', icon: '🌗', label: 'Alto Contraste AAA' },
            { key: 'grayscale', icon: '⚫', label: 'Monocromático' },
            { key: 'dyslexia', icon: '📖', label: 'Fuente Dislexia' },
            { key: 'spacing', icon: '↕️', label: 'Espaciado Amplio' },
            { key: 'highlight-links', icon: '🔗', label: 'Resaltar Enlaces' },
            { key: 'reading-guide', icon: '📏', label: 'Guía de Lectura' },
            { key: 'reduce-motion', icon: '⏸️', label: 'Sin Animaciones' },
            { key: 'big-cursor', icon: '🖱️', label: 'Cursor Grande' }
        ];

        tools.forEach(function (tool) {
            var btn = createEl('button', {
                type: 'button',
                className: 'a11y-btn',
                'data-a11y': tool.key,
                'aria-pressed': 'false'
            });
            btn.appendChild(createEl('span', { 'aria-hidden': 'true' }, tool.icon));
            btn.appendChild(createEl('span', null, tool.label));
            grid.appendChild(btn);
        });

        // Botón de lectura en voz alta (Web Speech API) si está disponible
        if ('speechSynthesis' in window) {
            var ttsBtn = createEl('button', {
                type: 'button',
                className: 'a11y-btn a11y-btn-full a11y-btn-center',
                id: 'a11y-tts-btn',
                'aria-pressed': 'false'
            });
            ttsBtn.appendChild(createEl('span', { 'aria-hidden': 'true' }, '🔊'));
            ttsBtn.appendChild(createEl('span', { id: 'a11y-tts-label' }, 'Leer página o selección en voz alta'));
            grid.appendChild(ttsBtn);
        }

        panel.appendChild(grid);

        // Atajos de teclado rápidos
        var shortcutsDetails = createEl('details', { className: 'a11y-shortcuts-details' });
        shortcutsDetails.appendChild(createEl('summary', null, '⌨️ Atajos de teclado rápidos'));
        var scList = createEl('ul', { className: 'a11y-shortcuts-list' });
        [
            ['Alt + A', 'Abrir o cerrar este panel'],
            ['Alt + S', 'Ir al contenido principal'],
            ['Alt + 1..5', 'Saltar entre secciones del portal'],
            ['Esc', 'Cerrar paneles o menús abiertos']
        ].forEach(function (pair) {
            var li = createEl('li');
            li.appendChild(createEl('kbd', null, pair[0]));
            li.appendChild(document.createTextNode(' · ' + pair[1]));
            scList.appendChild(li);
        });
        shortcutsDetails.appendChild(scList);
        panel.appendChild(shortcutsDetails);

        // Footer del panel
        var footer = createEl('div', { className: 'a11y-panel-footer' });
        var resetBtn = createEl('button', {
            type: 'button',
            className: 'a11y-reset-btn',
            id: 'a11y-reset-btn'
        }, '↺ Restablecer todo');
        footer.appendChild(resetBtn);

        if (!isStatementPage) {
            var stmtLink = createEl('a', {
                href: 'accesibilidad.html',
                className: 'a11y-statement-link'
            }, 'Declaración Ley 7600 →');
            footer.appendChild(stmtLink);
        } else {
            var homeLink = createEl('a', {
                href: 'index.html',
                className: 'a11y-statement-link'
            }, '← Portal Principal');
            footer.appendChild(homeLink);
        }

        panel.appendChild(footer);

        document.body.appendChild(toggleBtn);
        document.body.appendChild(panel);

        return {
            toggleBtn: toggleBtn,
            panel: panel,
            title: title,
            closeBtn: closeBtn,
            resetBtn: resetBtn,
            countBadge: countBadge
        };
    }

    function init() {
        var infra = ensureInfrastructure();
        var ui = buildWidgetUI();
        var a11yBtns = ui.panel.querySelectorAll('.a11y-btn[data-a11y]');
        var ttsBtn = document.getElementById('a11y-tts-btn');
        var ttsLabel = document.getElementById('a11y-tts-label');

        function announce(msg) {
            if (!infra.liveRegion) return;
            infra.liveRegion.textContent = '';
            window.setTimeout(function () {
                infra.liveRegion.textContent = msg;
            }, 30);
        }

        function countActiveOptions() {
            return Object.keys(a11yState).reduce(function (acc, key) {
                return acc + (a11yState[key] ? 1 : 0);
            }, 0);
        }

        function applyState() {
            Object.keys(a11yState).forEach(function (key) {
                if (key === 'reading-guide') {
                    infra.readingGuide.classList.toggle('active', !!a11yState[key]);
                } else {
                    htmlEl.classList.toggle('a11y-' + key, !!a11yState[key]);
                }
            });

            var isNormalFont = !a11yState['font-lg'] && !a11yState['font-xl'];
            a11yBtns.forEach(function (btn) {
                var k = btn.getAttribute('data-a11y');
                var active = k === 'font-normal' ? isNormalFont : !!a11yState[k];
                btn.classList.toggle('active', active);
                btn.setAttribute('aria-pressed', active ? 'true' : 'false');
            });

            var activeCount = countActiveOptions();
            ui.countBadge.textContent = String(activeCount);
            ui.countBadge.classList.toggle('visible', activeCount > 0);
            ui.toggleBtn.setAttribute(
                'aria-label',
                activeCount > 0
                    ? 'Herramientas de accesibilidad universal (' + activeCount + ' activas, atajo Alt + A)'
                    : 'Abrir herramientas de accesibilidad universal (Atajo Alt + A)'
            );

            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(a11yState));
            } catch (err) {
                // Silenciar en modo privado estricto
            }
        }

        function stopSpeech() {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            speechActive = false;
            if (ttsBtn && ttsLabel) {
                ttsBtn.classList.remove('active');
                ttsBtn.setAttribute('aria-pressed', 'false');
                ttsLabel.textContent = 'Leer página o selección en voz alta';
            }
        }

        function toggleSpeech() {
            if (!('speechSynthesis' in window)) return;
            if (speechActive || window.speechSynthesis.speaking) {
                stopSpeech();
                announce('Lectura en voz alta detenida');
                return;
            }
            var selected = (window.getSelection && window.getSelection().toString() || '').trim();
            var mainEl = document.getElementById('main-content');
            var textToRead = selected || (mainEl ? mainEl.innerText : document.body.innerText) || '';
            textToRead = textToRead.replace(/\s+/g, ' ').trim().slice(0, 4500);
            if (!textToRead) return;

            window.speechSynthesis.cancel();
            var utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = 'es-CR';
            utterance.rate = 0.98;
            utterance.onend = stopSpeech;
            utterance.onerror = stopSpeech;

            speechActive = true;
            if (ttsBtn && ttsLabel) {
                ttsBtn.classList.add('active');
                ttsBtn.setAttribute('aria-pressed', 'true');
                ttsLabel.textContent = 'Detener lectura en voz alta';
            }
            announce(selected ? 'Leyendo texto seleccionado en voz alta' : 'Iniciando lectura del contenido principal en voz alta');
            window.speechSynthesis.speak(utterance);
        }

        function setPanelOpen(willOpen, returnFocus) {
            if (willOpen) {
                ui.panel.removeAttribute('hidden');
                ui.toggleBtn.setAttribute('aria-expanded', 'true');
                ui.title.focus();
            } else {
                var wasOpen = !ui.panel.hasAttribute('hidden');
                ui.panel.setAttribute('hidden', '');
                ui.toggleBtn.setAttribute('aria-expanded', 'false');
                if (wasOpen && returnFocus) {
                    ui.toggleBtn.focus();
                }
            }
        }

        // Cargar preferencias guardadas
        try {
            var saved = window.localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var parsed = JSON.parse(saved);
                Object.keys(defaultState).forEach(function (k) {
                    if (typeof parsed[k] === 'boolean') {
                        a11yState[k] = parsed[k];
                    }
                });
            }
        } catch (err) {
            // Ignorar JSON inválido
        }
        applyState();

        // Eventos de botones de opciones
        a11yBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var key = btn.getAttribute('data-a11y');
                if (key === 'font-normal') {
                    a11yState['font-lg'] = false;
                    a11yState['font-xl'] = false;
                    applyState();
                    announce('Tamaño de texto restablecido al 100 por ciento');
                    return;
                }
                if (key === 'font-lg' && !a11yState['font-lg']) {
                    a11yState['font-xl'] = false;
                }
                if (key === 'font-xl' && !a11yState['font-xl']) {
                    a11yState['font-lg'] = false;
                }
                a11yState[key] = !a11yState[key];
                applyState();
                announce('Opción de accesibilidad ' + btn.textContent.trim() + (a11yState[key] ? ' activada' : ' desactivada'));
            });
        });

        if (ttsBtn) {
            ttsBtn.addEventListener('click', toggleSpeech);
        }

        ui.resetBtn.addEventListener('click', function () {
            a11yState = Object.assign({}, defaultState);
            stopSpeech();
            applyState();
            announce('Todos los ajustes de accesibilidad han sido restablecidos');
        });

        ui.toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var isHidden = ui.panel.hasAttribute('hidden');
            setPanelOpen(isHidden, false);
        });

        ui.closeBtn.addEventListener('click', function () {
            setPanelOpen(false, true);
        });

        // Cierre al hacer clic fuera del panel
        document.addEventListener('click', function (e) {
            if (!ui.panel.hasAttribute('hidden') && !ui.panel.contains(e.target) && !ui.toggleBtn.contains(e.target)) {
                setPanelOpen(false, false);
            }
        });

        // Guía de lectura para mouse y dispositivos táctiles
        function moveReadingGuide(clientY) {
            if (a11yState['reading-guide'] && infra.readingGuide) {
                infra.readingGuide.style.top = Math.max(0, Math.min(window.innerHeight - 40, clientY - 20)) + 'px';
            }
        }
        document.addEventListener('mousemove', function (e) { moveReadingGuide(e.clientY); }, { passive: true });
        document.addEventListener('touchmove', function (e) {
            if (e.touches && e.touches[0]) {
                moveReadingGuide(e.touches[0].clientY);
            }
        }, { passive: true });

        // Asegurar que main sea enfocable para Alt + S y skip-link
        var mainEl = document.getElementById('main-content');
        if (mainEl && !mainEl.hasAttribute('tabindex')) {
            mainEl.setAttribute('tabindex', '-1');
        }

        // Atajos globales de teclado
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                setPanelOpen(false, true);
                stopSpeech();
            }
            if (e.altKey) {
                var k = (e.key || '').toLowerCase();
                if (k === 'a') {
                    e.preventDefault();
                    var isHidden = ui.panel.hasAttribute('hidden');
                    setPanelOpen(isHidden, !isHidden);
                } else if (k === 's') {
                    e.preventDefault();
                    if (mainEl) {
                        mainEl.scrollIntoView({ behavior: a11yState['reduce-motion'] ? 'auto' : 'smooth' });
                        mainEl.focus();
                    }
                } else if (k === '1' && document.getElementById('quienes-somos')) {
                    window.location.hash = '#quienes-somos';
                } else if (k === '2' && document.getElementById('normativa')) {
                    window.location.hash = '#normativa';
                } else if (k === '3' && document.getElementById('grupos-trabajo')) {
                    window.location.hash = '#grupos-trabajo';
                } else if (k === '4' && document.getElementById('documentos')) {
                    window.location.hash = '#documentos';
                } else if (k === '5' && document.getElementById('contacto-slack')) {
                    window.location.hash = '#contacto-slack';
                }
            }
        });

        window.addEventListener('beforeunload', stopSpeech);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
