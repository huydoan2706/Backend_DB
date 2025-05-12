const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:license_plate_number', async (req, res) => {
    const licensePlate = req.params.license_plate_number;

    try {
        const [rows] = await db.query(
            `SELECT time_in, time_out FROM vehicle_logs
            WHERE license_plate_number = ?
            ORDER BY time_in DESC`,
            [licensePlate]
        );

        res.json({
            license_plate_number: licensePlate,
            history: rows
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

