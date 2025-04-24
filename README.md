# Yudha's Starmap

## Welcome!

This project is an interactive **procedural galaxy generator** built with JavaScript, HTML, and CSS. It creates unique, explorable 3D universes filled with stars, planets, and even fledgling civilizations right in your web browser.

I built the original version in R; then over the years I made a couple of slow attempts to move everything to JavaScript. This version is the latest and greatest, built largely for a keynote at the University of Bergen in 2025. 



## Features

* **Galaxy Shapes:** Generate galaxies attempting Spiral, Elliptical, or Irregular structures based on different coordinate generation algorithms.
* **Customizable Parameters:** Use sliders to control the number of stars (up to limits defined in `galaxy-core.js`) and the likelihood of civilizations appearing.
* **Detailed Universe:**
    * **Stars:** Generated with properties like mass, temperature, spectral type (O, B, A, F, G, K, M), luminosity, age, evolutionary stage (main sequence, red giant, etc.), and coordinates based on galaxy type. Binary systems can form.
    * **Planets:** Generated with type (terrestrial, gas giant, ice giant, molten, rocky, frozen), orbital distance, radius, mass, gravity, basic composition, atmosphere, temperature, water state, moons, day/year length, magnetic field, rings, and a calculated habitability score.
    * **Civilizations (Optional):** Can emerge on habitable planets, possessing unique names, traits (aggressive, peaceful, etc.), technological levels, government types, expansion policies, and relationships with neighbors.
* **Interactive 3D View:** Explore the generated galaxy using `3d-force-graph`.
    * **Navigation:** Left-drag to rotate, Right-drag to pan, Scroll to zoom.
    * **Interaction:** Hover over objects for tooltips, Click objects to select them.
* **Information Sidebar:**
    * View detailed properties of selected objects (stars, planets, civilizations).
    * Tabs provide Overview, Details, and potentially narrative Descriptions (if `galaxy-descriptions.js` is present).
    * See overall galaxy statistics and generation controls.
* **Data Export (Optional):** If `galaxy-export.js` is present, export galaxy data to CSV or JSON.

## How to Run

1.  **Download/Clone:** Get all the project files (`.html`, `.js`).
2.  **Directory:** Place all files (`index.html`, `galaxy-core.js`, etc.) together in the **same folder**.
3.  **Browser:** Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended). An internet connection is needed for external libraries (`Three.js`, `3d-force-graph`).
4.  **Explore:** Use the controls (now in the bottom-right panel) to generate galaxies and the mouse/sidebar to explore!

## How does this work?

This is essentially the realm of procedural generation. Instead of manually creating every single star and planet (which would take forever!), procedural generation uses **algorithms** (sets of rules and instructions) combined with **randomness** to create complex content automatically. We define the *rules* for how a star should form, how planets orbit, or what makes a planet habitable, and then let the computer generate the specific details based on those rules and random chance.

This project shows a few key proc-gen ideas (and some that are salient for my lecture):

1.  **Parameters & Randomness (`index.html`, `galaxy-core.js`, `galaxy-generator.js`):**
    * The UI sliders (`index.html`) provide high-level **parameters**.
    * `galaxy-generator.js` reads these parameters.
    * Throughout the code (especially in `galaxy-classes.js`), `window.GalaxyCore.getRandomNumber()` and `window.GalaxyCore.getRandomElement()` are used to introduce **controlled randomness**. Notice how random numbers aren't just picked wildly, but often within specific ranges or based on probabilities (like `civProbability`).

2.  **Rule-Based Systems (`galaxy-classes.js`):**
    * Look at the `Star` and `Planet` classes. Their constructors are full of **rules**.
    * *Example Rule (Planet Type):* The `determinePlanetType` method uses rules based on orbital distance and star luminosity to decide if a planet is likely molten, terrestrial, gas giant, etc.
    * *Example Rule (Star Evolution):* `calculateEvolution` uses the star's mass and age to determine if it's main-sequence, a red giant, or another stage.

3.  **Layered Generation (`galaxy-generator.js`):**
    * Generation happens in **steps**: Stars first, then planets around stars, then civilizations on habitable planets.
    * This layering allows dependencies: planet generation depends on the star's properties; civilization generation depends on the planet's properties.

4.  **Shaping Functions (`galaxy-classes.js` - `generateCoordinates` methods):**
    * The `generateSpiralCoordinates` and `generateEllipticalCoordinates` methods use mathematical functions (trigonometry, Gaussian distribution) combined with parameters and randomness to **shape** the distribution of stars, attempting to create something other than a uniform random cloud. This is a common technique in proc-gen.

5.  **Data Representation (`galaxy-classes.js`):**
    * The `Star`, `Planet`, `Civilization`, and `Artifact` classes act as **data structures** or blueprints. The proc-gen process fills in the specific properties for each instance of these classes.

6.  **Emergence:**
    * While not explicitly programmed, you might observe **emergent** patterns. Dense star clusters might form naturally from the coordinate algorithms. Chains of habitable planets might appear. Conflicts between civilizations with opposing traits might seem inevitable, even though only their initial relationship was determined by rules. This is the magic of complex systems arising from simpler rules!


## Exploring the Code

* **`galaxy-core.js`:** Start here to see base constants (like `LIMITS`, `SPECTRAL_TYPES`) and utility functions. Changing constants here directly affects generation outcomes.
* **`galaxy-classes.js`:** The heart of the generation logic. Look at the `constructor` and helper methods within each class (`Star`, `Planet`, `Civilization`) to understand the rules. See how coordinate generation differs for galaxy types.
* **`galaxy-generator.js`:** See how the overall process is orchestrated step-by-step and how modules are used together.
* **`galaxy-visualization.js`:** Explore how the generated data is mapped to visual properties (color, size) and rendered using `3d-force-graph`.
* **`galaxy-ui.js`:** See how user input is handled and how the different display panels are updated.

Have fun!