import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Clock,
    Target,
    Calendar,
    Flame,
    Plus,
    Edit,
    Trash2,
    Tag,
    Activity,
    Briefcase,
    BookOpen,
    Home,
    Dumbbell,
    Palette,
    FileText
} from 'lucide-react';
import useProductivityStats from '../../hooks/useProductivityStats';
import useFocusSessions from '../../hooks/useFocusSessions';
import SessionStats from '../tracker/SessionStats';
import CategoryManager from '../tracker/CategoryManager';
import ManualTimeEntry from '../tracker/ManualTimeEntry';

const PREDEFINED_TAGS = [
    { id: 'work', label: 'Work', color: '#3B82F6', icon: Briefcase },
    { id: 'learning', label: 'Learning', color: '#10B981', icon: BookOpen },
    { id: 'personal', label: 'Personal', color: '#8B5CF6', icon: Home },
    { id: 'health', label: 'Health', color: '#EF4444', icon: Dumbbell },
    { id: 'creative', label: 'Creative', color: '#F59E0B', icon: Palette },
    { id: 'other', label: 'Other', color: '#6B7280', icon: FileText }
];

const TrackerTab = ({ tabColor = '#F59E0B' }) => {
    const [currentView, setCurrentView] = useState('overview'); // 'overview', 'categories', 'sessions'
    const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'today', 'week', 'month', 'all'
    const [showCategoryManager, setShowCategoryManager] = useState(false);
    const [showManualEntry, setShowManualEntry] = useState(false);

    const { stats, loading, formatTime, calculateStats, getAllLogs } = useProductivityStats();
    const { sessions, deleteSession, updateSession } = useFocusSessions();

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
            '245, 158, 11';
    };

    const tabColorRgb = hexToRgb(tabColor);

    // Refresh stats when data changes
    useEffect(() => {
        calculateStats();
    }, [sessions]);

    const handleDeleteSession = async (sessionId) => {
        if (window.confirm('Are you sure you want to delete this session category? All logged time will be permanently lost.')) {
            try {
                await deleteSession(sessionId);
                calculateStats();
            } catch (error) {
                console.error('Failed to delete session:', error);
                alert('Failed to delete session. Please try again.');
            }
        }
    };

    const handleManualTimeEntry = async (entryData) => {
        try {
            // The ManualTimeEntry component handles the actual logging
            // We just need to refresh the stats after it's done
            calculateStats();
            setShowManualEntry(false);
        } catch (error) {
            console.error('Failed to process manual entry:', error);
            alert('Failed to process manual time entry. Please try again.');
        }
    };

    const getStatsByPeriod = () => {
        switch (selectedPeriod) {
            case 'today':
                return stats.todayTime;
            case 'week':
                return stats.weekTime;
            case 'month':
                return stats.monthTime;
            case 'all':
                return stats.totalTime;
            default:
                return stats.weekTime;
        }
    };

    const calculateCategoryStats = () => {
        const logs = getAllLogs();

        return PREDEFINED_TAGS.map(tag => {
            // Find all sessions with this tag
            const categorySessions = sessions.filter(session => session.tag === tag.id);

            // Find all logs for sessions with this tag
            const categoryLogs = logs.filter(log =>
                categorySessions.some(session => session.id === log.sessionId)
            );

            const totalTime = categoryLogs.reduce((sum, log) => sum + (log.timeSpent || 0), 0);

            return {
                ...tag,
                totalTime,
                sessionCount: categorySessions.length,
                logCount: categoryLogs.length,
                averageTime: categoryLogs.length > 0 ? Math.round(totalTime / categoryLogs.length) : 0
            };
        }).filter(category => category.totalTime > 0) // Only show categories with logged time
            .sort((a, b) => b.totalTime - a.totalTime); // Sort by most time logged
    };

    // Add this somewhere in your TrackerTab component to debug:
    useEffect(() => {
        console.log('=== DEBUGGING STORAGE ===');
        console.log('pixelPages_focusLogs:', JSON.parse(localStorage.getItem('pixelPages_focusLogs') || '[]'));
        console.log('focusSessionLogs:', JSON.parse(localStorage.getItem('focusSessionLogs') || '[]'));
        console.log('All localStorage:', JSON.stringify(Object.fromEntries(Object.entries(localStorage).filter(([key]) => key.startsWith('pixelPages_'))), null, 2));
    }, []);

    if (loading) {
        return (
            <div className="tracker-tab-container p-6">
                <div className="text-center py-8 font-mono text-white">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <BarChart3 size={32} style={{ color: tabColor }} />
                    </motion.div>
                    <div>Analyzing productivity data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="tracker-tab-container p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-mono text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <div
                        className="w-6 h-6 border border-gray-600"
                        style={{ backgroundColor: tabColor }}
                    />
                    PRODUCTIVITY TRACKER
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                    Monitor your focus sessions, analyze productivity patterns, and track your progress.
                </p>
            </div>

            {/* Navigation */}
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    {[
                        { id: 'overview', label: 'OVERVIEW', icon: BarChart3 },
                        { id: 'sessions', label: 'SESSIONS', icon: Target },
                        { id: 'analytics', label: 'ANALYTICS', icon: TrendingUp }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setCurrentView(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 font-mono font-bold transition-all ${currentView === tab.id
                                    ? 'border-2 text-white'
                                    : 'border-2 border-gray-600 text-gray-400 hover:border-gray-500'
                                }`}
                            style={{
                                borderColor: currentView === tab.id ? tabColor : undefined,
                                color: currentView === tab.id ? tabColor : undefined
                            }}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* View Toggle Buttons */}
            <div className="mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentView('overview')}
                        className={`px-4 py-2 font-mono text-sm border-2 transition-colors ${
                            currentView === 'overview'
                                ? 'text-white border-white'
                                : 'text-gray-400 border-gray-600 hover:border-gray-500'
                        }`}
                        style={{
                            borderColor: currentView === 'overview' ? tabColor : undefined,
                            color: currentView === 'overview' ? tabColor : undefined
                        }}
                    >
                        OVERVIEW
                    </button>
                    <button
                        onClick={() => setCurrentView('categories')}
                        className={`px-4 py-2 font-mono text-sm border-2 transition-colors ${
                            currentView === 'categories'
                                ? 'text-white border-white'
                                : 'text-gray-400 border-gray-600 hover:border-gray-500'
                        }`}
                        style={{
                            borderColor: currentView === 'categories' ? tabColor : undefined,
                            color: currentView === 'categories' ? tabColor : undefined
                        }}
                    >
                        BY CATEGORY
                    </button>
                    <button
                        onClick={() => setCurrentView('sessions')}
                        className={`px-4 py-2 font-mono text-sm border-2 transition-colors ${
                            currentView === 'sessions'
                                ? 'text-white border-white'
                                : 'text-gray-400 border-gray-600 hover:border-gray-500'
                        }`}
                        style={{
                            borderColor: currentView === 'sessions' ? tabColor : undefined,
                            color: currentView === 'sessions' ? tabColor : undefined
                        }}
                    >
                        SESSIONS
                    </button>
                </div>
            </div>

            {/* Overview View */}
            {currentView === 'overview' && (
                <div className="space-y-6">
                    {/* Key Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {/* Total Time */}
                        <div
                            className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
                            style={{
                                borderColor: tabColor,
                                boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
                            }}
                        >
                            <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none"
                                style={{ borderColor: tabColor }} />

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={20} style={{ color: tabColor }} />
                                    <span className="text-sm font-mono font-bold" style={{ color: tabColor }}>
                                        {selectedPeriod.toUpperCase()} FOCUS
                                    </span>
                                </div>
                                <div className="text-2xl font-mono font-bold text-white">
                                    {formatTime(getStatsByPeriod())}
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    {selectedPeriod === 'all' ? 'Total time logged' : `In the last ${selectedPeriod}`}
                                </div>
                            </div>
                        </div>

                        {/* Sessions Count */}
                        <div className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Target size={20} className="text-blue-400" />
                                <span className="text-sm font-mono font-bold text-blue-400">SESSIONS</span>
                            </div>
                            <div className="text-2xl font-mono font-bold text-white">
                                {stats.totalSessions}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                                Completed sessions
                            </div>
                        </div>

                        {/* Streak */}
                        <div className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Flame size={20} className="text-orange-400" />
                                <span className="text-sm font-mono font-bold text-orange-400">STREAK</span>
                            </div>
                            <div className="text-2xl font-mono font-bold text-white">
                                {stats.streakCount}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                                Consecutive active days
                            </div>
                        </div>

                        {/* Average Session */}
                        <div className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity size={20} className="text-green-400" />
                                <span className="text-sm font-mono font-bold text-green-400">AVERAGE</span>
                            </div>
                            <div className="text-2xl font-mono font-bold text-white">
                                {formatTime(stats.avgSessionLength)}
                            </div>
                            <div className="text-xs text-gray-400 font-mono">
                                Per session
                            </div>
                        </div>
                    </motion.div>

                    {/* Daily Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
                    >
                        <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
                            <Calendar size={20} />
                            DAILY ACTIVITY (LAST 30 DAYS)
                        </h3>

                        <div className="grid grid-cols-15 gap-1">
                            {stats.dailyStats.map((day, index) => {
                                const maxTime = Math.max(...stats.dailyStats.map(d => d.time));
                                const intensity = maxTime > 0 ? (day.time / maxTime) : 0;

                                return (
                                    <div
                                        key={day.date}
                                        className="w-4 h-4 border border-gray-600 cursor-pointer transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: day.time > 0
                                                ? `rgba(${tabColorRgb}, ${0.2 + intensity * 0.8})`
                                                : 'transparent'
                                        }}
                                        title={`${day.date}: ${formatTime(day.time)} (${day.sessions} sessions)`}
                                    />
                                );
                            })}
                        </div>

                        <div className="flex items-center justify-between mt-4 text-xs font-mono text-gray-400">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {[0, 0.25, 0.5, 0.75, 1].map(intensity => (
                                    <div
                                        key={intensity}
                                        className="w-3 h-3 border border-gray-600"
                                        style={{
                                            backgroundColor: intensity > 0
                                                ? `rgba(${tabColorRgb}, ${0.2 + intensity * 0.8})`
                                                : 'transparent'
                                        }}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </motion.div>

                    {/* Top Sessions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
                    >
                        <h3 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} />
                            TOP SESSION CATEGORIES
                        </h3>

                        {stats.sessionBreakdown.length > 0 ? (
                            <div className="space-y-3">
                                {stats.sessionBreakdown.slice(0, 5).map((session, index) => (
                                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-900 border border-gray-600">
                                        <div className="flex items-center gap-3">
                                            <div className="text-lg font-mono font-bold text-gray-400">
                                                #{index + 1}
                                            </div>
                                            <div
                                                className="w-4 h-4"
                                                style={{ backgroundColor: session.colorCode }}
                                            />
                                            <div>
                                                <div className="font-mono font-bold text-white">{session.name}</div>
                                                {session.tag && (
                                                    <div className="text-xs text-gray-400 font-mono">{session.tag}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-mono font-bold text-white">
                                                {formatTime(session.totalTime)}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono">
                                                {session.sessionCount} sessions
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400 font-mono">
                                No session data available. Start tracking your focus sessions!
                            </div>
                        )}
                    </motion.div>
                </div>
            )}

            {/* Category Analytics View */}
            {currentView === 'categories' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative mb-6"
                    style={{
                        borderColor: tabColor,
                        boxShadow: `0 0 20px rgba(${tabColorRgb}, 0.3), 8px 8px 0px 0px rgba(0,0,0,1)`
                    }}
                >
                    <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none"
                         style={{ borderColor: tabColor }} />

                    <div className="relative z-10">
                        <h3 className="text-xl font-mono font-bold text-white mb-6 flex items-center gap-2">
                            <BarChart3 size={20} style={{ color: tabColor }} />
                            TIME BY CATEGORY
                        </h3>

                        {(() => {
                            const categoryStats = calculateCategoryStats();
                            const maxTime = Math.max(...categoryStats.map(c => c.totalTime));

                            return categoryStats.length > 0 ? (
                                <div className="space-y-4">
                                    {categoryStats.map(category => {
                                        const IconComponent = category.icon;
                                        const hours = Math.floor(category.totalTime / 60);
                                        const minutes = category.totalTime % 60;

                                        return (
                                            <div
                                                key={category.id}
                                                className="bg-gray-900 border-2 border-gray-700 p-4 relative overflow-hidden"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <IconComponent size={24} style={{ color: category.color }} />
                                                        <div>
                                                            <h4 className="font-mono font-bold text-white">{category.label}</h4>
                                                            <p className="text-gray-400 text-sm font-mono">
                                                                {category.sessionCount} sessions • {category.logCount} logs • avg: {category.averageTime}m
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-mono font-bold text-white text-lg">
                                                            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
                                                        </div>
                                                        <div className="text-gray-400 text-sm font-mono">
                                                            {stats.totalTime > 0 ? ((category.totalTime / stats.totalTime) * 100).toFixed(1) : 0}% of total
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Progress bar */}
                                                <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
                                                    <div 
                                                      className="h-full transition-all duration-700 ease-out"
                                                      style={{ 
                                                        width: maxTime > 0 ? `${(category.totalTime / maxTime) * 100}%` : '0%',
                                                        backgroundColor: category.color
                                                      }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-400 font-mono">
                                    No category data available. Start logging time to see category breakdown.
                                </div>
                            );
                        })()}
                    </div>
                </motion.div>
            )}

            {/* Sessions View */}
            {currentView === 'sessions' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-mono font-bold text-white">SESSION CATEGORIES</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowManualEntry(true)}
                                className="bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                                style={{
                                    borderColor: '#22C55E',
                                    color: '#22C55E',
                                    boxShadow: `0 0 5px rgba(34, 197, 94, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Plus size={16} />
                                    <span>LOG TIME</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setShowCategoryManager(true)}
                                className="bg-gray-900 border-2 px-4 py-2 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                                style={{
                                    borderColor: tabColor,
                                    color: tabColor,
                                    boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Plus size={16} />
                                    <span>MANAGE CATEGORIES</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {sessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sessions.map(session => {
                                const sessionStats = stats.sessionBreakdown.find(s => s.id === session.id);
                                return (
                                    <motion.div
                                        key={session.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-gray-800 border-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative"
                                        style={{
                                            borderColor: session.colorCode,
                                            boxShadow: `0 0 10px rgba(${hexToRgb(session.colorCode)}, 0.2), 8px 8px 0px 0px rgba(0,0,0,1)`
                                        }}
                                    >
                                        <div className="absolute inset-0 border-2 opacity-30 animate-pulse pointer-events-none"
                                            style={{ borderColor: session.colorCode }} />

                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4"
                                                        style={{ backgroundColor: session.colorCode }}
                                                    />
                                                    <h4 className="font-mono font-bold text-white">{session.name}</h4>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setShowCategoryManager(true)}
                                                        className="text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSession(session.id)}
                                                        className="text-gray-400 hover:text-red-400 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {session.description && (
                                                <p className="text-xs text-gray-400 font-mono mb-3">
                                                    {session.description}
                                                </p>
                                            )}

                                            {session.tag && (
                                                <div className="mb-3">
                                                    <span className="px-2 py-1 text-xs font-mono border border-gray-600 text-gray-400">
                                                        {session.tag}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm font-mono">
                                                    <span className="text-gray-400">Total Time:</span>
                                                    <span className="text-white">{formatTime(sessionStats?.totalTime || 0)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm font-mono">
                                                    <span className="text-gray-400">Sessions:</span>
                                                    <span className="text-white">{sessionStats?.sessionCount || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm font-mono">
                                                    <span className="text-gray-400">Average:</span>
                                                    <span className="text-white">{formatTime(sessionStats?.averageTime || 0)}</span>
                                                </div>
                                                {sessionStats?.lastActive && (
                                                    <div className="flex justify-between text-sm font-mono">
                                                        <span className="text-gray-400">Last Active:</span>
                                                        <span className="text-white">
                                                            {new Date(sessionStats.lastActive).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12 bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        >
                            <Target size={48} className="text-gray-600 mx-auto mb-4" />
                            <h3 className="font-mono text-lg font-bold text-white mb-2">NO SESSION CATEGORIES</h3>
                            <p className="text-gray-400 font-mono text-sm mb-6">
                                Create your first session category to start tracking your productivity.
                            </p>
                            <button
                                onClick={() => setShowCategoryManager(true)}
                                className="bg-gray-900 border-2 px-6 py-3 relative group cursor-pointer transition-all duration-300 font-mono font-bold"
                                style={{
                                    borderColor: tabColor,
                                    color: tabColor,
                                    boxShadow: `0 0 5px rgba(${tabColorRgb}, 0.2), 2px 2px 0px 0px rgba(0,0,0,1)`
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Plus size={18} />
                                    <span>CREATE CATEGORY</span>
                                </div>
                            </button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Analytics View */}
            {currentView === 'analytics' && (
                <SessionStats
                    stats={stats}
                    tabColor={tabColor}
                    formatTime={formatTime}
                />
            )}
            {/* Category Manager Modal */}
            <CategoryManager
                isOpen={showCategoryManager}
                onClose={() => setShowCategoryManager(false)}
                sessions={sessions}
                updateSession={updateSession}
                deleteSession={deleteSession}
                tabColor={tabColor}
            />
            {/* Manual Time Entry Modal */}
            <ManualTimeEntry
                isOpen={showManualEntry}
                onClose={() => setShowManualEntry(false)}
                sessions={sessions}
                onSubmit={handleManualTimeEntry}
                tabColor={tabColor}
            />
        </div>
    );
};

export default TrackerTab;