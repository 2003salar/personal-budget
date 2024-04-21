const express = require('express');
const router = express.Router();
const pool = require('../connectDB'); 

router.use(express.urlencoded({extended: false}));
router.use(express.json());

// Middleware to handle and send requested envelope with its ID
router.param(['id'], async (req, res, next, id) => {
    try {
        const envelopeId = Number(id);
        const envelope = await pool.query('SELECT * FROM envelopes WHERE id = $1', [envelopeId]);
        if (envelope.rows.length > 0) {
            req.envelope = envelope.rows[0];
            req.envelope.id = envelopeId;
            next();
        } else {
            res.status(404).json({success: false, message: 'Envelope not found'});
        }
    } catch (error) {
        res.status(500).json({success: false, error: error});
    }
    
});

// Middleware to handle and send requested envelope with its ID
router.param('fromId', async (req, res, next, id) => {
    const envelopeId = Number(id);
    const envelope = await pool.query('SELECT * FROM envelopes WHERE id = $1', [envelopeId]) 
    if (envelope.rows.length > 0) {
        req.senderEnvelope = envelope.rows[0];
        next();
    } else {
        res.status(404).json({success: false, message: `Envelope with id ${envelopeId} was not found`});
    }
});

// Middleware to handle and send requested envelope with its ID
router.param('toId', async (req, res, next, id) => {
    const envelopeId = Number(id);
    const envelope = await pool.query('SELECT * FROM envelopes WHERE id = $1', [envelopeId]) 
    if (envelope.rows.length > 0) {
        req.receiverEnvelope = envelope.rows[0];
        next();
    } else {
        res.status(404).json({success: false, message: `Envelope with id ${envelopeId} was not found`});
    }
});

// Route to get all the envelopes
router.get('/', async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM envelopes;');
        if (results.rows) {
            const envelopes = results.rows;
            res.status(200).json({success: true, data: envelopes});
        }       
    } catch (error) {
        res.status(500).json({success: false, error: error});
    }
});

// Route to create an envelope using post request
router.post('/', async (req, res) => {
    try {
        const {title, budget} = req.body;
        const budgetAmount = Number(budget);
        if (isNaN(budget) || !title || budget < 0) {
            return res.status(400).json({success: false, error: 'Budget/title is missing or invalid' });
        }
        const results = await pool.query(
            'INSERT INTO envelopes (title, budget) VALUES ($1, $2) RETURNING *;',
            [title, budgetAmount]
        );
        const newEnvelope = results.rows[0];
        res.status(201).json({success: true , data: newEnvelope});
    } catch (error) {
        res.status(500).json({success: false, error: error});
    }
});

// Route to get a specific envelope with its ID
router.get('/:id', async (req, res) => {
    try {
        res.status(200).json({ success: true, data: req.envelope });
    } catch (error) {
        res.status(500).json({success: false, message: 'Something went wrong'})
    }
});

// Route to subtract an amount of budget from the specified envelope
router.patch('/:id', async (req, res) => {
    try {
        const { amount } = req.body;
        const amountValue = Number(amount);
        
        if (isNaN(amountValue) || amountValue < 1) {
            res.status(400).json({success: false, message: 'Invalid amount'});
            return;
        } else if (req.envelope.budget < amountValue) {
            res.status(400).json({success: false, message: 'You do not have enough budget'});
            return;
        }
        let budget = req.envelope.budget;
        await pool.query('UPDATE envelopes SET budget = $1 WHERE id = $2', [budget = budget - amountValue, req.envelope.id]);
        const newBudget = await pool.query('SELECT * FROM envelopes WHERE id = $1', [req.envelope.id]);
        res.status(200).json({success: true, data: newBudget.rows[0]}); 
    } catch (error) {
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
});

// Route to delete an envelope with a specific ID
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM envelopes WHERE id = $1', [req.envelope.id]);
        res.status(204).json({success: true, message: `Envelope with id ${req.envelope.id} was deleted successfully`});
    } catch (error) {
        res.status(500).json({success: false, message: 'Something went wrong'});
    }
});

// Route to transfer an amount of budget from envelope A to envelope B
router.post('/transfer/:fromId/:toId', async (req, res) => {
    try {
        const { amount } = req.body;
        const amountValue = Number(amount);
        if (isNaN(amountValue) || amountValue < 1) {
            res.status(400).json({success: false, message: 'Invalid amount'});
            return;
        }
        const senderId = req.senderEnvelope.id;
        const receiverId = req.receiverEnvelope.id;
        const newSenderBudget = Number(req.senderEnvelope.budget) - amountValue;
        const newReceiverBudget = Number(req.receiverEnvelope.budget) + amountValue;

        console.log(senderId, newSenderBudget);
        console.log(receiverId, newReceiverBudget);
        // await pool.query('UPDATE envelopes SET budget = $1 WHERE id = $2;', [newSenderBudget, req.params.fromId]);
        // await pool.query('UPDATE envelopes SET budget = $1 WHERE id = $2;', [newReceiverBudget, req.params.toId]);
        // await pool.query('INSERT INTO transaction (sender_id, receiver_id, amount, date) VALUES ($1, $2, $3, $4);', [req.params.fromId, req.params.toId, amountValue, new Date()]);
        res.status(201).json({success: true, message: `Transaction from envelope ${req.params.fromId} to envelope ${req.params.toId} with amount of ${amountValue} was successfully made`});

    } catch (error) {
        res.status(500).json({success: false, message: error});
    }
});

router.all('*', (req, res) => {
    res.status(404).json({success: false, message: 'Resource not found!'});
});

module.exports = router;