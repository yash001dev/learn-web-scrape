const puppeteer = require('puppeteer');

const url="https://books.toscrape.com/";

const main=async()=>{
    const browser=await puppeteer.launch({headless:false});
    const page=await browser.newPage();
    await page.goto(url,{waitUntil:'networkidle2'});

    const bookData= await page.evaluate(()=>{
        const bookPods=Array.from(
            document.querySelectorAll('.product_pod')
        );
        const data=bookPods.map(pod=>{
            const title=pod.querySelector('h3').innerText;
            const price=pod.querySelector('.price_color').innerText;
            const rating=pod.querySelector('.star-rating').classList[1];
            const image=pod.querySelector('img').src;
            return {title,price,rating,image}
        })
        return data;
    })

    console.log(bookData);

    // await browser.close();
}
main()