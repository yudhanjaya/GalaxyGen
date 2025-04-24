/**
 * Galaxy Generator - Descriptions Module (Placeholder)
 * Provides descriptive text for game elements.
 */

console.log("Loading galaxy-descriptions.js");

// Check if GalaxyCore is loaded (optional, but good practice)
if (!window.GalaxyCore) {
    console.warn("GalaxyDescriptions module loaded before GalaxyCore?");
}

/**
 * Generates a basic description for a civilization based on its properties.
 * @param {object} civProps - The properties object of the civilization node.
 * @returns {string} A textual description.
 */
function generateCivilizationDescription(civProps) {
    if (!civProps) {
        return "No civilization data available.";
    }

    // --- Basic Description Generation ---
    let desc = `The ${civProps.name || 'Unnamed Civilization'} are `;

    // Article helper
    const getArticle = (word) => (/^[aeiou]/i.test(word) ? 'an' : 'a');

    // Government Type
    const gov = civProps.government || 'unknown entity';
    desc += `${getArticle(gov)} ${gov.replace('-', ' ')}. `;

    // Age & Tech
    desc += `Having existed for approximately ${civProps.age || 'an unknown number of'} thousand years, they have reached technology level ${civProps.technologicalLevel || '?'}. `;

    // Traits
    if (civProps.traits && civProps.traits.length > 0) {
        desc += `They are known for being ${civProps.traits.join(' and ')}. `;
    } else {
        desc += "Their defining traits are unknown. ";
    }

    // Expansion Policy
    if (civProps.expansionPolicy) {
        switch (civProps.expansionPolicy) {
            case 'conquest': desc += "They tend to expand through military means. "; break;
            case 'colonization': desc += "Their focus is on settling new worlds. "; break;
            case 'trade': desc += "They primarily expand their influence via commerce. "; break;
            case 'diplomacy': desc += "Diplomatic outreach is their preferred method of interaction. "; break;
            case 'infiltration': desc += "They often operate subtly within other societies. "; break;
            default: desc += `Their expansion policy is ${civProps.expansionPolicy}. `;
        }
    }

    // Specializations (Optional)
    if (civProps.specializations && Object.keys(civProps.specializations).length > 0) {
        const specs = Object.keys(civProps.specializations);
        desc += `They show particular aptitude in ${specs.join(', ')}. `;
    }

    return desc.trim();
}


// Export the generator function
window.GalaxyDescriptions = {
    generateCivilizationDescription
};

console.log("galaxy-descriptions.js loaded successfully.");