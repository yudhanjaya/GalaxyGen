/* This script creates a simulation of a universe, complete with stars, planets, and civilizations. It generates all these entities with random properties and then writes the details to CSV files.

Here's a general rundown of what the script does:

The script defines three classes: Planet, Star, and Civilization.
Each class has a constructor that assigns random properties to its instances when they're created. For example, a Star has properties such as name, mass, luminosity, temperature, size, spectral type, age, rotation, and planets. The Planet class includes properties like name, size, mass, composition, atmosphere, orbit, temperature, moons, magnetic field, and rings. The Civilization class includes properties such as homePlanet, homeStar, isActive, and territory.

It then defines a few utility functions:
generateUniverse(numStars): This function generates an array of Star instances, each with a random number of Planet instances.
generateCivilizations(universe, numCivilizations): This function generates an array of Civilization instances, each associated with a random Star and Planet from the provided universe. It also randomly assigns an activity status to each civilization.
The script uses the csv-writer package to generate CSV files that detail the properties of the universe and civilizations. The generateUniverseCSV(universe) function writes the details of the stars and their planets to a CSV file, and the generateCivilizationCSV(civilizations) function writes the details of the civilizations to another CSV file.
Finally, the script generates a universe with 100 stars and a random number of civilizations (between 17 and 61), writes their details to CSV files, and logs the string representation of each civilization to the console.
If you run this script in a Node.js environment and have the csv-writer package installed, it will create two CSV files: universe.csv and civilizations.csv. The universe.csv file will contain details about each star and its planets, and the civilizations.csv file will contain details about each civilization, the stars and planets they occupy, and whether they're active or not. You'll also see details about each civilization logged to the console.
*/
const fs = require('fs'); // need nodejs
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


// Define the Planet class
class Planet {
    constructor() {
        // Assign random properties to the planet upon creation
        this.name = this.generateName();
        this.size = this.generateSize();
        this.mass = this.generateMass();
        this.composition = this.generateComposition();
        this.atmosphere = this.generateAtmosphere();
        this.orbit = this.generateOrbit();
        this.temperature = this.generateTemperature();
        this.moons = this.generateMoons();
        this.magneticField = this.generateMagneticField();
        this.rings = this.generateRings();
    }

    // The following methods generate random properties for the planet

    generateName() {
        // Generate a random string to serve as the planet's name
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    generateSize() {
        // Randomly assign a size category to the planet
        const sizes = ['small', 'medium', 'large'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    generateMass() {
        // Generate a random mass for the planet (in Earth masses)
        return +(Math.random() * (5.0 - 0.01) + 0.01).toFixed(2);
    }

    generateComposition() {
        // Randomly assign a composition to the planet
        const compositions = ['gas', 'ice', 'rocky'];
        return compositions[Math.floor(Math.random() * compositions.length)];
    }

    generateAtmosphere() {
        // Randomly assign an atmosphere type to the planet
        const atmospheres = ['thin', 'moderate', 'dense'];
        return atmospheres[Math.floor(Math.random() * atmospheres.length)];
    }

    generateOrbit() {
        // Generate a random orbit value for the planet
        return Math.random();
    }

    generateTemperature() {
        // Generate a random temperature for the planet (in Celsius)
        return Math.floor(Math.random() * (500 + 200) - 200);
    }

    generateMoons() {
        // Generate a random number of moons for the planet
        return Math.floor(Math.random() * 11);
    }

    generateMagneticField() {
        // Randomly decide whether the planet has a magnetic field
        return Math.random() < 0.5;
    }

    generateRings() {
        // Randomly decide whether the planet has rings
        return Math.random() < 0.5;
    }
}

// Define the Star class
class Star {
    constructor() {
        // Assign random properties to the star upon creation
        this.name = this.generateName();
        this.mass = this.generateMass();
        this.luminosity = this.generateLuminosity();
        this.temperature = this.generateTemperature();
        this.size = this.generateSize();
        this.spectralType = this.generateSpectralType();
        this.age = this.generateAge();
        this.rotation = this.generateRotation();
        this.planets = this.generatePlanets();
        // Assign random 3D coordinates to the star
        this.x = this.generateCoordinate();
        this.y = this.generateCoordinate();
        this.z = this.generateCoordinate();
    }

    generateCoordinate() {
        // Generate a random coordinate value for the star
        return Math.random() * 1000 - 500; // for example, this will generate a value between -500 and 500
    }

    // The following methods generate random properties for the star

    generateName() {
        // Generate a random string to serve as the star's name
        return Math.random().toString(36).substring(2, 7).toUpperCase();
    }

    generateMass() {
        // Generate a random mass for the star (in solar masses)
        return +(Math.random() * (50 - 0.08) + 0.08).toFixed(2);
    }

    generateLuminosity() {
        // Generate a random luminosity for the star (in solar luminosities)
        return +(Math.random() * (1000 - 0.01) + 0.01).toFixed(2);
    }

    generateTemperature() {
        // Generate a random temperature for the star (in Kelvin)
        return Math.floor(Math.random() * (50000 - 2000) + 2000);
    }

    generateSize() {
        // Randomly assign a size category to the star
        const sizes = ['dwarf', 'medium', 'giant', 'supergiant'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }

    generateSpectralType() {
        // Randomly assign a spectral type to the star
        const types = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
        return types[Math.floor(Math.random() * types.length)];
    }

    generateAge() {
        // Generate a random age for the star (in billions of years)
        return +(Math.random() * (13.8 - 0.01) + 0.01).toFixed(2);
    }

    generateRotation() {
        // Generate a random rotation period for the star (in days)
        return +(Math.random() * (100 - 0.1) + 0.1).toFixed(2);
    }

    generatePlanets() {
        // Generate a random number of planets for the star
        let planetCount = Math.floor(Math.random() * 10) + 1; // Between 1 and 10 planets
        let planets = [];
        for (let i = 0; i < planetCount; i++) {
            planets.push(new Planet());
        }
        return planets;
    }
}

function generateCivilizationName() {
  // Fictional prefixes based on a mixture of real-world inspired names, Latin translations, and Japanese/Indonesian-inspired names
  const namePrefixes = ["Solyp", "Lunari", "Flum", "Praed", "Vicu", "Nauta", "Bellyp", "Regalo", "Artex", "Civi", "Glady", "Aedifi", "Viae", "Vallis", "Monti", "Aurum", "Argen", "Ferro", "Libert", "Paxt", "Imperi", "Sapie", "Amor", "Vita", "Nocte", "Lumen", "Spiri", "Vox", "Kenshi", "Haru", "Sumi", "Jaya", "Dewi", "Bali", "Yoshi", "Nami"];
  const nameSuffixes = ["ian", "ite", "an", "in", "ish", "ese", "ic", "ish", "ese", "tec", "tec", "tec", "ing", "ol", "ese", "ese", "ese", "man", "ite", "ian", "ician", "ic", "ic", "ic", "ic", "an", "an", "al", "to", "ka", "naka", "gawa", "jima", "shima", "ndo", "sari", "wati", "rama", "tari"];

  // Randomly pick a prefix and suffix
  const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
  const suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];

  // Combine the prefix and suffix to form a civilization name
  const civilizationName = prefix + suffix;
  
  return civilizationName;
}

// Define the Civilization class
class Civilization {
    constructor(homePlanet, homeStar, isActive, name) {
        // Assign properties to the civilization upon creation
        this.homePlanet = homePlanet;
        this.homeStar = homeStar;
        this.isActive = isActive;
        this.territory = [{
            star: homeStar,
            planets: homeStar.planets
        }];
        this.name = generateCivilizationName();
    }


    expandTerritory(adjacentStars) {
        // Expand the civilization's territory to a random number of adjacent stars
        const expansionSize = Math.floor(Math.random() * adjacentStars.length);
        this.territory.push(...adjacentStars.slice(0, expansionSize).map(star => ({
            star: star,
            planets: star.planets
        })));
    }

    toString() {
        // Return a string representation of the civilization
        const status = this.isActive ? "Active" : "Dead";
        const territoryStars = this.territory.map(star => star.name).join(', ');
        return `${status} civilization from planet ${this.homePlanet.name} of star ${this.homeStar.name}. Territory includes ${territoryStars} stars.`;
    }
}

function generateUniverse(numStars) {
    // Generate a universe with a specified number of stars
    const universe = [];
    for (let i = 0; i < numStars; i++) {
        universe.push(new Star());
    }
    return universe;
}


async function generateUniverseCSV(universe) {
    const csvWriter = createCsvWriter({
        path: 'universe.csv',
        header: [{
                id: 'starName',
                title: 'Star Name'
            },
            {
                id: 'starMass',
                title: 'Star Mass'
            },
            {
                id: 'starLuminosity',
                title: 'Star Luminosity'
            },
            {
                id: 'starTemperature',
                title: 'Star Temperature'
            },
            {
                id: 'starSize',
                title: 'Star Size'
            },
            {
                id: 'starSpectralType',
                title: 'Star Spectral Type'
            },
            {
                id: 'starAge',
                title: 'Star Age'
            },
            {
                id: 'starRotation',
                title: 'Star Rotation'
            },
            {
                id: 'planetName',
                title: 'Planet Name'
            },
            {
                id: 'planetSize',
                title: 'Planet Size'
            },
            {
                id: 'planetMass',
                title: 'Planet Mass'
            },
            {
                id: 'planetComposition',
                title: 'Planet Composition'
            },
            {
                id: 'planetAtmosphere',
                title: 'Planet Atmosphere'
            },
            {
                id: 'planetOrbit',
                title: 'Planet Orbit'
            },
            {
                id: 'planetTemperature',
                title: 'Planet Temperature'
            },
            {
                id: 'planetMoons',
                title: 'Planet Moons'
            },
            {
                id: 'planetMagneticField',
                title: 'Planet Magnetic Field'
            },
            {
                id: 'planetRings',
                title: 'Planet Rings'
            },
        ]
    });

    const records = [];

    for (const star of universe) {
        for (const planet of star.planets) {
            records.push({
                starName: star.name,
                starMass: star.mass,
                starLuminosity: star.luminosity,
                starTemperature: star.temperature,
                starSize: star.size,
                starSpectralType: star.spectralType,
                starAge: star.age,
                starRotation: star.rotation,
                planetName: planet.name,
                planetSize: planet.size,
                planetMass: planet.mass,
                planetComposition: planet.composition,
                planetAtmosphere: planet.atmosphere,
                planetOrbit: planet.orbit,
                planetTemperature: planet.temperature,
                planetMoons: planet.moons,
                planetMagneticField: planet.magneticField,
                planetRings: planet.rings
            });
        }
    }

    await csvWriter.writeRecords(records);
    console.log('The universe CSV file was written successfully');
}


function generateCivilizations(universe, numCivilizations) {
    // Generate a specified number of civilizations in the universe
    const civilizations = [];
    for (let i = 0; i < numCivilizations; i++) {
        // Randomly select a star and a planet within that star's system
        const homeStar = universe[Math.floor(Math.random() * universe.length)];
        const homePlanet = homeStar.planets[Math.floor(Math.random() * homeStar.planets.length)];

        // Randomly determine if the civilization is active
        const isActive = Math.random() < 0.5;

        // Create a new Civilization instance with the home planet, home star, and activity status
        const civilization = new Civilization(homePlanet, homeStar, isActive);

        civilizations.push(civilization);
    }

    // After all civilizations are created, allow them to expand their territories
    for (const civ of civilizations) {
        const homeIndex = universe.indexOf(civ.homeStar);
        // Adjacent stars are those next to the home star in the universe array
        const adjacentStars = universe.slice(Math.max(0, homeIndex - 1), Math.min(universe.length, homeIndex + 2)).filter(star => star !== civ.homeStar);
        civ.expandTerritory(adjacentStars);
    }

    return civilizations;
}


// generates civilizations csv
async function generateCivilizationCSV(civilizations) {
    const csvWriter = createCsvWriter({
        path: 'civilizations.csv',
        header: [{
                id: 'starName',
                title: 'Star Name'
            },
            {
                id: 'planetName',
                title: 'Planet Name'
            },
            {
                id: 'name',
                title: 'Civilization Name'
            },   
            
            {
                id: 'civilizationStatus',
                title: 'Civilization Status'
            },
            {
                id: 'isHomePlanet',
                title: 'Is Home Planet'
            },
            {
                id: 'isHomeStar',
                title: 'Is Home Star'
            }
        ]
    });

    const records = [];

    for (const civilization of civilizations) {
        for (const territory of civilization.territory) {
            for (const planet of territory.planets) {
                records.push({
                    starName: territory.star.name,
                    planetName: planet.name,
                    civilizationStatus: civilization.isActive ? 'Active' : 'Dead',
                    name: civilization.name,
                    isHomePlanet: planet === civilization.homePlanet ? 'Yes' : 'No',
                    isHomeStar: territory.star === civilization.homeStar ? 'Yes' : 'No'
                });
            }
        }
    }

    await csvWriter.writeRecords(records);
    console.log('The civilization CSV file was written successfully');
}

// Generate a universe with 100 stars, then generate the csv
const universe = generateUniverse(100);
generateUniverseCSV(universe);

// Generate between 17 and 61 civilizations
const numCivilizations = Math.floor(Math.random() * (61 - 17 + 1)) + 17;
const civilizations = generateCivilizations(universe, numCivilizations);

// Print all civilizations
for (const civ of civilizations) {
    console.log(civ.toString());
}

// Generate the civilizations csv
generateCivilizationCSV(civilizations);
