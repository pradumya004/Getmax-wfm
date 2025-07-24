import MermaidGraph from "../mermaid/MermaidGraph.jsx";

const graph1 = `
graph TB
    subgraph Data_Ingestion_Layer
        A[Manual Entry] --> E
        B[API Integration] --> E
        C[SFTP Upload] --> E
        D[EDI Import] --> E
        F[EHR Integration] --> E
    end
    
    subgraph Core_Claims_Engine
        E[ClaimTasks Core] --> G[Workflow Engine]
        G --> H[Batch Processing]
        G --> I[QA System]
        G --> J[Audit System]
    end
    
    subgraph Processing_Layer
        H[ClaimBatch] --> K[EDI Generation]
        K --> L[Clearinghouse]
        L --> M[Payer Systems]
    end
    
    subgraph Quality_&_Compliance
        I[ClaimAudit] --> N[Compliance Reports]
        J[QA Reviews] --> N
    end
    
    subgraph Output_&_Reporting
        M --> O[Payment Posting]
        N --> P[Management Dashboards]
        O --> P
    end
`;

const graph2 = `
graph LR
    A[Claim Enters Stage] --> B{Auto-Progress Rules}
    B -->|Met| C[Auto Transition]
    B -->|Not Met| D{Escalation Rules}
    D -->|Triggered| E[Escalate to Manager]
    D -->|Not Triggered| F[Continue in Stage]
    C --> G[Update Metrics]
    E --> G
    F --> H[Monitor SLA]
`;

const graph3 = `
sequenceDiagram
    participant C as Claims
    participant B as Batch System
    participant V as Validation Engine
    participant CH as Clearinghouse
    participant P as Payer
    
    C->>B: Claims Ready for Submission
    B->>B: Group by Business Rules
    B->>V: Validate Batch
    V-->>B: Validation Results
    
    alt Validation Passed
        B->>CH: Submit Batch
        CH-->>B: Acknowledgment
        B->>P: Forward to Payer
        P-->>B: Status Updates
    else Validation Failed
        B->>C: Return with Errors
    end
`;

const graph4 = `
graph TD
    A[Claim Selection] --> B{Audit Type}
    B -->|Pre-Submission| C[Coding & Documentation]
    B -->|Post-Submission| D[Quality Review]
    B -->|Compliance| E[Regulatory Check]
    
    C --> F[Scoring Engine]
    D --> F
    E --> F
    
    F --> G{Score Threshold}
    G -->|Pass| H[Release/Continue]
    G -->|Fail| I[Corrective Actions]
    G -->|Warning| J[Management Review]
    
    I --> K[Assign Tasks]
    J --> L[Escalation Process]
`;

const graph5 = `
stateDiagram-v2
    [*] --> New_Claim
    New_Claim --> In_Floating_Pool
    In_Floating_Pool --> Assigned_For_Review
    
    Assigned_For_Review --> Initial_Review
    Initial_Review --> Coding_Review
    Coding_Review --> Billing_Review
    
    Billing_Review --> Ready_For_Submission
    Ready_For_Submission --> Batch_Created
    Batch_Created --> Submitted_To_Clearinghouse
    
    Submitted_To_Clearinghouse --> Acknowledged_By_Clearinghouse
    Acknowledged_By_Clearinghouse --> Sent_To_Payer
    Sent_To_Payer --> Under_Payer_Review
    
    Under_Payer_Review --> Paid
    Under_Payer_Review --> Denied
    Under_Payer_Review --> Partially_Paid
    
    Denied --> Appeal_Required
    Appeal_Required --> Appeal_Submitted
    Appeal_Submitted --> Appeal_Under_Review
    
    Paid --> Payment_Posted
    Partially_Paid --> Secondary_Billing
    Payment_Posted --> Closed
    
    Closed --> [*]
`;

const graph6 = `
graph TB
    subgraph "External Data Sources"
        EHR[EHR Systems<br/>Epic, Cerner, AllScripts]
        PM[Practice Management<br/>Medisoft, AdvancedMD]
        MANUAL[Manual Entry Portal]
        API[Third-party APIs]
        SFTP[SFTP File Uploads]
        EMAIL[Email Processing]
    end
    
    subgraph "Data Ingestion Layer"
        ROUTER[Data Router & Validator]
        PARSER[Multi-format Parser<br/>CSV, Excel, EDI, JSON]
        VALIDATOR[Business Rules Engine]
    end
    
    subgraph "Core Claims Processing"
        CLAIMTASKS[(ClaimTasks Model<br/>Primary Data Store)]
        WORKFLOW[(ClaimWorkflow Model<br/>Process Management)]
        BATCH[(ClaimBatch Model<br/>Submission Management)]
        AUDIT[(ClaimAudit Model<br/>Quality Assurance)]
    end
    
    subgraph "Processing Engines"
        PRIORITY[Priority Calculator]
        SLA[SLA Monitor]
        QA[QA Selection Engine]
        AUTO[Automation Engine]
    end
    
    subgraph "External Integrations"
        CH[Clearinghouses<br/>Availity, Change Healthcare]
        PAYER[Payer Systems<br/>Insurance Companies]
        BANK[Banking Systems<br/>Payment Processing]
    end
    
    EHR --> ROUTER
    PM --> ROUTER
    MANUAL --> ROUTER
    API --> ROUTER
    SFTP --> PARSER
    EMAIL --> PARSER
    
    ROUTER --> VALIDATOR
    PARSER --> VALIDATOR
    VALIDATOR --> CLAIMTASKS
    
    CLAIMTASKS --> WORKFLOW
    WORKFLOW --> BATCH
    WORKFLOW --> AUDIT
    
    CLAIMTASKS --> PRIORITY
    CLAIMTASKS --> SLA
    CLAIMTASKS --> QA
    WORKFLOW --> AUTO
    
    BATCH --> CH
    CH --> PAYER
    PAYER --> BANK
    
    style CLAIMTASKS fill:#e1f5fe
    style WORKFLOW fill:#f3e5f5
    style BATCH fill:#e8f5e8
    style AUDIT fill:#fff3e0
`;

const graph7 = `
stateDiagram-v2
    direction TB
    
    [*] --> NEW: Data Ingestion
    NEW --> FLOATING: Auto-assignment Logic
    FLOATING --> ASSIGNED: Employee Assignment
    
    state REVIEW {
        ASSIGNED --> INITIAL_REVIEW
        INITIAL_REVIEW --> CODING_REVIEW
        CODING_REVIEW --> BILLING_REVIEW
        BILLING_REVIEW --> READY_SUBMISSION
    }
    
    state SUBMISSION {
        READY_SUBMISSION --> BATCH_CREATED
        BATCH_CREATED --> SUBMITTED_CH
        SUBMITTED_CH --> ACKNOWLEDGED
        ACKNOWLEDGED --> SENT_PAYER
    }
    
    state PAYER_PROCESSING {
        SENT_PAYER --> UNDER_REVIEW
        UNDER_REVIEW --> PAID
        UNDER_REVIEW --> DENIED
        UNDER_REVIEW --> PARTIAL_PAID
        UNDER_REVIEW --> SUSPENDED
    }
    
    state APPEAL_PROCESS {
        DENIED --> APPEAL_REQUIRED
        APPEAL_REQUIRED --> APPEAL_SUBMITTED
        APPEAL_SUBMITTED --> APPEAL_REVIEW
        APPEAL_REVIEW --> PAID
        APPEAL_REVIEW --> FINAL_DENIED
    }
    
    state RESOLUTION {
        PAID --> PAYMENT_POSTED
        PARTIAL_PAID --> SECONDARY_BILLING
        SECONDARY_BILLING --> PAYMENT_POSTED
        FINAL_DENIED --> WRITE_OFF
        PAYMENT_POSTED --> CLOSED
        WRITE_OFF --> CLOSED
    }
    
    CLOSED --> [*]
    
    note right of REVIEW : QA audits can occur<br/>at any review stage
    note right of SUBMISSION : SLA monitoring<br/>is active throughout
    note right of PAYER_PROCESSING : Real-time status<br/>updates from payers
    note right of APPEAL_PROCESS : Automated deadline<br/>tracking and alerts
`;

const graph8 = `
graph LR
    subgraph "Real-time Integration"
        A1[API Calls] --> B1[Immediate Processing]
        A2[EHR Direct Connect] --> B1
        B1 --> C1[Real-time Validation]
        C1 --> D1[Instant Workflow Trigger]
    end
    
    subgraph "Batch Processing"
        A3[SFTP Upload] --> B2[Scheduled Processing]
        A4[Email Attachments] --> B2
        A5[CSV/Excel Files] --> B2
        B2 --> C2[Batch Validation]
        C2 --> D2[Bulk Workflow Creation]
    end
    
    subgraph "EDI Processing"
        A6[837 Files] --> B3[EDI Parser]
        B3 --> C3[X12 Validation]
        C3 --> D3[Structured Data Creation]
    end
    
    subgraph "Manual Entry"
        A7[Web Portal] --> B4[Form Validation]
        B4 --> C4[Real-time Checks]
        C4 --> D4[Single Claim Creation]
    end
    
    D1 --> E[ClaimTasks Database]
    D2 --> E
    D3 --> E
    D4 --> E
    
    style A1 fill:#4caf50
    style A2 fill:#4caf50
    style A3 fill:#ff9800
    style A4 fill:#ff9800
    style A5 fill:#ff9800
    style A6 fill:#2196f3
    style A7 fill:#9c27b0
`;

const graph9 = `
graph TD
    A[AR] --> B[Calculate Base Factors]
    
    B --> C1[Aging Days<br/>Weight: 30%]
    B --> C2[Claim Amount<br/>Weight: 25%]
    B --> C3[Payer Score<br/>Weight: 20%]
    B --> C4[Status Urgency<br/>Weight: 15%]
    B --> C5[Denial Flag<br/>Weight: 10%]
    
    C1 --> D[Weighted Sum Calculator]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    
    D --> E{Apply Multipliers}
    E --> F1[Client Weight<br/>1.0 - 2.0]
    E --> F2[Workflow Weight<br/>1.0 - 1.5]
    E --> F3[SOW Priority<br/>1.0 - 1.3]
    
    F1 --> G[Final Priority Score]
    F2 --> G
    F3 --> G
    
    G --> H{Score Range}
    H -->|0-25| I[Low Priority]
    H -->|26-50| J[Normal Priority]
    H -->|51-75| K[High Priority]
    H -->|76-100| L[Critical Priority]
    
    style G fill:#ff5722
    style I fill:#4caf50
    style J fill:#ffeb3b
    style K fill:#ff9800
    style L fill:#f44336
`;

const graph10 = `
sequenceDiagram
    participant U as User/System
    participant B as Batch Manager
    participant V as Validator
    participant W as Workflow Engine
    participant C as Clearinghouse
    participant P as Payer
    participant N as Notification System
    
    U->>B: Initiate Batch Creation
    B->>B: Group Claims by Rules
    B->>V: Validate Batch Contents
    
    alt Validation Successful
        V-->>B: Validation Passed
        B->>W: Trigger Batch Workflow
        W->>B: Workflow Created
        B->>C: Submit to Clearinghouse
        
        alt Clearinghouse Accepts
            C-->>B: Acknowledgment (997/999)
            B->>N: Notify Success
            C->>P: Forward to Payer
            P-->>C: Status Updates (277)
            C-->>B: Relay Status Updates
            B->>W: Update Workflow Status
        else Clearinghouse Rejects
            C-->>B: Rejection Notice
            B->>W: Mark Workflow Failed
            B->>N: Notify Failure
        end
        
    else Validation Failed
        V-->>B: Validation Errors
        B->>U: Return Error Report
        B->>N: Notify Validation Failure
    end
    
    Note over B,P: Continuous monitoring for<br/>status updates and responses
`;

const graph11 = `
graph TB
    subgraph "QA Selection Criteria"
        A1[Random Sampling<br/>10% of claims]
        A2[High-Value Claims<br/>>$5,000]
        A3[New Employee Claims<br/>First 90 days]
        A4[Error-Prone Payers<br/>Historical data]
        A5[Client-Specific Rules<br/>Contract requirements]
    end
    
    A1 --> B[QA Queue]
    A2 --> B
    A3 --> B
    A4 --> B
    A5 --> B
    
    B --> C{QA Review Type}
    
    C -->|Pre-Submission| D1[Coding Accuracy]
    C -->|Post-Submission| D2[Process Compliance]
    C -->|Denial Analysis| D3[Root Cause Review]
    C -->|Random Audit| D4[Quality Sampling]
    
    D1 --> E[Scoring Engine]
    D2 --> E
    D3 --> E
    D4 --> E
    
    E --> F{Score Threshold}
    F -->|90-100| G[Pass - Release]
    F -->|70-89| H[Pass with Notes]
    F -->|50-69| I[Needs Correction]
    F -->|<50| J[Fail - Rework Required]
    
    G --> K[Update Metrics]
    H --> L[Add Improvement Notes]
    I --> M[Create Action Items]
    J --> N[Reassign for Correction]
    
    L --> K
    M --> O[Track Corrections]
    N --> P[Manager Escalation]
    
    O --> K
    P --> Q[Training Assignment]
    Q --> K
    
    style E fill:#2196f3
    style F fill:#ff9800
    style G fill:#4caf50
    style J fill:#f44336
`;

const graph12 = `
graph TD
    A[System Event/Error] --> B{Error Type Classification}
    
    B -->|Data Validation| C1[Validation Error Handler]
    B -->|Network/API| C2[Network Error Handler]
    B -->|Business Logic| C3[Business Rule Handler]
    B -->|System/Database| C4[System Error Handler]
    
    C1 --> D1[Log Error Details]
    C2 --> D2[Retry with Backoff]
    C3 --> D3[Route to Exception Queue]
    C4 --> D4[Alert System Admin]
    
    D1 --> E1[Return to User with Details]
    D2 --> F{Retry Count}
    D3 --> E3[Manager Review Queue]
    D4 --> E4[Emergency Response]
    
    F -->|<3 Attempts| G[Exponential Backoff]
    F -->|>=3 Attempts| H[Dead Letter Queue]
    
    G --> I[Retry Operation]
    H --> J[Manual Intervention Required]
    
    I --> K{Success?}
    K -->|Yes| L[Continue Processing]
    K -->|No| D2
    
    E1 --> M[User Correction]
    E3 --> N[Management Decision]
    E4 --> O[System Recovery]
    J --> P[Technical Review]
    
    M --> A
    N --> Q[Process Override/Correction]
    O --> R[Service Restoration]
    P --> S[Root Cause Analysis]
    
    style C4 fill:#f44336
    style E4 fill:#ff5722
    style H fill:#ff9800
    style L fill:#4caf50
`
const graph13 = `
graph LR
    subgraph "Data Collection Layer"
        A1[Database Metrics]
        A2[Application Logs]
        A3[User Activity]
        A4[System Resources]
        A5[Business KPIs]
    end
    
    subgraph "Processing Layer"
        B1[Data Aggregator]
        B2[Real-time Analytics]
        B3[Batch Processors]
        B4[Alert Engine]
    end
    
    subgraph "Storage Layer"
        C1[Time Series DB<br/>InfluxDB]
        C2[Cache Layer<br/>Redis]
        C3[Data Warehouse<br/>PostgreSQL]
    end
    
    subgraph "Visualization Layer"
        D1[Executive Dashboard]
        D2[Operational Dashboard]
        D3[Technical Dashboard]
        D4[Custom Reports]
    end
    
    A1 --> B1
    A2 --> B2
    A3 --> B3
    A4 --> B4
    A5 --> B1
    
    B1 --> C1
    B2 --> C2
    B3 --> C3
    B4 --> C2
    
    C1 --> D1
    C2 --> D2
    C3 --> D3
    C1 --> D4
    
    style D1 fill:#e1f5fe
    style D2 fill:#f3e5f5
    style D3 fill:#e8f5e8
    style D4 fill:#fff3e0
`;

export default function GraphDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Claim Workflow Visuals</h1>
      <div className="flex flex-wrap gap-6 justify-start">
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            1. End-to-End Claims Flow
          </p>
          <MermaidGraph chart={graph1} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">2. Auto-Progress Logic</p>
          <MermaidGraph chart={graph2} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            3. Batch Submission Sequence
          </p>
          <MermaidGraph chart={graph3} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            4. Audit Workflow & Thresholds
          </p>
          <MermaidGraph chart={graph4} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            5. Claim State Transitions
          </p>
          <MermaidGraph chart={graph5} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            6. System-Wide Architecture
          </p>
          <MermaidGraph chart={graph6} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            7. Claim Lifecycle State Machine
          </p>
          <MermaidGraph chart={graph7} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            8. Data Integration Methods Comparison
          </p>
          <MermaidGraph chart={graph8} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            9. Claim Priority Scoring Algorithm
          </p>
          <MermaidGraph chart={graph9} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            10. Batch Processing Workflow
          </p>
          <MermaidGraph chart={graph10} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            11. QA and Audit Workflow
          </p>
          <MermaidGraph chart={graph11} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            12. Error Handling Workflow
          </p>
          <MermaidGraph chart={graph12} />
        </div>
        <div className="w-[500px]">
          <p className="text-lg font-semibold mb-2">
            13. Performance Monitoring Dashboard Architecture
          </p>
          <MermaidGraph chart={graph13} />
        </div>
      </div>
    </div>
  );
}
