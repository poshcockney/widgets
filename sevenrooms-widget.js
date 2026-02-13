/* sevenrooms-widget.js v7.7 - Modal Mobile Layout Fix */
(function() {

    // --- 1. ENGINE DEFAULTS ---
    const ENGINE_DEFAULTS = {
        API_URL: 'https://sevenrooms.netlify.app/.netlify/functions/check-availability',
        FONTS: {
            title: "'Poppins', sans-serif",
            body: "'Poppins', sans-serif"
        }
    };

    // --- 2. CSS INJECTOR ---
    function injectStyles() {
        // Prevent duplicate styles if script re-runs (fixes editor jitter)
        if (document.getElementById('srf-custom-styles')) return;

        // We add a specific class .srf-fp-instance to the calendar styles so they don't override Squarespace forms
        const css = `
        /* CORE STYLES */
        :root { --srf-radius: 2px; --srf-padding-container: 30px; --srf-margin-form-group: 1rem; --srf-margin-label: 0.25rem; --srf-margin-title: 0.5rem; }
        
        /* THEMES */
        .srf-theme-light { --srf-bg: var(--cfg-bg-light); --srf-text: var(--cfg-bg-dark); --srf-input-bg: rgba(255, 255, 255, 0.6); --srf-input-text: #000000; --srf-border: color-mix(in srgb, var(--cfg-bg-dark), transparent 80%); --srf-btn-text: var(--cfg-bg-light); --srf-slot-bg: var(--cfg-accent-main); --srf-slot-text: var(--cfg-bg-light); }
        .srf-theme-dark { --srf-bg: var(--cfg-bg-dark); --srf-text: var(--cfg-bg-light); --srf-input-bg: rgba(255, 255, 255, 0.1); --srf-input-text: #ffffff; --srf-border: color-mix(in srgb, var(--cfg-bg-light), transparent 80%); --srf-btn-text: var(--cfg-bg-light); --srf-slot-bg: var(--cfg-accent-main); --srf-slot-text: var(--cfg-bg-light); }

        /* STRUCTURE */
        .sevenrooms-widget-container { 
            background-color: var(--srf-bg); 
            color: var(--srf-text); 
            font-family: var(--srf-body-font); 
            border-radius: var(--srf-radius); 
            position: relative; 
            padding: var(--srf-padding-container); 
            width: 100%; 
            max-width: 100%; /* Fix: Prevent grid blowouts */
            min-width: 0;    /* Fix: CRITICAL for CSS Grid stability */
            margin: 0;       /* Fix: Prevent external margin push */
            display: block;  /* Fix: Ensure block layout */
            overflow-x: hidden; /* Fix: Contain horizontal overflow */
            box-sizing: border-box; 
        }
        .sevenrooms-widget-container * { box-sizing: border-box; }
        .sevenrooms-widget-container h2 { font-family: var(--srf-title-font); font-weight: 300; text-align: center; margin: 0 0 var(--srf-margin-title) 0; font-size: 2.5rem; line-height: 1.2; color: var(--srf-text); text-transform: uppercase; letter-spacing: 0.05em; }
        .sevenrooms-widget-container label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: var(--srf-margin-label); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--srf-text); font-family: var(--srf-body-font); }
        
        /* INPUTS & BUTTONS */
        .srf-input { width: 100%; height: 3.25rem; background-color: var(--srf-input-bg); border: 1px solid transparent; color: var(--srf-input-text); border-radius: var(--srf-radius); padding: 0.75rem 1rem; transition: all 0.2s ease; -webkit-appearance: none; appearance: none; font-family: inherit; font-size: 1rem; }
        .srf-input:focus, .srf-input:hover { filter: brightness(0.95); outline: none; border-color: var(--cfg-accent-main); }
        .srf-input option { color: #000; background: #FFF; }
        .srf-button { width: 100%; height: 3.25rem; background-color: var(--cfg-accent-main); color: var(--srf-btn-text); font-family: var(--srf-body-font); font-weight: 600; font-size: 1rem; padding: 0.75rem 1.5rem; border: none; border-radius: var(--srf-radius); cursor: pointer; transition: opacity 0.2s ease; }
        .srf-button:hover { opacity: 0.9; }
        
        /* ICONS */
        .srf-select-wrapper, .srf-date-wrapper, .srf-time-trigger-button { position: relative; }
        .srf-select-wrapper::after, .srf-time-trigger-button::before { content: '▼'; font-size: 0.625rem; color: var(--srf-input-text); position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .srf-time-trigger-button { text-align: left; cursor: pointer; width: 100%; }

        /* LAYOUT */
        .srf-form { display: flex; flex-direction: column; gap: 0; }
        .srf-form-group { width: 100%; margin-bottom: var(--srf-margin-form-group); }
        .srf-layout-stacked .srf-form-group { margin-bottom: 0.5rem; }
        .srf-layout-stacked .srf-submit-group label { display: none; }
        .srf-layout-stacked .srf-submit-group { margin-top: 0.5rem; }
        .sevenrooms-widget-container.srf-layout-stacked { padding: 25px; }
        .srf-layout-stacked h2 { margin-bottom: 0.5rem; } 
        @media (min-width: 768px) {
            .srf-layout-horizontal .srf-form { flex-direction: row; align-items: flex-end; gap: 1rem; }
            .srf-layout-horizontal .srf-form-group { margin-bottom: 0; flex: 1; }
            .srf-layout-horizontal .srf-submit-group { flex: 1; }
            .srf-layout-horizontal label { display: block; }
        }

        /* DROPDOWNS & MODALS */
        .srf-time-dropdown { display: none; position: absolute; background-color: var(--srf-bg); color: var(--srf-text); border: 1px solid var(--srf-border); border-radius: var(--srf-radius); box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 999999; max-height: 300px; flex-direction: column; overflow: hidden; font-family: var(--srf-body-font); }
        .srf-time-dropdown.srf-visible { display: flex; }
        .srf-time-list-wrapper { overflow-y: auto; flex-grow: 1; max-height: 220px; }
        .srf-time-list-item { padding: 0.75rem 1.5rem; text-align: center; font-size: 1rem; cursor: pointer; border-bottom: 1px solid var(--srf-border); font-weight: 600; background-color: var(--srf-bg); }
        .srf-time-list-item:hover { background-color: var(--srf-input-bg); }
        .srf-time-list-item.srf-selected { background-color: var(--cfg-accent-main); color: var(--srf-btn-text); }
        .srf-dropdown-footer { padding: 0.75rem; background-color: var(--srf-bg); border-top: 1px solid var(--srf-border); }
        .srf-halo-group { display: flex; justify-content: center; gap: 0.25rem; }
        .srf-halo-input { display: none; }
        .srf-halo-label { flex-grow: 1; text-align: center; padding: 0.5rem 0.25rem; border-radius: var(--srf-radius); background-color: var(--srf-input-bg); color: var(--srf-text); font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s ease; }
        .srf-halo-input:checked + .srf-halo-label { background-color: var(--cfg-accent-main); color: var(--srf-btn-text); }

        /* MODAL OVERLAY - Added box-sizing: border-box to fix mobile padding issue */
        .srf-modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 2147483647; align-items: center; justify-content: center; padding: 1rem; box-sizing: border-box; }
        .srf-modal-overlay * { box-sizing: border-box; }

        .srf-results-modal-content { background-color: var(--srf-bg); color: var(--srf-text); font-family: var(--srf-body-font); width: 100%; max-width: 800px; max-height: 90vh; border-radius: var(--srf-radius); display: flex; flex-direction: column; position: relative; border: 1px solid var(--srf-border); }
        .srf-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid var(--srf-border); }
        
        /* ADJUSTED: Font size bumped from 0.9rem to 1.2rem */
        .srf-modal-title { margin: 0; font-size: 1.2rem; font-weight: 600; color: var(--srf-text); }
        
        /* ADDED: Force white summary text explicitly on dark mode */
        .srf-theme-dark .srf-modal-summary-text { color: #ffffff !important; }

        .srf-modal-edit-link { background: none; border: none; color: var(--cfg-accent-main); text-decoration: underline; cursor: pointer; margin-left: 0.5rem; font-size: 0.875rem; }
        .srf-modal-close { background: none; border: none; font-size: 2rem; color: var(--srf-text); opacity: 0.7; cursor: pointer; }
        .srf-results-body { padding: 1.5rem; overflow-y: auto; flex-grow: 1; }
        .srf-spinner { display: none; margin: 2rem auto; border: 4px solid var(--srf-input-bg); width: 48px; height: 48px; border-radius: 50%; border-left-color: var(--cfg-accent-main); animation: srf-spin 1s ease infinite; }
        @keyframes srf-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .srf-error { display: none; padding: 1rem; border: 1px solid var(--cfg-accent-main); color: var(--cfg-accent-main); margin-bottom: 1rem; }
        
        /* ADDED: Inline error style */
        .srf-inline-error { display: none; color: var(--cfg-accent-main); font-size: 0.9rem; font-weight: 600; margin-top: 0.5rem; text-align: center; }

        /* GRID & RESULTS */
        .srf-slots-grid { display: none; }
        .srf-venue-heading { font-family: var(--srf-heading-font); font-weight: 600; font-size: 1.25rem; color: var(--srf-text); margin: 1.5rem 0 0.75rem; }
        .srf-area-container { margin-bottom: 1rem; }
        .srf-area-header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--srf-border); padding-bottom: 0.5rem; margin-bottom: 0.5rem; }
        .srf-area-heading { font-family: var(--srf-body-font); font-weight: 600; font-size: 1rem; margin: 0; color: var(--srf-text); }
        .srf-special-offer-area { background-color: color-mix(in srgb, var(--cfg-accent-sec), transparent 90%); padding: 0.75rem; border: 1px solid var(--cfg-accent-sec); border-radius: var(--srf-radius); color: var(--srf-text); }
        .srf-special-offer-label { font-size: 0.75rem; font-weight: 700; color: var(--srf-btn-text); background: var(--cfg-accent-sec); padding: 2px 6px; border-radius: var(--srf-radius); text-transform: uppercase; margin-left: 0.5rem; }
        
        .srf-scroll-controls { display: flex; gap: 0.25rem; }
        .srf-scroll-btn { background: transparent; border: none; font-weight: bold; cursor: pointer; font-size: 1.25rem; color: var(--srf-text); }
        .srf-scroll-btn.srf-disabled { opacity: 0.2; pointer-events: none; }
        .srf-area-container.srf-hide-arrows .srf-scroll-controls { display: none; }
        .srf-slots-subgrid-wrapper { position: relative; margin-bottom: 1.5rem; }
        
        /* ADDED: Kill margin inside special offers to prevent "chin" space */
        .srf-special-offer-area .srf-slots-subgrid-wrapper { margin-bottom: 0; }

        .srf-slots-subgrid { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 0.75rem; padding-bottom: 0.75rem; }
        .srf-slots-subgrid::-webkit-scrollbar { height: 6px; }
        .srf-slots-subgrid::-webkit-scrollbar-thumb { background: var(--srf-border); border-radius: var(--srf-radius); }
        .srf-slot-button { flex: 0 0 auto; min-width: 100px; height: 3rem; background-color: var(--srf-slot-bg); color: var(--srf-slot-text); border-radius: var(--srf-radius); display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: all 0.2s; opacity: 0.85; }
        .srf-slot-button:hover { opacity: 1; transform: translateY(-1px); }

        .srf-show-all-times-wrapper, .srf-other-dates-wrapper, .srf-other-locations-wrapper { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--srf-border); }
        .srf-show-all-times-button { background-color: var(--cfg-accent-main); color: var(--srf-btn-text); font-weight: 600; border: none; padding: 0.75rem 1.5rem; border-radius: var(--srf-radius); cursor: pointer; display: block; margin: 0 auto; }
        .srf-other-dates-trigger, .srf-other-locations-trigger { background: var(--srf-input-bg); border: 1px solid transparent; color: var(--srf-text); width: 100%; text-align: left; padding: 0.75rem 1rem; border-radius: var(--srf-radius); font-weight: 600; cursor: pointer; position: relative; transition: all 0.2s ease; }
        .srf-other-dates-trigger:hover, .srf-other-locations-trigger:hover { filter: brightness(0.95); border-color: var(--cfg-accent-main); }
        .srf-other-dates-trigger::after, .srf-other-locations-trigger::after { content: '▼'; position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); transition: transform 0.2s ease; }
        .srf-other-dates-trigger.srf-open::after, .srf-other-locations-trigger.srf-open::after { transform: translateY(-50%) rotate(180deg); }
        .srf-other-dates-list, .srf-other-locations-list { display: none; margin-top: 0.5rem; background-color: var(--srf-input-bg); padding: 0.5rem; border-radius: var(--srf-radius); gap: 0.5rem; grid-template-columns: 1fr 1fr; border: 1px solid var(--srf-border); }
        .srf-other-locations-list { grid-template-columns: 1fr; }
        .srf-other-date-button, .srf-other-location-button { background-color: transparent; border: 1px solid transparent; color: var(--srf-text); padding: 0.75rem; border-radius: var(--srf-radius); cursor: pointer; }
        .srf-other-date-button:hover, .srf-other-location-button:hover { background-color: var(--srf-border); }
        
        /* SCOPED FLATPICKR STYLES - Added .srf-fp-instance class */
        .flatpickr-calendar.srf-fp-instance { font-family: var(--srf-body-font) !important; background: var(--srf-bg) !important; color: var(--srf-text) !important; border: 1px solid var(--srf-border) !important; border-radius: var(--srf-radius) !important; }
        .flatpickr-calendar.srf-fp-instance .flatpickr-day { color: var(--srf-text) !important; }
        .flatpickr-calendar.srf-fp-instance .flatpickr-day.selected { background: var(--cfg-accent-main) !important; border-color: var(--cfg-accent-main) !important; color: var(--srf-btn-text) !important; }
        
        /* ADDED: Fix for Flatpickr Month/Year/Weekday colors overriding defaults */
        .flatpickr-calendar.srf-fp-instance .flatpickr-current-month,
        .flatpickr-calendar.srf-fp-instance .flatpickr-current-month .flatpickr-monthDropdown-months,
        .flatpickr-calendar.srf-fp-instance .flatpickr-current-month input.cur-year,
        .flatpickr-calendar.srf-fp-instance span.flatpickr-weekday { color: var(--srf-text) !important; }
        .flatpickr-calendar.srf-fp-instance .flatpickr-prev-month svg,
        .flatpickr-calendar.srf-fp-instance .flatpickr-next-month svg { fill: var(--srf-text) !important; }
        
        /* ADDED: Enforce exact white for dark mode calendar text elements */
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-current-month,
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-current-month .flatpickr-monthDropdown-months,
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-current-month input.cur-year,
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark span.flatpickr-weekday,
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-day:not(.selected) { color: #ffffff !important; }
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-prev-month svg,
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-next-month svg { fill: #ffffff !important; }

        /* ADDED: Fix for dark mode dropdown backgrounds (Month Selector) */
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-monthDropdown-months { background-color: var(--srf-bg) !important; }
        .flatpickr-calendar.srf-fp-instance.srf-theme-dark .flatpickr-monthDropdown-months option { background-color: var(--srf-bg); color: #ffffff; }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.id = "srf-custom-styles";
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }

    // --- 3. DEPENDENCY LOADER ---
    function loadDependencies(callback) {
        if (typeof flatpickr === 'function') { callback(); return; }
        // Check if css is already loaded to prevent duplicates/overrides
        if (!document.querySelector('link[href*="flatpickr"]')) {
            const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css'; document.head.appendChild(link);
        }
        const fontLink = document.createElement('link'); fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"; fontLink.rel = "stylesheet"; document.head.appendChild(fontLink);
        const script = document.createElement('script'); script.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
        script.onload = callback;
        document.head.appendChild(script);
    }

    // --- 4. WIDGET FACTORY ---
    function initAllWidgets() {
        // Support new .THEME or legacy .THEMES
        if (!window.SR_WIDGET_CONFIG || (!window.SR_WIDGET_CONFIG.THEMES && !window.SR_WIDGET_CONFIG.THEME)) {
            console.warn("SR Widget: No configuration found in window.SR_WIDGET_CONFIG");
            return;
        }
        const targets = document.querySelectorAll('.sevenrooms-widget-target');
        targets.forEach(target => {
            if (target.getAttribute('data-srf-init') === 'true') return;
            initSingleWidget(target);
            target.setAttribute('data-srf-init', 'true');
        });
    }

    function initSingleWidget(container) {
        // Resolve configuration mode (Single Theme vs Legacy Multi-Brand)
        let theme, localVenuesList, styleSuffix;
        
        if (window.SR_WIDGET_CONFIG.THEME) {
            // v6.3: Simplified Config (No Brands)
            theme = window.SR_WIDGET_CONFIG.THEME;
            localVenuesList = window.SR_WIDGET_CONFIG.VENUES || [];
            styleSuffix = 'main';
        } else {
            // Legacy: Brands & Themes
            const brandKey = container.dataset.branding || "VB";
            styleSuffix = brandKey;
            theme = window.SR_WIDGET_CONFIG.THEMES[brandKey] || window.SR_WIDGET_CONFIG.THEMES["VB"];
            const allVenues = window.SR_WIDGET_CONFIG.VENUES || [];
            localVenuesList = allVenues.filter(v => v.brand === brandKey);
        }

        const themeFonts = theme.fonts || {};
        const CONFIG = {
            VENUE_ID: container.dataset.venueId || (localVenuesList[0] ? localVenuesList[0].id : ''),
            VENUE_NAME: container.dataset.venueName, 
            VENUE_PATH: container.dataset.venuePath,
            THEME: container.dataset.theme || 'dark',
            LAYOUT: container.dataset.layout || 'stacked',
            TITLE: container.dataset.title || 'Book A Table',
            COLORS: {
                accentMain: container.dataset.colorAccentMain || theme.accentMain,
                accentSec:  container.dataset.colorAccentSec || theme.accentSec,
                bgLight:    container.dataset.colorBgLight || theme.bgLight,
                bgDark:     container.dataset.colorBgDark || theme.bgDark,
            },
            FONTS: {
                title: container.dataset.fontTitle || themeFonts.title || ENGINE_DEFAULTS.FONTS.title,
                titleUrl: themeFonts.titleUrl,
                body:  container.dataset.fontBody || themeFonts.body || ENGINE_DEFAULTS.FONTS.body,
                url:   container.dataset.fontUrl || themeFonts.url
            }
        };

        const applyStyles = (element) => {
            element.style.setProperty('--cfg-accent-main', CONFIG.COLORS.accentMain);
            element.style.setProperty('--cfg-accent-sec', CONFIG.COLORS.accentSec);
            element.style.setProperty('--cfg-bg-light', CONFIG.COLORS.bgLight);
            element.style.setProperty('--cfg-bg-dark', CONFIG.COLORS.bgDark);
            element.style.setProperty('--srf-title-font', CONFIG.FONTS.title);
            element.style.setProperty('--srf-body-font', CONFIG.FONTS.body);
            element.style.setProperty('--srf-heading-font', CONFIG.FONTS.body);
        };
        applyStyles(container);

        // FONT LOADING LOGIC
        if (CONFIG.FONTS.url && !document.querySelector(`link[href="${CONFIG.FONTS.url}"]`)) {
            const fontLink = document.createElement('link'); fontLink.href = CONFIG.FONTS.url; fontLink.rel = "stylesheet"; document.head.appendChild(fontLink);
        }
        
        // Auto-build @font-face if titleUrl is provided
        if (CONFIG.FONTS.titleUrl) {
             const styleId = `srf-font-face-${styleSuffix}`;
             if (!document.getElementById(styleId)) {
                 const style = document.createElement('style');
                 style.id = styleId;
                 const cleanName = CONFIG.FONTS.title.split(',')[0].replace(/['"]/g, '');
                 style.textContent = `@font-face { font-family: '${cleanName}'; src: url('${CONFIG.FONTS.titleUrl}') format('woff'); font-display: swap; }`;
                 document.head.appendChild(style);
             }
        }

        const otherVenuesAttr = container.getAttribute('data-other-venues');
        if (otherVenuesAttr) {
            try { 
                const extras = JSON.parse(otherVenuesAttr);
                extras.forEach(v => {
                    const idx = localVenuesList.findIndex(existing => existing.id === v.id);
                    if (idx > -1) localVenuesList[idx] = v; 
                    else localVenuesList.push(v);
                });
            } catch (e) { console.warn("SR Widget: Invalid data-other-venues JSON"); }
        }

        const currentVenueIndex = localVenuesList.findIndex(v => v.id === CONFIG.VENUE_ID);
        if (currentVenueIndex === -1) {
            const globalVenue = window.SR_WIDGET_CONFIG.VENUES ? window.SR_WIDGET_CONFIG.VENUES.find(v => v.id === CONFIG.VENUE_ID) : null;
            localVenuesList.unshift({ 
                id: CONFIG.VENUE_ID, 
                name: CONFIG.VENUE_NAME || (globalVenue ? globalVenue.name : 'Main Venue'), 
                path: CONFIG.VENUE_PATH || (globalVenue ? globalVenue.path : 'checkout') 
            });
        } else {
            if (CONFIG.VENUE_NAME) localVenuesList[currentVenueIndex].name = CONFIG.VENUE_NAME;
            if (CONFIG.VENUE_PATH) localVenuesList[currentVenueIndex].path = CONFIG.VENUE_PATH;
        }
        
        CONFIG.VENUES_LIST = localVenuesList;

        const uniqueId = Math.random().toString(36).substr(2, 9);
        
        // NEW LOGIC: Determine if we show location selector
        // Show selector if NO explicit venueId is provided AND there are multiple venues available.
        const explicitVenueId = container.dataset.venueId;
        const showLocationSelect = !explicitVenueId;

        container.innerHTML = `
        <div class="sevenrooms-widget-container srf-theme-${CONFIG.THEME} srf-layout-${CONFIG.LAYOUT}" id="srf-${uniqueId}">
            <div class="srf-step-1-content">
                <h2>${CONFIG.TITLE}</h2>
                <form class="srf-form">
                    <input type="hidden" name="venue-id" value="${CONFIG.VENUE_ID}">
                    
                    ${showLocationSelect ? `
                    <div class="srf-form-group srf-location-group">
                        <label>Location</label>
                        <div class="srf-select-wrapper">
                            <select class="srf-input venue-select"></select>
                        </div>
                    </div>` : ''}

                    <div class="srf-form-group"><label>Party Size</label><div class="srf-select-wrapper"><select name="party-size" class="srf-input party-size-select"></select></div></div>
                    <div class="srf-form-group"><label>Date</label><div class="srf-date-wrapper"><input type="text" class="srf-input date-input" placeholder="Select a date..." required></div></div>
                    <div class="srf-form-group srf-time-group"><label>Preferred Time</label><button type="button" class="srf-input srf-time-trigger-button">All Times</button><input type="hidden" name="time-slot" class="time-slot-input" value="_all_"><input type="hidden" name="halo-interval" class="halo-interval-input" value="60"></div>
                    <div class="srf-form-group srf-submit-group">
                        <label class="srf-layout-horizontal-label">&nbsp;</label>
                        <button type="button" class="srf-button submit-btn">SEARCH</button>
                    </div>
                    <div class="srf-inline-error"></div>
                </form>
            </div>
            <div class="srf-time-dropdown srf-theme-${CONFIG.THEME}" id="dropdown-${uniqueId}">
                <div class="srf-time-list-wrapper"></div>
                <div class="srf-dropdown-footer"><div class="srf-halo-group">
                    <input type="radio" id="halo-30-${uniqueId}" name="halo-${uniqueId}" value="30" class="srf-halo-input"><label for="halo-30-${uniqueId}" class="srf-halo-label">± 30m</label>
                    <input type="radio" id="halo-60-${uniqueId}" name="halo-${uniqueId}" value="60" class="srf-halo-input" checked><label for="halo-60-${uniqueId}" class="srf-halo-label">± 1h</label>
                    <input type="radio" id="halo-120-${uniqueId}" name="halo-${uniqueId}" value="120" class="srf-halo-input"><label for="halo-120-${uniqueId}" class="srf-halo-label">± 2h</label>
                </div></div>
            </div>
            <div class="srf-modal-overlay srf-theme-${CONFIG.THEME}" id="modal-${uniqueId}">
                <div class="srf-modal-content srf-results-modal-content">
                    <div class="srf-modal-header"><h3 class="srf-modal-title"><span class="srf-modal-summary-text"></span><button type="button" class="srf-modal-edit-link">(Edit)</button></h3><button type="button" class="srf-modal-close">&times;</button></div>
                    <div class="srf-results-body"><div class="srf-spinner"></div><div class="srf-error"></div><div class="srf-slots-grid"></div><div class="srf-show-all-times-wrapper" style="display: none;"><button type="button" class="srf-show-all-times-button">Show All Available Times</button></div><div class="srf-other-dates-wrapper" style="display: none;"><button type="button" class="srf-other-dates-trigger">Show other dates</button><div class="srf-other-dates-list"></div></div><div class="srf-other-locations-wrapper" style="display: none;"><button type="button" class="srf-other-locations-trigger">View other locations</button><div class="srf-other-locations-list"></div></div></div>
                </div>
            </div>
        </div>`;

        const wrapper = container.querySelector(`#srf-${uniqueId}`);
        const modal = document.querySelector(`#modal-${uniqueId}`);
        const dropdown = document.querySelector(`#dropdown-${uniqueId}`);
        applyStyles(modal); applyStyles(dropdown);
        document.body.appendChild(modal); document.body.appendChild(dropdown);

        const form = wrapper.querySelector('.srf-form'), submitBtn = wrapper.querySelector('.submit-btn'), partyInput = wrapper.querySelector('.party-size-select'), dateInput = wrapper.querySelector('.date-input'), timeTrigger = wrapper.querySelector('.srf-time-trigger-button'), timeSlotInput = wrapper.querySelector('.time-slot-input'), haloInput = wrapper.querySelector('.halo-interval-input'), timeListWrapper = dropdown.querySelector('.srf-time-list-wrapper'), haloGroup = dropdown.querySelector('.srf-halo-group');
        const modalClose = modal.querySelector('.srf-modal-close'), modalEdit = modal.querySelector('.srf-modal-edit-link'), modalSummary = modal.querySelector('.srf-modal-summary-text'), spinner = modal.querySelector('.srf-spinner'), errorMsg = modal.querySelector('.srf-error'), slotsGrid = modal.querySelector('.srf-slots-grid'), showAllTimesBtn = modal.querySelector('.srf-show-all-times-button'), otherDatesBtn = modal.querySelector('.srf-other-dates-trigger'), otherDatesList = modal.querySelector('.srf-other-dates-list'), otherDatesWrapper = modal.querySelector('.srf-other-dates-wrapper'), otherLocBtn = modal.querySelector('.srf-other-locations-trigger'), otherLocList = modal.querySelector('.srf-other-locations-list'), otherLocWrapper = modal.querySelector('.srf-other-locations-wrapper');
        const inlineError = wrapper.querySelector('.srf-inline-error');

        // --- NEW: Initialize Location Selector if active ---
        const venueSelect = wrapper.querySelector('.venue-select');
        if (showLocationSelect && venueSelect) {
            // 1. Add Placeholder
            const placeholder = document.createElement('option');
            placeholder.value = "";
            placeholder.textContent = "Select...";
            placeholder.selected = true;
            placeholder.disabled = true; // Prevent re-selection
            venueSelect.appendChild(placeholder);

            // 2. Clear default Venue ID
            CONFIG.VENUE_ID = "";
            form.querySelector('input[name="venue-id"]').value = "";

            // 3. Add Venues
            localVenuesList.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.id;
                
                // Clean Name Logic
                let cleanName = v.name;
                cleanName = cleanName.replace(/Vivat Bacchus\s*/i, "").replace(/Humble Grape\s*/i, "").trim();
                
                opt.textContent = cleanName;
                venueSelect.appendChild(opt);
            });

            // 4. Handle Change
            venueSelect.onchange = () => {
                CONFIG.VENUE_ID = venueSelect.value;
                form.querySelector('input[name="venue-id"]').value = venueSelect.value;
                if (inlineError) inlineError.style.display = 'none';
            };
        }

        for (let i = 1; i <= 10; i++) { const opt = document.createElement('option'); opt.value = i; opt.text = `${i} ${i === 1 ? 'Person' : 'People'}`; if (i === 2) opt.selected = true; partyInput.appendChild(opt); }
        let flatpickrInstance = flatpickr(dateInput, { 
            altInput: true, 
            altFormat: "d/m/Y", 
            dateFormat: "Y-m-d", 
            minDate: "today", 
            defaultDate: "today", 
            disableMobile: "true", 
            appendTo: document.body, 
            onReady: (sd, ds, inst) => { 
                // CRITICAL FIX: Add scoping class to the calendar container
                inst.calendarContainer.classList.add('srf-fp-instance');
                inst.calendarContainer.classList.add(CONFIG.THEME === 'light' ? 'srf-theme-light' : 'srf-theme-dark'); 
                applyStyles(inst.calendarContainer); 
            }, 
            onClose: () => { if (modal.classList.contains('srf-visible')) runSearch(false); } 
        });

        function populateTimeList() {
            timeListWrapper.innerHTML = '';
            const addTime = (val, text) => { const div = document.createElement('div'); div.className = `srf-time-list-item`; div.textContent = text; div.dataset.time = val; if(val==='_all_') div.classList.add('srf-selected'); div.onclick = (e) => { e.stopPropagation(); timeSlotInput.value = val; updateTimeButton(); toggleDropdown(false); if (modal.classList.contains('srf-visible')) runSearch(false); }; timeListWrapper.appendChild(div); };
            addTime('_all_', 'All Times');
            let curr = new Date(); curr.setHours(12,0,0,0); const end = new Date(); end.setHours(23,0,0,0);
            while(curr <= end) { addTime(curr.toTimeString().substring(0,5), curr.toTimeString().substring(0,5)); curr.setMinutes(curr.getMinutes() + 30); }
        }
        populateTimeList();

        function updateTimeButton() { const t = timeSlotInput.value; const h = haloInput.value; timeTrigger.textContent = t === '_all_' ? 'All Times' : `${t} (± ${h === '60' ? '1h' : h === '120' ? '2h' : '30m'})`; }
        function toggleDropdown(show) { if(show) { dropdown.classList.add('srf-visible'); const r = timeTrigger.getBoundingClientRect(); dropdown.style.top = (r.bottom + window.scrollY + 5) + 'px'; dropdown.style.left = (r.left + window.scrollX) + 'px'; dropdown.style.width = r.width + 'px'; } else { dropdown.classList.remove('srf-visible'); } }
        timeTrigger.onclick = (e) => { e.stopPropagation(); toggleDropdown(!dropdown.classList.contains('srf-visible')); };
        document.addEventListener('click', (e) => { if(!dropdown.contains(e.target)) toggleDropdown(false); });
        timeListWrapper.addEventListener('click', (e) => { const t=e.target.closest('.srf-time-list-item'); if(!t)return; timeListWrapper.querySelectorAll('.srf-time-list-item').forEach(i=>i.classList.remove('srf-selected')); t.classList.add('srf-selected'); });
        haloGroup.querySelectorAll('input').forEach(r => { r.onchange = (e) => { haloInput.value = e.target.value; updateTimeButton(); }; });

        async function runSearch(isManual) {
            if (inlineError) inlineError.style.display = 'none'; // Reset error
            if (!CONFIG.VENUE_ID) {
                if (isManual && inlineError) {
                    inlineError.textContent = "Please select a location.";
                    inlineError.style.display = 'block';
                }
                return;
            }
            if(isManual) { submitBtn.textContent = 'Checking...'; submitBtn.disabled = true; }
            modal.classList.add('srf-visible'); spinner.style.display = 'block'; slotsGrid.style.display = 'none'; errorMsg.style.display = 'none';
            const dateStr = new Date(dateInput.value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
            modalSummary.textContent = `${partyInput.value} Ppl, ${dateStr}, ${timeTrigger.textContent}`;
            const payload = { venueId: CONFIG.VENUE_ID, partySize: parseInt(partyInput.value), date: dateInput.value, timeSlot: timeSlotInput.value === '_all_' ? '16:00' : timeSlotInput.value, haloInterval: timeSlotInput.value === '_all_' ? 900 : parseInt(haloInput.value) };
            try {
                const res = await fetch(ENGINE_DEFAULTS.API_URL, { method: 'POST', body: JSON.stringify(payload) });
                const data = await res.json();
                if (data.groupedByVenue) renderSlots(data.groupedByVenue); else throw new Error('No data');
            } catch (e) { spinner.style.display = 'none'; errorMsg.style.display = 'block'; errorMsg.textContent = "Unavailable. Please try again."; } 
            finally { if(isManual) { submitBtn.textContent = 'SEARCH'; submitBtn.disabled = false; } }
        }

        function renderSlots(data) {
            spinner.style.display = 'none'; slotsGrid.innerHTML = '';
            const venueData = data[CONFIG.VENUE_ID] || Object.values(data)[0];
            if (!venueData || Object.keys(venueData).length === 0) { slotsGrid.innerHTML = '<p style="text-align:center; opacity:0.7;">No tables found.</p>'; slotsGrid.style.display = 'block'; otherDatesBtn.click(); return; }

            const areaNames = Object.keys(venueData);
            // --- SMART SORTING (UPDATED v6.9) ---
            areaNames.sort((a, b) => {
                const aLower = a.toLowerCase(), bLower = b.toLowerCase();
                const getRank = (n) => { 
                    // Force all special offers (containing "% off" or "special") to the top
                    if (n.includes("% off") || n.includes("special")) return 0; // Rank 0 (highest)
                    if (n.includes("wine")) return 2; 
                    return 10; 
                };
                const rankA = getRank(aLower), rankB = getRank(bLower);
                if (rankA !== rankB) return rankA - rankB;
                const timeA = (venueData[a] && venueData[a].length > 0) ? venueData[a][0].time_iso : '9999';
                const timeB = (venueData[b] && venueData[b].length > 0) ? venueData[b][0].time_iso : '9999';
                if (timeA < timeB) return -1; if (timeA > timeB) return 1;
                return aLower.localeCompare(bLower);
            });

            areaNames.forEach(areaName => {
                const slots = venueData[areaName];
                let targetMin = -1, targetMax = -1;
                if(timeSlotInput.value !== '_all_') { const [h, m] = timeSlotInput.value.split(':').map(Number); const minutes = h * 60 + m; const hInt = parseInt(haloInput.value); targetMin = minutes - hInt; targetMax = minutes + hInt; }
                
                // Fix: Case-insensitive check for styling and labels
                const lowerName = areaName.toLowerCase();
                const isSpecial = lowerName.includes('% off') || lowerName.includes('special');

                const areaDiv = document.createElement('div'); 
                areaDiv.className = `srf-area-container ${isSpecial ? 'srf-special-offer-area' : ''}`;
                
                const title = document.createElement('h3'); 
                title.className = 'srf-area-heading'; 
                // EXPLICITLY SETTING "Special Offer" TEXT
                title.innerHTML = isSpecial ? `${areaName} <span class="srf-special-offer-label">Special Offer</span>` : areaName;
                
                const gridDiv = document.createElement('div'); gridDiv.className = 'srf-slots-subgrid';
                let count = 0;
                slots.forEach(slot => {
                    const [sh, sm] = slot.time_iso.substring(11, 16).split(':').map(Number); const sMin = sh * 60 + sm;
                    // UPDATED: Use isSpecial to prevent special offers from being filtered by time
                    if(timeSlotInput.value !== '_all_' && (sMin < targetMin || sMin > targetMax) && !isSpecial) return;
                    const btn = document.createElement('a'); btn.className = 'srf-slot-button'; btn.textContent = slot.time_formatted;
                    const vConfig = CONFIG.VENUES_LIST.find(v => v.id === CONFIG.VENUE_ID) || {};
                    const path = vConfig.path || 'checkout';
                    btn.href = `https://www.sevenrooms.com/explore/${CONFIG.VENUE_ID}/reservations/create/${path}/?venues=${CONFIG.VENUE_ID}&date=${dateInput.value}&timeslot_id=${slot.token}&party_size=${partyInput.value}`;
                    btn.target = "_blank"; gridDiv.appendChild(btn); count++;
                });
                if(count > 0) {
                    const header = document.createElement('div'); header.className = 'srf-area-header-row'; header.appendChild(title);
                    const wrapper = document.createElement('div'); wrapper.className = 'srf-slots-subgrid-wrapper'; wrapper.appendChild(gridDiv);
                    const controls = document.createElement('div'); controls.className = 'srf-scroll-controls';
                    const l = document.createElement('button'); l.className = 'srf-scroll-btn'; l.innerHTML = '&lt;';
                    const r = document.createElement('button'); r.className = 'srf-scroll-btn'; r.innerHTML = '&gt;';
                    l.onclick = () => gridDiv.scrollBy({ left: -200, behavior: 'smooth' }); r.onclick = () => gridDiv.scrollBy({ left: 200, behavior: 'smooth' });
                    controls.append(l, r); header.appendChild(controls);
                    areaDiv.appendChild(header); areaDiv.appendChild(wrapper); slotsGrid.appendChild(areaDiv);
                    const checkArrows = () => {
                        l.classList.toggle('srf-disabled', gridDiv.scrollLeft <= 0);
                        r.classList.toggle('srf-disabled', gridDiv.scrollLeft + gridDiv.clientWidth >= gridDiv.scrollWidth - 1);
                        areaDiv.classList.toggle('srf-hide-arrows', gridDiv.scrollWidth <= gridDiv.clientWidth);
                    };
                    gridDiv.addEventListener('scroll', checkArrows); setTimeout(checkArrows, 100); window.addEventListener('resize', checkArrows);
                }
            });
            slotsGrid.style.display = 'block';
            if(otherDatesWrapper) otherDatesWrapper.style.display = 'block';
            if(otherLocWrapper) otherLocWrapper.style.display = 'block';
        }

        submitBtn.onclick = () => runSearch(true);
        modalClose.onclick = () => modal.classList.remove('srf-visible');
        modalEdit.onclick = () => modal.classList.remove('srf-visible');
        showAllTimesBtn.onclick = () => { timeSlotInput.value = '_all_'; updateTimeButton(); runSearch(false); };
        otherDatesBtn.onclick = () => {
            if(otherDatesList.style.display === 'grid') { otherDatesList.style.display = 'none'; otherDatesBtn.classList.remove('srf-open'); return; }
            otherDatesBtn.classList.add('srf-open'); otherDatesList.innerHTML = ''; otherDatesList.style.display = 'grid';
            for(let i=1; i<5; i++) { const d = new Date(dateInput.value); d.setHours(12,0,0,0); d.setDate(d.getDate() + i); const btn = document.createElement('button'); btn.className = 'srf-other-date-button'; btn.innerHTML = `<span>${d.toLocaleDateString('en-US',{weekday:'short'})}</span> ${d.getDate()} ${d.toLocaleDateString('en-US',{month:'short'})}`; btn.onclick = () => { flatpickrInstance.setDate(d); runSearch(false); }; otherDatesList.appendChild(btn); }
        };
        otherLocBtn.onclick = () => {
            if(otherLocList.style.display === 'grid') { otherLocList.style.display = 'none'; otherLocBtn.classList.remove('srf-open'); return; }
            otherLocBtn.classList.add('srf-open'); otherLocList.innerHTML = ''; otherLocList.style.display = 'grid';
            CONFIG.VENUES_LIST.forEach(v => {
                if(v.id === CONFIG.VENUE_ID) return;
                const btn = document.createElement('button'); btn.className = 'srf-other-location-button'; btn.textContent = v.name;
                btn.onclick = () => { CONFIG.VENUE_ID = v.id; form.querySelector('input[name="venue-id"]').value = v.id; otherLocList.style.display = 'none'; otherLocBtn.classList.remove('srf-open'); runSearch(false); };
                otherLocList.appendChild(btn);
            });
        };
    }

    // --- INIT ---
    injectStyles();
    loadDependencies(() => {
        initAllWidgets();
        new MutationObserver((mutations) => {
            if (mutations.some(m => m.addedNodes.length)) initAllWidgets();
        }).observe(document.body, { childList: true, subtree: true });
    });

})();
