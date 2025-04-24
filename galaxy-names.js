/**
 * Galaxy Generator - Name Generation Module
 * Handles generation of names for stars, planets, and civilizations
 */

// Log module loading for debugging
console.log("Loading galaxy-names.js");

// Check dependencies
if (!window.GalaxyCore) {
    console.error("galaxy-names.js Error: Required dependency GalaxyCore not found!");
    throw new Error("galaxy-names.js Error: Required dependency GalaxyCore not found!");
}

// ======= NAME GENERATION DATA =======
// (Data remains the same as before)
const STAR_NAME_COMPONENTS = {
    prefixes: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu',
               'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'Proxima',
               'Ultima', 'Nova', 'Hyper', 'Quantum', 'Cosmic', 'Astro', 'Galactic', 'Stellar', 'Nebula', 'Pulsar',
               'Quasar', 'Void', 'Aether', 'Flux', 'Lumen', 'Umbra', 'Radiant', 'Twilight', 'Dawn', 'Dusk', 'Zenith',
               'Nadir', 'Apex', 'Core', 'Fringe', 'Frontier', 'Nexus', 'Vertex', 'Vortex', 'Helix', 'Spiral'],
    roots: ['Centauri', 'Eridani', 'Cygni', 'Draconis', 'Aquarii', 'Leonis', 'Ursae', 'Scorpii', 'Orionis', 'Pegasi',
            'Andromeda', 'Cassiopeia', 'Lyra', 'Auriga', 'Boötes', 'Carina', 'Cepheus', 'Corvus', 'Crux', 'Gemini',
            'Hercules', 'Hydra', 'Lacerta', 'Lupus', 'Lynx', 'Ophiuchus', 'Perseus', 'Phoenix', 'Pictor', 'Sagittarius',
            'Taurus', 'Vela', 'Volans', 'Vulpecula', 'Xephyr', 'Ystera', 'Zephyrus', 'Aether', 'Chronos', 'Cosmos',
            'Erebus', 'Helios', 'Hyperion', 'Khaos', 'Nyx', 'Oranos', 'Tartarus', 'Thalassa', 'Ourania', 'Astraeus',
            'Phoebe', 'Rhea', 'Theia', 'Themis', 'Crius', 'Mnemosyne', 'Prometheus', 'Styx', 'Selene', 'Eos'],
    suffixes: ['Prime', 'Major', 'Minor', 'Maxima', 'Minima', 'Proxima', 'Ultima', 'Nova', 'Superba', 'Magna',
               'Borealis', 'Australis', 'Occidentalis', 'Orientalis', 'Centralis', 'Peripheria', 'Anterior', 'Posterior',
               'Superior', 'Inferior', 'Luminosa', 'Obscura', 'Radianta', 'Nebulosa', 'Vortexa', 'Pulsara', 'Quasara',
               'Coronae', 'Crucis', 'Draconis', 'Leonis', 'Lupi', 'Serpentis', 'Tauri', 'Ursae', 'Velorum', 'Virginis',
               'Carinae', 'Phoenicis', 'Aquilae', 'Ceti', 'Delphini', 'Gruis', 'Hydrae', 'Pavonis', 'Telescopii']
};
const PLANET_NAME_COMPONENTS = {
    prefixes: ['New', 'Old', 'Neo', 'Paleo', 'Micro', 'Macro', 'Hyper', 'Hypo', 'Ultra', 'Infra', 'Xeno', 'Exo', 'Endo',
               'Iso', 'Poly', 'Mono', 'Multi', 'Omni', 'Pan', 'Hemi', 'Proto', 'Meta', 'Para', 'Quasi', 'Pseudo', 'Crypto',
               'Archaeo', 'Palaeo', 'Meso', 'Neo', 'Tele', 'Holo', 'Nano', 'Pico', 'Femto', 'Atto', 'Zepto', 'Yocto', 'Giga',
               'Tera', 'Peta', 'Exa', 'Zetta', 'Yotta', 'Bronto', 'Mega', 'Supra', 'Hyper', 'Super', 'Trans'],
    roots: ['Terra', 'Gaia', 'Luna', 'Sol', 'Helios', 'Selene', 'Ares', 'Athena', 'Zeus', 'Hera', 'Poseidon', 'Demeter',
            'Apollo', 'Artemis', 'Hephaestus', 'Aphrodite', 'Hermes', 'Dionysus', 'Hades', 'Persephone', 'Chronos', 'Rhea',
            'Oceanus', 'Tethys', 'Hyperion', 'Theia', 'Crius', 'Mnemosyne', 'Phoebe', 'Themis', 'Atlas', 'Prometheus',
            'Epimetheus', 'Coeus', 'Cronus', 'Iapetus', 'Aegaeon', 'Aether', 'Ananke', 'Erebus', 'Eros', 'Geras', 'Hemera',
            'Hypnos', 'Nemesis', 'Nyx', 'Oneiroi', 'Phanes', 'Pontus', 'Tartarus', 'Thalassa', 'Thanatos', 'Uranus',
            'Zephyrus', 'Boreas', 'Notus'],
    suffixes: ['Prime', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Sextus', 'Septimus', 'Octavus', 'Nonus', 'Decimus',
               'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Major', 'Minor',
               'Maximus', 'Minimus', 'Magnus', 'Parvus', 'Novus', 'Antiquus', 'Primus', 'Ultimus', 'Borealis', 'Australis',
               'Orientalis', 'Occidentalis', 'Centralis', 'Exterior', 'Interior', 'Superior', 'Inferior', 'Proxima', 'Remota',
               'Frigidus', 'Calidus', 'Obscurus', 'Luminosus', 'Ferreus', 'Aquaticus', 'Saxeus', 'Crystallus']
};
const CIVILIZATION_NAME_COMPONENTS = {
    prefixes: ["Az", "Xen", "Vex", "Qu", "Neb", "Lum", "Kry", "Jov", "Hel", "Gal", "Vor", "Zar", "Eth", "Dra", "Thal",
               "Phax", "Mer", "Tyr", "Sil", "Bor", "Chax", "Ark", "Fel", "Trill", "Rax"],
    mids: ["ar", "or", "an", "en", "in", "om", "um", "al", "el", "il", "ax", "ex", "ix", "ox", "ux", "on", "th", "ra",
           "ri", "ze", "ko", "ma", "tu", "va", "yu"],
    suffixes: ["ian", "ite", "oid", "ean", "ar", "on", "id", "an", "ese", "ite", "oid", "ax", "ex", "ix", "ox", "ux",
               "ari", "ori", "uri", "athi", "othi", "izi", "azi", "uzi", "exi"]
};

// ======= NAME GENERATION FUNCTIONS =======

/**
 * Generate a name for a star
 * @return {string} Star name
 */
function generateStarName() {
    // Use GalaxyCore directly
    const getRandomElement = window.GalaxyCore.getRandomElement;
    const usePrefix = Math.random() < 0.4;
    const useSuffix = Math.random() < 0.3;

    let name = '';
    if (usePrefix) name += getRandomElement(STAR_NAME_COMPONENTS.prefixes) + ' ';
    name += getRandomElement(STAR_NAME_COMPONENTS.roots);
    if (useSuffix) name += ' ' + getRandomElement(STAR_NAME_COMPONENTS.suffixes);

    return name;
}

/**
 * Generate a name for a planet
 * @return {string} Planet name
 */
function generatePlanetName() {
    // Use GalaxyCore directly
    const getRandomElement = window.GalaxyCore.getRandomElement;
    const usePrefix = Math.random() < 0.5;
    const useSuffix = Math.random() < 0.6;

    let name = '';
    if (usePrefix) name += getRandomElement(PLANET_NAME_COMPONENTS.prefixes) + ' ';
    name += getRandomElement(PLANET_NAME_COMPONENTS.roots);
    if (useSuffix) name += ' ' + getRandomElement(PLANET_NAME_COMPONENTS.suffixes);

    return name;
}

/**
 * Generate a name for a civilization
 * @return {string} Civilization name
 */
function generateCivilizationName() {
    // Use GalaxyCore directly
    const getRandomElement = window.GalaxyCore.getRandomElement;
    const useMid = Math.random() < 0.4;

    const prefix = getRandomElement(CIVILIZATION_NAME_COMPONENTS.prefixes);
    const mid = useMid ? getRandomElement(CIVILIZATION_NAME_COMPONENTS.mids) : "";
    const suffix = getRandomElement(CIVILIZATION_NAME_COMPONENTS.suffixes);

    return prefix + mid + suffix;
}

/**
 * Generate a name for a megastructure
 * @return {string} Megastructure name
 */
function generateMegastructureName() {
    // Use GalaxyCore directly
    const getRandomElement = window.GalaxyCore.getRandomElement;
    const prefixes = ['Grand', 'Eternal', 'Celestial', 'Prime', 'Ultimate', 'Sovereign'];
    const types = ['Sphere', 'Ring', 'Vault', 'Nexus', 'Array', 'Web', 'Matrix'];
    const suffixes = ['of Creation', 'of Destiny', 'of Prosperity', 'of Eternity', 'of Power'];

    const prefix = Math.random() < 0.7 ? getRandomElement(prefixes) + ' ' : '';
    const suffix = Math.random() < 0.5 ? ' ' + getRandomElement(suffixes) : '';

    return prefix + getRandomElement(types) + suffix;
}

// Export name generation functions
window.GalaxyNames = {
    generateStarName,
    generatePlanetName,
    generateCivilizationName,
    generateMegastructureName
};

console.log("galaxy-names.js loaded successfully");