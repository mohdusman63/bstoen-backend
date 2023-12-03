const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.set('view engine', 'ejs');
const path = require('path')
app.use(express.static('public'));
const puppeteer = require('puppeteer')


app.use(express.static(path.join(__dirname, 'public')));


// app.use(routes);
app.get("/export/html", async (req, res) => {
    res.render('pdf')
})

app.get('/export/pdf', (req, res) => {
    (async () => {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ["--no-sandbox"]
        });
        const page = await browser.newPage()
        await page.goto('http://13.233.47.235:3000/export/html', { waitUntil: 'networkidle0', target: 'newPage'  })
        // await page.setViewport({width: 1080, height: 1024});
        await page.emulateMediaType('screen');
        await page.setViewport({ width: 1680, height: 1050 });

        const buffer = await page.pdf({ format: 'A4' })
        res.type('application/pdf')
        res.send(buffer)
        browser.close()
    })()
})

app.use(express.json());
app.listen(3000, () => {
    console.log("Server is listening port 3000")
})