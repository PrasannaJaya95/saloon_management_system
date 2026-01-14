import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, ShoppingBag, TrendingUp, Filter } from 'lucide-react';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('30days'); // 7days, 30days, year

    useEffect(() => {
        fetchReports();
    }, [range]);

    const getDates = () => {
        const end = new Date();
        const start = new Date();
        if (range === '7days') start.setDate(end.getDate() - 7);
        if (range === '30days') start.setDate(end.getDate() - 30);
        if (range === 'year') start.setFullYear(end.getFullYear() - 1);
        return { start: start.toISOString(), end: end.toISOString() };
    };

    const fetchReports = async () => {
        setLoading(true);
        try {
            const { start, end } = getDates();
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            const [statsRes, chartRes] = await Promise.all([
                fetch(`${baseUrl}/api/reports/stats?startDate=${start}&endDate=${end}`, { headers }),
                fetch(`${baseUrl}/api/reports/chart?startDate=${start}&endDate=${end}`, { headers })
            ]);

            const statsData = await statsRes.json();
            const chartDataRaw = await chartRes.json();

            setStats(statsData);
            setChartData(chartDataRaw);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Custom SVG Line Chart Component ---
    const LineChart = ({ data, color = "#ec4899" }) => {
        if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-gray-500">No Data</div>;

        const height = 250;
        const width = 800; // ViewBox width
        const padding = 20;

        const maxVal = Math.max(...data.map(d => d.amount)) || 100;
        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - ((d.amount / maxVal) * (height - padding * 2)) - padding;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="w-full overflow-hidden">
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64 overflow-visible">
                    {/* Grid Lines */}
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#374151" strokeWidth="1" />
                    <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#374151" strokeWidth="1" />

                    {/* Path */}
                    <path d={`M ${points}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* Fill Gradient Area (Optional simple fill) */}
                    <path d={`M ${points} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} fill={color} fillOpacity="0.1" />

                    {/* Data Points */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                        const y = height - ((d.amount / maxVal) * (height - padding * 2)) - padding;
                        return (
                            <g key={i} className="group">
                                <circle cx={x} cy={y} r="4" fill={color} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                <title>{`${d.date}: Rs. ${d.amount}`}</title>
                            </g>
                        );
                    })}
                </svg>
                <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                    <span>{data[0]?.date}</span>
                    <span>{data[data.length - 1]?.date}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50 p-6 rounded-3xl border border-gray-800 backdrop-blur-xl">
                <div>
                    <h1 className="text-2xl font-bold text-white">Business Reports</h1>
                    <p className="text-gray-400 text-sm mt-1">Analytics overview for your salon performance.</p>
                </div>

                <div className="flex bg-gray-900 border border-gray-700 rounded-xl p-1">
                    {['7days', '30days', 'year'].map(r => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${range === r ? 'bg-pink-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {r === '7days' ? 'Last 7 Days' : r === '30days' ? 'Last 30 Days' : 'This Year'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Generating Reports...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                                    <DollarSign className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+12%</span>
                            </div>
                            <h3 className="text-gray-400 text-sm">Total Revenue</h3>
                            <p className="text-2xl font-bold text-white mt-1">Rs. {stats?.revenue?.toLocaleString() || 0}</p>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Calendar className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm">Total Bookings</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stats?.bookings || 0}</p>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm">Shop Orders</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stats?.orders || 0}</p>
                        </div>

                        <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                            <h3 className="text-gray-400 text-sm">New Customers</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stats?.newCustomers || 0}</p>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Revenue Trend Chart */}
                        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-pink-500" /> Revenue Trend
                            </h3>
                            <LineChart data={chartData} />
                        </div>

                        {/* Payment Method Breakdown */}
                        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-6">Sales by Payment</h3>
                            <div className="space-y-6">
                                {stats?.paymentStats && Object.entries(stats.paymentStats).map(([method, amount], idx) => {
                                    const total = stats.revenue || 1;
                                    const percentage = Math.round((amount / total) * 100);
                                    const colors = ['bg-pink-500', 'bg-purple-500', 'bg-blue-500', 'bg-yellow-500'];

                                    return (
                                        <div key={method}>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-white font-medium">{method}</span>
                                                <span className="text-gray-400">{percentage}%</span>
                                            </div>
                                            <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[idx % colors.length]}`}
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Rs. {amount.toLocaleString()}</p>
                                        </div>
                                    );
                                })}
                                {!stats?.paymentStats && <p className="text-gray-500">No sales data available.</p>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Reports;
