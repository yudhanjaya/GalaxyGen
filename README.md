# Yudha's Starmap

## Welcome!

This project is an interactive **procedural galaxy generator** built with JavaScript, HTML, and CSS. It creates unique, explorable 3D universes filled with stars, planets, and even fledgling civilizations right in your web browser.

I built the original version in R; then over the years I made a couple of slow attempts to move everything to JavaScript. This version is the latest and greatest, built largely for a keynote at the University of Bergen in 2025. Look! We have stars, planets . . . 

![Screenshot_1](https://github.com/user-attachments/assets/bcfdf6d4-64f3-477e-860e-039ca8b65730)

and even civilizations!

![Screenshot_2](https://github.com/user-attachments/assets/b72c7563-28d8-4d62-91c4-3f2aa4eb7c06)

We define the *rules* for how a star should form, how planets orbit, or what makes a planet habitable, and then let the program generate the specific details based on rulesets and random chance. Of course, we take a lot of inspiration from games, especially the bigs ones - Stellaris, Endless Space II, Sins of a Solar Empire, and so on, as well as the Wikipedia page on star distributions. While we don't have anything remotely as complex as those game systems, you'll see certain tocuhes - like the policy selections for alien species - that make a lot of sense once you understand where I'm coming from.


## Features


* **Parameterized Generation:** Control high-level outcomes using simple UI parameters:
    * **Galaxy Shape (`index.html`, `galaxy-classes.js`):** Choose between Spiral, Elliptical, or Irregular. Each uses a different mathematical algorithm in `galaxy-classes.js` (`generateSpiralCoordinates`, `generateEllipticalCoordinates`, etc.) to determine the initial placement of stars, demonstrating how different rule sets create distinct large-scale structures.
    * **Star Count (`index.html`, `galaxy-generator.js`):** Directly sets the target number of stars, influencing galaxy density. The actual number is capped by `LIMITS.MAX_STARS` in `galaxy-core.js`.
    * **Civilization Chance (`index.html`, `galaxy-generator.js`):** A probability factor influencing how likely civilizations are to emerge on suitable planets, demonstrating probability-based procedural content.

* **Rule-Based Object Creation (`galaxy-classes.js`):** Stars, planets, and civilizations are constructed based on rules:
    * **Stars:** Mass influences temperature, luminosity, spectral type (OBAFGKM), size, and lifespan/evolutionary stage (main sequence, giant, dwarf, etc.). Binary systems can randomly form.
    * **Planets:** Type (terrestrial, gas giant, etc.) is determined by rules based on orbital distance and star properties. Size, mass, gravity, composition, atmosphere, temperature, water presence, moons, rings, and habitability are then calculated based on further rules and constrained randomness.
    * **Civilizations:** Randomly assigned traits, government types, and tech levels influence their behavior and relationships, showcasing procedural agent characteristics.

* **Layered Dependencies (`galaxy-generator.js`):** The generation process builds complexity in layers:
    * Galaxy shape influences star placement.
    * Star properties (luminosity, age) influence planet properties (temperature, habitability).
    * Planet properties (habitability) influence civilization placement.
    * Civilization properties influence their relationships and expansion.

* **Controlled Randomness (`galaxy-core.js`, `galaxy-names.js`, `galaxy-classes.js`):** Random numbers are used throughout, but within specific constraints or based on probabilities, ensuring variety without complete chaos:
    * `getRandomNumber(min, max)` is used for values like mass, age, temperature variations.
    * `getRandomElement(array)` selects from predefined lists for things like names, traits, or planet features.
    * Probabilities (`Math.random() < probability`) determine events like binary system formation, ring presence, or civilization emergence.

* **Emergent Complexity:** While not explicitly programmed, the interaction of these rules can lead to emergent situations like densely populated clusters, isolated systems, hostile neighbors, or chains of potentially habitable worlds. Exploring the output reveals these unplanned complexities.

* **Interactive Visualization (`galaxy-visualization.js`, `index.html`):** The generated data is mapped to visual properties (size, color) and displayed using `3d-force-graph` and `Three.js`, allowing direct interaction and exploration of the procedurally generated universe.

* **Data Persistence (Optional - `galaxy-export.js`):** The generated universe, a complex data structure created procedurally, can be exported, demonstrating how generated content can be saved and potentially reused.

* **Narrative Potential (Optional - `galaxy-descriptions.js`):** Simple rules can generate basic narrative descriptions for civilizations, showing how procedural text can add flavor based on generated properties.

## How to Run

1.  **Download/Clone:** Get all the project files (`.html`, `.js`).
2.  **Directory:** Place all files (`index.html`, `galaxy-core.js`, etc.) together in the **same folder**.
3.  **Browser:** Open `index.html` in a modern web browser (Chrome, Firefox, Edge recommended). An internet connection is needed for external libraries (`Three.js`, `3d-force-graph`).
4.  **Explore:** Use the controls (now in the bottom-right panel) to generate galaxies and the mouse/sidebar to explore!


## Exploring the Code

* **`galaxy-core.js`:** Start here to see base constants (like `LIMITS`, `SPECTRAL_TYPES`) and utility functions. Changing constants here directly affects generation outcomes.
* **`galaxy-classes.js`:** The heart of the generation logic. Look at the `constructor` and helper methods within each class (`Star`, `Planet`, `Civilization`) to understand the rules. See how coordinate generation differs for galaxy types.
* **`galaxy-generator.js`:** See how the overall process is orchestrated step-by-step and how modules are used together.
* **`galaxy-visualization.js`:** Explore how the generated data is mapped to visual properties (color, size) and rendered using `3d-force-graph`.
* **`galaxy-ui.js`:** See how user input is handled and how the different display panels are updated.

Have fun!
