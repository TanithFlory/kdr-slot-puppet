import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import Audic from "audic";
const audic = new Audic("audio.mp3");
audic.loop = true;

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}
async function main() {
  let browser;
  try {
    let isKedarnathAvailable = false;
    puppeteer.use(StealthPlugin());
    browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });
    await page.setUserAgent(ua);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.goto("https://registrationandtouristcare.uk.gov.in");
    await page.evaluate(() => {
      localStorage.setItem(
        "api_token",
        "cLit56fSl8fOco8BqXNCyV0tlqaqRSbymHu5wnaOgXs1mK0eDDAC8qaXS420Da9T6ZzrEk+0RIGTgnzP8Ei5qQ=="
      );
    });

    while (!isKedarnathAvailable) {
      await page.goto(
        "https://registrationandtouristcare.uk.gov.in/tour_plan.php"
      );

      await page.evaluate(() => {
        document.querySelector(".input-box > input").click();
      });

      const button = await page.waitForSelector(".applyBtn");

      button?.evaluate((el) => el.click());

      await delay(5000);

      await page.waitForSelector("#preloader1", {
        hidden: true,
      });
      await page.click("#availability");

      const table = await page.waitForSelector(".row.show_txt");

      isKedarnathAvailable = await table?.evaluate((el) =>
        el.childNodes[7]
          .querySelector(".date-box-inner")
          .childNodes[3].classList.contains("available")
      );

      await delay(5000);
    }

      await audic.play();
  } catch (error) {
    console.log(error);
    browser.close();
    main();
  }
}

main();
