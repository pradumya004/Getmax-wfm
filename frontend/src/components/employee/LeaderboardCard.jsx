// frontend/src/components/employee/LeaderboardCard.jsx

import React from "react";
import { Trophy, TrendingUp, Users } from "lucide-react";
import { Card } from "../ui/Card.jsx";
import { Badge } from "../ui/Badge.jsx";
import { getInitials } from "../../lib/utils.js";

const LeaderboardCard = ({
  leaderboard = [],
  currentUser,
  title = "Team Leaderboard",
}) => {
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-4 h-4 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-4 h-4 text-orange-400" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank <= 3)
      return "bg-gradient-to-r from-yellow-400 to-orange-500 text-black";
    return "bg-slate-700 text-gray-300";
  };

  return (
    <Card theme="employee" className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <TrendingUp className="w-5 h-5 text-emerald-400" />
      </div>

      <div className="space-y-3">
        {leaderboard.slice(0, 10).map((player, index) => {
          const isCurrentUser = player.employeeId === currentUser?.employeeId;

          return (
            <div
              key={player.employeeId || index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isCurrentUser
                  ? "bg-emerald-500/20 border border-emerald-500/30"
                  : "hover:bg-slate-800/50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${getRankColor(
                  player.rank
                )}`}
              >
                {player.rank}
              </div>

              <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-xs">
                  {getInitials(player.name)}
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p
                    className={`font-medium ${
                      isCurrentUser ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {isCurrentUser ? "You" : player.name}
                  </p>
                  {isCurrentUser && (
                    <Badge variant="success" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{player.points} points</p>
              </div>

              {getRankIcon(player.rank)}
            </div>
          );
        })}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400">No leaderboard data available</p>
        </div>
      )}
    </Card>
  );
};

export default LeaderboardCard;
