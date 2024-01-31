const puppeteer = require("puppeteer");
const getImagesFromSrcset = require("./utils/getImagesFromSrcset");

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
  for (let [index,product] of bookData.splice(0, 6).entries()) {
    const productUrl = mainUrl;
    try {
      await page.goto(`${productUrl}${convertedString(product.productPath)}`, {
        waitUntil: "networkidle2",
      });
      const data = await page.evaluate(() => {
        //to get image
        const imgElement = document.querySelector("img.photoswipe__image"); // Update the selector accordingly
        if (!imgElement) {
          throw new Error("Image element not found");
        }
        const src =
          imgElement.getAttribute("data-photoswipe-src") ||
          imgElement.getAttribute("src");

          //get the tags
                const radioButtons = document.querySelectorAll(
                  '.variant-input-wrap input[type="radio"]'
                );
                const values = [];

                radioButtons.forEach((radio) => {
                  const label = radio.nextElementSibling;
                  if (label) {
                    values.push(label.innerText.trim());
                  }
                });

        console.log(values,"values src", src);


        return {src,values};
      });
      if(data) {
        console.log("mainnnn", data);
        // const mainImage = await getImagesFromSrcset(productUrl,product);
         bookData[index] = { ...product, imageUrl: data.src,tags:data.values };
      }
      
    } catch (err) {
      console.error("Error::", err);
    }
  }
    console.log('bookData',bookData);
  await browser.close();
};
main();
