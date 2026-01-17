import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Calendar, TrendingUp, ChevronDown, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays, isSameDay, subYears } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import "react-day-picker/style.css";

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user } = useAuth();
    const token = user?.token;

    // Filter States: 'preset' | 'daily' | 'monthly' | 'yearly'
    const [filterType, setFilterType] = useState('preset');
    const [presetRange, setPresetRange] = useState(7); // 7, 28, 90

    // For manual selection
    const [selectedDate, setSelectedDate] = useState(new Date()); // For daily
    const [selectedMonth, setSelectedMonth] = useState(new Date()); // For monthly
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // For yearly

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Data States
    const [statsData, setStatsData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dailyBookings, setDailyBookings] = useState([]);
    const [dailyOrders, setDailyOrders] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Helper to calculate range based on filter type
    const getDateRange = () => {
        const now = new Date();
        let start, end;

        switch (filterType) {
            case 'preset':
                end = endOfDay(now);
                start = startOfDay(subDays(now, presetRange - 1));
                break;
            case 'daily':
                start = startOfDay(selectedDate);
                end = endOfDay(selectedDate);
                break;
            case 'monthly':
                start = startOfMonth(selectedMonth);
                end = endOfMonth(selectedMonth);
                break;
            case 'yearly':
                start = startOfYear(new Date(selectedYear, 0, 1));
                end = endOfYear(new Date(selectedYear, 0, 1));
                break;
            default:
                end = endOfDay(now);
                start = startOfDay(subDays(now, 6)); // Default 7 days
        }
        return { start, end };
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;

            setLoading(true);
            setLoadingDetails(true);
            try {
                const { start, end } = getDateRange();

                // Define Chart Context & Aggregation
                let chartStart = start;
                let chartEnd = end;
                let groupBy = 'day';

                if (filterType === 'monthly') {
                    // Show Last 12 Months
                    chartStart = startOfMonth(subYears(start, 1));
                    // Ensure we capture partial data of current month or full selected month
                    groupBy = 'month';
                } else if (filterType === 'yearly') {
                    // Show Last 10 Years
                    chartStart = startOfYear(subYears(start, 10));
                    groupBy = 'year';
                } else if (filterType === 'daily') {
                    // Single Day Selection -> Show that day's data (flat) or maybe last 30 days?
                    // User Request: "view selected date, data only" implies strict filtering for lists/stats.
                    // For chart, user previously asked "view selected date data only".
                    // But typically a 1-day trend is a dot.
                    // Let's stick to the STRICT request: "if i select daily... view selected date data only".
                    // BUT for Monthly/Yearly they asked for "Last X years".
                    // So Daily = Single Day. Monthly = 12 Months. Yearly = 10 Years.
                    chartStart = start;
                    groupBy = 'day';
                }

                // API calls
                const [statsRes, chartRes, bookingsRes, ordersRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/reports/stats?startDate=${start.toISOString()}&endDate=${end.toISOString()}&trendStartDate=${chartStart.toISOString()}&trendEndDate=${chartEnd.toISOString()}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/reports/chart?startDate=${chartStart.toISOString()}&endDate=${chartEnd.toISOString()}&groupBy=${groupBy}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/bookings?startDate=${format(start, 'yyyy-MM-dd')}&endDate=${format(end, 'yyyy-MM-dd')}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/shop/orders?startDate=${start.toISOString()}&endDate=${end.toISOString()}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (statsRes.ok) setStatsData(await statsRes.json());

                if (chartRes.ok) {
                    const cData = await chartRes.json();
                    setChartData(Array.isArray(cData) ? cData : []);
                }

                if (bookingsRes.ok) {
                    const bData = await bookingsRes.json();
                    setDailyBookings(bData.success && Array.isArray(bData.data) ? bData.data : []);
                }
                if (ordersRes.ok) {
                    const oData = await ordersRes.json();
                    setDailyOrders(oData.success && Array.isArray(oData.data) ? oData.data : []);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setChartData([]);
                setDailyBookings([]);
                setDailyOrders([]);
            } finally {
                setLoading(false);
                setLoadingDetails(false);
            }
        };

        fetchData();
    }, [filterType, presetRange, selectedDate, selectedMonth, selectedYear, token]);

    const stats = [
        {
            title: 'Revenue',
            value: statsData?.revenue !== undefined ? `Rs. ${statsData.revenue.toLocaleString()}` : 'Loading...',
            icon: TrendingUp,
            trend: filterType === 'daily' ? 'For selected date' : 'For selected period',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Appointments',
            value: statsData?.bookings !== undefined ? statsData.bookings : '...',
            icon: Calendar,
            trend: filterType === 'daily' ? 'Scheduled for date' : 'In period',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'New Customers',
            value: statsData?.newCustomers !== undefined ? statsData.newCustomers : '...',
            icon: Users,
            trend: 'Joined in period',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            title: 'Orders',
            value: statsData?.orders !== undefined ? statsData.orders : '...',
            icon: CreditCard,
            trend: 'Total orders',
            color: 'from-orange-500 to-red-500'
        },
    ];

    // Month Grid Generation
    const months = Array.from({ length: 12 }, (_, i) => new Date(0, i));

    // Year Grid Generation (current - 5 to current + 1)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);

    return (
        <div className="space-y-8 relative" onClick={() => isCalendarOpen && setIsCalendarOpen(false)}>
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div>
                    <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-white to-gray-400' : 'from-black to-gray-800'}`}>Dashboard Overview</h1>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-black'} mt-1 font-medium`}>
                        {filterType === 'daily' && format(selectedDate, 'MMMM do, yyyy')}
                        {filterType === 'monthly' && format(selectedMonth, 'MMMM yyyy')}
                        {filterType === 'yearly' && format(new Date(selectedYear, 0, 1), 'yyyy')}
                        {filterType === 'preset' && `Last ${presetRange} Days`}
                    </p>
                </div>

                {/* Filter Toolbar */}
                <div className={`flex flex-wrap items-center gap-3 p-1.5 rounded-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>

                    {/* Filter Type Selector */}
                    <div className="flex bg-gray-100/10 rounded-xl p-1 border border-gray-500/10">
                        {['preset', 'daily', 'monthly', 'yearly'].map(type => (
                            <button
                                key={type}
                                onClick={() => {
                                    setFilterType(type);
                                    setIsCalendarOpen(false);
                                }}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize
                                ${filterType === type
                                        ? 'bg-pink-500 text-white shadow-lg'
                                        : `${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="h-6 w-px bg-gray-500/20 mx-1 hidden sm:block"></div>

                    {/* Dynamic Controls based on Filter Type */}

                    {/* 1. Presets */}
                    {filterType === 'preset' && (
                        <div className="flex gap-2">
                            {[7, 28, 90].map(days => (
                                <button
                                    key={days}
                                    onClick={() => setPresetRange(days)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all
                                    ${presetRange === days
                                            ? 'border-pink-500 bg-pink-500/10 text-pink-500'
                                            : `${theme === 'dark' ? 'border-gray-700 text-gray-400 hover:border-gray-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}`}
                                >
                                    Last {days} Days
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 2. Daily Picker */}
                    {filterType === 'daily' && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsCalendarOpen(!isCalendarOpen);
                                }}
                                className={`flex items-center gap-2 text-sm font-bold border rounded-lg px-4 py-1.5 transition-colors
                                ${theme === 'dark' ? 'text-gray-200 border-gray-700 bg-gray-800 hover:bg-gray-700' : 'text-black border-gray-300 bg-white hover:bg-gray-50'}`}
                            >
                                <Calendar className="w-4 h-4" />
                                {format(selectedDate, 'MMM dd, yyyy')}
                                <ChevronDown className="w-4 h-4 opacity-50" />
                            </button>
                            {isCalendarOpen && (
                                <div onClick={(e) => e.stopPropagation()} className={`absolute right-0 top-10 z-50 p-4 rounded-xl shadow-2xl border ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'}`}>
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setSelectedDate(date);
                                                setIsCalendarOpen(false);
                                            }
                                        }}
                                        styles={{
                                            caption: { color: theme === 'dark' ? 'white' : 'black' },
                                            head_cell: { color: theme === 'dark' ? 'gray' : 'black' },
                                            day: { color: theme === 'dark' ? 'white' : 'black' }
                                        }}
                                        modifiersStyles={{
                                            selected: { backgroundColor: '#ec4899', color: 'white' }
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Monthly Picker */}
                    {filterType === 'monthly' && (
                        <div className="flex gap-2">
                            <select
                                value={`${selectedMonth.getMonth()}-${selectedMonth.getFullYear()}`} // Simple composite key
                                onChange={(e) => {
                                    const [m, y] = e.target.value.split('-').map(Number);
                                    setSelectedMonth(new Date(y, m));
                                }}
                                className={`text-sm font-bold border rounded-lg px-3 py-1.5 outline-none cursor-pointer
                                ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
                            >
                                {years.map(y => (
                                    months.map(m => (
                                        <option key={`${m.getMonth()}-${y}`} value={`${m.getMonth()}-${y}`}>
                                            {format(m, 'MMM')} {y}
                                        </option>
                                    ))
                                ))}
                            </select>
                        </div>
                    )}

                    {/* 4. Yearly Picker */}
                    {filterType === 'yearly' && (
                        <div className="flex gap-2">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className={`text-sm font-bold border rounded-lg px-3 py-1.5 outline-none cursor-pointer
                                ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-black'}`}
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                    )}

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={idx}
                        className={`p-6 rounded-3xl backdrop-blur-md transition-all duration-300 group relative overflow-hidden 
                        shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.3)] hover:-translate-y-1
                        ${theme === 'dark'
                                ? 'bg-gray-900/40 border border-gray-700/50 hover:border-pink-500/50'
                                : 'bg-white border border-gray-100 hover:border-pink-500/30 hover:shadow-xl'}`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} ${theme === 'dark' ? 'opacity-20' : 'opacity-10'} rounded-full blur-3xl -mr-16 -mt-16 transition-opacity group-hover:opacity-40`}></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl text-white border-t border-l border-white/20 shadow-lg flex items-center justify-center
                            bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className="w-7 h-7 drop-shadow-md text-white" />
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1 ${theme === 'dark' ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <p className={`text-sm font-bold tracking-wide drop-shadow-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{stat.title}</p>
                            <h3 className={`text-3xl font-bold mt-2 group-hover:scale-105 transition-transform origin-left drop-shadow-lg ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend - Full Width */}
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'} shadow-lg col-span-1 lg:col-span-2`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Revenue Trend</h3>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <XAxis
                                    dataKey="date"
                                    stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'}
                                    tickFormatter={(str) => {
                                        if (!str) return '';
                                        // '2025' len=4
                                        if (str.length === 4) return str;
                                        // '2025-01' len=7
                                        if (str.length === 7) return format(new Date(str + '-01'), 'MMM yyyy');
                                        // '2025-01-01'
                                        return format(new Date(str), 'MMM dd');
                                    }}
                                    fontSize={12}
                                />
                                <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                        color: theme === 'dark' ? 'white' : 'black',
                                        borderRadius: '12px'
                                    }}
                                    labelFormatter={(label) => {
                                        if (!label) return '';
                                        if (label.length === 4) return label; // Year
                                        if (label.length === 7) return format(new Date(label + '-01'), 'MMM yyyy'); // Month
                                        return format(new Date(label), 'MMM dd, yyyy'); // Day
                                    }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Services Chart */}
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'} shadow-lg`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Top Services</h3>
                    <div className="h-[300px] w-full">
                        {statsData?.topServices && statsData.topServices.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsData.topServices} layout="vertical" margin={{ left: 0, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} horizontal={false} />
                                    <XAxis type="number" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} fontSize={12} hide />
                                    <YAxis type="category" dataKey="name" width={120} stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} fontSize={11} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} />
                                    <Tooltip
                                        cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                                        contentStyle={{
                                            backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                            color: theme === 'dark' ? 'white' : 'black',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Bookings" label={{ position: 'right', fill: theme === 'dark' ? 'white' : 'black', fontSize: 12 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">No service data available</div>
                        )}
                    </div>
                </div>

                {/* Top Products Chart */}
                <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'} shadow-lg`}>
                    <h3 className={`text-lg font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Top Products</h3>
                    <div className="h-[300px] w-full">
                        {statsData?.topProducts && statsData.topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={statsData.topProducts} layout="vertical" margin={{ left: 0, right: 30 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} horizontal={false} />
                                    <XAxis type="number" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} fontSize={12} hide />
                                    <YAxis type="category" dataKey="name" width={120} stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} fontSize={11} tick={{ fill: theme === 'dark' ? '#9ca3af' : '#4b5563' }} />
                                    <Tooltip
                                        cursor={{ fill: theme === 'dark' ? '#374151' : '#f3f4f6' }}
                                        contentStyle={{
                                            backgroundColor: theme === 'dark' ? '#1f2937' : 'white',
                                            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                            color: theme === 'dark' ? 'white' : 'black',
                                            borderRadius: '12px'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} name="Units Sold" label={{ position: 'right', fill: theme === 'dark' ? 'white' : 'black', fontSize: 12 }} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 italic">No product data available</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Details */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="flex items-center gap-3">
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Activity Details</h2>
                    <span className="text-sm text-gray-400 font-medium px-3 py-1 bg-gray-800 rounded-full border border-gray-700">{
                        filterType === 'daily' ? format(selectedDate, 'MMM dd, yyyy') :
                            filterType === 'monthly' ? format(selectedMonth, 'MMM yyyy') :
                                filterType === 'yearly' ? format(new Date(selectedYear, 0, 1), 'yyyy') :
                                    `Last ${presetRange} Days`
                    }</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'} shadow-lg h-[400px] flex flex-col`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                <Calendar className="w-5 h-5 text-blue-500" />
                                Scheduled Appointments
                            </h3>
                            <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20">{dailyBookings.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {loadingDetails ? (
                                <div className="text-center text-gray-500 py-10">Loading appointments...</div>
                            ) : dailyBookings.length === 0 ? (
                                <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                                    <Calendar className="w-8 h-8 opacity-20 mb-2" />
                                    No appointments scheduled.
                                </div>
                            ) : (
                                dailyBookings.map(booking => (
                                    <div key={booking._id} className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 flex justify-between items-start hover:border-blue-500/30 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-white">{booking.clientName}</p>
                                            <p className="text-xs text-gray-400">{booking.serviceName || (booking.services && booking.services.map(s => s.name).join(', '))}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${booking.status === 'Confirmed' ? 'border-green-500/30 text-green-400' :
                                                    booking.status === 'Completed' ? 'border-blue-500/30 text-blue-400' : 'border-gray-600 text-gray-400'
                                                    }`}>{booking.status}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">{booking.startTime}</p>
                                            <p className="text-xs text-blue-400">Rs. {booking.totalPrice}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100'} shadow-lg h-[400px] flex flex-col`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                <CreditCard className="w-5 h-5 text-orange-500" />
                                Transactions
                            </h3>
                            <span className="text-xs font-bold bg-orange-500/10 text-orange-400 px-2 py-1 rounded-md border border-orange-500/20">{dailyOrders.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {loadingDetails ? (
                                <div className="text-center text-gray-500 py-10">Loading transactions...</div>
                            ) : dailyOrders.length === 0 ? (
                                <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                                    <CreditCard className="w-8 h-8 opacity-20 mb-2" />
                                    No transactions found.
                                </div>
                            ) : (
                                dailyOrders.map(order => (
                                    <div key={order._id} className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 flex justify-between items-start hover:border-orange-500/30 transition-colors">
                                        <div>
                                            <p className="text-sm font-bold text-white max-w-[150px] truncate">{order.customerName}</p>
                                            <p className="text-xs text-gray-400">{order.items.length} items • <span className="text-orange-400">{order.paymentMethod}</span></p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-400">{order.source}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-white">Rs. {order.totalAmount}</p>
                                            <p className="text-[10px] text-gray-500">#{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
