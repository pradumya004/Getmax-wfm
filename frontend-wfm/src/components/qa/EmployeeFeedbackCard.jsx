import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const EmployeeFeedbackCard = ({ feedback }) => {
  const getVerdictBadge = (verdict) => {
    switch (verdict) {
      case 'Pass':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Pass</Badge>;
      case 'Fail':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Fail</Badge>;
      case 'Critical Error':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Critical Error</Badge>;
      default:
        return <Badge variant="outline">{verdict}</Badge>;
    }
  };

  return (
    <Card className="bg-glass-dark border-[#39ff14]/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">Audit for Claim: {feedback.claimId}</CardTitle>
            <CardDescription className="text-gray-400">
              Audited by {feedback.qaAuditor} • {formatDistanceToNow(new Date(feedback.timestamp), { addSuffix: true })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-gray-400">Score</span>
              <p className="text-2xl font-bold text-[#39ff14]">{feedback.qaScore}</p>
            </div>
            {getVerdictBadge(feedback.verdict)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 bg-black/20 p-4 rounded-md border border-gray-700">{feedback.feedback}</p>
      </CardContent>
    </Card>
  );
};

export default EmployeeFeedbackCard;