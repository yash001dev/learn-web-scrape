const { default: puppeteer } = require("puppeteer");

async function getImagesFromSrcset(url,targetElementSelector='.photoswipe__image') {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    
    const imageSrc = await page.evaluate(() => {
        const imgElement = document.querySelector(targetElementSelector); // Update the selector accordingly
        if (!imgElement) {
        throw new Error('Image element not found');
        }
    
        const src = imgElement.getAttribute('data-photoswipe-src') || imgElement.getAttribute('src');
        return src;
    });
    
    await browser.close();
    
    return imageSrc;
    
}
module.exports = getImagesFromSrcset;