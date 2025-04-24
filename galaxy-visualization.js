/**
 * Galaxy Generator - Visualization Module
 * Handles 3D visualization of the galaxy using ForceGraph3D
 */

// Log module loading for debugging
console.log("Loading galaxy-visualization.js");

// Check dependencies
if (!window.GalaxyCore) {
    console.error("Required dependency GalaxyCore not found!");
    throw new Error("Required dependency GalaxyCore not found!");
}
if (typeof THREE === 'undefined') {
    console.warn("THREE.js library not found. Visualization might be limited.");
}
if (typeof ForceGraph3D === 'undefined') {
    console.error("ForceGraph3D library not found!");
    throw new Error("ForceGraph3D library not found!");
}

/**
 * Creates a 3D visualization of a galaxy
 * @param {string} containerId - ID of the container element
 * @param {Object} graphData - Object containing nodes and links
 * @param {Object} options - Visualization options
 * @return {Object} The graph object
 */
function createGalaxyVisualization(containerId, graphData, options = {}) {
    try {
        console.log("Creating galaxy visualization...");

        // Check if container exists
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID "${containerId}" not found!`);
            throw new Error(`Container with ID "${containerId}" not found!`);
        }

        // Check if ForceGraph3D is available
        if (typeof ForceGraph3D !== 'function') {
            console.error("ForceGraph3D library not found!");
            throw new Error("ForceGraph3D library not found!");
        }

        // Default options
        const {
            nodeRelSize = 4,
            linkWidth = 0.2,
            backgroundColor = '#000011',
            enablePointerInteraction = true,
            showParticles = true,
            onNodeClick,
            onNodeHover
        } = options;

        // Initialize the graph
        const graph = ForceGraph3D({
            extraRenderers: [] // Can be extended with custom renderers
        })(container)
            .graphData(graphData)
            .backgroundColor(backgroundColor)
            .nodeLabel(node => node.name) // Basic label, tooltip provides more info
            .nodeColor(node => node.color || '#ffffff') // Fallback color
            .nodeVal(node => Math.max(1, node.val || 1)) // Ensure val is at least 1
            .nodeRelSize(nodeRelSize)
            .linkWidth(link => link.width || linkWidth)
            .linkColor(link => link.color || '#ffffff')
            .linkOpacity(0.5)
            .linkDirectionalParticles(link =>
                showParticles ? (link.source?.type === 'civilization' || link.target?.type === 'civilization' ? 3 : 0) : 0
            )
            .linkDirectionalParticleWidth(1)
            .enableNodeDrag(enablePointerInteraction)
            .enableNavigationControls(enablePointerInteraction)
            .showNavInfo(true)
            .onNodeClick(node => {
                // Focus on node
                if (node) {
                    focusNode(graph, node); // Use helper function
                }
                // Trigger event for node selection
                if (onNodeClick) {
                    onNodeClick(node);
                }
            })
            .onNodeHover(node => {
                // Change cursor on hover
                container.style.cursor = node ? 'pointer' : 'grab';
                if (onNodeHover) {
                    onNodeHover(node);
                }
            });

        // Add custom objects only if THREE is available
        if (typeof THREE === 'object') {
            customizeNodeAppearance(graph);
            customizeLinkAppearance(graph);
        } else {
            console.warn("THREE.js library not found. Using default node/link appearance.");
        }

        console.log("Visualization created successfully");
        return graph;
    } catch (error) {
        console.error("Error creating visualization:", error);
        return createFallbackVisualization(containerId, graphData, options);
    }
}

/**
 * Creates a fallback 2D visualization if 3D fails
 */
function createFallbackVisualization(containerId, graphData, options = {}) {
    console.warn("Falling back to basic ForceGraph3D visualization.");
    const container = document.getElementById(containerId);
    if (!container) return null;

    try {
        const graph = ForceGraph3D()(container)
            .graphData(graphData)
            .nodeLabel('name')
            .nodeColor('color')
            .nodeVal('val')
            .backgroundColor('#000011')
            .onNodeClick(options.onNodeClick)
            .onNodeHover(options.onNodeHover);
        return graph;
    } catch (fallbackError) {
        console.error("Fallback visualization also failed:", fallbackError);
        container.innerHTML = `<p style="color: red; padding: 20px;">Error: Galaxy visualization could not be created. Please ensure ForceGraph3D and THREE.js are loaded correctly.</p>`;
        return null;
    }
}

/**
 * Customizes the appearance of nodes based on their type using THREE.js
 * @param {Object} graph - The ForceGraph3D object
 */
function customizeNodeAppearance(graph) {
    if (typeof THREE !== 'object') return;

    graph.nodeThreeObject(node => {
        let shape;
        const nodeSize = Math.max(0.5, node.val || 1); // Ensure minimum size

        try {
            switch (node.type) {
                case 'star':
                    const starMaterial = new THREE.MeshLambertMaterial({
                        color: node.color,
                        emissive: node.color,
                        emissiveIntensity: 0.6
                    });
                    shape = new THREE.Mesh(new THREE.SphereGeometry(nodeSize * 0.5), starMaterial); // Stars slightly smaller relative to val

                    // Add glow effect for stars (except black holes)
                    if (node.properties?.stellarEvolution !== 'black-hole') {
                        const glowMaterial = new THREE.SpriteMaterial({
                            map: createGlowTexture(),
                            color: node.color,
                            transparent: true,
                            blending: THREE.AdditiveBlending,
                            opacity: 0.7
                        });
                        const glow = new THREE.Sprite(glowMaterial);
                        glow.scale.set(nodeSize * 3, nodeSize * 3, 1); // Larger glow
                        shape.add(glow);
                    }
                    break;

                case 'planet':
                    shape = new THREE.Mesh(
                        new THREE.SphereGeometry(nodeSize * 0.3), // Planets smaller relative to val
                        new THREE.MeshLambertMaterial({ color: node.color })
                    );

                    // Add rings if the planet has them
                    if (node.properties?.rings) {
                        const ringGeometry = new THREE.RingGeometry(nodeSize * 0.5, nodeSize * 0.8, 32);
                        const ringMaterial = new THREE.MeshBasicMaterial({
                            color: 0xaaaaaa,
                            side: THREE.DoubleSide,
                            transparent: true,
                            opacity: 0.4
                        });
                        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                        // Orient rings - random tilt
                        ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
                         ring.rotation.y = (Math.random() - 0.5) * 0.5;
                        shape.add(ring);
                    }
                    break;

                case 'civilization':
                    shape = new THREE.Mesh(
                        new THREE.OctahedronGeometry(nodeSize * 0.4), // Distinct shape, slightly smaller
                        new THREE.MeshPhongMaterial({ // Use Phong for potential shininess
                            color: node.color,
                            emissive: node.color,
                            emissiveIntensity: 0.4,
                            shininess: 50
                        })
                    );
                    break;

                case 'megastructure':
                    const megaMaterial = new THREE.MeshStandardMaterial({ color: node.color, roughness: 0.5, metalness: 0.3 });
                     if (node.properties?.structure === 'dyson-swarm') {
                        shape = new THREE.Group();
                        const count = 15;
                        const radius = nodeSize * 1.0;
                        const elementGeo = new THREE.BoxGeometry(0.3, 0.3, 0.1); // Flat elements
                         for (let i = 0; i < count; i++) {
                            const phi = Math.acos(-1 + (2 * i) / count);
                            const theta = Math.sqrt(count * Math.PI) * phi;
                             const element = new THREE.Mesh(elementGeo, megaMaterial);
                             element.position.set(
                                radius * Math.sin(phi) * Math.cos(theta),
                                radius * Math.sin(phi) * Math.sin(theta),
                                radius * Math.cos(phi)
                            );
                            element.lookAt(0, 0, 0); // Point towards center
                            shape.add(element);
                        }
                    } else if (node.properties?.structure === 'ringworld') {
                         shape = new THREE.Mesh(
                            new THREE.TorusGeometry(nodeSize * 1.2, nodeSize * 0.2, 8, 48), // Thinner ring
                            megaMaterial
                        );
                         shape.rotation.x = Math.PI / 2; // Flat ring
                     } else {
                        // Default shape for other megastructures (e.g., tetrahedron)
                        shape = new THREE.Mesh(new THREE.TetrahedronGeometry(nodeSize * 0.6), megaMaterial);
                    }
                    break;

                case 'companion-star':
                     // Similar to star but potentially smaller
                     shape = new THREE.Mesh(
                        new THREE.SphereGeometry(nodeSize * 0.4), // Smaller than primary
                        new THREE.MeshLambertMaterial({
                            color: node.color,
                            emissive: node.color,
                            emissiveIntensity: 0.5
                        })
                    );
                    break;

                default:
                    // Default shape (small sphere) for unknown types
                    shape = new THREE.Mesh(
                        new THREE.SphereGeometry(nodeSize * 0.2),
                        new THREE.MeshLambertMaterial({ color: node.color || '#888888' })
                    );
                    break;
            }
        } catch (e) {
            console.error("Error creating node object:", e, node);
            // Fallback shape on error
            shape = new THREE.Mesh(
                new THREE.SphereGeometry(0.5),
                new THREE.MeshBasicMaterial({ color: 0xff0000 }) // Red sphere indicates error
            );
        }

        // Add text label sprite? (Optional, can impact performance)
        /*
        const sprite = new SpriteText(node.name);
        sprite.material.depthWrite = false; // Make sprite background transparent
        sprite.color = node.color || 'lightgrey';
        sprite.textHeight = 1.5;
        sprite.position.y = nodeSize * 0.6; // Position label above node
        shape.add(sprite);
        */

        return shape;
    });
}


/**
 * Customizes the appearance of links using THREE.js (e.g., dashed lines)
 * @param {Object} graph - The ForceGraph3D object
 */
function customizeLinkAppearance(graph) {
    if (typeof THREE !== 'object') return;

    graph.linkThreeObject(link => {
        // Default: ForceGraph3D handles solid lines.
        // Return null to use default line geometry.
        // Modify this function to return a custom THREE.Line object
        // if you need dashed lines or other effects.

        if (link.dashed) {
            // Create a dashed line material
            const material = new THREE.LineDashedMaterial({
                color: link.color || 0xffffff,
                linewidth: link.width || 0.1, // Note: linewidth may not work on all platforms
                scale: 1,
                dashSize: 0.5, // Length of dashes
                gapSize: 0.3   // Length of gaps
            });

            // Create geometry (a line segment)
            const geometry = new THREE.BufferGeometry();
            // Define points (start and end will be set by the library)
            geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3)); // Placeholder points

            const line = new THREE.Line(geometry, material);
            // Required for dashed lines: compute line distances
            line.computeLineDistances();
            return line;
        }

        return null; // Use default line object for non-dashed links
    });

    // Adjust line positions based on node objects
    graph.linkPositionUpdate((line, { start, end }, link) => {
        if (!line) return; // No custom object

        const startNode = link.source;
        const endNode = link.target;

        if (typeof startNode === 'string' || typeof endNode === 'string') {
             // Sometimes nodes might be represented by IDs initially
            return;
        }

        // Calculate offset based on node size (approximate)
        const startVec = new THREE.Vector3(start.x, start.y, start.z);
        const endVec = new THREE.Vector3(end.x, end.y, end.z);
        const lineDir = endVec.clone().sub(startVec).normalize();

        const startOffset = (startNode.val || 1) * 0.5; // Approximate radius offset
        const endOffset = (endNode.val || 1) * 0.5;

        const adjustedStart = startVec.add(lineDir.clone().multiplyScalar(startOffset));
        const adjustedEnd = endVec.sub(lineDir.clone().multiplyScalar(endOffset));


        if (line instanceof THREE.Line) {
            const positions = line.geometry.attributes.position.array;
            positions[0] = adjustedStart.x;
            positions[1] = adjustedStart.y;
            positions[2] = adjustedStart.z;
            positions[3] = adjustedEnd.x;
            positions[4] = adjustedEnd.y;
            positions[5] = adjustedEnd.z;
            line.geometry.attributes.position.needsUpdate = true;

            // Important for dashed lines
            if (line.material instanceof THREE.LineDashedMaterial) {
                line.computeLineDistances();
            }
        }
    });
}

/**
 * Creates a texture for the star glow effect
 * @returns {THREE.Texture}
 */
function createGlowTexture() {
    if (typeof THREE !== 'object') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');

    const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

/**
 * Focuses the camera on a specific node
 * @param {Object} graph - The graph instance
 * @param {Object} node - The node to focus on
 * @param {number} distance - Distance from the node
 * @param {number} duration - Transition duration in ms
 */
function focusNode(graph, node, distance = 50, duration = 1500) {
    if (!graph || !node || typeof node.x === 'undefined') return;

    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance }; // Handle case where node is at (0,0,0)

    graph.cameraPosition(
        newPos, // New position
        { x: node.x, y: node.y, z: node.z }, // Look-at point (node center)
        duration // Transition duration
    );
}


/**
 * Creates HTML content for the tooltip
 * @param {Object} node - The node data
 * @returns {string} HTML string for the tooltip
 */
function createTooltip(node) {
    if (!node || !node.properties) {
        return node ? `<strong>${node.name || node.id}</strong><br>Type: ${node.type || 'Unknown'}` : '';
    }

    let details = `<strong>${node.name}</strong><br>Type: ${node.type}`;
    const props = node.properties;

    switch (node.type) {
        case 'star':
            details += `<br>Class: ${props.spectralType} (${props.stellarEvolution || 'main-sequence'})`;
            details += `<br>Mass: ${props.mass?.toFixed(2)} M☉`;
            details += `<br>Planets: ${props.planets?.length || 0}`;
            break;
        case 'planet':
            details += `<br>System: ${props.star?.name || 'Unknown'}`;
            details += `<br>Type: ${props.type}`;
            details += `<br>Habitability: ${props.habitability?.toFixed(0)}%`;
            if (props.civilization) {
                details += `<br>Inhabited by: ${props.civilization.name}`;
            }
            break;
        case 'civilization':
            details += `<br>Home: ${props.homePlanet?.name || 'Unknown'}`;
            details += `<br>Tech Level: ${props.technologicalLevel}`;
            details += `<br>Traits: ${props.traits?.join(', ')}`;
            break;
        case 'megastructure':
            details += `<br>Structure: ${props.structure || 'Unknown'}`;
             details += `<br>Location: Planet ${props.location?.name || props.location?.id || 'Unknown'}`;
            break;
         case 'companion-star':
            details += `<br>Primary: ${props.primary?.name || 'Unknown'}`;
            details += `<br>Mass: ${props.mass?.toFixed(2)} M☉`;
            details += `<br>Orbit: ${props.orbitDistance?.toFixed(1)} AU`;
            break;
    }
    return details;
}

// Export visualization functions
window.GalaxyVisualization = {
    createGalaxyVisualization,
    focusNode,
    createTooltip
    // Note: Internal helpers like customizeNodeAppearance are not exported by default
};

console.log("galaxy-visualization.js loaded successfully");