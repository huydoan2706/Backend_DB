const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /vehicles-out
router.post('/', async (req, res) => {
    const { license_plate_number, time_out } = req.body;

    const conn = await db.getConnection(); // Bắt đầu transaction
    try {
        await conn.beginTransaction();

        // 1. Cập nhật time_out trong bảng vehicle_logs
        const [result] = await conn.query(
            'UPDATE vehicle_logs SET time_out = ? WHERE license_plate_number = ? AND time_out IS NULL LIMIT 1',
            [time_out, license_plate_number]
        );

        if (result.affectedRows === 0) {
            // Không tìm thấy dòng đang giữ xe
            await conn.rollback();
            return res.status(404).json({ error: 'Không tìm thấy xe đang ở trong bãi (chưa có time_out)' });
        }

        await conn.commit();
        res.status(201).json({ message: 'Ghi nhận xe ra thành công' });

    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: 'Lỗi khi ghi nhận xe ra', details: err.message });
    } finally {
        conn.release();
    }
});

module.exports = router;
