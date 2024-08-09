import puppeteer from "puppeteer";

void (async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  const response = await page.goto("https://developer.chrome.com/");

  // if (response) {
  //   const securityDetails = response.securityDetails();
  //   console.log(securityDetails?.protocol);
  //   if (securityDetails) {
  //     const expiryDate = securityDetails.validTo() * 1000;
  //     console.log(new Date(expiryDate));
  //   }
  // }

  const client = await page.target().createCDPSession();
  await client.send("Network.enable");

  page.on("response", async (res) => {
    const securityDetails = res.securityDetails();
    if (securityDetails != null) {
      console.log(securityDetails.protocol())
      // console.info(
      //   await client.send("Network.getCertificate", { origin: res.url() })
      // );
    }
  });
})();
