const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', async (req, res) => {
    const { license_plate_number, time_in } = req.body;

    try {
        // 1. Ghi nhận xe vào — trigger sẽ gán applied
        await db.query(`
            INSERT INTO vehicle_logs (license_plate_number, time_in)
            VALUES (?, ?)
        `, [license_plate_number, time_in]);

        // 2. Truy vấn lại để lấy giá trị applied
        const [rows] = await db.query(`
            SELECT applied FROM vehicle_logs
            WHERE license_plate_number = ? AND time_in = ?
            ORDER BY id DESC LIMIT 1
        `, [license_plate_number, time_in]);

        const applied = rows[0]?.applied;

        // 3. Trả kết quả kèm cảnh báo nếu là xe lạ
        if (applied === 0) {
            return res.status(201).json({
                message: 'Đã ghi nhận xe vào',
                warning: 'Xe chưa đăng ký — cần xác minh người điều khiển.'
            });
        } else {
            return res.status(201).json({ message: 'Đã ghi nhận xe vào' });
        }

    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi ghi nhận xe vào', details: err.message });
    }
});

module.exports = router;
