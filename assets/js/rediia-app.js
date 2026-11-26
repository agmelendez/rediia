/* ==========================================================================
   LÓGICA INTERACTIVA DEL PORTAL INSTITUCIONAL REDIIA · UNED COSTA RICA
   Sin uso de innerHTML (prevención XSS / CSP estricta script-src 'self')
   Rutas públicas ASCII limpias y catálogo documental auditado
   ========================================================================== */
(function () {
    'use strict';

    function announceStatus(msg) {
        var live = document.getElementById('a11y-live-region');
        if (!live) return;
        live.textContent = '';
        window.setTimeout(function () {
            live.textContent = msg;
        }, 30);
    }

    function copyTextSafe(text, onSuccess) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
                fallbackCopy(text, onSuccess);
            });
        } else {
            fallbackCopy(text, onSuccess);
        }
    }

    function fallbackCopy(text, onSuccess) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            onSuccess();
        } catch (err) {
            // Silenciar si el navegador bloquea el portapapeles
        }
    }

    // 1. BASE DE DATOS FACTUAL DE DOCUMENTOS PÚBLICOS OFICIALES (GEO / LLMO + VISOR DUAL)
    var documentosRedIIA = [
        {
            id: 'doc-politica-2025',
            cat: 'normativa',
            tag: 'Norma Rectora UNED · CU-2025-385a',
            title: 'Política Institucional de Inteligencia Artificial en la UNED (2025)',
            url: 'documentos/politica-institucional-ia-uned-2025.pdf',
            meta: 'Setiembre 2025 · Consejo Universitario UNED (Sesión 3088-2025, Art. IV, Inc. 7)',
            summary: 'Instrumento normativo vinculante superior que establece el marco ético, los 9 principios rectores (RAFT + 4 principios UNED) y el modelo de gobernanza distribuida de la IA en la UNED, creando oficialmente la RedIIA y asignándole sus 5 funciones estratégicas.',
            bullets: [
                'Establece los 9 principios éticos: Responsabilidad, Rendición de cuentas, Equidad, Transparencia, Sostenibilidad, Creatividad humana, Supervisión humana, Autonomía universitaria y Seguridad de datos/Pensamiento crítico.',
                'Define las 5 funciones oficiales de RedIIA: Coordinación institucional, integración tecnológica segura (Sandbox), creación de capacidades, investigación interdisciplinaria e impacto social.',
                'Precisa que el Consejo Universitario orienta, Rectoría define dirección estratégica, las Vicerrectorías implementan y RedIIA articula transversalmente.'
            ]
        },
        {
            id: 'doc-propuesta-conre-2026',
            cat: 'gobernanza',
            tag: 'Ruta de Trabajo 1.er Año · CONRE',
            title: 'Propuesta de Ruta de Trabajo de la RedIIA enviada a CONRE (30 julio 2026)',
            url: 'documentos/propuesta-ruta-trabajo-rediia-conre-2026.pdf',
            meta: '30 de julio de 2026 · Red Institucional de Inteligencia Artificial (RedIIA) · UNED',
            summary: 'Documento constitutivo de la operación anual de RedIIA elevado al Consejo de Rectoría tras las primeras sesiones plenarias. Define la arquitectura mínima de nodos, el carácter consultivo y el cronograma de entregables trimestrales a 12 meses.',
            bullets: [
                'Consolida la naturaleza jurídica consultiva, recomendatoria y articuladora de RedIIA, sin crear plazas, presupuesto propio ni burocracia paralela.',
                'Define los productos del primer año: mapa de iniciativas, guías y protocolos, matriz de umbrales de riesgo, manual del Sandbox institucional e informe anual.',
                'Vincula el soporte técnico-documental inicial con el Programa Estrategia de Transformación Digital adscrito a Rectoría.'
            ]
        },
        {
            id: 'doc-marco-docencia',
            cat: 'docencia',
            tag: 'Vicerrectoría de Docencia · Mayo 2026',
            title: 'Marco de Aplicación para el Uso Pedagógico, Ético y Responsable de la IA en la Docencia',
            url: 'documentos/marco-aplicacion-ia-docencia-uned-2026.pdf',
            meta: 'Mayo 2026 · Vicerrectoría de Docencia UNED (REF.CONRE.665-2026 / ViD 316-2026)',
            summary: 'Primer instrumento sectorial derivado de la Política de IA de la UNED. Operacionaliza los principios éticos en el diseño curricular, la mediación pedagógica a distancia, la evaluación de los aprendizajes y la declaración transparente de uso.',
            bullets: [
                'Clasifica pedagógicamente el uso de IA en cuatro niveles: accesorio, relevante permitido con condiciones, sustantivo condicionado y no permitido.',
                'Establece la intencionalidad pedagógica como punto de partida antes de autorizar o restringir herramientas de IA en una asignatura.',
                'Protege la privacidad estudiantil y prohíbe exigir que el estudiantado ingrese datos personales sensibles en plataformas comerciales.'
            ]
        },
        {
            id: 'doc-guia-docentes',
            cat: 'docencia',
            tag: 'Guía Práctica Profesorado · Mayo 2026',
            title: 'Guía Operativa para Personas Profesoras sobre Uso de IA en la UNED',
            url: 'documentos/guia-operativa-docentes-ia-uned-2026.pdf',
            meta: 'Mayo 2026 · Vicerrectoría de Docencia UNED',
            summary: 'Instrumento práctico para cátedras y personas tutoras que traduce el Marco de Docencia en pautas concretas para diseñar orientaciones académicas, rúbricas, actividades de evaluación auténtica y acompañamiento estudiantil.',
            bullets: [
                'Brinda plantillas de cláusulas y niveles de uso de IA para incluir explícitamente en las orientaciones académicas de cada curso.',
                'Orienta sobre cómo rediseñar evaluaciones centradas en el proceso, la argumentación y la aplicación contextualizada.',
                'Promueve la transparencia recíproca: el personal docente también declara cuándo utiliza IA para elaborar materiales didácticos.'
            ]
        },
        {
            id: 'doc-guia-estudiantes',
            cat: 'docencia',
            tag: 'Guía Práctica Estudiantado · Mayo 2026',
            title: 'Guía para Personas Estudiantes sobre Uso Ético y Responsable de la IA',
            url: 'documentos/guia-estudiantes-ia-uned-2026.pdf',
            meta: 'Mayo 2026 · Vicerrectoría de Docencia UNED',
            summary: 'Guía formativa dirigida a toda la población estudiantil de la UNED sobre cómo aprovechar la Inteligencia Artificial como aliada del aprendizaje a distancia sin comprometer la integridad académica ni el pensamiento propio.',
            bullets: [
                'Explica paso a paso cómo verificar datos y referencias para evitar alucinaciones («IA con criterio» / Supervisión Humana).',
                'Enseña cómo declarar y citar transparentemente el uso de herramientas de IA generativa en tareas, proyectos y TFG según normas APA 7.',
                'Aclara qué prácticas constituyen uso legítimo de apoyo y cuáles representan fraude o sustitución indebida del aprendizaje.'
            ]
        },
        {
            id: 'doc-proifed',
            cat: 'docencia',
            tag: 'Investigación Educativa · PROIFED',
            title: 'Declaración de Principios y Protocolo de IA · PROIFED UNED',
            url: 'documentos/declaracion-principios-protocolo-ia-proifed-2026.pdf',
            meta: 'Mayo 2026 · Programa de Investigación en Fundamentos de la Educación a Distancia (PROIFED)',
            summary: 'Protocolo especializado sobre ética, autoría, revisión crítica y trazabilidad del uso de Inteligencia Artificial en investigaciones sobre educación superior a distancia.',
            bullets: [
                'Reafirma que las herramientas de IA nunca pueden figurar como coautoras de artículos, informes o productos científicos.',
                'Exige declarar en la sección metodológica el modelo, versión y propósito exacto cuando se emplea IA en análisis o edición.',
                'Resguarda la confidencialidad de datos primarios de investigación frente al entrenamiento de modelos externos.'
            ]
        },
        {
            id: 'doc-red-viva',
            cat: 'gobernanza',
            tag: 'Fundamento Teórico · Red Viva',
            title: 'RedIIA como Red Viva y Gobernanza de IA en la UNED',
            url: 'documentos/rediia-como-red-viva-2026.pdf',
            meta: 'Agosto 2026 · Vicerrectoría de Planificación (VIPLAN) · RedIIA UNED',
            summary: 'Desarrollo conceptual de la RedIIA como red de actantes donde la relación colaborativa es la unidad operativa mínima, articulando nodos permanentes y nodos temporales de misión.',
            bullets: [
                'Introduce los conceptos de actante, multiplexidad de roles y campos gravitacionales alineados con los 5 fines de la Política de IA.',
                'Identifica y previene riesgos de gestión de red: centralización excesiva, participación nominal y formación de silos temáticos.',
                'Propone indicadores relacionales de valor de red: densidad, fluidez, conexiones interáreas activadas y aprendizajes transferidos.'
            ]
        },
        {
            id: 'doc-enia-micitt',
            cat: 'nacional',
            tag: 'Estrategia Nacional IA · MICITT',
            title: 'Plan de Acción de la Estrategia Nacional de Inteligencia Artificial (ENIA 2025)',
            url: 'documentos/plan-accion-enia-micitt-2025.pdf',
            meta: 'Agosto 2025 · Ministerio de Ciencia, Innovación, Tecnología y Telecomunicaciones (MICITT)',
            summary: 'Marco estratégico nacional de Costa Rica sobre adopción ética, talento humano, infraestructura y gobernanza pública de la Inteligencia Artificial, con el cual se alinea la Función 5 de la RedIIA.',
            bullets: [
                'Permite alinear los proyectos de investigación y extensión de la UNED con las prioridades nacionales de desarrollo digital.',
                'Promueve la articulación entre universidades públicas, sector gubernamental y ciudadanía.',
                'Sirve de referente externo para el subsistema S4 (Inteligencia y entorno) de la RedIIA.'
            ]
        },
        {
            id: 'doc-ley-sandbox',
            cat: 'nacional',
            tag: 'Marco Legislativo · Exp. 23.919',
            title: 'Dictamen Proyecto de Ley N.° 23.919 (Base Nacional de Sandboxes de IA)',
            url: 'documentos/dictamen-proyecto-ley-23919-sandboxes-ia.pdf',
            meta: 'Asamblea Legislativa de la República de Costa Rica · Expediente N.° 23.919',
            summary: 'Antecedente legislativo nacional sobre espacios controlados de prueba regulatoria y tecnológica (Sandboxes), utilizado como insumo comparado para el diseño del Sandbox Institucional de IA de la UNED.',
            bullets: [
                'Fundamenta jurídicamente la experimentación controlada con salvaguardas explícitas de derechos fundamentales.',
                'Establece criterios de elegibilidad, monitoreo continuo, transparencia y evaluación de salida para proyectos piloto.',
                'Complementa el Manual de Gestión de Pilotos en Sandbox Institucional de IA de la RedIIA.'
            ]
        }
    ];

    function initApp() {
        var docListEl = document.getElementById('visor-doc-list');
        var searchInput = document.getElementById('doc-search-input');
        var catBtns = document.querySelectorAll('.visor-cat-btn');
        var allCatBtn = document.querySelector('.visor-cat-btn[data-cat="all"]');
        var activeTitleEl = document.getElementById('visor-active-title');
        var openBtnEl = document.getElementById('visor-open-btn');
        var downloadBtnEl = document.getElementById('visor-download-btn');
        var iframeEl = document.getElementById('visor-pdf-iframe');
        var factualMetaEl = document.getElementById('informe-factual-meta');
        var factualSummaryEl = document.getElementById('informe-factual-summary');
        var factualBulletsEl = document.getElementById('informe-factual-bullets');

        if (allCatBtn) {
            allCatBtn.textContent = 'Todos (' + documentosRedIIA.length + ')';
        }

        var currentCat = 'all';
        var currentDocId = documentosRedIIA[0].id;

        function selectDocument(doc) {
            currentDocId = doc.id;
            if (activeTitleEl) activeTitleEl.textContent = doc.title;
            if (openBtnEl) openBtnEl.href = doc.url;
            if (downloadBtnEl) downloadBtnEl.href = doc.url;
            if (iframeEl) {
                iframeEl.src = doc.url;
                iframeEl.title = 'Visor PDF: ' + doc.title;
            }
            if (factualMetaEl) factualMetaEl.textContent = doc.meta;
            if (factualSummaryEl) factualSummaryEl.textContent = doc.summary;
            if (factualBulletsEl) {
                factualBulletsEl.textContent = '';
                doc.bullets.forEach(function (b) {
                    var li = document.createElement('li');
                    li.textContent = b;
                    factualBulletsEl.appendChild(li);
                });
            }
            renderDocList();
            announceStatus('Documento cargado: ' + doc.title);
        }

        function renderDocList() {
            if (!docListEl) return;
            var query = ((searchInput && searchInput.value) || '').trim().toLowerCase();
            docListEl.textContent = '';
            var filtered = documentosRedIIA.filter(function (d) {
                var matchCat = currentCat === 'all' || d.cat === currentCat;
                var matchQuery = !query ||
                    d.title.toLowerCase().indexOf(query) !== -1 ||
                    d.tag.toLowerCase().indexOf(query) !== -1 ||
                    d.summary.toLowerCase().indexOf(query) !== -1;
                return matchCat && matchQuery;
            });

            if (filtered.length === 0) {
                var emptyMsg = document.createElement('p');
                emptyMsg.className = 'visor-empty-msg';
                emptyMsg.textContent = 'No se encontraron documentos con ese criterio.';
                docListEl.appendChild(emptyMsg);
                return;
            }

            filtered.forEach(function (doc) {
                var btn = document.createElement('button');
                btn.type = 'button';
                var isActive = doc.id === currentDocId;
                btn.className = 'visor-doc-item' + (isActive ? ' active' : '');
                if (isActive) {
                    btn.setAttribute('aria-current', 'true');
                }
                var tagSpan = document.createElement('span');
                tagSpan.className = 'doc-tag';
                tagSpan.textContent = doc.tag;
                var titleSpan = document.createElement('span');
                titleSpan.className = 'doc-title';
                titleSpan.textContent = doc.title;
                btn.appendChild(tagSpan);
                btn.appendChild(titleSpan);
                btn.addEventListener('click', function () {
                    selectDocument(doc);
                });
                docListEl.appendChild(btn);
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', renderDocList);
        }
        catBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                catBtns.forEach(function (b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                currentCat = btn.getAttribute('data-cat');
                renderDocList();
                announceStatus('Categoría filtrada: ' + btn.textContent.trim());
            });
        });
        renderDocList();

        // 2. FILTRO DEL DIRECTORIO DE REPRESENTACIÓN INSTITUCIONAL REDIIA
        var filterPills = document.querySelectorAll('.filter-pill');
        var teamCards = document.querySelectorAll('.team-card');
        filterPills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                filterPills.forEach(function (p) {
                    p.classList.remove('active');
                    p.setAttribute('aria-pressed', 'false');
                });
                pill.classList.add('active');
                pill.setAttribute('aria-pressed', 'true');
                var filter = pill.getAttribute('data-filter');
                var visibleCount = 0;
                teamCards.forEach(function (card) {
                    var roles = card.getAttribute('data-role') || '';
                    if (filter === 'all' || roles.indexOf(filter) !== -1) {
                        card.style.display = 'flex';
                        visibleCount += 1;
                    } else {
                        card.style.display = 'none';
                    }
                });
                announceStatus('Mostrando ' + visibleCount + ' representaciones en categoría ' + pill.textContent.trim());
            });
        });

        // 3. VERIFICADOR INTERACTIVO DE MATRIZ DE UMBRALES DE RIESGO (5 NIVELES · CONTRASTE AA/AAA)
        var umbralCheckboxes = document.querySelectorAll('.umbral-checkbox');
        var umbralBadge = document.getElementById('umbral-badge');
        var umbralTitle = document.getElementById('umbral-title');
        var umbralDesc = document.getElementById('umbral-desc');
        var umbralAction = document.getElementById('umbral-action');
        var umbralCard = document.getElementById('umbral-result-card');

        var nivelesUmbral = {
            1: {
                badge: 'NIVEL 1 · BAJO RIESGO (USO ORDINARIO)',
                color: '#057A55',
                bg: '#E6F2EB',
                title: 'Uso Exploratorio o Individual Autónomo',
                desc: 'Su caso corresponde a uso exploratorio, apoyo de redacción, lluvia de ideas o consulta sin datos personales ni impacto institucional directo. No requiere trámite ante RedIIA.',
                action: 'Aplicar las Guías Generales de Docencia/Estudiantes (Mayo 2026), verificar posibles alucinaciones («IA con criterio») y declarar el uso cuando corresponda según APA 7.'
            },
            2: {
                badge: 'NIVEL 2 · RIESGO MODERADO (PROCESO INTERNO)',
                color: '#0369A1',
                bg: '#E0F2FE',
                title: 'Uso Regular en Dependencia o Asignatura sin Decisiones Críticas',
                desc: 'Se incorpora una herramienta de IA en el flujo de trabajo de una oficina o curso sin tratar datos personales sensibles ni automatizar calificaciones.',
                action: 'Revisar lineamientos del Marco Docente o de la unidad, compartir la iniciativa en el Mapeo de RedIIA (Instrumento D) y mantener supervisión humana en cada entregable.'
            },
            3: {
                badge: 'NIVEL 3 · RIESGO ALTO (DATOS, PI O EVALUACIÓN)',
                color: '#92400E',
                bg: '#FEF8EA',
                title: 'Activación de Orientación Técnica y Salvaguardas Específicas',
                desc: 'La iniciativa involucra datos personales (Ley N.° 8968), obras o manuscritos inéditos (Ley N.° 6683 / EUNED) o incide en la evaluación del aprendizaje estudiantil.',
                action: 'Solicitar acompañamiento técnico a RedIIA (rediia@uned.ac.cr) para aplicar cláusulas de anonimización, consentimiento informado, Semáforo Docente o Protocolo EUNED v2.0.'
            },
            4: {
                badge: 'NIVEL 4 · ALCANCE INSTITUCIONAL (SANDBOX IA)',
                color: '#6B21A8',
                bg: '#F3E8FF',
                title: 'Ingreso Recomendado al Sandbox Institucional de IA',
                desc: 'Requiere integración con sistemas informáticos de la UNED, licenciamiento transversal o despliegue piloto multi-unidad.',
                action: 'Inscribir un Nodo Temático y postular el piloto al Sandbox Institucional de IA (3 fases: protocolo de pruebas, ejecución controlada con DTIC y evaluación de KPIs).'
            },
            5: {
                badge: 'NIVEL 5 · RIESGO CRÍTICO (GOBERNANZA SUPERIOR)',
                color: '#B91C1C',
                bg: '#FEE2E2',
                title: 'Elevación Técnica a Rectoría / CONRE con Dictamen Integral',
                desc: 'Implica decisiones automatizadas con impacto directo sobre derechos fundamentales estudiantiles o laborales, seguridad informática crítica o continuidad del servicio público.',
                action: 'Requiere valoración interdisciplinaria obligatoria (Núcleo Gestor + Oficina Jurídica + DTIC) y acuerdo formal de la autoridad superior competente (Rectoría / CONRE).'
            }
        };

        function updateUmbralLevel() {
            var maxLevel = 1;
            umbralCheckboxes.forEach(function (cb) {
                if (cb.checked) {
                    var val = parseInt(cb.value, 10);
                    if (val > maxLevel) maxLevel = val;
                }
            });
            var info = nivelesUmbral[maxLevel];
            if (umbralBadge) {
                umbralBadge.textContent = info.badge;
                umbralBadge.style.background = info.bg;
                umbralBadge.style.color = info.color;
            }
            if (umbralCard) umbralCard.style.borderTopColor = info.color;
            if (umbralTitle) umbralTitle.textContent = info.title;
            if (umbralDesc) umbralDesc.textContent = info.desc;
            if (umbralAction) umbralAction.textContent = info.action;
        }

        umbralCheckboxes.forEach(function (cb) {
            cb.addEventListener('change', updateUmbralLevel);
        });

        // 4. COPIADO DE CITA APA 7 Y CORREO OFICIAL AL PORTAPAPELES (con fallback local)
        var copyApaBtn = document.getElementById('copy-apa-btn');
        var apaTextEl = document.getElementById('apa-citation-text');
        if (copyApaBtn && apaTextEl) {
            copyApaBtn.addEventListener('click', function () {
                copyTextSafe(apaTextEl.textContent.trim(), function () {
                    copyApaBtn.textContent = '✅ Cita APA Copiada';
                    announceStatus('Cita académica APA 7 copiada al portapapeles');
                    window.setTimeout(function () {
                        copyApaBtn.textContent = '📋 Copiar Cita APA 7';
                    }, 2600);
                });
            });
        }

        var copyEmailBtn = document.getElementById('copy-email-btn');
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', function () {
                copyTextSafe('rediia@uned.ac.cr', function () {
                    copyEmailBtn.textContent = '✅ rediia@uned.ac.cr copiado';
                    announceStatus('Correo institucional rediia@uned.ac.cr copiado al portapapeles');
                    window.setTimeout(function () {
                        copyEmailBtn.textContent = '📋 Copiar Correo';
                    }, 2600);
                });
            });
        }

        // 5. MENÚ DESPLEGABLE ACCESIBLE "RECURSOS" Y MENÚ MÓVIL RESPONSIVE
        var dropdown = document.getElementById('nav-recursos-dropdown');
        var dropdownBtn = document.getElementById('nav-recursos-btn');
        if (dropdown && dropdownBtn) {
            dropdownBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                var isOpen = dropdown.classList.toggle('open');
                dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
            document.addEventListener('click', function (e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                    dropdownBtn.setAttribute('aria-expanded', 'false');
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && dropdown.classList.contains('open')) {
                    dropdown.classList.remove('open');
                    dropdownBtn.setAttribute('aria-expanded', 'false');
                    dropdownBtn.focus();
                }
            });
        }

        var mobileMenuBtn = document.getElementById('mobile-menu-toggle');
        var headerNav = document.getElementById('header-main-nav');
        if (mobileMenuBtn && headerNav) {
            mobileMenuBtn.addEventListener('click', function () {
                var isOpen = headerNav.classList.toggle('mobile-open');
                mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
            });
            headerNav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    if (headerNav.classList.contains('mobile-open')) {
                        headerNav.classList.remove('mobile-open');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
