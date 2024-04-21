const express = require('express');
const app = express();
const router = require('./routes/routes');

app.use('/api/v1/envelopes', router);


app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});