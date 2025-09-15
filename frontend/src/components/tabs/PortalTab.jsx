import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Trophy, 
  MessageCircle, 
  Gamepad2, 
  Zap, 
  Star, 
  Target,
  Coffee,
  Code,
  Book,
  Brush,
  BookOpen,
  Dumbbell,
  Music,
  Heart,
  Crown,
  ChevronRight,
  Activity,
  UserPlus,
  Settings,
  Wifi,
  Tag,
  WifiOff,
  Clock3,
  Shield,
  Radar,
  Brain,
  Pen,
  Palette
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const PortalTab = () => {
  const { currentTheme, getThemeColors } = useTheme();
  const themeColors = getThemeColors();
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Focus session category colors
  const focusCategories = {
    'scholar': '#FF1493',      // Deep Pink
    'profession': '#00FFFF',   // Cyan  
    'artisan': '#8A2BE2',      // Blue Violet
    'scribe': '#FF6347',       // Tomato Red
    'programming': '#00FF7F',  // Spring Green
    'literacy': '#FFD700',     // Gold
    'strategist': '#FF4500',   // Orange Red
    'mindfulness': '#40E0D0',  // Turquoise
    'knowledge': '#DA70D6'     // Orchid
  };

  // Mock friends data with activities
  const mockFriends = [
    {
      id: 1,
      username: "CodeMaster_Alex",
      avatar: "/Avatars/avatar6.png",
      status: "online",
      activity: {
        type: "focus",
        category: "programming",
        duration: "45m",
        started: "2h ago",
        icon: Code,
        color: focusCategories.programming
      },
      level: 12,
      lastSeen: "Online",
      recentAchievements: [
        { name: "Code Warrior", icon: Code, earnedAt: "2 hours ago" },
        { name: "Focus Master", icon: Target, earnedAt: "Yesterday" }
      ],
      stats: {
        totalXP: 2400,
        focusTime: "127h",
        streak: 15
      }
    },
    {
      id: 2,
      username: "Coffee_Goblin96",
      avatar: "/Avatars/avatar16.png",
      status: "online",
      activity: {
        type: "focus",
        category: "artisan",
        duration: "1h 20m",
        started: "30m ago",
        icon: Palette,
        color: focusCategories.artisan
      },
      level: 8,
      lastSeen: "Online",
      recentAchievements: [
        { name: "Creative Genius", icon: Brush, earnedAt: "4 hours ago" }
      ],
      stats: {
        totalXP: 1800,
        focusTime: "89h",
        streak: 8
      }
    },
    {
      id: 3,
      username: "Gl1tchM4ster",
      avatar: "/Avatars/avatar12.png",
      status: "online",
      activity: {
        type: "focus",
        category: "scribe",
        duration: "45m",
        started: "1h ago",
        icon: Pen,
        color: "#ef4444"
      },
      level: 15,
      lastSeen: "Online",
      recentAchievements: [
        { name: "Iron Will", icon: Pen, earnedAt: "1 hour ago" },
        { name: "Consistency King", icon: Crown, earnedAt: "Today" }
      ],
      stats: {
        totalXP: 3200,
        focusTime: "203h",
        streak: 22
      }
    },
    {
      id: 4,
      username: "Bookworm_Bella",
      avatar: "/Avatars/avatar13.png",
      status: "away",
      activity: {
        type: "focus",
        lastActivity: "literacy",
        duration: "2h 15m",
        started: "3h ago",
        icon: BookOpen,
        color: focusCategories.literacy
      },
      level: 10,
      lastSeen: "3 hours ago",
      recentAchievements: [
        { name: "Knowledge Seeker", icon: BookOpen, earnedAt: "Today" }
      ],
      stats: {
        totalXP: 2100,
        focusTime: "156h",
        streak: 12
      }
    },
    {
      id: 5,
      username: "shadow_mage_13",
      avatar: "/Avatars/avatar5.png",
      status: "offline",
      activity: {
        type: "offline",
        lastActivity: "Scribe",
        duration: "1h 30m",
        started: "Yesterday",
        icon: Pen,
        color: focusCategories.artisan
      },
      level: 7,
      lastSeen: "Yesterday",
      recentAchievements: [
        { name: "Rhythm Master", icon: Music, earnedAt: "Yesterday" }
      ],
      stats: {
        totalXP: 1500,
        focusTime: "78h",
        streak: 5
      }
    },
    {
      id: 6,
      username: "ghostgirll_13",
      avatar: "/Avatars/avatar14.png",
      status: "online",
      activity: {
        type: "focus",
        category: "scholar",
        duration: "2h 5m",
        started: "15m ago",
        icon: Brain,
        color: focusCategories.scholar
      },
      level: 11,
      lastSeen: "Online",
      recentAchievements: [
        { name: "Study Streak", icon: BookOpen, earnedAt: "Today" },
        { name: "Knowledge Collector", icon: Trophy, earnedAt: "2 days ago" }
      ],
      stats: {
        totalXP: 2300,
        focusTime: "134h",
        streak: 18
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#22c55e';
      case 'away': return '#f59e0b';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getActivityText = (friend) => {
    switch (friend.activity.type) {
      case 'focus':
        return `Started ${friend.activity.category} skill session for ${friend.activity.duration}`;
      case 'idle':
        return `Just finished: ${friend.activity.lastActivity}`;
      case 'recent':
        return `Last activity: ${friend.activity.lastActivity}`;
      case 'offline':
        return `Last seen: ${friend.lastSeen}`;
      default:
        return 'Available';
    }
  };

  const onlineFriends = mockFriends.filter(f => f.status === 'online');
  const awayFriends = mockFriends.filter(f => f.status === 'away');
  const offlineFriends = mockFriends.filter(f => f.status === 'offline');

  // Recent activity feed
  const recentActivity = [
        {
      id: 1,
      user: "ghostgirll_13",
      avatar: "/Avatars/avatar14.png",
      action: "earned achievement",
      achievement: "Tag Rookie",
      icon: Tag,
      time: "Yesterday"
    },
        {
      id: 3,
      user: "Bookworm_Bella",
      avatar: "/Avatars/avatar13.png",
      action: "Started skill session",
      achievement: "Scholar",
      icon: BookOpen,
      time: "3 hours ago"
    },
        {
      id: 4,
      user: "shadow_mage_13",
      avatar: "/Avatars/avatar5.png",
      action: "earned achievement",
      achievement: "Create 200 logs",
      icon: Pen,
      time: "4 hours ago"
    },
    {
      id: 6,
      user: "CodeMaster_Alex",
      avatar: "/Avatars/avatar6.png",
      action: "earned achievement",
      achievement: "Code Warrior",
      icon: Code,
      time: "2 hours ago"
    },
    {
      id: 1,
      user: "Coffee_Goblin96",
      avatar: "/Avatars/avatar16.png",
      action: "Started skill session",
      achievement: "Artisan",
      icon: Brush,
      time: "30 minutes ago"
    }
  ];

  return (
    <div className="p-6 space-y-6 h-full overflow-hidden">
      {/* Compact Portal Command Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden flex-shrink-0 p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: currentTheme === 'default' 
            ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
            : '0 0 10px rgba(255, 255, 255, 0.1), 4px 4px 0px 0px rgba(0,0,0,1)',
          height: '80px'
        }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Left: Portal Command Title */}
          <div>
            <motion.h1 
              className="text-3xl font-bold font-mono text-white tracking-wider"
              style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.6)' }}
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.6)',
                  '0 0 30px rgba(255, 255, 255, 0.8)',
                  '0 0 20px rgba(255, 255, 255, 0.6)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              PORTAL COMMAND CENTER
            </motion.h1>
          </div>

          {/* Right: Action Buttons and Status */}
          <div className="flex items-center gap-6">
            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg font-mono font-bold text-sm flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              >
                <UserPlus size={16} />
                ADD PIXEL PAL
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg font-mono font-bold text-sm flex items-center gap-2 transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }}
              >
                <Settings size={16} />
                PRIVACY SETTINGS
              </motion.button>
            </div>

            {/* Network Status */}
            <div className="text-right">
              <div className="text-xs font-mono text-white/60 mb-1">NETWORK STATUS</div>
              <div className="flex items-center gap-2">
                <Wifi size={16} className="text-green-400" />
                <span className="text-green-400 font-mono font-bold">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Column - Squad Activity Monitor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 flex flex-col"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: currentTheme === 'default' 
              ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
              : '0 0 10px rgba(255, 255, 255, 0.1), 4px 4px 0px 0px rgba(0,0,0,1)'
          }}
        >
          <h2 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2 flex-shrink-0">
            <Activity size={20} className="text-white" />
            PIXEL PAL ACTIVITY
          </h2>

          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Online Friends */}
            {onlineFriends.length > 0 && (
              <div>
                <h3 className="text-sm font-mono font-bold text-green-400 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  ACTIVE MEMBERS ({onlineFriends.length})
                </h3>
                <div className="space-y-2">
                  {onlineFriends.map(friend => (
                    <motion.div
                      key={friend.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg cursor-pointer transition-all"
                      style={{
                        backgroundColor: selectedFriend?.id === friend.id ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${selectedFriend?.id === friend.id ? 'rgba(255, 255, 255, 0.4)' : 'rgba(34, 197, 94, 0.3)'}`,
                        boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)'
                      }}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={friend.avatar}
                            alt={friend.username}
                            className="w-12 h-12 rounded-lg object-cover"
                            style={{ imageRendering: 'pixelated' }}
                            onError={(e) => {
                              e.target.src = '/Avatars/avatar1.png';
                            }}
                          />
                          <div 
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900"
                            style={{ backgroundColor: getStatusColor(friend.status) }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white text-sm truncate">
                              {friend.username}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                              L{friend.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <friend.activity.icon size={12} style={{ color: friend.activity.color }} />
                            <span className="truncate">{getActivityText(friend)}</span>
                          </div>
                        </div>
                        
                        <ChevronRight size={14} className="text-white/40" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Away Friends */}
            {awayFriends.length > 0 && (
              <div>
                <h3 className="text-sm font-mono font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  AWAY MEMBERS ({awayFriends.length})
                </h3>
                <div className="space-y-2">
                  {awayFriends.map(friend => (
                    <motion.div
                      key={friend.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg cursor-pointer transition-all opacity-75"
                      style={{
                        backgroundColor: selectedFriend?.id === friend.id ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${selectedFriend?.id === friend.id ? 'rgba(255, 255, 255, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`,
                        boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)'
                      }}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={friend.avatar}
                            alt={friend.username}
                            className="w-12 h-12 rounded-lg object-cover"
                            style={{ imageRendering: 'pixelated' }}
                            onError={(e) => {
                              e.target.src = '/Avatars/avatar1.png';
                            }}
                          />
                          <div 
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900"
                            style={{ backgroundColor: getStatusColor(friend.status) }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white text-sm truncate">
                              {friend.username}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                              L{friend.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <friend.activity.icon size={12} style={{ color: friend.activity.color }} />
                            <span className="truncate">{getActivityText(friend)}</span>
                          </div>
                        </div>
                        
                        <ChevronRight size={14} className="text-white/40" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Friends */}
            {offlineFriends.length > 0 && (
              <div>
                <h3 className="text-sm font-mono font-bold text-gray-400 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  OFFLINE MEMBERS ({offlineFriends.length})
                </h3>
                <div className="space-y-2">
                  {offlineFriends.map(friend => (
                    <motion.div
                      key={friend.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg cursor-pointer transition-all opacity-50"
                      style={{
                        backgroundColor: selectedFriend?.id === friend.id ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${selectedFriend?.id === friend.id ? 'rgba(255, 255, 255, 0.4)' : 'rgba(107, 114, 128, 0.3)'}`,
                        boxShadow: '0 0 10px rgba(107, 114, 128, 0.1)'
                      }}
                      onClick={() => setSelectedFriend(friend)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={friend.avatar}
                            alt={friend.username}
                            className="w-12 h-12 rounded-lg object-cover"
                            style={{ imageRendering: 'pixelated' }}
                            onError={(e) => {
                              e.target.src = '/Avatars/avatar1.png';
                            }}
                          />
                          <div 
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900"
                            style={{ backgroundColor: getStatusColor(friend.status) }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono font-bold text-white text-sm truncate">
                              {friend.username}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/80">
                              L{friend.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            <friend.activity.icon size={12} style={{ color: friend.activity.color }} />
                            <span className="truncate">{getActivityText(friend)}</span>
                          </div>
                        </div>
                        
                        <ChevronRight size={14} className="text-white/40" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Activity Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 flex flex-col"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              boxShadow: currentTheme === 'default' 
                ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
                : '0 0 10px rgba(255, 255, 255, 0.1), 4px 4px 0px 0px rgba(0,0,0,1)',
              height: '320px'
            }}
          >
            <h3 className="text-lg font-bold font-mono text-white mb-4 flex items-center gap-2 flex-shrink-0">
              <Zap size={18} className="text-white" />
              ACTIVITY FEED
            </h3>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {recentActivity.map(activity => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={activity.avatar}
                      alt={activity.user}
                      className="w-8 h-8 rounded-lg object-cover"
                      style={{ imageRendering: 'pixelated' }}
                      onError={(e) => {
                        e.target.src = '/Avatars/avatar1.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <span className="font-mono font-bold text-white">{activity.user}</span>
                        <span className="text-white/60 ml-1">{activity.action}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <activity.icon size={16} className="text-white" />
                        <span className="text-xs text-white/80 font-mono">{activity.achievement}</span>
                      </div>
                      <div className="text-xs text-white/40 mt-1">{activity.time}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Member Intel */}
          <AnimatePresence>
            {selectedFriend ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="p-6 flex flex-col flex-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  boxShadow: currentTheme === 'default' 
                    ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
                    : '0 0 10px rgba(255, 255, 255, 0.1), 4px 4px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="flex items-center justify-between mb-6 flex-shrink-0">
                  <h3 className="text-lg font-bold font-mono text-white">MEMBER INTEL</h3>
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex flex-col h-full space-y-6">
                  {/* Top Row: Avatar and Basic Info */}
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className="relative inline-block">
                        <img
                          src={selectedFriend.avatar}
                          alt={selectedFriend.username}
                          className="w-20 h-20 rounded-lg object-cover"
                          style={{ imageRendering: 'pixelated' }}
                          onError={(e) => {
                            e.target.src = '/Avatars/avatar1.png';
                          }}
                        />
                        <div 
                          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900"
                          style={{ backgroundColor: getStatusColor(selectedFriend.status) }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-mono font-bold text-white text-xl mb-1">{selectedFriend.username}</h4>
                      <p className="text-sm text-white/60 mb-3">Level {selectedFriend.level}</p>
                      
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold" 
                           style={{ 
                             backgroundColor: getStatusColor(selectedFriend.status) + '20',
                             color: getStatusColor(selectedFriend.status),
                             border: `1px solid ${getStatusColor(selectedFriend.status)}`
                           }}>
                        {selectedFriend.status.toUpperCase()}
                      </div>
                    </div>

                    {/* Stats Grid on the Right */}
                    <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="text-lg font-bold text-white">
                          {selectedFriend.stats.totalXP}
                        </div>
                        <div className="text-xs text-white/60 mt-1">TOTAL XP</div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="text-lg font-bold text-blue-400">{selectedFriend.stats.focusTime}</div>
                        <div className="text-xs text-white/60 mt-1">FOCUS TIME</div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                        <div className="text-lg font-bold text-orange-400">{selectedFriend.stats.streak}</div>
                        <div className="text-xs text-white/60 mt-1">DAY STREAK</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Current Status and Recent Achievements */}
                  <div className="grid grid-cols-2 gap-6 flex-1">
                    {/* Current Status */}
                    <div className="p-4 rounded-lg h-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-sm font-mono font-bold text-white/60 mb-3">CURRENT STATUS</div>
                      <div className="flex items-center gap-3 mb-3">
                        <selectedFriend.activity.icon size={24} style={{ color: selectedFriend.activity.color }} />
                        <span className="text-sm text-white font-mono flex-1">{getActivityText(selectedFriend)}</span>
                      </div>
                      {selectedFriend.activity.type === 'focus' && (
                        <div className="text-xs text-white/40 p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                          <div className="mb-1"><strong>Started:</strong> {selectedFriend.activity.started}</div>
                          <div><strong>Duration:</strong> {selectedFriend.activity.duration}</div>
                        </div>
                      )}
                    </div>

                    {/* Recent Achievements */}
                    <div className="p-4 rounded-lg h-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                      <div className="text-sm font-mono font-bold text-white/60 mb-3">RECENT ACHIEVEMENTS</div>
                      <div className="space-y-3 h-full overflow-y-auto">
                        {selectedFriend.recentAchievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                            <div className="p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                              <achievement.icon size={18} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-mono text-white font-bold truncate">{achievement.name}</div>
                              <div className="text-xs text-white/60">{achievement.earnedAt}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 flex items-center justify-center flex-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  boxShadow: currentTheme === 'default' 
                    ? '0 0 15px rgba(255, 255, 255, 0.2), 4px 4px 0px 0px rgba(0,0,0,1)' 
                    : '0 0 10px rgba(255, 255, 255, 0.1), 4px 4px 0px 0px rgba(0,0,0,1)'
                }}
              >
                <div className="text-center">
                  <Users size={48} className="mx-auto mb-4 text-white/40" />
                  <h3 className="text-xl font-bold font-mono text-white mb-3">MEMBER INTEL</h3>
                  <p className="text-white/60 font-mono">Select a pixel pal to view their intel</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PortalTab;