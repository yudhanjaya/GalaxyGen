# GalaxyGen

This code generates a fictional universe with stars, planets, and civilizations, and exports the generated data to CSV files. Repl here: https://replit.com/@YudhanjayaWije1/Galaxy-Gen?v=1

V1 is the deprecated older version, which I initally wrote in R and tried to visualize in JS. V2 here is the first JS version.

This version (universe.js) outputs universe.csv and civilizations.csv. 

Here's a general breakdown of what the code does:

1. The code imports necessary modules: `fs` (Node.js file system module) and `createCsvWriter` (a library for creating CSV files).

2. The code defines two classes: `Planet` and `Star`. These classes represent the properties and behavior of planets and stars, respectively. Each instance of a `Planet` or `Star` is initialized with random properties.

3. The code defines a function `generateCivilizationName()` that generates random civilization names based on predefined prefixes and suffixes.

4. The code defines the `Civilization` class. Each civilization is initialized with a home planet, home star, activity status, territory, and name. The `Civilization` class has a method `expandTerritory()` that allows a civilization to expand its territory to adjacent stars.

5. The code defines a function `generateUniverse()` that generates a universe with a specified number of stars.

6. The code defines an `async` function `generateUniverseCSV()` that takes a universe as input and exports the star and planet data to a CSV file using `createCsvWriter`.

7. The code defines a function `generateCivilizations()` that generates a specified number of civilizations in the given universe. Each civilization is created with a random home star and planet. After all civilizations are created, they are allowed to expand their territories to adjacent stars.

8. The code defines an `async` function `generateCivilizationCSV()` that takes civilizations as input and exports the civilization data to a CSV file using `createCsvWriter`.

9. The code generates a universe with 100 stars and exports the star and planet data to a CSV file using `generateUniverseCSV()`.

10. The code generates a random number of civilizations between 17 and 61, and generates the civilizations using `generateCivilizations()`. It then prints the details of each civilization.

11. The code exports the civilization data to a CSV file using `generateCivilizationCSV()`.

Next step: visualization.
