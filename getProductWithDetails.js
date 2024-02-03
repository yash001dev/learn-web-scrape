const puppeteer = require("puppeteer");
const fs = require("fs");

const url = "https://www.casewale.com/collections/iphone-15-pro-max";
const mainUrl = "https://www.casewale.com";
let convertedString = (originalString) =>
  originalString.toLowerCase().replace(/\s+/g, "-");

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const bookData = await page.evaluate(() => {
    const bookPods = Array.from(
      document.querySelectorAll(".grid-product__content")
    );

    console.log("BookPods", bookPods);
    const data = bookPods.map((pod) => {
      // const title=pod.querySelector('h3').innerText;
      // const price=pod.querySelector('.price_color').innerText;
      // const rating=pod.querySelector('.star-rating').classList[1];
      // const image=pod.querySelector('img').src;
      // return {title,price,rating,image}
      const price = pod.querySelector("a .money").innerHTML;
      const title = pod.querySelector(".grid-product__title").innerText;
      const imgSrc = pod.querySelector("a ");
      const imgPath = imgSrc.getAttribute("href");

      return { price, title, productPath: imgPath };
    });
    return data;
  });

  //   console.log(bookData);
  for (let [index, product] of bookData.splice(0, 6).entries()) {
    const productUrl = mainUrl;
    try {
      await page.goto(`${productUrl}${convertedString(product.productPath)}`, {
        waitUntil: "networkidle2",
      });
      const productDetails = await page.evaluate(() => {
        //to get image
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

        //get Features
        const featureTitleElement  = document.querySelector('.accordion-container .set:first-child .content');
        console.log('Feee',featureTitleElement)
        if (featureTitleElement) {
         let ulElement;
         if (featureTitleElement && featureTitleElement.nextElementSibling) {
            ulElement = featureTitleElement.nextElementSibling.querySelector("ol");
         }

          if (ulElement) {
            const listItems = Array.from(
              ulElement.querySelectorAll("li") ||
                ulElement.querySelectorAll("ol")
            );
            return listItems.map((li) => li.textContent.trim());
          }
        }
        console.log("illll", featureTitleElement);

        return { src, TagsValues, featureTitleElement };
      });

      // try {
      //   //get all Features
      //   await page.waitForSelector(".accordion-container ul");

      //   if (ulElementHTML) {
      //     bookData[index] = {
      //       ...product,
      //       featureHtml: ulElementHTML,
      //     };
      //     // featureList.push(ulElementHTML);
      //   }
      // } catch (err) {
      //   console.error("Error in Feature", err);
      // }
      // console.log("Feature", productDetails);

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
  await browser.close();
};
main();
