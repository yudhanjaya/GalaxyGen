/**
 * Galaxy Generator - UI Module
 * Handles user interface interactions and display
 */

// Log module loading
console.log("Loading galaxy-ui.js");

// Check essential dependencies exist on window - DO NOT destructure here
if (!window.GalaxyCore || !window.GalaxyGenerator || !window.GalaxyVisualization || typeof ForceGraph3D === 'undefined' || typeof THREE === 'undefined') {
    console.error("galaxy-ui.js Error: Required dependencies missing! (GalaxyCore, GalaxyGenerator, GalaxyVisualization, ForceGraph3D, THREE)");
    // Display error to user if possible
    window.addEventListener('DOMContentLoaded', () => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingDetail = document.getElementById('loadingDetail');
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (loadingDetail) loadingDetail.textContent = "Error: Critical dependencies missing. Cannot initialize.";
        // Optionally hide the main container
        const container = document.getElementById('container');
        if (container) container.style.display = 'none';
    });
    // throw new Error("galaxy-ui.js Error: Critical dependencies missing!"); // Stop script execution
} else {
    // Dependencies seem OK, proceed with UI logic

    /**
     * UI Controller Class
     * Manages UI state and interactions
     */
    class GalaxyUIController {
        constructor() {
            // State
            this.currentUniverse = null;
            this.graph = null;
            this.selectedNode = null;
            this.isGenerating = false;
            this.loadedModules = {
                export: typeof window.GalaxyExport !== 'undefined',
                descriptions: typeof window.GalaxyDescriptions !== 'undefined' // Example
            };
            this.elements = {}; // Cache DOM elements

            // Bind methods
            Object.getOwnPropertyNames(GalaxyUIController.prototype).forEach(methodName => {
                if (methodName !== 'constructor' && typeof this[methodName] === 'function') {
                    this[methodName] = this[methodName].bind(this);
                }
            });
        }

        /** Initialize the UI: cache elements, set listeners, generate initial view */
        init() {
            console.log("Initializing GalaxyUIController...");
            if (!this.cacheDOMElements()) {
                console.error("UI Initialization failed: Could not find essential DOM elements.");
                // Display error to user maybe?
                const loadingDetail = document.getElementById('loadingDetail');
                 if(loadingDetail) loadingDetail.textContent = "Error: UI elements missing.";
                return; // Stop initialization
            }
            this.initEventListeners();
            this.updateExportButtonStates(); // Set initial state based on loaded modules
            this.generateGalaxy(true); // Generate initial test galaxy
        }

        /** Cache references to DOM elements */
        cacheDOMElements() {
            this.elements = {
                container: document.getElementById('container'),
                graphContainer: document.getElementById('graphContainer'),
                propertiesPane: document.getElementById('propertiesPane'),
                dataPane: document.getElementById('dataPane'),
                tooltip: document.getElementById('tooltip'),
                loadingOverlay: document.getElementById('loadingOverlay'),
                loadingProgressBar: document.getElementById('loadingProgressBar'),
                loadingDetail: document.getElementById('loadingDetail'),
                galaxyType: document.getElementById('galaxyType'),
                starCount: document.getElementById('starCount'),
                starCountValue: document.getElementById('starCountValue'),
                civProbability: document.getElementById('civProbability'),
                civProbabilityValue: document.getElementById('civProbabilityValue'),
                generateButton: document.getElementById('generateButton'),
                propertiesTitle: document.getElementById('propertiesTitle'),
                focusButton: document.getElementById('focusButton'),
                tabs: document.querySelectorAll('#propertiesPane .tab'),
                tabContents: document.querySelectorAll('#propertiesPane .tab-content'),
                overviewTab: document.getElementById('overviewTab'),
                detailsTab: document.getElementById('detailsTab'),
                descriptionTab: document.getElementById('descriptionTab'),
                descriptionTabButton: document.querySelector('#propertiesPane .tab[data-tab="description"]'),
                universeData: document.getElementById('universeData'),
                saveCsvButton: document.getElementById('saveCsvButton'),
                saveJsonButton: document.getElementById('saveJsonButton')
            };

             // Basic check if crucial elements exist
             return !!(this.elements.graphContainer && this.elements.propertiesPane && this.elements.dataPane && this.elements.generateButton);
        }

        /** Set up event listeners */
        initEventListeners() {
            if (this.elements.starCount && this.elements.starCountValue) {
                this.elements.starCount.addEventListener('input', () => {
                    this.elements.starCountValue.textContent = this.elements.starCount.value;
                });
                 // Initial display update
                 this.elements.starCountValue.textContent = this.elements.starCount.value;
            }
            if (this.elements.civProbability && this.elements.civProbabilityValue) {
                this.elements.civProbability.addEventListener('input', () => {
                    this.elements.civProbabilityValue.textContent = this.elements.civProbability.value + '%';
                });
                 // Initial display update
                 this.elements.civProbabilityValue.textContent = this.elements.civProbability.value + '%';
            }
            if (this.elements.generateButton) {
                this.elements.generateButton.addEventListener('click', () => this.generateGalaxy(false));
            }
            if (this.elements.saveCsvButton) {
                this.elements.saveCsvButton.addEventListener('click', this.saveToCSV);
            }
            if (this.elements.saveJsonButton) {
                this.elements.saveJsonButton.addEventListener('click', this.saveToJSON);
            }
            if (this.elements.focusButton) {
                this.elements.focusButton.addEventListener('click', () => {
                    if (this.selectedNode && this.graph && window.GalaxyVisualization.focusNode) {
                        window.GalaxyVisualization.focusNode(this.graph, this.selectedNode);
                    }
                });
            }
            if (this.elements.tabs && this.elements.tabContents) {
                this.elements.tabs.forEach(tab => {
                    tab.addEventListener('click', () => this.handleTabClick(tab));
                });
            }
             // Ensure tooltips are removed if mouse leaves graph area
             if(this.elements.graphContainer) {
                 this.elements.graphContainer.addEventListener('mouseleave', () => {
                     this.handleNodeHover(null); // Treat leaving as hover ending
                 });
             }
        }

        /** Handle tab clicks in properties pane */
        handleTabClick(clickedTab) {
             if (!this.elements.tabs || !this.elements.tabContents) return;

            this.elements.tabs.forEach(t => t.classList.remove('active'));
            this.elements.tabContents.forEach(content => content.classList.remove('active'));

            clickedTab.classList.add('active');
            const tabContentId = clickedTab.getAttribute('data-tab') + 'Tab';
            const tabContentElement = document.getElementById(tabContentId);
            if (tabContentElement) {
                tabContentElement.classList.add('active');
            }

            // If description tab clicked, load module and update content
            if (clickedTab.getAttribute('data-tab') === 'description' && this.selectedNode) {
                this.loadOptionalModule('descriptions', () => {
                    this.updateDescriptionTab(this.selectedNode);
                });
            }
        }


        /** Update states of export buttons based on module availability */
        updateExportButtonStates() {
             const exportLoaded = this.loadedModules.export;
             if (this.elements.saveCsvButton) {
                 this.elements.saveCsvButton.disabled = !exportLoaded;
                 this.elements.saveCsvButton.title = exportLoaded ? "Export data to CSV file" : "GalaxyExport module not loaded";
             }
              if (this.elements.saveJsonButton) {
                 this.elements.saveJsonButton.disabled = !exportLoaded;
                 this.elements.saveJsonButton.title = exportLoaded ? "Export data to JSON file" : "GalaxyExport module not loaded";
             }
        }


        /** Load optional JS module */
        loadOptionalModule(moduleName, callback) {
            const moduleKey = moduleName;
            const moduleObjectName = `Galaxy${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}`;
            const scriptSrc = `galaxy-${moduleName}.js`;

            // Already loaded or available?
            if (this.loadedModules[moduleKey] || window[moduleObjectName]) {
                if (!this.loadedModules[moduleKey]) {
                    console.log(`Optional module ${moduleObjectName} was already present.`);
                    this.loadedModules[moduleKey] = true;
                    this.updateExportButtonStates(); // Update buttons if export module was just found
                }
                if (callback) callback();
                return;
            }

            console.log(`Loading optional module: ${scriptSrc}...`);
            const script = document.createElement('script');
            script.src = scriptSrc;
            script.async = true;
            script.onload = () => {
                if (window[moduleObjectName]) {
                    console.log(`${scriptSrc} loaded successfully, object ${moduleObjectName} found.`);
                    this.loadedModules[moduleKey] = true;
                    this.updateExportButtonStates(); // Update buttons if export loaded
                    if (callback) callback();
                } else {
                    console.error(`Module ${scriptSrc} loaded, but object ${moduleObjectName} not found.`);
                }
            };
            script.onerror = (e) => {
                console.error(`Error loading module ${scriptSrc}:`, e);
                 this.updateExportButtonStates(); // Ensure buttons reflect failed load
            };
            document.body.appendChild(script);
        }

        /** Show loading overlay */
        showLoading(message = "Generating...") {
            if (!this.elements.loadingOverlay) return;
            this.elements.loadingOverlay.style.display = 'flex';
            this.updateLoadingProgress(0, message);
        }

        /** Hide loading overlay */
        hideLoading() {
            if (!this.elements.loadingOverlay) return;
            this.elements.loadingOverlay.style.display = 'none';
        }

        /** Update loading progress bar and text */
        updateLoadingProgress(percent, message) {
            if (this.elements.loadingProgressBar) {
                this.elements.loadingProgressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
            }
            if (this.elements.loadingDetail) {
                this.elements.loadingDetail.textContent = message;
            }
        }

        /** Generate new galaxy */
        async generateGalaxy(useTestMode = false) {
             // Access dependencies here, ensures they are checked at runtime
             const { generateTestUniverse, generateUniverse, processUniverseData } = window.GalaxyGenerator;
             const { createGalaxyVisualization } = window.GalaxyVisualization;

             if (this.isGenerating) return;
             this.isGenerating = true;
             console.log(`Generating galaxy... (Test Mode: ${useTestMode})`);
             this.showLoading("Initializing generation...");
             // Disable generate button during generation
             if (this.elements.generateButton) this.elements.generateButton.disabled = true;

            try {
                const options = {
                    galaxyType: this.elements.galaxyType?.value || 'spiral',
                    starCount: parseInt(this.elements.starCount?.value || 100),
                    civProbability: parseInt(this.elements.civProbability?.value || 10) / 100
                };

                this.selectedNode = null;
                if (this.elements.focusButton) this.elements.focusButton.style.display = 'none';
                this.updatePropertiesPane(null);

                // --- *** FIX IS HERE *** ---
                // Call the correct generator with the correct arguments
                let generationPromise;
                if (useTestMode) {
                    // generateTestUniverse expects only the progress callback
                    generationPromise = Promise.resolve(generateTestUniverse(this.updateLoadingProgress));
                } else {
                    // generateUniverse expects options and the progress callback
                    generationPromise = generateUniverse(options, this.updateLoadingProgress);
                }
                this.currentUniverse = await generationPromise;
                // --- *** END FIX *** ---


                if (!this.currentUniverse) throw new Error("Universe generation failed.");

                this.updateLoadingProgress(90, "Processing data...");
                const graphData = processUniverseData(this.currentUniverse);
                if (!graphData) throw new Error("Processing universe data failed.");

                this.updateLoadingProgress(95, "Rendering galaxy...");
                this.updateDataPane(); // Update stats

                if (!this.graph) {
                    this.graph = createGalaxyVisualization('graphContainer', graphData, {
                        onNodeClick: this.handleNodeClick,
                        onNodeHover: this.handleNodeHover
                    });
                    if (!this.graph) throw new Error("Visualization creation failed.");
                } else {
                    this.graph.graphData(graphData);
                    // Optional: Reset camera view
                    this.graph.cameraPosition({ x: 0, y: 0, z: 500 }, { x: 0, y: 0, z: 0 }, 500);
                }

                this.updateLoadingProgress(100, "Galaxy ready!");
                setTimeout(this.hideLoading, 500);

            } catch (error) {
                console.error("Error during galaxy generation process:", error);
                this.updateLoadingProgress(100, `Error: ${error.message || "Unknown error"}`);
                setTimeout(this.hideLoading, 3000); // Keep message visible longer
            } finally {
                this.isGenerating = false;
                 // Re-enable generate button
                 if (this.elements.generateButton) this.elements.generateButton.disabled = false;
            }
        }

        /** Handle node clicks from visualization */
        handleNodeClick(node) {
             this.selectedNode = node;
             this.updatePropertiesPane(node);
             if (this.elements.focusButton) {
                 this.elements.focusButton.style.display = node ? 'block' : 'none';
             }
             // Check if description tab is active and load module if needed
             const descriptionTabActive = this.elements.descriptionTabButton?.classList.contains('active');
             if (node && node.type === 'civilization' && descriptionTabActive) {
                 this.loadOptionalModule('descriptions', () => {
                     this.updateDescriptionTab(node);
                 });
             }
        }

        /** Handle node hover events from visualization */
        handleNodeHover(node) {
             // Access createTooltip from the correct scope
             const { createTooltip } = window.GalaxyVisualization;
             const tooltip = this.elements.tooltip;
             const container = this.elements.graphContainer; // Use graph container for cursor style
             if (!tooltip || !container) return;

             if (node) {
                 tooltip.innerHTML = createTooltip(node);
                 tooltip.style.display = 'block';
                 container.style.cursor = 'pointer'; // Indicate clickable
                 document.addEventListener('mousemove', this.updateTooltipPosition, { passive: true }); // Use passive listener
                 // Initial position based on last known event (might need to be passed from graph interaction)
                 // this.updateTooltipPosition({ clientX: lastEventX, clientY: lastEventY });
             } else {
                 tooltip.style.display = 'none';
                 container.style.cursor = 'grab'; // Default cursor
                 document.removeEventListener('mousemove', this.updateTooltipPosition);
             }
        }


        /** Update tooltip position */
        updateTooltipPosition(event) {
            const tooltip = this.elements.tooltip;
            if (!tooltip || tooltip.style.display === 'none') return;
            const PADDING = 15;
            let x = event.clientX + PADDING;
            let y = event.clientY + PADDING;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;
            const tooltipRect = tooltip.getBoundingClientRect();

            if (x + tooltipRect.width > winWidth - PADDING) {
                x = event.clientX - tooltipRect.width - PADDING;
            }
            if (y + tooltipRect.height > winHeight - PADDING) {
                y = event.clientY - tooltipRect.height - PADDING;
            }
            if (x < PADDING) x = PADDING;
            if (y < PADDING) y = PADDING;

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        }


        /** Update properties pane based on selected node */
        updatePropertiesPane(node) {
            if (!node) {
                // Clear pane and show default message
                if (this.elements.propertiesTitle) this.elements.propertiesTitle.textContent = "Node Properties";
                if (this.elements.overviewTab) this.elements.overviewTab.innerHTML = `<div class="property-group"><h3>Select an object</h3><p>Click on a star, planet, or civilization.</p></div>`;
                if (this.elements.detailsTab) this.elements.detailsTab.innerHTML = '';
                if (this.elements.descriptionTab) this.elements.descriptionTab.innerHTML = '';
                if (this.elements.descriptionTabButton) this.elements.descriptionTabButton.style.display = 'none';
                if (this.elements.focusButton) this.elements.focusButton.style.display = 'none';
                // Ensure overview tab is active by default when cleared
                 this.activateTab('overview');
                return;
            }

            // Update title
            if (this.elements.propertiesTitle) {
                const typeName = node.type ? node.type.charAt(0).toUpperCase() + node.type.slice(1) : 'Object';
                this.elements.propertiesTitle.textContent = `${node.name || 'Unnamed'} (${typeName})`;
            }

            // Show/hide description tab button
            if (this.elements.descriptionTabButton) {
                this.elements.descriptionTabButton.style.display = (node.type === 'civilization') ? 'block' : 'none';
                 // If description tab was active but node is no longer a civ, switch to overview
                 if (node.type !== 'civilization' && this.elements.descriptionTabButton.classList.contains('active')) {
                     this.activateTab('overview');
                 }
            }


            // Update content of currently active tab
            this.updateOverviewTab(node);
            this.updateDetailsTab(node);
             // If description tab is the active one, trigger its update/load sequence
             const activeTab = document.querySelector('#propertiesPane .tab.active');
             if (activeTab && activeTab.getAttribute('data-tab') === 'description') {
                 this.loadOptionalModule('descriptions', () => {
                     this.updateDescriptionTab(node);
                 });
             }
        }

         /** Helper to activate a specific tab */
         activateTab(tabDataAttribute) {
             if (!this.elements.tabs) return;
             this.elements.tabs.forEach(t => {
                 const isActive = t.getAttribute('data-tab') === tabDataAttribute;
                 t.classList.toggle('active', isActive);
                 const contentId = t.getAttribute('data-tab') + 'Tab';
                 const contentEl = document.getElementById(contentId);
                 if (contentEl) {
                     contentEl.classList.toggle('active', isActive);
                 }
             });
         }


        /** Generates HTML for a simple key-value display */
        generateHtmlForProperties(props, title = "Properties") {
             let html = `<div class="property-group"><h4>${title}</h4>`;
             let count = 0;
             for (const key in props) {
                  // Basic filtering of non-displayable properties
                 if (props.hasOwnProperty(key) && typeof props[key] !== 'object' && typeof props[key] !== 'function' && key !== 'id' && key !== 'isValid') {
                      let value = props[key];
                      if (typeof value === 'number') value = Number(value.toFixed(2)); // Round numbers
                     html += `<div class="property-row">
                                <div class="property-label">${key.charAt(0).toUpperCase() + key.slice(1)}:</div>
                                <div class="property-value">${value}</div>
                             </div>`;
                      count++;
                 }
             }
             if (count === 0) html += '<p>No details available.</p>';
             html += `</div>`;
             return html;
        }

        /** Update overview tab content */
        updateOverviewTab(node) {
             if (!this.elements.overviewTab || !node || !node.properties) return;
             let html = `<div class="property-group"><h4>Overview</h4>`;
             const props = node.properties;
             switch (node.type) {
                 case 'star':
                     html += `
                        <div class="property-row"><div class="property-label">Type:</div><div class="property-value">${props.spectralType || 'N/A'} (${props.stellarEvolution || 'N/A'})</div></div>
                        <div class="property-row"><div class="property-label">Mass:</div><div class="property-value">${props.mass?.toFixed(2) || 'N/A'} M☉</div></div>
                        <div class="property-row"><div class="property-label">Luminosity:</div><div class="property-value">${props.luminosity?.toFixed(2) || 'N/A'} L☉</div></div>
                        <div class="property-row"><div class="property-label">Planets:</div><div class="property-value">${props.planets?.length || 0}</div></div>
                        ${props.isBinarySystem ? `<div class="property-row"><div class="property-label">System:</div><div class="property-value">Binary (${props.companions?.length || 0} comp.)</div></div>` : ''}
                     `;
                     break;
                 case 'planet':
                     html += `
                        <div class="property-row"><div class="property-label">Type:</div><div class="property-value">${props.type || 'N/A'} (${props.size || 'N/A'})</div></div>
                        <div class="property-row"><div class="property-label">Orbit:</div><div class="property-value">${props.orbit?.toFixed(2) || 'N/A'} AU</div></div>
                        <div class="property-row"><div class="property-label">Radius:</div><div class="property-value">${props.radius?.toFixed(2) || 'N/A'} R🜨</div></div>
                        <div class="property-row"><div class="property-label">Habitability:</div><div class="property-value">${props.habitability?.toFixed(0) || 'N/A'}%</div></div>
                        <div class="property-row"><div class="property-label">Civilization:</div><div class="property-value">${props.civilization?.name || 'None'}</div></div>
                        <div class="property-row"><div class="property-label">Moons:</div><div class="property-value">${props.moons || 0}</div></div>
                    `;
                     break;
                 case 'civilization':
                     html += `
                        <div class="property-row"><div class="property-label">Government:</div><div class="property-value">${props.government || 'N/A'}</div></div>
                        <div class="property-row"><div class="property-label">Tech Level:</div><div class="property-value">${props.technologicalLevel || 'N/A'}</div></div>
                        <div class="property-row"><div class="property-label">Age:</div><div class="property-value">${props.age || 'N/A'} kyr</div></div>
                        <div class="property-row"><div class="property-label">Home Planet:</div><div class="property-value">${props.homePlanet?.name || 'N/A'}</div></div>
                        <div class="property-row"><div class="property-label">Colonies:</div><div class="property-value">${(props.planets?.length || 1) - 1}</div></div>
                     `;
                     break;
                 default: // Fallback for companion stars, megastructures etc.
                     html += this.generateHtmlForProperties(props, "Overview");
                     break;
             }
             html += `</div>`;
             this.elements.overviewTab.innerHTML = html;
         }

        /** Update details tab content */
        updateDetailsTab(node) {
            if (!this.elements.detailsTab || !node || !node.properties) return;
            let html = this.generateHtmlForProperties(node.properties, "Details"); // Display all simple props

            // Add specific sections based on type
            const props = node.properties;
            if (node.type === 'planet') {
                html += `<div class="property-group"><h4>Environment</h4>
                            <div class="property-row"><div class="property-label">Gravity:</div><div class="property-value">${props.gravity?.toFixed(2) || 'N/A'} g</div></div>
                            <div class="property-row"><div class="property-label">Temperature:</div><div class="property-value">${props.temperature || 'N/A'} K</div></div>
                            <div class="property-row"><div class="property-label">Atmosphere:</div><div class="property-value">${props.atmosphere?.density || 'None'} (${props.atmosphere?.composition?.join(', ') || ''})</div></div>
                            <div class="property-row"><div class="property-label">Water:</div><div class="property-value">${props.water || 'N/A'}</div></div>
                            <div class="property-row"><div class="property-label">Day Length:</div><div class="property-value">${props.day?.toFixed(1) || 'N/A'} hrs</div></div>
                            <div class="property-row"><div class="property-label">Year Length:</div><div class="property-value">${props.year?.toFixed(2) || 'N/A'} Earth Years</div></div>
                            <div class="property-row"><div class="property-label">Features:</div><div class="property-value">${props.specialFeatures?.join(', ') || 'None'}</div></div>
                         </div>`;
                 if (props.artifacts?.length > 0) {
                     html += `<div class="property-group"><h4>Artifacts/Structures</h4>`;
                     props.artifacts.forEach(art => {
                         html += `<p>- ${art.type} (${art.name || art.purpose || 'details unknown'})</p>`;
                     });
                     html += `</div>`;
                 }
            } else if (node.type === 'civilization') {
                 html += `<div class="property-group"><h4>Society</h4>
                            <div class="property-row"><div class="property-label">Traits:</div><div class="property-value">${props.traits?.join(', ') || 'N/A'}</div></div>
                            <div class="property-row"><div class="property-label">Expansion:</div><div class="property-value">${props.expansionPolicy || 'N/A'}</div></div>
                          </div>`;
                 if (props.specializations && Object.keys(props.specializations).length > 0) {
                     html += `<div class="property-group"><h4>Specializations</h4>`;
                     Object.entries(props.specializations).forEach(([spec, level]) => {
                         html += `<div class="property-row"><div class="property-label">${spec}:</div><div class="property-value">Level ${level}</div></div>`;
                     });
                     html += `</div>`;
                 }
                 if (props.relationships && Object.keys(props.relationships).length > 0) {
                    html += `<div class="property-group"><h4>Relationships</h4>`;
                     // Need universe reference to get names from IDs
                     const civNameMap = this.currentUniverse?.civilizations?.reduce((map, c) => { map[c.id] = c.name; return map; }, {}) || {};
                     Object.entries(props.relationships).forEach(([otherCivId, status]) => {
                        const otherCivName = civNameMap[otherCivId] || otherCivId; // Show name if found, else ID
                         html += `<div class="property-row"><div class="property-label">${otherCivName}:</div><div class="property-value">${status}</div></div>`;
                     });
                     html += `</div>`;
                 }
            } else if (node.type === 'star') {
                 html += `<div class="property-group"><h4>Star Data</h4>
                            <div class="property-row"><div class="property-label">Temperature:</div><div class="property-value">${props.temperature || 'N/A'} K</div></div>
                            <div class="property-row"><div class="property-label">Age:</div><div class="property-value">${props.age?.toFixed(2) || 'N/A'} Gyr</div></div>
                            <div class="property-row"><div class="property-label">Rotation:</div><div class="property-value">${props.rotation?.toFixed(1) || 'N/A'} days</div></div>
                            <div class="property-row"><div class="property-label">Features:</div><div class="property-value">${props.specialFeatures?.join(', ') || 'None'}</div></div>
                          </div>`;
                 if (props.isBinarySystem && props.companions?.length > 0) {
                      html += `<div class="property-group"><h4>Companions</h4>`;
                      props.companions.forEach((comp, i) => {
                          html += `<p><b>Companion ${i+1}:</b> ${comp.spectralType}-Type, Mass: ${comp.mass?.toFixed(2)} M☉, Orbit: ${comp.orbitDistance?.toFixed(1)} AU</p>`;
                      });
                      html += `</div>`;
                 }
            }

            this.elements.detailsTab.innerHTML = html;
        }

	/** Update description tab content (requires descriptions module) */
        updateDescriptionTab(node) {
             if (!this.elements.descriptionTab || !node || node.type !== 'civilization') return;

             let description = "Loading description...";
             // Access description generator from the correct scope
             const generator = window.GalaxyDescriptions?.generateCivilizationDescription; // Use optional chaining

             // *** ADD THIS LOG ***
             console.log(`Updating description for ${node.name}. Generator found: ${!!generator}`);

             if (this.loadedModules.descriptions && generator) {
                 try {
                      description = generator(node.properties); // Pass the civilization properties object
                 } catch (e) {
                     console.error("Error generating description:", e);
                     description = "Error generating description.";
                 }
             } else if (node.properties?.getDescription) { // Check for fallback method
                 console.log(`Description generator not found or module not loaded, trying fallback getDescription...`);
                 try {
                     description = node.properties.getDescription(); // Use basic fallback if available
                 } catch (e) {
                     console.error("Error in fallback getDescription:", e);
                     description = "Error in fallback description method.";
                 }
             } else {
                 description = "Description module not loaded or generator function unavailable.";
             }

             this.elements.descriptionTab.innerHTML = `
                <div class="property-group">
                    <h4>Description</h4>
                    <div class="species-description">${description}</div>
                </div>
            `;
         }

        /** Update data pane with universe stats */
        updateDataPane() {
            if (!this.elements.universeData || !this.currentUniverse) return;
            const universe = this.currentUniverse;
            const metadata = universe.metadata || {};

            let html = `
                <div class="property-group">
                    <h4>Galaxy Stats</h4>
                    <div class="property-row"><div class="property-label">Type:</div><div class="property-value">${metadata.galaxyType || 'N/A'}</div></div>
                    <div class="property-row"><div class="property-label">Stars:</div><div class="property-value">${metadata.starCount || 0}</div></div>
                    <div class="property-row"><div class="property-label">Planets:</div><div class="property-value">${metadata.planetCount || 0}</div></div>
                    <div class="property-row"><div class="property-label">Habitable:</div><div class="property-value">${metadata.habitablePlanets || 0}</div></div>
                    <div class="property-row"><div class="property-label">Civilizations:</div><div class="property-value">${metadata.civilizationCount || 0}</div></div>
                    <div class="property-row"><div class="property-label">Generated:</div><div class="property-value">${metadata.generatedDate ? new Date(metadata.generatedDate).toLocaleString() : 'N/A'}</div></div>
                </div>`;
            this.elements.universeData.innerHTML = html;
        }

        /** Helper to trigger file download */
        downloadData(filename, content, mimeType) {
            try {
                const blob = new Blob([content], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error("Download failed:", error);
                alert("Failed to initiate download.");
            }
        }

        /** Save galaxy data to CSV */
        saveToCSV() {
             this.loadOptionalModule('export', () => {
                 // Access export function from correct scope
                 const exporter = window.GalaxyExport?.exportToCSV;
                 if (!this.currentUniverse || !exporter) {
                    alert("Universe data or export function not available."); return;
                 }
                 try {
                     const csvData = exporter(this.currentUniverse);
                     this.downloadData('galaxy_export.csv', csvData, 'text/csv;charset=utf-8;');
                 } catch (error) { console.error("Error exporting CSV:", error); alert(`CSV Export Error: ${error.message}`); }
             });
        }

        /** Save galaxy data to JSON */
        saveToJSON() {
             this.loadOptionalModule('export', () => {
                 // Access export function from correct scope
                 const exporter = window.GalaxyExport?.exportToJSON;
                 if (!this.currentUniverse || !exporter) {
                     alert("Universe data or export function not available."); return;
                 }
                 try {
                     const jsonData = exporter(this.currentUniverse, true); // Pretty print
                     this.downloadData('galaxy_export.json', jsonData, 'application/json;charset=utf-8;');
                 } catch (error) { console.error("Error exporting JSON:", error); alert(`JSON Export Error: ${error.message}`); }
             });
        }

    } // End GalaxyUIController Class

    // --- Initialize UI ---
    window.addEventListener('DOMContentLoaded', () => {
        console.log("DOM loaded, creating UI Controller instance.");
        // Create and initialize the UI controller instance, attaching it to window for potential debugging
        window.galaxyUI = new GalaxyUIController();
        window.galaxyUI.init();
    });

    console.log("galaxy-ui.js loaded and controller defined.");

} // End dependency check block