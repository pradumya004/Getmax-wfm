import React, { useState } from 'react';
import { Gamepad2, Crown, ShieldCheck, Star, Zap, Trophy, Sparkles } from 'lucide-react';

const feed = [
  {
    text: 'Priya R. reached Level 6!',
    icon: Crown,
    color: 'text-yellow-400',
    bgColor: 'from-yellow-500/20 to-amber-600/20',
    borderColor: 'border-yellow-400/40',
    time: '2 min ago',
    points: '+500 XP'
  },
  {
    text: 'John T. earned "QA Hero" badge',
    icon: ShieldCheck,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-600/20',
    borderColor: 'border-blue-400/40',
    time: '5 min ago',
    points: '+250 XP'
  },
  {
    text: 'Mike L. is on a 15-day streak!',
    icon: Gamepad2,
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-emerald-600/20',
    borderColor: 'border-green-400/40',
    time: '12 min ago',
    points: '+750 XP'
  },
  {
    text: 'Sarah J. completed 50 tasks milestone!',
    icon: Trophy,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-600/20',
    borderColor: 'border-purple-400/40',
    time: '1 hour ago',
    points: '+1000 XP'
  },
  {
    text: 'David C. achieved "Speed Demon" title',
    icon: Zap,
    color: 'text-orange-400',
    bgColor: 'from-orange-500/20 to-red-600/20',
    borderColor: 'border-orange-400/40',
    time: '2 hours ago',
    points: '+300 XP'
  },
];

const Card = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const CardHeader = ({ className, children }) => (
  <div className={className}>{children}</div>
);
const CardTitle = ({ className, children }) => (
  <h3 className={className}>{children}</h3>
);
const CardContent = ({ children }) => (
  <div className="px-6 pb-6">{children}</div>
);

const GamificationFeedTile = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 h-full rounded-2xl shadow-2xl hover:shadow-purple-400/20 transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-white text-xl flex items-center gap-3 font-semibold">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
            <Gamepad2 className="text-white w-5 h-5" />
          </div>
          <span className="bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Gamification Feed
          </span>
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
        </CardTitle>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
            <span className="text-blue-200/80 text-sm">Live Updates</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400" />
            <span className="text-blue-200/80 text-sm">5 New</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
          {feed.map((item, index) => (
            <div
              key={index}
              className={`
                group relative p-4 rounded-xl bg-gradient-to-r ${item.bgColor} 
                border ${item.borderColor}
                hover:scale-[1.02] transition-all duration-300 cursor-pointer
                ${hoveredIndex === index ? 'shadow-lg' : ''}
              `}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r ${item.bgColor} blur-sm transition-opacity duration-300`}></div>

              <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <div className={`p-2 rounded-lg bg-gradient-to-br ${item.bgColor} border ${item.borderColor}`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-white font-medium text-sm leading-relaxed">
                      {item.text}
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.color} bg-gradient-to-r ${item.bgColor}`}>
                        {item.points}
                      </span>
                      <span className="text-xs text-blue-200/70">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover particles */}
              {hoveredIndex === index && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-150"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-cyan-400 font-bold text-lg">24</div>
              <div className="text-blue-200/70 text-xs">Today</div>
            </div>
            <div>
              <div className="text-purple-400 font-bold text-lg">156</div>
              <div className="text-blue-200/70 text-xs">This Week</div>
            </div>
            <div>
              <div className="text-pink-400 font-bold text-lg">1.2k</div>
              <div className="text-blue-200/70 text-xs">All Time</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationFeedTile;