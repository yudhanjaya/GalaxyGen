# GalaxyGen

This code generates a fictional universe with stars, planets, and civilizations, and exports the generated data to CSV files.

Here's a breakdown of what the code does:

The code imports necessary modules: fs (Node.js file system module) and createCsvWriter (a library for creating CSV files).

The code defines two classes: Planet and Star. These classes represent the properties and behavior of planets and stars, respectively. Each instance of a Planet or Star is initialized with random properties.

The code defines a function generateCivilizationName() that generates random civilization names based on predefined prefixes and suffixes.

The code defines the Civilization class. Each civilization is initialized with a home planet, home star, activity status, territory, and name. The Civilization class has a method expandTerritory() that allows a civilization to expand its territory to adjacent stars.

The code defines a function generateUniverse() that generates a universe with a specified number of stars.

The code defines an async function generateUniverseCSV() that takes a universe as input and exports the star and planet data to a CSV file using createCsvWriter.

The code defines a function generateCivilizations() that generates a specified number of civilizations in the given universe. Each civilization is created with a random home star and planet. After all civilizations are created, they are allowed to expand their territories to adjacent stars.

The code defines an async function generateCivilizationCSV() that takes civilizations as input and exports the civilization data to a CSV file using createCsvWriter.

The code generates a universe with 100 stars and exports the star and planet data to a CSV file using generateUniverseCSV().

The code generates a random number of civilizations between 17 and 61, and generates the civilizations using generateCivilizations(). It then prints the details of each civilization.

The code exports the civilization data to a CSV file using generateCivilizationCSV().

Overall, the code simulates a fictional universe with stars, planets, and civilizations, and exports the generated data to CSV files for further analysis or usage.
