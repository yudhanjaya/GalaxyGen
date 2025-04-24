/**
 * Galaxy Generator - Core Module
 * Contains utilities, constants, and helper functions
 */

// Log module loading for debugging
console.log("Loading galaxy-core.js");

// ======= CONSTANTS =======

// Galaxy type constants
const GALAXY_TYPES = {
    SPIRAL: 'spiral',
    ELLIPTICAL: 'elliptical',
    IRREGULAR: 'irregular'
};

// Size constraints to prevent performance issues
const LIMITS = {
    MAX_STARS: 3000,
    MAX_PLANETS_PER_STAR: 9,
    MAX_CIVILIZATIONS: 50,
    MAX_ARTIFACTS_PER_PLANET: 2,
    BATCH_SIZE: 10 // Number of objects to process in one batch
};

// Spectral types and their characteristics
const SPECTRAL_TYPES = {
    O: { color: '#9bb0ff', tempMin: 30000, tempMax: 50000, massMin: 16, massMax: 50 },
    B: { color: '#aabfff', tempMin: 10000, tempMax: 30000, massMin: 2.1, massMax: 16 },
    A: { color: '#cad7ff', tempMin: 7500, tempMax: 10000, massMin: 1.4, massMax: 2.1 },
    F: { color: '#f8f7ff', tempMin: 6000, tempMax: 7500, massMin: 1.04, massMax: 1.4 },
    G: { color: '#fff4ea', tempMin: 5000, tempMax: 6000, massMin: 0.8, massMax: 1.04 },
    K: { color: '#ffd2a1', tempMin: 3500, tempMax: 5000, massMin: 0.45, massMax: 0.8 },
    M: { color: '#ffcc6f', tempMin: 2000, tempMax: 3500, massMin: 0.08, massMax: 0.45 }
};

// Planet types and their characteristics
const PLANET_TYPES = {
    'molten': { color: '#FF6347', compositionPrimary: 'iron', compositionSecondary: 'silicate', compositionTrace: 'magma' },
    'terrestrial': { color: '#4CAF50', compositionPrimary: 'silicate', compositionSecondary: 'iron', compositionTrace: 'water' },
    'rocky': { color: '#888888', compositionPrimary: 'silicate', compositionSecondary: 'metal', compositionTrace: 'carbon' },
    'gas-giant': { color: '#CD853F', compositionPrimary: 'hydrogen', compositionSecondary: 'helium', compositionTrace: 'methane' },
    'ice-giant': { color: '#87CEEB', compositionPrimary: 'water', compositionSecondary: 'ammonia', compositionTrace: 'methane' },
    'frozen': { color: '#E0FFFF', compositionPrimary: 'ice', compositionSecondary: 'rock', compositionTrace: 'methane' }
};

// ======= UTILITY FUNCTIONS =======

/**
 * Get a random item from an array
 * @param {Array} array - The array to pick from
 * @return {*} A random element from the array
 */
function getRandomElement(array) {
     if (!array || array.length === 0) return undefined; // Handle empty or null arrays
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a random number between min and max
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @param {boolean} isInteger - If true, return integer
 * @return {number} A random number
 */
function getRandomNumber(min, max, isInteger = false) {
    const random = Math.random() * (max - min) + min;
    return isInteger ? Math.floor(random) : random;
}

/**
 * Get a rounded number with specific precision
 * @param {number} value - The number to round
 * @param {number} decimals - Number of decimal places
 * @return {number} Rounded number
 */
function roundTo(value, decimals = 2) {
    return +(Math.round(value + "e+" + decimals) + "e-" + decimals);
}

/**
 * Calculate 3D distance between two points
 * @param {Object} point1 - {x, y, z} coordinates
 * @param {Object} point2 - {x, y, z} coordinates
 * @return {number} The distance
 */
function calculate3DDistance(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dz = point2.z - point1.z;
    return Math.sqrt(dx*dx + dy*dy + dz*dz);
}

/**
 * Capitalize the first letter of each word in a string
 * @param {string} str - The input string
 * @return {string} Capitalized string
 */
function capitalizeWords(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Execute a callback in batches with timeout to prevent UI freezing
 * @param {Array} items - Items to process
 * @param {Function} processFunc - Function to process each item (receives item, index)
 * @param {number} batchSize - Number of items per batch
 * @param {Function} progressCallback - Called with progress percentage (0-100), current index, total items
 * @param {Function} completionCallback - Called when all batches complete
 */
function processBatched(items, processFunc, batchSize, progressCallback, completionCallback) {
    const totalItems = items ? items.length : 0;
    let currentIndex = 0;

    function processBatch() {
        const startTime = Date.now();
        const endIndex = Math.min(currentIndex + batchSize, totalItems);

        for (let i = currentIndex; i < endIndex; i++) {
            try {
                processFunc(items[i], i);
            } catch (error) {
                console.error(`Error processing item at index ${i}:`, items[i], error);
                // Decide if you want to stop processing or continue
            }
        }

        currentIndex = endIndex;
        const progressPercent = totalItems > 0 ? (currentIndex / totalItems) * 100 : 100;

        if (progressCallback) {
            try {
                progressCallback(progressPercent, currentIndex, totalItems);
            } catch (error) {
                console.error("Error in progressCallback:", error);
            }
        }

        if (currentIndex < totalItems) {
             // Schedule next batch using setTimeout to yield to the event loop
             // Adjust delay based on processing time if needed
            const elapsedTime = Date.now() - startTime;
             const delay = Math.max(0, 10 - elapsedTime); // Aim for ~10ms per batch cycle minimum
            setTimeout(processBatch, delay);
        } else {
            if (completionCallback) {
                try {
                    completionCallback();
                } catch (error) {
                    console.error("Error in completionCallback:", error);
                }
            }
        }
    }

    // Start processing only if there are items
    if (items && items.length > 0) {
        // Start the first batch asynchronously
        setTimeout(processBatch, 0);
    } else {
        // No items, call completion callback immediately if it exists
        if (progressCallback) progressCallback(100, 0, 0); // Indicate 100% progress if no items
        if (completionCallback) {
             setTimeout(completionCallback, 0); // Call async for consistency
        }
    }
}


// Export utilities onto the window object
window.GalaxyCore = {
    GALAXY_TYPES,
    LIMITS,
    SPECTRAL_TYPES,
    PLANET_TYPES,
    getRandomElement,
    getRandomNumber,
    roundTo,
    calculate3DDistance,
    capitalizeWords,
    processBatched
};

console.log("galaxy-core.js loaded successfully");