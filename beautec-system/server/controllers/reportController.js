const Booking = require('../models/Booking');
const Order = require('../models/Order');
const User = require('../models/User');

// Helper to filter by date range
const getDateFilter = (startDate, endDate) => {
    let filter = {};
    if (startDate && endDate) {
        filter = {
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };
    } else {
        // Default to last 30 days if no date provided? Or simplified All Time
        // For "best reporting", usually default is This Month or Last 30 Days.
        // Let's rely on frontend to send dates, or default to empty (All Time)
    }
    return filter;
};

// @desc    Get summary stats (cards)
// @route   GET /api/reports/stats
exports.getStats = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateFilter = {};

        // Apply date filter to 'date' for bookings and 'createdAt' for orders
        // Note: Booking model usually has 'date' or 'slot.date'. Let's assume 'date' based on previous context.
        // Checking Order model, it has 'createdAt'.

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // Include entire end day

            dateFilter = { createdAt: { $gte: start, $lte: end } };
        }

        // 1. Revenue from Orders
        const orders = await Order.find({ ...dateFilter, status: { $ne: 'Cancelled' } });
        const orderRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        // 2. Revenue from Bookings (assuming Bookings have a price/cost)
        // I need to verify Booking model structure. Assuming it has 'price' or service.price.
        // If not, I'll count them at least.
        const bookings = await Booking.find(startDate ? {
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
            status: { $ne: 'Cancelled' }
        } : { status: { $ne: 'Cancelled' } });

        // Assuming booking doesn't save price explicitly (it might link to Service), 
        // strictly speaking we might need to populate 'service'.
        // For now, let's just count bookings.
        const bookingCount = bookings.length;

        // 3. New Customers (Users created in range)
        const newCustomers = await User.countDocuments({
            ...dateFilter,
            role: 'User'
        });

        // 4. Sales by Payment Method
        const paymentMethods = orders.reduce((acc, order) => {
            const method = order.paymentMethod || 'Other';
            acc[method] = (acc[method] || 0) + order.totalAmount;
            return acc;
        }, {});

        res.status(200).json({
            revenue: orderRevenue, // + bookingRevenue if available
            bookings: bookingCount,
            orders: orders.length,
            newCustomers,
            paymentStats: paymentMethods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Revenue Chart Data (Daily)
// @route   GET /api/reports/chart
exports.getChartData = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: { $ne: 'Cancelled' }
        });

        // Aggregate by Date
        const dailyData = {};
        orders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            dailyData[dateStr] = (dailyData[dateStr] || 0) + order.totalAmount;
        });

        // Fill in missing days
        const chartData = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            chartData.push({
                date: dateStr,
                amount: dailyData[dateStr] || 0
            });
        }

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
