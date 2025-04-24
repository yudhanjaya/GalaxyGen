/**
 * Galaxy Generator - Export Module
 * Handles exporting galaxy data to various formats
 * This is a separate module to be loaded on-demand or after core modules.
 */
console.log("Loading galaxy-export.js");

// Helper function (could also be in GalaxyCore)
/**
 * Escape a string for CSV
 * @param {*} value - The value to escape
 * @return {string} Escaped string
 */
function escapeCsv(value) {
    if (value === null || typeof value === 'undefined') return '';
    const str = String(value);
    // If string contains comma, quote, or newline, wrap in quotes and escape any quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

/**
 * Escape a string for XML attributes/content
 * @param {*} value - The value to escape
 * @return {string} Escaped string
 */
function escapeXml(value) {
    if (value === null || typeof value === 'undefined') return '';
    const str = String(value);
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}


/**
 * Export universe data to CSV format
 * @param {Object} universe - The universe object containing stars, civilizations etc.
 * @return {string} CSV content as a string
 */
function exportToCSV(universe) {
    if (!universe || !universe.stars) {
        console.error("Cannot export CSV: Invalid universe data provided.");
        return '';
    }

    let csv = 'Type,ID,Name,ParentID,ParentName,Mass,Habitability,Planets/Colonies,Age,TechLevel,Government,Traits,X,Y,Z,Other\n'; // Header row

    // Add stars
    universe.stars.forEach(star => {
        csv += [
            'Star',
            escapeCsv(star.id),
            escapeCsv(star.name),
            '', // ParentID
            '', // ParentName
            escapeCsv(star.mass?.toFixed(2)), // Mass
            '', // Habitability
            escapeCsv(star.planets?.length || 0), // Planets
            escapeCsv(star.age?.toFixed(2)), // Age
            '', // TechLevel
            '', // Government
            '', // Traits
            escapeCsv(star.coordinates?.x?.toFixed(2)), // X
            escapeCsv(star.coordinates?.y?.toFixed(2)), // Y
            escapeCsv(star.coordinates?.z?.toFixed(2)), // Z
             escapeCsv(`${star.spectralType}-Type ${star.stellarEvolution || ''}`) // Other
        ].join(',') + '\n';

        // Add planets for this star
        star.planets?.forEach(planet => {
            csv += [
                'Planet',
                escapeCsv(planet.id),
                escapeCsv(planet.name),
                escapeCsv(star.id), // ParentID
                escapeCsv(star.name), // ParentName
                escapeCsv(planet.mass?.toFixed(2)), // Mass
                escapeCsv(planet.habitability?.toFixed(0)), // Habitability
                escapeCsv(planet.moons || 0), // Moons as "Planets/Colonies" placeholder
                '', // Age
                '', // TechLevel
                '', // Government
                '', // Traits
                '', // X
                '', // Y
                '', // Z
                 escapeCsv(`Type: ${planet.type}, Orbit: ${planet.orbit?.toFixed(2)} AU`) // Other
            ].join(',') + '\n';
        });
    });

    // Add civilizations
    universe.civilizations?.forEach(civ => {
         const homePlanet = civ.homePlanet;
         const homeStar = homePlanet?.star;
        csv += [
            'Civilization',
            escapeCsv(civ.id),
            escapeCsv(civ.name),
            escapeCsv(homePlanet?.id), // ParentID (Home Planet ID)
            escapeCsv(homePlanet?.name), // ParentName (Home Planet Name)
            '', // Mass
            '', // Habitability
            escapeCsv(civ.planets?.length || 0), // Colonies
            escapeCsv(civ.age), // Age
            escapeCsv(civ.technologicalLevel), // TechLevel
            escapeCsv(civ.government), // Government
            escapeCsv(civ.traits?.join('; ')), // Traits (use semicolon separator)
             escapeCsv(homeStar?.coordinates?.x?.toFixed(2)), // Use home star coords approx
             escapeCsv(homeStar?.coordinates?.y?.toFixed(2)),
             escapeCsv(homeStar?.coordinates?.z?.toFixed(2)),
             escapeCsv(`Home System: ${homeStar?.name || 'N/A'}`) // Other
        ].join(',') + '\n';
    });

    return csv;
}

/**
 * Export universe data to JSON format
 * @param {Object} universe - The universe object
 * @param {boolean} pretty - Whether to pretty-print the JSON (default: true)
 * @return {string} JSON content as a string
 */
function exportToJSON(universe, pretty = true) {
    if (!universe) {
         console.error("Cannot export JSON: Invalid universe data provided.");
         return '';
    }

    // Create a simplified version for export, avoiding circular references if possible
    // This example creates a deep copy, which might be slow for huge universes
    // A more optimized approach would selectively copy properties.
    try {
         // Use a replacer function to handle potential circularity if needed,
         // although the structure below should avoid common ones.
         const simplifiedUniverse = {
            metadata: { ...universe.metadata }, // Copy metadata
            stars: universe.stars?.map(star => ({
                id: star.id,
                name: star.name,
                spectralType: star.spectralType,
                mass: star.mass,
                age: star.age,
                coordinates: { ...star.coordinates },
                isBinarySystem: star.isBinarySystem,
                stellarEvolution: star.stellarEvolution,
                specialFeatures: star.specialFeatures,
                 companions: star.companions?.map(c => ({ ...c })), // Copy companions if present
                planets: star.planets?.map(planet => ({
                    id: planet.id,
                    name: planet.name,
                    type: planet.type,
                    orbit: planet.orbit,
                    radius: planet.radius,
                    mass: planet.mass,
                    temperature: planet.temperature,
                    habitability: planet.habitability,
                    civilizationId: planet.civilization ? planet.civilization.id : null, // Store ID only
                    artifacts: planet.artifacts?.map(artifact => ({ ...artifact, locationId: planet.id })) // Copy artifacts, add location ID
                })) || []
            })) || [],
            civilizations: universe.civilizations?.map(civ => ({
                id: civ.id,
                name: civ.name,
                homePlanetId: civ.homePlanet?.id || null, // Store ID only
                planetIds: civ.planets?.map(p => p.id) || [], // Store IDs only
                technologicalLevel: civ.technologicalLevel,
                age: civ.age,
                government: civ.government,
                traits: civ.traits,
                expansionPolicy: civ.expansionPolicy,
                specializations: { ...civ.specializations },
                relationships: { ...civ.relationships }, // Relationship keys are civ names (IDs might be better)
                artifacts: civ.artifacts?.map(artifact => ({ ...artifact })) // Copy artifacts
            })) || []
        };

        return pretty ?
            JSON.stringify(simplifiedUniverse, null, 2) :
            JSON.stringify(simplifiedUniverse);

     } catch (error) {
         console.error("Error converting universe to JSON:", error);
         return JSON.stringify({ error: "Failed to serialize universe", message: error.message });
     }
}

/**
 * Export universe data to GraphML format
 * @param {Object} universe - The universe object
 * @return {string} GraphML content as a string
 */
function exportToGraphML(universe) {
     if (!universe || !universe.stars) {
         console.error("Cannot export GraphML: Invalid universe data provided.");
         return '';
    }

    // Start GraphML document
    let graphml = `<?xml version="1.0" encoding="UTF-8"?>
<graphml xmlns="http://graphml.graphdrawing.org/xmlns"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
         http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
  <key id="d_name" for="node" attr.name="name" attr.type="string"/>
  <key id="d_type" for="node" attr.name="type" attr.type="string"/>
  <key id="d_mass" for="node" attr.name="mass" attr.type="double"/>
  <key id="d_habitability" for="node" attr.name="habitability" attr.type="int"/>
  <key id="d_tech_level" for="node" attr.name="techLevel" attr.type="int"/>
  <key id="d_government" for="node" attr.name="government" attr.type="string"/>
  <key id="d_x" for="node" attr.name="x" attr.type="double"/>
  <key id="d_y" for="node" attr.name="y" attr.type="double"/>
  <key id="d_z" for="node" attr.name="z" attr.type="double"/>
  <key id="e_relationship" for="edge" attr.name="relationship" attr.type="string"/>

  <graph id="G" edgedefault="directed">
`; // Using directed edges

    // Add nodes for stars
    universe.stars?.forEach(star => {
        graphml += `    <node id="${escapeXml(star.id)}">
      <data key="d_name">${escapeXml(star.name)}</data>
      <data key="d_type">Star</data>
      <data key="d_mass">${star.mass || 0}</data>
      <data key="d_x">${star.coordinates?.x || 0}</data>
      <data key="d_y">${star.coordinates?.y || 0}</data>
      <data key="d_z">${star.coordinates?.z || 0}</data>
    </node>\n`;

        // Add nodes for planets and edges from star to planets
        star.planets?.forEach(planet => {
            graphml += `    <node id="${escapeXml(planet.id)}">
      <data key="d_name">${escapeXml(planet.name)}</data>
      <data key="d_type">Planet</data>
      <data key="d_mass">${planet.mass || 0}</data>
      <data key="d_habitability">${planet.habitability || 0}</data>
    </node>\n`;
             // Edge: Star orbits Planet
            graphml += `    <edge source="${escapeXml(star.id)}" target="${escapeXml(planet.id)}">
      <data key="e_relationship">orbits</data>
    </edge>\n`;
        });
    });

    // Add nodes for civilizations and edges
    universe.civilizations?.forEach(civ => {
         const homePlanetId = civ.homePlanet?.id;
        graphml += `    <node id="${escapeXml(civ.id)}">
      <data key="d_name">${escapeXml(civ.name)}</data>
      <data key="d_type">Civilization</data>
      <data key="d_tech_level">${civ.technologicalLevel || 0}</data>
      <data key="d_government">${escapeXml(civ.government)}</data>
    </node>\n`;

         // Edge: Civilization -> Home Planet
        if (homePlanetId) {
            graphml += `    <edge source="${escapeXml(civ.id)}" target="${escapeXml(homePlanetId)}">
      <data key="e_relationship">homeworld</data>
    </edge>\n`;
        }

        // Edges for colonies
        civ.planets?.forEach(planet => {
            if (planet.id !== homePlanetId) { // Avoid self-loop for home planet
                 // Edge: Civilization -> Colony Planet
                graphml += `    <edge source="${escapeXml(civ.id)}" target="${escapeXml(planet.id)}">
      <data key="e_relationship">colony</data>
    </edge>\n`;
            }
        });

        // Add edges for relationships (only once per pair)
        Object.entries(civ.relationships || {}).forEach(([otherCivName, relationship]) => {
            const otherCiv = universe.civilizations.find(c => c.name === otherCivName);
            if (otherCiv && civ.id < otherCiv.id) { // Process relationship only once (e.g., based on ID order)
                 // Edge: Civ <-> Other Civ
                graphml += `    <edge source="${escapeXml(civ.id)}" target="${escapeXml(otherCiv.id)}">
      <data key="e_relationship">${escapeXml(relationship)}</data>
    </edge>\n`;
                // If you want directed edges showing relationship from both sides, add another edge in the opposite direction.
                // For an undirected graph view, tools often interpret the single edge as bidirectional.
            }
        });
    });

    // End GraphML document
    graphml += `  </graph>
</graphml>`;

    return graphml;
}


// Export functions onto the window object
window.GalaxyExport = {
    exportToCSV,
    exportToJSON,
    exportToGraphML
    // escapeCsv and escapeXml are internal helpers here, but could be exported if needed elsewhere
};

console.log("galaxy-export.js potentially loaded (dynamically or statically).");