/**
 * Galaxy Generator - Classes Module
 * Contains core classes for the galaxy generator
 */

// Log module loading for debugging
console.log("Loading galaxy-classes.js");

// Check dependencies - these should be loaded before this script runs
if (!window.GalaxyCore || !window.GalaxyNames) {
    console.error("galaxy-classes.js Error: Required dependencies (GalaxyCore or GalaxyNames) not found!");
    // Attempting to proceed, but constructors might fail.
    // Consider throwing an error to halt execution if dependencies are critical.
    // throw new Error("galaxy-classes.js Error: Required dependencies missing!");
}

// No top-level imports/destructuring

/**
 * Planet class
 */
class Planet {
    constructor(star, index) {
        // DO NOT destructure GalaxyCore/GalaxyNames here. Access directly below.
        try {
            this.id = `planet-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            // Use window.GalaxyNames directly:
            this.name = window.GalaxyNames.generatePlanetName();
            this.star = star;
            this.index = index;
            // Call methods that will use window.GalaxyCore directly:
            this.orbit = this.generateOrbit(index);
            this.size = this.generateSize();
            this.radius = this.calculateRadius();
            this.mass = this.calculateMass();
            this.gravity = this.calculateGravity();
            this.type = this.determinePlanetType(star);
            this.composition = this.generateComposition();
            this.atmosphere = this.generateAtmosphere();
            this.temperature = this.calculateTemperature(star);
            this.water = this.determineWaterContent();
            this.moons = this.generateMoons();
            this.day = this.generateDayLength();
            this.year = this.calculateOrbitalPeriod();
            this.magneticField = this.generateMagneticField();
            this.rings = this.generateRings();
            this.habitability = this.calculateHabitability();
            this.specialFeatures = this.generateSpecialFeatures();
            this.civilization = null; // Reference to Civilization object if inhabited
            this.artifacts = []; // Artifact objects found/placed here
            this.isValid = true; // Assume valid unless error occurs
        } catch (error) {
            console.error("Error creating Planet:", this.name || this.id || 'ID_Error', error);
            this.isValid = false; // Mark as invalid on error
        }
    }

    // Methods using direct window access:
    generateOrbit(index) {
        // Use window.GalaxyCore directly:
        const baseOrbit = 0.4 + 0.3 * Math.pow(2, index);
        const variation = baseOrbit * (Math.random() * 0.3 - 0.15);
        return window.GalaxyCore.roundTo(baseOrbit + variation);
    }

    determinePlanetType(star) {
        if (!star || typeof star.luminosity === 'undefined') return 'rocky'; // Fallback
        const habitableZoneCenter = Math.sqrt(star.luminosity || 1);
        const innerZone = habitableZoneCenter * 0.75;
        const outerZone = habitableZoneCenter * 1.25;
        if (this.orbit < innerZone * 0.5) return Math.random() < 0.7 ? 'molten' : 'rocky';
        if (this.orbit < innerZone) return Math.random() < 0.8 ? 'rocky' : 'terrestrial';
        if (this.orbit <= outerZone) return Math.random() < 0.6 ? 'terrestrial' : 'rocky';
        if (this.orbit < outerZone * 2) {
            if (this.size === 'large' && Math.random() < 0.7) return 'gas-giant';
            return Math.random() < 0.5 ? 'rocky' : 'ice-giant';
        }
        return Math.random() < 0.6 ? (this.size === 'large' ? 'ice-giant' : 'frozen') : 'frozen';
    }

    generateSize() { /* No external dependencies */
        const sizeRoll = Math.random();
        if (sizeRoll < 0.5) return 'small';
        if (sizeRoll < 0.8) return 'medium';
        return 'large';
    }

    calculateRadius() { /* Uses window.GalaxyCore.roundTo */
        let r;
        switch (this.size) {
            case 'small': r = 0.1 + Math.random() * 0.7; break;
            case 'medium': r = 0.7 + Math.random() * 0.9; break;
            case 'large': r = 1.5 + Math.random() * 10; break;
            default: r = 1.0;
        }
        return window.GalaxyCore.roundTo(r);
    }

    calculateMass() { /* Uses window.GalaxyCore.roundTo */
        let densityFactor;
        switch (this.type) {
            case 'gas-giant': densityFactor = 0.3; break;
            case 'ice-giant': densityFactor = 0.6; break;
            case 'molten': densityFactor = 1.3; break;
            case 'terrestrial': densityFactor = 1.0; break;
            case 'rocky': densityFactor = 1.2; break;
            case 'frozen': densityFactor = 0.8; break;
            default: densityFactor = 1.0;
        }
        return window.GalaxyCore.roundTo(Math.pow(this.radius || 1, 3) * densityFactor);
    }

    calculateGravity() { /* Uses window.GalaxyCore.roundTo */
        const radiusSquared = Math.pow(this.radius || 1, 2);
        return window.GalaxyCore.roundTo(this.mass / (radiusSquared || 1));
    }

    generateComposition() { /* Uses window.GalaxyCore.PLANET_TYPES */
        const planetTypeData = window.GalaxyCore.PLANET_TYPES[this.type] || window.GalaxyCore.PLANET_TYPES['rocky'];
        return {
            primary: planetTypeData.compositionPrimary,
            secondary: planetTypeData.compositionSecondary,
            trace: planetTypeData.compositionTrace
        };
    }

    generateAtmosphere() { /* No external dependencies */
        if (this.type === 'gas-giant' || this.type === 'ice-giant') return { density: 'extreme', composition: this.type === 'gas-giant' ? ['hydrogen', 'helium'] : ['methane', 'ammonia', 'water vapor'] };
        if (this.type === 'molten') return { density: Math.random() < 0.5 ? 'thin' : 'none', composition: ['sulfur dioxide', 'carbon dioxide'] };
        if (this.type === 'terrestrial') return { density: Math.random() < 0.7 ? 'moderate' : 'thin', composition: Math.random() < 0.5 ? ['nitrogen', 'oxygen'] : ['carbon dioxide', 'nitrogen'] };
        if (this.type === 'frozen') return { density: 'thin', composition: ['nitrogen', 'methane'] };
        return { density: Math.random() < 0.3 ? 'thin' : 'none', composition: ['carbon dioxide'] }; // Rocky default
    }

    calculateTemperature(star) { /* No external dependencies */
        if (!star || typeof star.luminosity === 'undefined') return 100; // Fallback temp
        const baseTemp = 278 * Math.sqrt(star.luminosity || 1) / Math.sqrt(this.orbit || 0.1);
        const variation = 30 * (Math.random() - 0.5);
        const greenhouseEffect = this.atmosphere && this.atmosphere.density !== 'none' && this.atmosphere.composition?.includes('carbon dioxide') ? 50 : (this.atmosphere?.density === 'moderate' || this.atmosphere?.density === 'extreme') ? 20 : 0;
        return Math.floor(baseTemp + variation + greenhouseEffect);
    }

    determineWaterContent() { /* No external dependencies */
        if (this.type === 'terrestrial' || this.type === 'ice-giant' || this.type === 'frozen') {
            if (this.temperature > 373) return 'vapor';
            if (this.temperature > 273) return Math.random() < 0.7 ? 'liquid' : 'ice';
            return 'ice';
        }
        if (this.type === 'gas-giant' && this.temperature < 300) return 'vapor-clouds';
        return 'none';
    }

    generateDayLength() { /* Uses window.GalaxyCore.roundTo */
        let hours;
        if (this.type === 'terrestrial' || this.type === 'rocky') hours = 5 + Math.random() * 70;
        else if (this.type === 'gas-giant' || this.type === 'ice-giant') hours = 5 + Math.random() * 20;
        else hours = 10 + Math.random() * 40;
        return window.GalaxyCore.roundTo(hours, 1);
    }

    calculateOrbitalPeriod() { /* Uses window.GalaxyCore.roundTo */
        return window.GalaxyCore.roundTo(Math.sqrt(Math.pow(this.orbit || 0.1, 3)));
    }

    generateMoons() { /* No external dependencies */
        let maxMoons = 0;
        if (this.type === 'gas-giant') maxMoons = 30;
        else if (this.type === 'ice-giant') maxMoons = 15;
        else if (this.type === 'terrestrial') maxMoons = 3;
        else maxMoons = 2;
        if (this.size === 'small') maxMoons = Math.max(1, Math.floor(maxMoons / 3));
        if (this.size === 'medium') maxMoons = Math.max(1, Math.floor(maxMoons / 2));
        return Math.floor(Math.random() * Math.random() * maxMoons);
    }

    generateMagneticField() { /* No external dependencies */
        if (this.type === 'gas-giant' || this.type === 'ice-giant') return Math.random() < 0.9;
        if (this.type === 'terrestrial') return Math.random() < 0.6;
        return Math.random() < 0.3;
    }

    generateRings() { /* No external dependencies */
        if (this.type === 'gas-giant') return Math.random() < 0.4;
        if (this.type === 'ice-giant') return Math.random() < 0.3;
        return Math.random() < 0.05;
    }

    calculateHabitability() { /* No external dependencies */
        if (this.type !== 'terrestrial') return 0;
        let score = 0;
        if (this.temperature > 273 && this.temperature < 323) score += 30;
        else if (this.temperature > 223 && this.temperature < 373) score += 15;
        if (this.water === 'liquid') score += 25;
        if (this.atmosphere && this.atmosphere.density === 'moderate') {
            score += 20;
            if (this.atmosphere.composition?.includes('oxygen')) score += 15;
        }
        if (this.magneticField) score += 10;
        return Math.min(score, 100);
    }

    generateSpecialFeatures() { /* No external dependencies */
        const features = [];
        if (this.type === 'terrestrial') {
            if (Math.random() < 0.3) features.push('active-volcanoes');
            if (Math.random() < 0.4 && this.water === 'liquid') features.push('oceans');
            if (Math.random() < 0.3) features.push('plate-tectonics');
        }
        if (this.type === 'gas-giant') {
            if (Math.random() < 0.5) features.push('storms');
            if (Math.random() < 0.3) features.push('great-spot');
        }
        if (Math.random() < 0.1) features.push('asteroid-impacts');
        if (Math.random() < 0.05) features.push('unusual-orbit');
        return features;
    }
}

/**
 * Star class
 */
class Star {
    constructor(galaxyType, distanceFromCenter) {
        // DO NOT destructure GalaxyCore/GalaxyNames here. Access directly below.
        try {
            this.id = `star-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            // Use window.GalaxyNames directly:
            this.name = window.GalaxyNames.generateStarName();
            // Call methods that use window.GalaxyCore directly:
            this.mass = this.generateMass();
            this.luminosity = this.calculateLuminosity();
            this.temperature = this.calculateTemperature();
            this.size = this.determineSize();
            this.spectralType = this.determineSpectralType();
            this.age = this.generateAge();
            this.rotation = this.generateRotation();
            // *** Call updated generateCoordinates ***
            this.coordinates = this.generateCoordinates(galaxyType, distanceFromCenter);
            this.isBinarySystem = this.determineIfBinary();
            this.companions = this.isBinarySystem ? this.generateCompanions() : [];
            this.stellarEvolution = this.calculateEvolution();
            this.planets = []; // Populated later
            this.specialFeatures = this.generateSpecialFeatures();
            this.isValid = true; // Assume valid unless error occurs
        } catch (error) {
            console.error("Error creating Star:", this.name || this.id || 'ID_Error', error);
            this.isValid = false; // Mark as invalid on error
        }
    }

    // --- *** UPDATED COORDINATE METHODS START *** ---

    generateCoordinates(galaxyType, distanceFromCenter) {
        // Use direct access to window.GalaxyCore
        const { getRandomNumber } = window.GalaxyCore;
        // Increase overall scale for better visual separation
        const GALAXY_SCALE = 1500; // Increased scale factor (was effectively ~500 before)

        try {
            switch (galaxyType) {
                case 'spiral':
                    // Pass the scale to the specific generator
                    return this.generateSpiralCoordinates(distanceFromCenter, GALAXY_SCALE);
                case 'elliptical':
                    // Pass the scale to the specific generator
                    return this.generateEllipticalCoordinates(distanceFromCenter, GALAXY_SCALE);
                case 'irregular':
                case 'test': // Keep test small
                default:
                    const scale = (galaxyType === 'test' ? 300 : GALAXY_SCALE * 0.6); // Smaller scale for irregular/test
                    return {
                        x: getRandomNumber(-scale, scale),
                        y: getRandomNumber(-scale, scale),
                        z: getRandomNumber(-scale * 0.3, scale * 0.3) // Make irregular slightly flatter too
                    };
            }
        } catch (error) {
            console.error("Error generating coordinates:", error);
            return { x: 0, y: 0, z: 0 }; // Fallback
        }
    }

    generateSpiralCoordinates(distanceFromCenter, galaxyScale) {
        // Use direct access to window.GalaxyCore
        const { getRandomNumber } = window.GalaxyCore;

        const armCount = getRandomNumber(2, 5, true); // 2-4 arms
        const arm = Math.floor(Math.random() * armCount);
        const armOffset = (2 * Math.PI * arm) / armCount; // Base angle for this arm
        const armTightness = 0.2 + Math.random() * 0.2; // How tightly wound the arms are
        const armWidth = 0.3 / armCount; // How wide the arms are angularly

        // Core bulge properties
        const coreRadius = galaxyScale * 0.15;
        const isCore = Math.random() < 0.2; // 20% chance to be in the core bulge

        let distance, theta, z;

        if (isCore) {
            // Generate coordinates within the core bulge (more spherical)
            const r = Math.random() * coreRadius; // Distance from center within core
             const phi = Math.random() * Math.PI; // Angle from Z axis
             theta = Math.random() * 2 * Math.PI; // Angle around Z axis
             distance = r * Math.sin(phi);
             z = r * Math.cos(phi) * 0.7; // Slightly flattened core

        } else {
            // Generate coordinates within the spiral arms (disk)
            // Bias distance towards outside, less dense in center disk area
             distance = coreRadius + (galaxyScale - coreRadius) * Math.sqrt(distanceFromCenter); // Use sqrt for density falloff

            // Base angle on distance and arm
            const baseTheta = armOffset + (distance * armTightness);

            // Add offset to place star *within* the arm's angular width
            const angleOffset = (Math.random() - 0.5) * armWidth;

            theta = baseTheta + angleOffset;

            // Make the disk very flat, with slight vertical variance
             const zVariance = galaxyScale * 0.03 * (1 - Math.pow(distance / galaxyScale, 2)); // Thinner towards edge
             z = getRandomNumber(-zVariance, zVariance);
        }

         // Add slight fuzziness to arm positions, less than before
         const fuzziness = galaxyScale * 0.02; // Much smaller fuzz factor
        return {
            x: distance * Math.cos(theta) + getRandomNumber(-fuzziness, fuzziness),
            y: distance * Math.sin(theta) + getRandomNumber(-fuzziness, fuzziness),
            z: z + getRandomNumber(-fuzziness * 0.5, fuzziness * 0.5) // Less Z fuzz
        };
    }

    generateEllipticalCoordinates(distanceFromCenter, galaxyScale) {
        // Use direct access to window.GalaxyCore
        const { getRandomNumber } = window.GalaxyCore;

        // Use Gaussian distribution for more realistic density falloff from center
        // Generate two random numbers for Box-Muller transform
        const u1 = Math.random();
        const u2 = Math.random();
        const randStdNormal1 = Math.sqrt(-2.0 * Math.log(u1 || 1e-9)) * Math.cos(2.0 * Math.PI * u2); // Avoid log(0)
        const randStdNormal2 = Math.sqrt(-2.0 * Math.log(u1 || 1e-9)) * Math.sin(2.0 * Math.PI * u2);
        const randStdNormal3 = Math.sqrt(-2.0 * Math.log(Math.random() || 1e-9)) * Math.cos(2.0 * Math.PI * Math.random()); // Third independent normal

        // Define the radii of the ellipsoid axes (make them more distinct)
        const a = galaxyScale * 0.5;      // Longest radius (e.g., along x)
        const b = a * getRandomNumber(0.5, 0.7); // Medium radius (e.g., along y) - More flattened
        const c = b * getRandomNumber(0.6, 0.8); // Shortest radius (e.g., along z) - Even more flattened

        // Scale the normally distributed points by the axis radii
        // This creates an elliptical distribution dense at the center
        const x = randStdNormal1 * a;
        const y = randStdNormal2 * b;
        const z = randStdNormal3 * c;

        // Apply slight random rotation to the ellipsoid orientation (optional)
        // This involves matrix multiplication or quaternions - skipping for simplicity here.
        // Simple approach: Could randomly swap axes sometimes, but let's keep it aligned for now.

        return { x, y, z };
    }

    // --- *** END UPDATED COORDINATE METHODS *** ---


    // --- Other Star methods (Unchanged from previous version) ---
    generateMass() { /* Uses window.GalaxyCore.getRandomNumber, window.GalaxyCore.roundTo */
        const randomValue = Math.random();
        let mass;
        if (randomValue < 0.7) mass = window.GalaxyCore.getRandomNumber(0.08, 0.5);
        else if (randomValue < 0.9) mass = window.GalaxyCore.getRandomNumber(0.5, 1.5);
        else if (randomValue < 0.98) mass = window.GalaxyCore.getRandomNumber(1.5, 10);
        else mass = window.GalaxyCore.getRandomNumber(10, 50);
        return window.GalaxyCore.roundTo(mass);
    }

    calculateLuminosity() { /* Uses window.GalaxyCore.roundTo */
        return window.GalaxyCore.roundTo(Math.pow(this.mass || 1, 3.5));
    }

    calculateTemperature() { /* No external dependencies */
        const baseTemp = 2000 + ((this.mass || 1) * 5000);
        return Math.floor(Math.min(baseTemp, 50000));
    }

    determineSpectralType() { /* No external dependencies */
        if (this.temperature > 30000) return 'O'; if (this.temperature > 10000) return 'B';
        if (this.temperature > 7500) return 'A'; if (this.temperature > 6000) return 'F';
        if (this.temperature > 5000) return 'G'; if (this.temperature > 3500) return 'K';
        return 'M';
    }

    determineSize() { /* No external dependencies */
        if (this.mass > 20) return 'supergiant'; if (this.mass > 5) return 'giant';
        if (this.mass < 0.5) return 'dwarf'; return 'medium';
    }

    generateAge() { /* Uses window.GalaxyCore.getRandomNumber, window.GalaxyCore.roundTo */
        const maxPossibleAge = Math.min(13.8, 10 / Math.pow(this.mass || 0.1, 2.5)); // Avoid division by zero if mass is 0
        return window.GalaxyCore.roundTo(window.GalaxyCore.getRandomNumber(0.01, maxPossibleAge || 13.8));
    }

    generateRotation() { /* Uses window.GalaxyCore.getRandomNumber, window.GalaxyCore.roundTo */
        return window.GalaxyCore.roundTo(window.GalaxyCore.getRandomNumber(0.1, 100));
    }

    determineIfBinary() { /* No external dependencies */ return Math.random() < 0.5; }

    generateCompanions() { /* Uses window.GalaxyCore.roundTo */
        const companions = []; const companionCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < companionCount; i++) {
            const companionMass = (this.mass || 1) * (0.3 + Math.random() * 0.7);
            const orbitDistance = 10 + Math.random() * 100;
            const orbitalPeriod = Math.sqrt(Math.pow(orbitDistance, 3) / ((this.mass || 1) + companionMass));
            companions.push({
                mass: window.GalaxyCore.roundTo(companionMass), spectralType: this.determineCompanionSpectralType(companionMass),
                orbitDistance: window.GalaxyCore.roundTo(orbitDistance), orbitalPeriod: window.GalaxyCore.roundTo(orbitalPeriod)
            });
        }
        return companions;
    }

    determineCompanionSpectralType(mass) { /* No external dependencies */
        if (mass > 16) return 'O'; if (mass > 2.1) return 'B'; if (mass > 1.4) return 'A';
        if (mass > 1.04) return 'F'; if (mass > 0.8) return 'G'; if (mass > 0.45) return 'K'; return 'M';
    }

    calculateEvolution() { /* No external dependencies */
        const lifespan = 10 / Math.pow(this.mass || 0.1, 2.5); // Avoid division by zero
        const lifePercentage = this.age / (lifespan || 0.01);
        if (lifePercentage < 0.1) return 'protostar'; if (lifePercentage < 0.9) return 'main-sequence';
        if (this.mass > 8) {
            if (lifePercentage < 0.95) return 'red-supergiant'; if (lifePercentage < 0.98) return 'supernova-imminent';
            return this.mass > 20 ? 'black-hole' : 'neutron-star';
        } else {
            if (lifePercentage < 0.95) return 'red-giant'; return 'white-dwarf';
        }
    }

    generatePlanetsCount() { /* Uses window.GalaxyCore.LIMITS */
        let planetCount = 0;
        // Ensure window.GalaxyCore and LIMITS exist before accessing MAX_PLANETS_PER_STAR
        const maxPlanets = window.GalaxyCore?.LIMITS?.MAX_PLANETS_PER_STAR ?? 6; // Use default if undefined
        if (this.stellarEvolution === 'main-sequence') {
            if (this.spectralType === 'M') planetCount = Math.floor(Math.random() * 5) + 1;
            else if (this.spectralType === 'G' || this.spectralType === 'K') planetCount = Math.floor(Math.random() * 6) + 2;
            else planetCount = Math.floor(Math.random() * 4) + 1;
        } else if (this.stellarEvolution === 'protostar') planetCount = Math.floor(Math.random() * 3) + 1;
        else if (this.stellarEvolution === 'red-giant' || this.stellarEvolution === 'red-supergiant') planetCount = Math.floor(Math.random() * 3);
        else planetCount = Math.floor(Math.random() * 2);
        if (this.isBinarySystem) planetCount = Math.floor(planetCount * 0.6);
        return Math.min(planetCount, maxPlanets);
    }


    generateSpecialFeatures() { /* No external dependencies */
        const features = [];
        if (Math.random() < 0.05) features.push('pulsar'); if (Math.random() < 0.02) features.push('magnetar');
        if (Math.random() < 0.1) features.push('variable'); if (Math.random() < 0.03) features.push('nova');
        if (this.stellarEvolution === 'red-giant' || this.stellarEvolution === 'red-supergiant') features.push('stellar-wind');
        if (this.stellarEvolution === 'supernova-imminent') features.push('unstable');
        if (this.spectralType === 'O' || this.spectralType === 'B') features.push('intense-radiation');
        return features;
    }
}

/**
 * Civilization class
 */
class Civilization {
     constructor(homePlanet) {
        // DO NOT destructure GalaxyCore/GalaxyNames here. Access directly below.
        try {
            this.id = `civ-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            // Use window.GalaxyNames directly:
            this.name = window.GalaxyNames.generateCivilizationName();
            this.homePlanet = homePlanet; // Planet object
            this.planets = homePlanet ? [homePlanet] : []; // Array of Planet objects
            // Call methods that use window.GalaxyCore/Names directly:
            this.technologicalLevel = this.generateTechLevel();
            this.age = this.generateAge();
            this.traits = this.generateTraits();
            this.specializations = this.generateSpecializations();
            this.government = this.generateGovernment();
            this.expansionPolicy = this.generateExpansionPolicy();
            this.relationships = {}; // Key: other civ ID, Value: relationship string
            this.artifacts = this.generateArtifacts(); // Civ-specific artifacts (megastructures, etc.)
            this.description = null;
            this.isValid = true; // Assume valid unless error occurs
        } catch (error) {
            console.error("Error creating Civilization:", this.name || this.id || 'ID_Error', error);
            this.isValid = false; // Mark as invalid on error
        }
    }

    // Methods using direct window access:
    generateTechLevel() { /* No external dependencies */ return Math.floor(Math.random() * 10) + 1; }
    generateAge() { /* No external dependencies */ return Math.floor(Math.random() * 50) + 1; } // Thousands of years

    generateTraits() { /* Uses window.GalaxyCore.getRandomElement */
        const possibleTraits = ['aggressive', 'peaceful', 'curious', 'xenophobic', 'xenophilic', 'spiritual', 'materialistic', 'collectivist', 'individualist', 'adaptive', 'traditional', 'expansionist', 'isolationist'];
        const traitCount = 2 + Math.floor(Math.random() * 3);
        const selectedTraits = new Set();
        const contradictions = { 'aggressive': 'peaceful', 'xenophobic': 'xenophilic', 'spiritual': 'materialistic', 'collectivist': 'individualist', 'traditional': 'adaptive', 'expansionist': 'isolationist' };
        let attempts = 0; // Prevent infinite loop
        while (selectedTraits.size < traitCount && attempts < 100) {
            const candidate = window.GalaxyCore.getRandomElement(possibleTraits);
            let conflict = false;
            for (const existing of selectedTraits) { if (candidate === existing || contradictions[candidate] === existing || contradictions[existing] === candidate) { conflict = true; break; } }
            if (!conflict) selectedTraits.add(candidate);
            attempts++;
        }
        return Array.from(selectedTraits);
    }

    generateSpecializations() { /* Uses window.GalaxyCore.getRandomElement */
        const possibleSpecs = ['energy', 'propulsion', 'warfare', 'agriculture', 'medicine', 'computing', 'robotics', 'terraforming', 'biotechnology', 'psychology', 'architecture', 'art', 'trade'];
        const count = 1 + Math.floor(Math.random() * 3); const specializations = {}; const usedSpecs = new Set();
        for (let i = 0; i < count; i++) {
            let spec = window.GalaxyCore.getRandomElement(possibleSpecs); let attempts = 0;
            while (usedSpecs.has(spec) && attempts < 50) { spec = window.GalaxyCore.getRandomElement(possibleSpecs); attempts++; } // Avoid infinite loop
            if (!usedSpecs.has(spec)) {
                usedSpecs.add(spec);
                specializations[spec] = Math.min(10, Math.max(1, this.technologicalLevel + Math.floor(Math.random() * 3) - 1));
            }
        }
        return specializations;
    }

    generateGovernment() { /* Uses window.GalaxyCore.getRandomElement */
        const governments = ['monarchy', 'democracy', 'oligarchy', 'technocracy', 'theocracy', 'dictatorship', 'hive-mind', 'tribal', 'corporate', 'federation', 'collective', 'anarchy', 'military-junta'];
        return window.GalaxyCore.getRandomElement(governments);
    }

    generateExpansionPolicy() { /* Uses window.GalaxyCore.getRandomElement */
        const policies = ['colonization', 'conquest', 'trade', 'diplomacy', 'infiltration'];
        if (this.traits.includes('aggressive')) return 'conquest'; if (this.traits.includes('peaceful')) return Math.random() < 0.7 ? 'diplomacy' : 'trade';
        if (this.traits.includes('expansionist')) return Math.random() < 0.6 ? 'colonization' : 'conquest'; if (this.traits.includes('xenophobic')) return Math.random() < 0.5 ? 'infiltration' : 'conquest';
        return window.GalaxyCore.getRandomElement(policies);
    }

    generateArtifacts() { /* Uses window.GalaxyCore.getRandomElement, window.GalaxyNames.generateMegastructureName */
        const artifacts = [];
        if (this.technologicalLevel >= 5 && Math.random() < 0.7) artifacts.push({ type: 'orbital-station', locationId: this.homePlanet?.id, size: Math.random() < 0.3 ? 'large' : 'medium', purpose: window.GalaxyCore.getRandomElement(['military', 'scientific', 'residential', 'commercial']) });
        if (this.technologicalLevel >= 7 && Math.random() < 0.5) artifacts.push({ type: 'transportation-network', extent: 'system-wide', technology: window.GalaxyCore.getRandomElement(['warp-gates', 'hyperspace-beacons', 'mass-accelerators']) });
        if (this.technologicalLevel >= 9 && Math.random() < 0.3) artifacts.push({ type: 'megastructure', name: window.GalaxyNames.generateMegastructureName(), structure: window.GalaxyCore.getRandomElement(['dyson-swarm', 'ringworld', 'artificial-planet', 'stellar-engine']), completion: Math.random() < 0.2 ? 'complete' : 'partial' });
        return artifacts;
    }

    expandTo(planet) { /* Uses window.GalaxyCore.getRandomElement */
        if (!planet || !planet.id || this.planets.some(p => p.id === planet.id)) return;
        if (planet.civilization && planet.civilization.id !== this.id) { console.warn(`${this.name} cannot expand to ${planet.name}, already colonized by ${planet.civilization.name}`); return; }
        this.planets.push(planet); planet.civilization = this;
        if (Math.random() < 0.7) {
            const colonyType = window.GalaxyCore.getRandomElement(['mining', 'agricultural', 'research', 'military', 'residential']);
            planet.artifacts.push({ type: 'colony', owner: this.id, purpose: colonyType, population: Math.floor(Math.random() * 1e6) + 1000, age: Math.floor(Math.random() * this.age) });
        }
        // console.log(`${this.name} expanded to ${planet.name}`); // Reduced logging verbosity
    }

    establishRelationship(otherCiv) { /* No external dependencies */
        if (!otherCiv || otherCiv.id === this.id || !otherCiv.traits) return;
        const otherCivId = otherCiv.id;
        if (this.relationships[otherCivId]) return this.relationships[otherCivId];
        if (otherCiv.relationships[this.id]) { this.relationships[otherCivId] = otherCiv.relationships[this.id]; return this.relationships[otherCivId]; }
        let compatibilityScore = 0; this.traits.forEach(trait => { if (otherCiv.traits.includes(trait)) compatibilityScore += 1; });
        const opposites = { 'aggressive': 'peaceful', 'xenophobic': 'xenophilic', 'spiritual': 'materialistic', 'collectivist': 'individualist', 'traditional': 'adaptive', 'expansionist': 'isolationist' };
        this.traits.forEach(trait => { if (opposites[trait] && otherCiv.traits.includes(opposites[trait])) compatibilityScore -= 2; });
        let relationship;
        if (this.traits.includes('xenophobic') || otherCiv.traits.includes('xenophobic') || (this.traits.includes('aggressive') && otherCiv.traits.includes('aggressive'))) relationship = 'hostile';
        else if (compatibilityScore > 1) relationship = 'alliance'; else if (compatibilityScore > 0) relationship = 'friendly';
        else if (compatibilityScore === 0) relationship = 'neutral'; else if (compatibilityScore > -3) relationship = 'tense';
        else relationship = 'hostile';
        if ((this.traits.includes('xenophilic') || otherCiv.traits.includes('xenophilic')) && (relationship === 'neutral' || relationship === 'tense')) relationship = 'friendly';
        this.relationships[otherCivId] = relationship; otherCiv.relationships[this.id] = relationship;
        return relationship;
    }

    getDescription() { /* Basic fallback */
        const gov = this.government ? this.government.replace('-', ' ') : 'unknown';
        const traits = this.traits ? this.traits.join(", ") : 'unknown';
        return `The ${this.name} represent a ${gov} civilization, level ${this.technologicalLevel}. Traits: ${traits}.`;
    }
}

/**
 * Artifact class
 */
class Artifact {
     constructor(type, location = null) { // Location can be null or a planet object
        // DO NOT destructure GalaxyCore here. Access directly below.
        try {
            this.id = `artifact-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            this.type = type;
            this.locationId = location ? location.id : null; // Store ID
            this.properties = this.generateProperties(type); // Pass type
            this.isValid = true; // Assume valid unless error occurs
        } catch (error) {
            console.error("Error creating Artifact:", type, error);
            this.isValid = false; // Mark as invalid on error
        }
    }

    // Method using direct window access:
    generateProperties(type) { /* Uses window.GalaxyCore.getRandomElement */
        const getRandomElement = window.GalaxyCore.getRandomElement; // Can alias here for readability within method
        switch (type) {
            case 'ancient-ruins': return { age: Math.floor(Math.random() * 1e5) + 5e3, extent: getRandomElement(['small', 'moderate', 'extensive', 'massive']), preservation: getRandomElement(['poor', 'partial', 'good', 'excellent']), technology: getRandomElement(['primitive', 'comparable', 'advanced', 'incomprehensible']) };
            case 'derelict-station': return { age: Math.floor(Math.random() * 1e4) + 500, size: getRandomElement(['small', 'medium', 'large', 'enormous']), condition: getRandomElement(['destroyed', 'severely damaged', 'partially intact', 'mostly intact']), origin: getRandomElement(['unknown', 'ancient', 'recent', 'extragalactic']) };
            case 'anomaly': return { nature: getRandomElement(['gravitational', 'electromagnetic', 'quantum', 'temporal', 'dimensional']), stability: getRandomElement(['stable', 'fluctuating', 'degrading', 'growing']), danger: Math.floor(Math.random() * 10) + 1, origin: getRandomElement(['natural', 'artificial', 'unknown']) };
            case 'colony': case 'megastructure': case 'orbital-station': case 'transportation-network': return {}; // Properties added elsewhere
            default: console.warn(`Generating default properties for unknown artifact type: ${type}`); return { description: "Unknown artifact type" };
        }
    }
}

// Export classes onto the window object
window.GalaxyClasses = {
    Star,
    Planet,
    Civilization,
    Artifact
};

console.log("galaxy-classes.js loaded successfully");