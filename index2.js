const puppeteer = require('puppeteer');
const getImagesFromSrcset = require('./utils/getImagesFromSrcset');

const url="https://www.casewale.com/collections/iphone-15-pro-max";
const mainUrl="https://www.casewale.com";





const main=async()=>{
    const browser=await puppeteer.launch({headless:false});

    const page=await browser.newPage();
    await page.goto(url,{waitUntil:'networkidle2'});


    const bookData= await page.evaluate(()=>{
        const bookPods=Array.from(
            document.querySelectorAll('.grid-product__content')
        );

        console.log("BookPods",bookPods)
         const data=bookPods.map(pod=>{
            // const title=pod.querySelector('h3').innerText;
            // const price=pod.querySelector('.price_color').innerText;
            // const rating=pod.querySelector('.star-rating').classList[1];
            // const image=pod.querySelector('img').src;
            // return {title,price,rating,image}
            const price=pod.querySelector(
                'a .money'
            ).innerHTML;
            const title=pod.querySelector(
                '.grid-product__title'
            ).innerText;
            const imgSrc=pod.querySelector(
                'a '
            )
            const imgPath=imgSrc.getAttribute('href');

            return {price,title,productPath:imgPath}
        })
        return data;
    })

    console.log(bookData);
    for (let product of bookData) {
        const productUrl = mainUrl ;
        // await page.goto(productUrl, { waitUntil: 'networkidle2' });
        console.log("PRO:",productUrl);
        const mainImage = await getImagesFromSrcset(productUrl);
        product.mainImage = mainImage;
    }
    console.log(bookData);
    await browser.close();
}
main()