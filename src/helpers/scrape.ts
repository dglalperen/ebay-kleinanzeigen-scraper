import puppeteer from 'puppeteer';

export async function scrapeData(url: string) {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url);
  
    const productData = await page.evaluate(() => {
      const products = Array.from(document.querySelectorAll('.aditem'));
    
      const data = products.map(product => {
        // Extract the title
        const titleElement = product.querySelector('.aditem-main h2 a');
        const title = titleElement ? titleElement.textContent.trim() : null;
    
        // Extract the image URL
        const imageElement = product.querySelector('.aditem-image img');
        const imageUrl = imageElement ? imageElement.baseURI : null;
    
        // Extract the location
        const locationElement = product.querySelector('.aditem-main--top--left');
        const location = locationElement ? locationElement.textContent.trim() : null;
    
        // Extract the description
        const descriptionElement = product.querySelector('.aditem-main--middle--description');
        const description = descriptionElement ? descriptionElement.textContent.trim() : null;
    
        // Extract the price
        const priceElement = product.querySelector('.aditem-main--middle--price-shipping--price');
        const price = priceElement ? priceElement.textContent.trim() : null;
    
        // Extract offer or request (Gesuch)
        const offerOrRequestElement = product.querySelector('.simpletag');
        const offerOrRequest = offerOrRequestElement ? offerOrRequestElement.textContent.trim() : null;
    
        return {
          title,
          imageUrl,
          location,
          description,
          price,
          offerOrRequest
        };
      });
    
      return data;
    });
  
    console.log('productData', productData);
    await browser.close();
  }