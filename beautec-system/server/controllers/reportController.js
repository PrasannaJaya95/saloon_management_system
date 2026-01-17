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
        const { startDate, endDate, trendStartDate, trendEndDate } = req.query;
        let dateFilter = {};

        // Filter for primary stats (Cards)
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter = { createdAt: { $gte: start, $lte: end } };
        }

        // Filter for trending items (Charts) - defaults to primary filter if not provided
        let trendDateFilter = dateFilter;
        let trendBookingDateFilter = {};

        if (trendStartDate && trendEndDate) {
            const tStart = new Date(trendStartDate);
            const tEnd = new Date(trendEndDate);
            tEnd.setHours(23, 59, 59, 999);
            trendDateFilter = { createdAt: { $gte: tStart, $lte: tEnd } };

            const tStartStr = tStart.toISOString().split('T')[0];
            const tEndStr = tEnd.toISOString().split('T')[0];
            trendBookingDateFilter.date = { $gte: tStartStr, $lte: tEndStr };
        } else if (startDate && endDate) {
            // Fallback to primary dates for booking string filter
            const startStr = new Date(startDate).toISOString().split('T')[0];
            const endStr = new Date(endDate).toISOString().split('T')[0];
            trendBookingDateFilter.date = { $gte: startStr, $lte: endStr };
        }

        // 1. Revenue from Orders
        const orders = await Order.find({ ...dateFilter, status: { $ne: 'Cancelled' } });
        const orderRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

        // 2. Revenue from Bookings
        // Adjust for 'date' field being a string in format "YYYY-MM-DD" (based on Booking model)
        const bookingDateFilter = {};
        if (startDate && endDate) {
            // Need to match string dates. Since they are YYYY-MM-DD, string comparison works.
            const startStr = new Date(startDate).toISOString().split('T')[0];
            const endStr = new Date(endDate).toISOString().split('T')[0];
            bookingDateFilter.date = { $gte: startStr, $lte: endStr };
        }

        const bookings = await Booking.find({
            ...bookingDateFilter,
            status: { $ne: 'Cancelled' }
        });

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

        // 5. Top Services (Use Trend Filter)
        const trendingBookings = await Booking.find({
            ...trendBookingDateFilter,
            status: { $ne: 'Cancelled' }
        }).populate('services', 'name');

        const serviceCounts = {};
        trendingBookings.forEach(booking => {
            if (booking.services && booking.services.length > 0) {
                booking.services.forEach(service => {
                    const name = service.name || 'Unknown Service';
                    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
                });
            }
        });

        const topServices = Object.entries(serviceCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 6. Top Products (Use Trend Filter)
        const trendingOrders = await Order.find({
            ...trendDateFilter,
            status: { $ne: 'Cancelled' }
        });

        const productCounts = {};
        trendingOrders.forEach(order => {
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    if (item.type === 'Product') {
                        const name = item.name || 'Unknown Product';
                        productCounts[name] = (productCounts[name] || 0) + (item.quantity || 1);
                    }
                });
            }
        });

        const topProducts = Object.entries(productCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        res.status(200).json({
            revenue: orderRevenue, // + bookingRevenue if available
            bookings: bookingCount,
            orders: orders.length,
            newCustomers,
            paymentStats: paymentMethods,
            topServices,
            topProducts
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
        const { startDate, endDate, groupBy = 'day' } = req.query;
        const start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            createdAt: { $gte: start, $lte: end },
            status: { $ne: 'Cancelled' }
        });

        // Helper to format date key based on groupBy
        const getKey = (date) => {
            const d = new Date(date);
            if (groupBy === 'year') return d.getFullYear().toString();
            if (groupBy === 'month') return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            return d.toISOString().split('T')[0]; // 'day'
        };

        const aggregatedData = {};
        orders.forEach(order => {
            const key = getKey(order.createdAt);
            aggregatedData[key] = (aggregatedData[key] || 0) + order.totalAmount;
        });

        const chartData = [];
        let current = new Date(start);

        while (current <= end) {
            const key = getKey(current);
            chartData.push({
                date: key, // Keep format consistent with XAxis expectation or format later
                amount: aggregatedData[key] || 0
            });

            // Increment based on groupBy
            if (groupBy === 'year') {
                current.setFullYear(current.getFullYear() + 1);
            } else if (groupBy === 'month') {
                current.setMonth(current.getMonth() + 1);
            } else {
                current.setDate(current.getDate() + 1);
            }
        }

        res.status(200).json(chartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
