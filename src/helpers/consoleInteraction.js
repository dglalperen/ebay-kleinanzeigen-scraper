import { scrapeData } from "./scrape.js";
import { Radius } from "../utils/radius.js";
import { Location } from "../utils/location.js";
import inquirer from "inquirer";

async function consoleInteraction() {
  try {
    console.log("Welcome to the eBay Kleinanzeigen Webscraper!");

    // Select Location
    const locationAnswers = await inquirer.prompt([
      {
        type: "list",
        name: "location",
        message: "Select a location:",
        choices: Object.keys(Location),
      },
    ]);
    const location = Location[locationAnswers.location];

    // Select Radius
    const radiusAnswers = await inquirer.prompt([
      {
        type: "list",
        name: "radius",
        message: "Select a radius in kilometers:",
        choices: Object.keys(Radius),
      },
    ]);
    const radius = Radius[radiusAnswers.radius];

    // Select Product
    const productAnswers = await inquirer.prompt([
      {
        type: "input",
        name: "product",
        message: "Enter the product to search for:",
      },
    ]);
    const product = productAnswers.product;

    // Construct the URL
    let url = `https://www.kleinanzeigen.de/s-${location.city}-${
      location.bundesland
    }/${product.replace(/\s+/g, "-")}/${location.code}`;
    if (radius !== "") {
      url += radius;
    }

    console.log(
      `Searching for ${product} in ${location.city} within ${
        radius === "" ? "no specific radius" : radius + " km"
      }...`
    );
    console.log(`URL: ${url}`);

    await scrapeData(url);
  } catch (error) {
    console.error("Error:", error);
  }
}

export { consoleInteraction };
