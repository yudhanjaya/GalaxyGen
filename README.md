# Galaxy Generator

Generates stars, populates them with planets, and even introduces civilizations that can span multiple worlds. The result is visualized in an interface that kind of mimics low-key terminal vibes but also does contain a proper 3D visualization that you can click, drag, and interact with. 

![Screenshot_7](https://github.com/yudhanjaya/GalaxyGen/assets/16394240/9ebd578c-6be0-4f6d-901d-6a10b732d01e)

Parts of this were written for the follow-up to my novel, Pilgrim Machines (a follow-up to the Salvage Crew) but I ended up not using it. This current version is essentially v2 with changes to the names, the rules on how civilizations interacty with planets, and rewritten using Anthropic's Claude 3.5 Sonnet to generate a visualization. 

## Features

- Procedural generation of stars, planets, and civilizations
- 3D visualization of the universe using Three.js and 3D Force-Directed Graph
- Interactive exploration: click on objects to view their properties
- Distinct visual representation for stars, planets, and civilizations
- Overview of universe statistics
- Export universe data to CSV

## Installation and Usage

This project doesn't require any build steps or additional dependencies. It uses CDN-hosted libraries for simplicity.


1. Open the `index.html` file in a web browser.
2. The universe will be automatically generated and visualized.
3. Use your mouse to interact with the 3D visualization:
   - Left-click and drag to rotate the view
   - Right-click and drag to pan
   - Scroll to zoom in/out
4. Click on any star, planet, or civilization to view its properties in the right panel.
5. The bottom right panel shows an overview of the universe.
6. Click the "Save to CSV" button to download the universe data as a CSV file.


## To-do

1. Fix data export. Right now, the CSV that is exported is a very simple version of the more detailed CSVs that I generated with V1 and V2. Make it dump to proper csv or graphml.
2. Data import. So that you can continuously revisit a generated universe. 
3. See if we can make this better resemble a galaxy. Right now, the nature of the Force-directed visualization means that we get irregular galaxies. It would be nice to be able to do elliptical or spiral. Add the supermassive black hole at the center. This may require some overhauls in how stars connect to each other. 
4. Generation settings.
5. Improved name generation. V1 and V2 gave me scrabble sounding names which is fair because I lifted quite a bit of the syllables of scrabble words. V3 however gives me extremely boring names over and over again. So see if we can improve this a little bit by adding other languages, other syllable sets. 
6. Big overhaul, see if we can visually make nodes resemble their properties.
   
## Customization

You can customize the universe generation by modifying the following parameters in the `generateAndVisualizeUniverse` function:

- Change the number of stars by modifying the argument in `generateUniverse(100)`.
- Adjust the probability of civilization occurrence in the `attachCivilizations` function.
- Modify the color scheme by changing the color values in the `processUniverseData` function.

## Contributing

Contributions to the Universe Generator are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [3D Force-Directed Graph](https://github.com/vasturiano/3d-force-graph) library by Vasco Asturiano
- [Three.js](https://threejs.org/) for 3D rendering

## Contact

If you have any questions, feel free to reach out to @yudhanjaya or open an issue in this repository.
