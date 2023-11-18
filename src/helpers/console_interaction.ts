import * as readline from 'readline';
import { Location } from '../utils/locationCodes';
import { Radius } from '../utils/radius';
import { scrapeData } from './scrape';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
  }

export async function console_interaction() {
  try {
    console.log('Welcome to the eBay Kleinanzeigen Webscraper!');

    // Select Location
    const locationChoice = await askQuestion('Select a location: ' + Object.keys(Location).join(', ') + '\n');
    const location = Location[locationChoice as keyof typeof Location];

    // Select Radius
    const radiusChoice = await askQuestion('Select a radius in kilometers: ' + Object.keys(Radius).join(', ') + '\n');
    const radius = Radius[radiusChoice as keyof typeof Radius];

    // Select Product
    const product = await askQuestion('Enter the product to search for: ');

    // Construct the URL
    let url = `https://www.kleinanzeigen.de/s-${location.city}-${location.bundesland}/${product.replace(/\s+/g, '-')}/${location.code}`;
    if (radius !== '') {
      url += radius;
    }

    console.log(`Searching for ${product} in ${locationChoice} within ${radiusChoice === '' ? 'no specific radius' : radiusChoice + ' km'}...`);
    console.log(`URL: ${url}`);

    await scrapeData(url);

    rl.close();
  } catch (error) {
    console.error('Error:', error);
    rl.close();
  }
}
