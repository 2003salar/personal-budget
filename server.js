const express = require('express');
const app = express();
const envelopes = require('./data');
const newEnvelope = require('./newEnvelope');
const newId = require('./helpers')

app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Middleware to handle and send requested envelope with its ID
app.param('envelopeId', (req, res, next, id) => {
    const envelopeId = Number(id);
    const envelope = envelopes.find(envelope => envelope.id === envelopeId)
    if (envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).json({success: false, message: 'Envelope not found'});
    }
});

// Middleware to handle and send requested envelope with its ID
app.param('fromId', (req, res, next, id) => {
    const envelopeId = Number(id);
    const envelope = envelopes.find(envelope => envelope.id === envelopeId)
    if (envelope) {
        req.senderEnvelope = envelope;
        next();
    } else {
        res.status(404).json({success: false, message: 'Envelope not found'});
    }
});

// Middleware to handle and send requested envelope with its ID
app.param('toId', (req, res, next, id) => {
    const envelopeId = Number(id);
    const envelope = envelopes.find(envelope => envelope.id === envelopeId)
    if (envelope) {
        req.receiverEnvelope = envelope;
        next();
    } else {
        res.status(404).json({success: false, message: 'Envelope not found'});
    }
});

// Route to get all the envelopes
app.get('/', (req, res) => {
    res.status(200).json({success: true, data: envelopes});
});

// Route to create an envelope using post request
app.post('/envelopes', (req, res) => {
    const id = newId(envelopes);
    const { budget } = req.body;
    const { title } = req.body;
    if (budget === undefined || isNaN(budget)) {
        return res.status(400).json({success: false, error: 'Budget/title is missing or invalid' });
    }
    const createEnvelope = new newEnvelope(id, budget, title);
    res.status(201).json({success: true , data: [...envelopes, createEnvelope]});
});

// Route to get a specific envelope with its ID
app.get('/envelope/:envelopeId', (req, res) => {
    res.json({ success: true, data: req.envelope });
});

// Route to subtract an amount of budget from the specified envelope
app.put('/envelope/:envelopeId/:amount', (req, res) => {
    const amount = parseInt(req.params.amount);
    const envelope = req.envelope;
    if (envelope.budget < amount || envelope.budget === amount) {
        res.status(400).send('Invalid amount to cut')
    } else {
        envelope.budget -= amount;
        res.json({ success: true, data: envelope });
    }
});

// Route to transfer an amount of budget from envelope A to envelope B
app.post('/envelopes/transfer/:fromId/:toId', (req, res) => {
    const senderEnvelope = req.senderEnvelope;
    const receiverEnvelope = req.receiverEnvelope;
    const transferAmount = Number(req.headers['transfer-amount']);

    if (!transferAmount || typeof transferAmount !== 'number' || transferAmount < 0) {
        res.status(400).json({ success: false, message: 'Invalid transation amount!' });        ;
    } else if (senderEnvelope.budget < transferAmount) {
        res.status(400).json({ success: false, message: 'You do not have enough budget!' });
    } else {
        senderEnvelope.budget -= transferAmount;
        receiverEnvelope.budget += transferAmount;
        res.status(201).json({ success: true, message: 'Transaction was successfully made!' });
    }
});

// Route to delete an envelope with a specific ID
app.delete('/envelope/:envelopeId', (req, res) => {
    const envelopeToDelete = req.envelope;
    const index = envelopes.findIndex(envelope => envelopeToDelete.id === envelope.id)
    if (index !== -1) {
        envelopes.splice(index, 1);
        res.status(204).json({success: true, message: 'Envelope deleted successfully'});
    }
});

app.all('*', (req, res) => {
    res.status(404).json({success: false, message: 'Resource not found!'});
});

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});