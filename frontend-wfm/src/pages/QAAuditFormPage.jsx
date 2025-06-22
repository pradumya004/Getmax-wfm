import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import QAAuditForm from '@/components/qa/QAAuditForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const mockAuditQueue = [
  { claimId: 'C-13456', empName: 'John T.', auditTrigger: 'Random', sowType: 'Coding', status: 'Pending' },
  { claimId: 'C-14324', empName: 'Priya R.', auditTrigger: 'Rule-based', sowType: 'AR Calling', status: 'Pending' },
  { claimId: 'C-15892', empName: 'Mike L.', auditTrigger: 'Manual', sowType: 'Denials', status: 'Completed' },
  { claimId: 'C-16101', empName: 'Sarah J.', auditTrigger: 'Random', sowType: 'Charges', status: 'Escalated' },
  { claimId: 'C-17234', empName: 'Priya R.', auditTrigger: 'Rule-based', sowType: 'AR Calling', status: 'Completed' },
  { claimId: 'C-19981', empName: 'John T.', auditTrigger: 'Random', sowType: 'Coding', status: 'Pending' },
];

const QAAuditFormPage = () => {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const claimData = mockAuditQueue.find(c => c.claimId === claimId);
  const title = `QA Audit: ${claimId}`;

  if (!claimData) {
    return (
      <div className="text-center text-white">
        <h1 className="text-2xl">Claim not found</h1>
        <Button onClick={() => navigate('/qa')} className="mt-4">Back to Queue</Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} - GetMax</title>
        <meta name="description" content={`Audit form for claim ${claimId}.`} />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/qa')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-gray-300">Complete the audit form below.</p>
          </div>
        </div>
        <QAAuditForm claimData={claimData} />
      </div>
    </>
  );
};

export default QAAuditFormPage;