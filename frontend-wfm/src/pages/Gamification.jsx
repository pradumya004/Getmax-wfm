import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfile from '@/components/gamification/UserProfile';
import Leaderboard from '@/components/gamification/Leaderboard';
import BadgeMaster from '@/components/gamification/BadgeMaster';
import { User, Trophy, Shield } from 'lucide-react';

const Gamification = () => {
  const title = "Gamification Dashboard";

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="Boost engagement with XP, badges, and leaderboards." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300">Engage, compete, and get rewarded for your performance.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 bg-glass-dark border border-[#39ff14]/20 p-1 h-auto">
            <TabsTrigger value="profile" className="data-[state=active]:bg-[#39ff14] data-[state=active]:text-black">
              <User className="w-4 h-4 mr-2" />
              My Profile
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-[#39ff14] data-[state=active]:text-black">
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="badge-master" className="data-[state=active]:bg-[#39ff14] data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              Badge Master (Admin)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <UserProfile />
          </TabsContent>
          <TabsContent value="leaderboard" className="mt-6">
            <Leaderboard />
          </TabsContent>
          <TabsContent value="badge-master" className="mt-6">
            <BadgeMaster />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Gamification;