/*jshint esversion: 8 */
// Serves the production build of the GiftLink React frontend.
//   /          -> landing page (home.html)
//   /app/*     -> React single-page app (index.html)
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 9000;
const buildDir = path.join(__dirname, 'build');

app.use(express.static(buildDir, { index: false }));

app.get('/', (req, res) => {
    res.sendFile(path.join(buildDir, 'home.html'));
});

app.get('/app*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

app.listen(port, () => {
    console.log(`GiftLink website running on port ${port}`);
});
