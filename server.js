const express = require('express');
const app = express();
const envelopes = require('./data');
const newEnvelope = require('./newEnvelope');
const newId = require('./helpers')

app.use(express.json());

app.param('envelopeId', (req, res, next, id) => {
    const envelopeId = parseInt(id);
    const envelope = envelopes.find(envelope => envelope.id === envelopeId)
    if (envelope) {
        req.envelope = envelope;
        next();
    } else {
        res.status(404).send('Envelope not found');
    }
});

app.param('fromId', (req, res, next, id) => {
    const envelopeId = parseInt(id);
    const envelope = envelopes.find(envelope => envelope.id === envelopeId)
    if (envelope) {
        req.senderEnvelope = envelope;
        next();
    } else {
        res.status(404).send('Envelope not found');
    }
});

app.param('toId', (req, res, next, id) => {
    const envelopeId = parseInt(id);
    const envelope = envelopes.find(envelope => envelope.id === envelopeId)
    if (envelope) {
        req.receiverEnvelope = envelope;
        next();
    } else {
        res.status(404).send('Envelope not found');
    }
});

app.get('/', (req, res) => {
    res.send(envelopes);
});

app.post('/envelopes', (req, res) => {
    const id = newId(envelopes);
    const budget = req.body.budget;
    const title = req.body.title;
    if (budget === undefined || isNaN(budget)) {
        return res.status(400).json({ error: 'Budget/title is missing or invalid' });
    }
    const createEnvelope = new newEnvelope(id, budget, title);
    envelopes.push(createEnvelope);
    res.status(201).send(createEnvelope);
});

app.get('/envelope/:envelopeId', (req, res) => {
    res.send(req.envelope)
});

app.put('/envelope/:envelopeId/:amount', (req, res) => {
    const amount = parseInt(req.params.amount);
    const envelope = req.envelope;
    if (envelope.budget < amount || envelope.budget === amount) {
        res.status(400).send('Invalid amount to cut')
    } else {
        envelope.budget -= amount;
        res.send(envelope)
    }
});

app.post('/envelopes/transfer/:fromId/:toId', (req, res) => {
    const senderEnvelope = req.senderEnvelope;
    const receiverEnvelope = req.receiverEnvelope;
    const transferAmount = parseInt(req.headers['transfer-amount']);

    if (!transferAmount || typeof transferAmount !== 'number' || transferAmount < 0) {
        res.status(400).send('Invalid transaction amount!');
    } else if (senderEnvelope.budget < transferAmount) {
        res.status(400).send('You do not have enough budget!')
    } else {
        senderEnvelope.budget -= transferAmount;
        receiverEnvelope.budget += transferAmount;
        res.status(201).send('Transaction was successfully made!');
    }
});

app.delete('/envelope/:envelopeId', (req, res) => {
    const envelopeToDelete = req.envelope;
    const index = envelopes.findIndex(envelope => envelopeToDelete.id === envelope.id)

    if (index !== -1) {
        envelopes.splice(index, 1);
        res.status(204).send('Deleted');
    }
});

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});