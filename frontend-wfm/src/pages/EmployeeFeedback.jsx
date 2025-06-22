import React from 'react';
import { Helmet } from 'react-helmet';
import EmployeeFeedbackCard from '@/components/qa/EmployeeFeedbackCard';

const mockFeedback = [
  {
    id: 1,
    claimId: 'C-15892',
    qaScore: 85,
    verdict: 'Fail',
    feedback: 'Incorrect denial code used. Please refer to the UHC-specific guidelines for code 123. Training session scheduled.',
    timestamp: '2025-06-20T10:30:00Z',
    qaAuditor: 'Jane Doe'
  },
  {
    id: 2,
    claimId: 'C-17234',
    qaScore: 98,
    verdict: 'Pass',
    feedback: 'Excellent work on resolving this complex claim. Follow-up was timely and well-documented.',
    timestamp: '2025-06-19T14:00:00Z',
    qaAuditor: 'Jane Doe'
  },
  {
    id: 3,
    claimId: 'C-12111',
    qaScore: 70,
    verdict: 'Critical Error',
    feedback: 'HIPAA violation detected in notes. Immediate retraining required. Please see manager.',
    timestamp: '2025-06-18T11:00:00Z',
    qaAuditor: 'Jane Doe'
  }
];

const EmployeeFeedback = () => {
  const title = "My QA Feedback";

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content="View your quality audit feedback and scores." />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300">Review your recent audit results and feedback from the QA team.</p>
        </div>
        <div className="space-y-4">
          {mockFeedback.map(item => (
            <EmployeeFeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default EmployeeFeedback;