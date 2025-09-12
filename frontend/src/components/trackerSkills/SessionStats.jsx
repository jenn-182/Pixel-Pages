import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Target, 
  Calendar,
  PieChart
} from 'lucide-react';

const SessionStats = ({ stats, tabColor, formatTime }) => {
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '245, 158, 11';
  };

  const tabColorRgb = hexToRgb(tabColor);

  // Get weekly stats for the last 4 weeks
  const getWeeklyStats = () => {
    const weeks = [];
    const now = new Date();
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i * 7 + 6) * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const weekDays = stats.dailyStats.filter(day => {
        const dayDate = new Date(day.date);
        return dayDate >= weekStart && dayDate <= weekEnd;
      });
      
      const weekTime = weekDays.reduce((sum, day) => sum + day.time, 0);
      const weekSessions = weekDays.reduce((sum, day) => sum + day.sessions, 0);
      
      weeks.push({
        week: `Week ${4 - i}`,
        time: weekTime,
        sessions: weekSessions,
        startDate: weekStart.toLocaleDateString()
      });
    }
    
    return weeks;
  };

  const weeklyStats = getWeeklyStats();
  const maxWeeklyTime = Math.max(...weeklyStats.map(w => w.time));

  return (
    <div className="space-y-6">
      {/* Advanced Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Weekly Breakdown */}
        <div className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h4 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} style={{ color: tabColor }} />
            WEEKLY BREAKDOWN
          </h4>
          
          <div className="space-y-3">
            {weeklyStats.map((week, index) => (
              <div key={week.week} className="space-y-2">
                <div className="flex justify-between text-sm font-mono">
                  <span className="text-gray-400">{week.week}</span>
                  <span className="text-white">{formatTime(week.time)}</span>
                </div>
                <div className="w-full bg-gray-700 h-2 border border-gray-600">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: maxWeeklyTime > 0 ? `${(week.time / maxWeeklyTime) * 100}%` : '0%',
                      backgroundColor: tabColor
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Distribution */}
        <div className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h4 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <PieChart size={20} style={{ color: tabColor }} />
            CATEGORY BREAKDOWN
          </h4>
          
          {stats.sessionBreakdown.length > 0 ? (
            <div className="space-y-3">
              {stats.sessionBreakdown.slice(0, 5).map((session, index) => {
                const percentage = stats.totalTime > 0 
                  ? ((session.totalTime / stats.totalTime) * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={session.id} className="space-y-2">
                    <div className="flex justify-between text-sm font-mono">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3"
                          style={{ backgroundColor: session.colorCode }}
                        />
                        <span className="text-white truncate">{session.name}</span>
                      </div>
                      <span className="text-gray-400">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 border border-gray-600">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: session.colorCode
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400 font-mono text-sm">
              No session data available
            </div>
          )}
        </div>

        {/* Productivity Insights */}
        <div className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          <h4 className="text-lg font-mono font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} style={{ color: tabColor }} />
            INSIGHTS
          </h4>
          
          <div className="space-y-4 text-sm font-mono">
            <div>
              <div className="text-gray-400 mb-1">Most Productive Day</div>
              <div className="text-white">
                {stats.dailyStats.length > 0 
                  ? (() => {
                      const mostProductiveDay = stats.dailyStats.reduce((max, day) => 
                        day.time > max.time ? day : max
                      );
                      return `${new Date(mostProductiveDay.date).toLocaleDateString()} (${formatTime(mostProductiveDay.time)})`;
                    })()
                  : 'No data available'
                }
              </div>
            </div>
            
            <div>
              <div className="text-gray-400 mb-1">Current Streak</div>
              <div className="text-white flex items-center gap-2">
                <span>{stats.streakCount} days</span>
                {stats.streakCount > 0 && (
                  <div className="text-orange-400">🔥</div>
                )}
              </div>
            </div>
            
            <div>
              <div className="text-gray-400 mb-1">This Week vs Last Week</div>
              <div className="text-white">
                {weeklyStats.length >= 2 ? (() => {
                  const thisWeek = weeklyStats[3]?.time || 0;
                  const lastWeek = weeklyStats[2]?.time || 0;
                  const change = thisWeek - lastWeek;
                  const changePercent = lastWeek > 0 ? ((change / lastWeek) * 100).toFixed(1) : 0;
                  
                  return change >= 0 
                    ? `+${formatTime(change)} (+${changePercent}%)`
                    : `${formatTime(change)} (${changePercent}%)`;
                })() : 'Not enough data'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Session Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 border-2 border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6"
      >
        <h4 className="text-lg font-mono font-bold text-white mb-6 flex items-center gap-2">
          <Target size={20} style={{ color: tabColor }} />
          DETAILED SESSION ANALYTICS
        </h4>
        
        {stats.sessionBreakdown.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-gray-400">CATEGORY</th>
                  <th className="text-right py-3 px-4 text-gray-400">TOTAL TIME</th>
                  <th className="text-right py-3 px-4 text-gray-400">SESSIONS</th>
                  <th className="text-right py-3 px-4 text-gray-400">AVERAGE</th>
                  <th className="text-right py-3 px-4 text-gray-400">LAST ACTIVE</th>
                </tr>
              </thead>
              <tbody>
                {stats.sessionBreakdown.map((session, index) => (
                  <tr key={session.id} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3"
                          style={{ backgroundColor: session.colorCode }}
                        />
                        <div>
                          <div className="text-white font-bold">{session.name}</div>
                          {session.tag && (
                            <div className="text-xs text-gray-400">{session.tag}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-white font-bold">
                      {formatTime(session.totalTime)}
                    </td>
                    <td className="text-right py-3 px-4 text-white">
                      {session.sessionCount}
                    </td>
                    <td className="text-right py-3 px-4 text-white">
                      {formatTime(session.averageTime)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-400">
                      {session.lastActive 
                        ? new Date(session.lastActive).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 font-mono">
            No session data available for detailed analytics.
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SessionStats;