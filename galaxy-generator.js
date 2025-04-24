/**
 * Galaxy Generator - Universe Generation Module
 * Handles the generation of stars, planets, civilizations and artifacts
 */

// Log module loading for debugging
console.log("Loading galaxy-generator.js");

// Check dependencies before proceeding
if (!window.GalaxyCore || !window.GalaxyClasses) {
    console.error("galaxy-generator.js Error: Required dependencies (GalaxyCore or GalaxyClasses) not found!");
    // Don't proceed if core dependencies are missing
    // throw new Error("galaxy-generator.js Error: Required dependencies missing!");
} else {
    // Dependencies seem available, proceed to define functions

    /**
     * Generates a test universe with minimal objects
     * @param {Function} progressCallback - Called with progress updates
     * @return {Object} A simple test universe or null on error
     */
    function generateTestUniverse(progressCallback) {
        console.log("Generating test universe...");
        // Access dependencies inside the function
        const { Star, Planet, Civilization } = window.GalaxyClasses;

        // Check if classes are actually available
        if (!Star || !Planet || !Civilization) {
            console.error("Cannot generate test universe: Core classes missing.");
            if (progressCallback) progressCallback(100, "Error: Missing classes!");
            return null;
        }

        if (progressCallback) progressCallback(10, "Creating test universe...");

        const universe = {
            stars: [],
            civilizations: [],
            metadata: { galaxyType: 'test', generatedDate: new Date().toISOString() }
        };

        for (let i = 0; i < 5; i++) {
            try {
                const star = new Star('test', 0.5);
                if (!star.isValid) continue; // Skip if star creation failed

                star.planets = [new Planet(star, 0)];
                if (!star.planets[0].isValid) star.planets = []; // Remove invalid planet

                universe.stars.push(star);
                if (progressCallback) progressCallback(20 + (i * 10), `Created test star ${i+1}/5`);
            } catch (error) {
                console.error(`Error creating test star ${i}:`, error);
            }
        }

        try {
            const firstValidStar = universe.stars.find(s => s.planets.length > 0);
            if (firstValidStar) {
                const planet = firstValidStar.planets[0];
                const civ = new Civilization(planet);
                if (civ.isValid) {
                    planet.civilization = civ; // Link planet back to civ
                    universe.civilizations.push(civ);
                }
            }
        } catch (error) {
            console.error("Error creating test civilization:", error);
        }

        if (progressCallback) progressCallback(100, "Test universe created!");
        console.log("Test universe generated successfully:", universe);
        return universe;
    }


    /**
     * Generates a universe with stars, planets, civilizations, and artifacts
     * @param {Object} options - Generation options
     * @param {Function} progressCallback - Called with progress updates
     * @return {Promise<Object|null>} Promise resolving to the generated universe or null on critical error
     */
    function generateUniverse(options, progressCallback) {
        // Access dependencies inside the function
        const { LIMITS, processBatched, calculate3DDistance } = window.GalaxyCore;
        const { Star, Planet, Civilization, Artifact } = window.GalaxyClasses;

        // Check if classes are actually available
        if (!Star || !Planet || !Civilization || !Artifact) {
             console.error("Cannot generate universe: Core classes missing.");
             if (progressCallback) progressCallback(100, "Error: Missing classes!");
             return Promise.resolve(null); // Return a resolved promise with null
        }
        if (!processBatched || !calculate3DDistance) {
             console.error("Cannot generate universe: Core utilities missing.");
             if (progressCallback) progressCallback(100, "Error: Missing utilities!");
             return Promise.resolve(null);
        }


        return new Promise((resolve, reject) => {
            try {
                console.log("Starting universe generation with options:", options);
                const {
                    galaxyType = 'spiral',
                    starCount = 100,
                    civProbability = 0.1
                } = options;

                const actualStarCount = Math.min(starCount, LIMITS.MAX_STARS);
                const universe = {
                    stars: [],
                    civilizations: [],
                    metadata: { galaxyType, generatedDate: new Date().toISOString() }
                };
                let progress = 0;

                function updateProgress(increment, message) {
                    progress += increment;
                    if (progressCallback) {
                        // Ensure progress doesn't exceed 99 until final step
                        progressCallback(Math.min(progress, 99), message);
                    }
                }

                function step1_generateStars() {
                    updateProgress(5, "Creating stars...");
                    const starsToGenerate = new Array(actualStarCount).fill(null);
                    processBatched(
                        starsToGenerate,
                        (_, index) => {
                            try {
                                const distanceFromCenter = Math.random() * 0.9 + 0.1;
                                const newStar = new Star(galaxyType, distanceFromCenter);
                                if (newStar.isValid) { // Only add valid stars
                                     universe.stars.push(newStar);
                                }
                            } catch (error) { console.error(`Error creating star ${index}:`, error); }
                        },
                        LIMITS.BATCH_SIZE,
                        (percentComplete) => {
                             // Allocate 20% of progress bar to star generation
                            updateProgress(0.2 * (percentComplete / 100) * 100, `Creating stars: ${Math.floor(percentComplete)}%`);
                        },
                        step2_generatePlanets
                    );
                }

                function step2_generatePlanets() {
                    updateProgress(5, "Creating planetary systems...");
                    processBatched(
                        universe.stars,
                        (star, index) => {
                            try {
                                const planetCount = star.generatePlanetsCount();
                                for (let i = 0; i < planetCount; i++) {
                                    const newPlanet = new Planet(star, i);
                                     if (newPlanet.isValid) { // Only add valid planets
                                        star.planets.push(newPlanet);
                                     }
                                }
                            } catch (error) { console.error(`Error creating planets for star ${star.name}:`, error); }
                        },
                        LIMITS.BATCH_SIZE,
                         (percentComplete) => {
                             // Allocate 30% of progress bar to planet generation
                             updateProgress(0.3 * (percentComplete / 100) * 100, `Creating planets: ${Math.floor(percentComplete)}%`);
                        },
                        step3_createCivilizations
                    );
                }

                function step3_createCivilizations() {
                    updateProgress(5, "Identifying habitable planets...");
                    const habitablePlanets = [];
                    universe.stars.forEach(star => {
                        star.planets.forEach(planet => {
                             // Only consider planets not already assigned a civ (important if re-running)
                            if (planet.habitability > 60 && !planet.civilization) {
                                habitablePlanets.push(planet);
                            }
                        });
                    });
                    habitablePlanets.sort((a, b) => b.habitability - a.habitability);

                    const maxCivilizations = Math.min(
                        Math.max(1, Math.ceil(habitablePlanets.length * civProbability)),
                        LIMITS.MAX_CIVILIZATIONS
                    );
                    const potentialCivPlanets = habitablePlanets.slice(0, maxCivilizations * 2); // Consider slightly more planets than needed

                    updateProgress(5, "Seeding civilizations...");
                     let civsCreated = 0;
                     potentialCivPlanets.forEach(planet => {
                         if (civsCreated >= maxCivilizations) return;
                         if (Math.random() < civProbability && !planet.civilization) {
                            try {
                                const civ = new Civilization(planet);
                                if (civ.isValid) { // Check if civ creation was successful
                                    planet.civilization = civ; // Link planet back to civ
                                    universe.civilizations.push(civ);
                                    civsCreated++;
                                }
                            } catch (error) { console.error(`Error creating civilization on ${planet.name}:`, error); }
                         }
                     });
                     // Allocate 10% progress here
                     updateProgress(10, `Created ${civsCreated} civilizations`);
                    step4_establishRelationships();
                }

                function step4_establishRelationships() {
                    updateProgress(5, "Establishing relationships...");
                    const civs = universe.civilizations;
                    for (let i = 0; i < civs.length; i++) {
                        for (let j = i + 1; j < civs.length; j++) {
                            try {
                                civs[i].establishRelationship(civs[j]);
                            } catch (error) { console.error(`Error establishing relationship between ${civs[i].name} and ${civs[j].name}:`, error); }
                        }
                    }
                    // Allocate 5% progress
                    updateProgress(5, "Relationships established");
                    step5_expandCivilizations();
                }

                function step5_expandCivilizations() {
                    updateProgress(5, "Expanding civilizations...");
                     processBatched(
                        universe.civilizations,
                        (civ) => {
                            if (!civ.homePlanet?.star) return; // Skip civ if homeworld invalid
                            const homeStarCoords = civ.homePlanet.star.coordinates;
                             const expansionRange = 100 + (civ.technologicalLevel * 20); // Example range

                            universe.stars.forEach(star => {
                                if (star === civ.homePlanet.star || !star.coordinates) return; // Skip home system or invalid star

                                const distance = calculate3DDistance(star.coordinates, homeStarCoords);

                                if (distance < expansionRange) {
                                    star.planets.forEach(planet => {
                                         // Check if expansion is possible (e.g., based on habitability, existing civ)
                                        const expansionChance = planet.habitability > 50 ? 0.2 : 0.05; // Lower chance
                                         if (Math.random() < expansionChance && !planet.civilization) {
                                            try {
                                                civ.expandTo(planet);
                                            } catch(error) { console.error(`Error expanding ${civ.name} to ${planet.name}:`, error); }
                                         }
                                    });
                                }
                            });
                        },
                        1, // Process one civ at a time for simplicity
                        (percentComplete) => {
                             // Allocate 15% progress
                             updateProgress(0.15 * (percentComplete / 100) * 100, `Expanding civilizations: ${Math.floor(percentComplete)}%`);
                        },
                        step6_addArtifacts
                    );
                }

                function step6_addArtifacts() {
                    updateProgress(5, "Adding artifacts...");
                    const artifactTypes = ['ancient-ruins', 'derelict-station', 'anomaly'];
                    const artifactCount = Math.floor(actualStarCount * 0.05);
                    const potentialLocations = [];
                    universe.stars.forEach(star => {
                        star.planets.forEach(planet => {
                             // Prefer planets without civs, but allow on colonized if needed
                            if (!planet.civilization || Math.random() < 0.1) {
                                potentialLocations.push(planet);
                            }
                        });
                    });

                     // Shuffle locations for randomness
                     for (let i = potentialLocations.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [potentialLocations[i], potentialLocations[j]] = [potentialLocations[j], potentialLocations[i]];
                    }

                    for (let i = 0; i < artifactCount && i < potentialLocations.length; i++) {
                        try {
                            const location = potentialLocations[i];
                            const artifactType = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
                            const artifact = new Artifact(artifactType, location);
                            if (artifact.isValid) {
                                 // Limit artifacts per planet
                                 if (location.artifacts.length < LIMITS.MAX_ARTIFACTS_PER_PLANET) {
                                    location.artifacts.push(artifact);
                                 }
                            }
                        } catch (error) { console.error(`Error creating artifact ${i}:`, error); }
                    }
                     // Allocate 5% progress
                     updateProgress(5, "Artifacts added");
                    finalize();
                }

                function finalize() {
                    updateProgress(5, "Finalizing galaxy..."); // This brings total close to 100%
                    universe.metadata.starCount = universe.stars.length;
                    universe.metadata.planetCount = universe.stars.reduce((sum, star) => sum + star.planets.length, 0);
                    universe.metadata.civilizationCount = universe.civilizations.length;
                    universe.metadata.habitablePlanets = universe.stars.reduce((sum, star) =>
                        sum + star.planets.filter(p => p.habitability > 60).length, 0);

                    console.log("Universe generation completed:", universe);
                    // Call progress callback one last time for 100%
                     if (progressCallback) progressCallback(100, "Galaxy generated!");
                    resolve(universe); // Resolve the promise with the generated universe
                }

                // Start the generation process
                step1_generateStars();

            } catch (error) {
                console.error("Critical error during universe generation setup:", error);
                if (progressCallback) progressCallback(100, `Error: ${error.message}`);
                reject(error); // Reject the promise on critical error
            }
        });
    }

    /**
     * Processes universe data for visualization
     * @param {Object} universe - The generated universe
     * @return {Object|null} Object containing nodes and links, or null on error
     */
    function processUniverseData(universe) {
        console.log("Processing universe data for visualization...");
         if (!universe || !universe.stars) {
            console.error("Cannot process: Invalid universe data provided.");
            return null;
         }
         // Access core constants/types if needed (e.g., for colors)
         const { SPECTRAL_TYPES, PLANET_TYPES } = window.GalaxyCore;

        try {
            const nodes = [];
            const links = [];

            // Process stars
            universe.stars.forEach(star => {
                 if (!star || !star.id || !star.coordinates) return; // Skip invalid stars

                const starId = star.id;
                let starColor = SPECTRAL_TYPES[star.spectralType]?.color || '#ffffff'; // Get color from core data

                // Modify color based on stellar evolution (more robust checks)
                if (star.stellarEvolution === 'red-giant' || star.stellarEvolution === 'red-supergiant') starColor = '#ff6060';
                else if (star.stellarEvolution === 'white-dwarf') starColor = '#f0f0ff';
                else if (star.stellarEvolution === 'neutron-star') starColor = '#c0ffff';
                else if (star.stellarEvolution === 'black-hole') starColor = '#111111'; // Dark grey, not pure black

                nodes.push({
                    id: starId, name: star.name, type: 'star',
                    val: Math.max(1, (star.mass || 1) * 2), // Node size based on mass
                    color: starColor,
                    x: star.coordinates.x, y: star.coordinates.y, z: star.coordinates.z,
                    properties: star // Keep reference to original object
                });

                // Process binary companions
                star.companions?.forEach((companion, index) => {
                     const companionId = `companion-${star.id}-${index}`;
                     let companionColor = SPECTRAL_TYPES[companion.spectralType]?.color || '#ffffff';
                     const angle = Math.random() * Math.PI * 2;
                     const dist = (companion.orbitDistance || 10) * 0.2; // Scale down binary distance for viz
                     nodes.push({
                        id: companionId, name: `${star.name} Companion ${index + 1}`, type: 'companion-star',
                        val: Math.max(1, (companion.mass || 1) * 2), color: companionColor,
                        x: star.coordinates.x + Math.cos(angle) * dist,
                        y: star.coordinates.y + Math.sin(angle) * dist,
                        z: star.coordinates.z + (Math.random() - 0.5) * dist * 0.5,
                        properties: { ...companion, primary: star } // Include primary star ref
                    });
                    links.push({ source: starId, target: companionId, color: '#aaaaaa', width: 0.1 });
                 });

                // Process planets
                star.planets.forEach(planet => {
                     if (!planet || !planet.id) return; // Skip invalid planets
                    const planetId = planet.id;
                     let planetColor = PLANET_TYPES[planet.type]?.color || '#888888'; // Get color from core data

                    if (planet.civilization) planetColor = '#FF4500'; // Highlight civ planets
                    else if (planet.type === 'terrestrial' && planet.habitability > 60) planetColor = '#00BFFF'; // Highlight habitable

                    // Calculate position relative to star - logarithmic scale for orbit
                    const orbitScale = 8; // Adjust scale factor
                    const angle = Math.random() * Math.PI * 2; // Random position in orbit
                    const orbitRadius = Math.log10(planet.orbit + 1) * orbitScale; // Log scale + offset
                     const planarOffset = (Math.random() - 0.5) * orbitRadius * 0.1; // Slight Z offset for visual separation

                    nodes.push({
                        id: planetId, name: planet.name, type: 'planet',
                        val: Math.max(1, (planet.radius || 1) * 1.5), // Size based on radius
                        color: planetColor,
                        x: star.coordinates.x + Math.cos(angle) * orbitRadius,
                        y: star.coordinates.y + Math.sin(angle) * orbitRadius,
                        z: star.coordinates.z + planarOffset,
                        properties: planet
                    });
                    links.push({ source: starId, target: planetId, color: '#555555', width: 0.1 });

                    // Process significant artifacts on the planet (e.g., megastructures created by civs)
                    planet.artifacts?.forEach((artifact, artifactIndex) => {
                         // Example: Visualize megastructures differently
                         if (artifact.type === 'megastructure') {
                            const megastructureId = `megastructure-${planetId}-${artifactIndex}`;
                            const msAngle = Math.random() * Math.PI * 2;
                             const msRadius = (planet.radius || 1) * 0.5; // Position near planet surface
                             nodes.push({
                                id: megastructureId, name: artifact.name || `Megastructure`, type: 'megastructure',
                                val: 4, color: '#7851A9', // Distinct color/size
                                x: nodes[nodes.length - 1].x + Math.cos(msAngle) * msRadius, // Offset from planet node
                                y: nodes[nodes.length - 1].y + Math.sin(msAngle) * msRadius,
                                z: nodes[nodes.length - 1].z + (Math.random() - 0.5) * msRadius * 0.5,
                                properties: artifact
                             });
                             links.push({ source: planetId, target: megastructureId, color: '#7851A9', width: 0.1, dashed: true });
                         }
                     });
                });
            });

            // Process civilizations (position near home planet)
            universe.civilizations.forEach(civ => {
                 if (!civ || !civ.id || !civ.homePlanet?.id) return; // Skip invalid civs

                const civId = civ.id;
                const homePlanetNode = nodes.find(node => node.id === civ.homePlanet.id);

                if (homePlanetNode) {
                    nodes.push({
                        id: civId, name: civ.name, type: 'civilization',
                        val: 5, color: '#FF4500', // Distinct size/color
                        x: homePlanetNode.x + (Math.random() - 0.5) * 3, // Slightly offset from planet
                        y: homePlanetNode.y + (Math.random() - 0.5) * 3,
                        z: homePlanetNode.z + (Math.random() - 0.5) * 3,
                        properties: civ
                    });
                    // Link civ node to home planet node
                    links.push({ source: civId, target: homePlanetNode.id, color: '#FF4500', width: 0.2 });

                    // Link civ node to other colonized planets
                    civ.planets.forEach(planet => {
                        if (planet.id !== civ.homePlanet.id) {
                            links.push({ source: civId, target: planet.id, color: '#FF8C00', width: 0.1, dashed: true }); // Lighter orange dashed
                        }
                    });

                     // Link civ node to other civ nodes based on relationships
                     Object.entries(civ.relationships).forEach(([otherCivId, relationship]) => {
                         // Only draw link once (e.g., from lower ID to higher ID)
                         if (civId < otherCivId) {
                             let relationshipColor;
                             switch (relationship) {
                                 case 'alliance': relationshipColor = '#2e7d32'; break; // Green
                                 case 'friendly': relationshipColor = '#558b2f'; break; // Light green
                                 case 'neutral': relationshipColor = '#f9a825'; break; // Yellow
                                 case 'tense': relationshipColor = '#e65100'; break; // Orange
                                 case 'hostile': relationshipColor = '#c62828'; break; // Red
                                 default: relationshipColor = '#aaaaaa';
                             }
                             links.push({ source: civId, target: otherCivId, color: relationshipColor, width: 0.3, dashed: true });
                         }
                     });
                } else {
                     console.warn(`Home planet node not found for civilization: ${civ.name}`);
                     // Could place civ node at origin or near home star as fallback
                 }
            });

            console.log(`Processed ${nodes.length} nodes and ${links.length} links.`);
            return { nodes, links };

        } catch (error) {
            console.error("Error processing universe data for visualization:", error);
            return null; // Return null on error
        }
    }

    // Export generator functions onto the window object
    window.GalaxyGenerator = {
        generateTestUniverse,
        generateUniverse,
        processUniverseData
    };

    console.log("galaxy-generator.js loaded successfully");

} // End dependency check block