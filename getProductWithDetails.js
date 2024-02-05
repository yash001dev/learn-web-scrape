const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://www.casewale.com/collections/iphone-15-pro-max";
const mainUrl = "https://www.casewale.com";
let convertedString = (originalString) =>
  originalString.toLowerCase().replace(/\s+/g, "-");

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  // page.on("console", (consoleObj) => console.log(consoleObj.text()));
  await page.goto(url, { waitUntil: "load" });

  const bookData = await page.evaluate(() => {
    const bookPods = Array.from(
      document.querySelectorAll(".grid-product__content")
    );

    const data = bookPods.map((pod) => {
      const priceElement = pod.querySelector("a .money");
      const price = priceElement ? priceElement.innerHTML : null;
      const title = pod.querySelector(".grid-product__title").innerText;
      const imgSrc = pod.querySelector("a ");
      const imgPath = imgSrc.getAttribute("href");

      return { price, title, productPath: imgPath };
    });
    return data;
  });

  for (let [index, product] of bookData.splice(0, 6).entries()) {
    console.log("Inside loop Entered...")
    const productUrl = mainUrl;
    try {
      await page.goto(`${productUrl}${convertedString(product.productPath)}`, {
        waitUntil: "networkidle2",
      });
      const productDetails = await page.evaluate(() => {
        //to get image
        console.log("Inside productDetails...")
        const imgElement = document.querySelector("img.photoswipe__image"); // Update the selector accordingly
        if (!imgElement) {
          throw new Error("Image element not found");
        }
        const src =
          imgElement.getAttribute("data-photoswipe-src") ||
          imgElement.getAttribute("src");

        //get the tags
        const radioButtonsTags = document.querySelectorAll(
          '.variant-input-wrap input[type="radio"]'
        );
        const TagsValues = [];

        radioButtonsTags.forEach((radio) => {
          const label = radio.nextElementSibling;
          if (label) {
            TagsValues.push(label.innerText.trim());
          }
        });

        console.log("Feature start here...")

        //get Features
        const listType = document.querySelector('.accordion-container .set:nth-child(1) ol') ? 'ol' : 'ul';
        console.log("listType", listType);
        //I want get the html of the first accordion including ul or ol
        const listElement = document.querySelector(`.accordion-container .set:nth-child(1) ${listType}`);
        const listHTML = listElement ? listElement.outerHTML : null;
        //Store listElement html to feature variable into string
        const featureHtml = listElement ? listHTML : null;
       
        return { src, TagsValues, featureTitleElement: featureHtml};
      });

     
      if (productDetails) {
        bookData[index] = {
          ...product,
          mainImageUrl: productDetails.src,
          productTags: productDetails.TagsValues,
          Features: productDetails.featureTitleElement,
        };
      }
    } catch (err) {
      console.error("Error::", err?.message || err);
    }
  }
  const jsonString = JSON.stringify(bookData, null, 2);

  // Write JSON data to a file
  fs.writeFileSync("output.json", jsonString, "utf-8");

  console.log("bookData", bookData.splice(0, 3));
  // await browser.close();
};
main();
