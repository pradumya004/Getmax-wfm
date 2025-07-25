// frontend/src/pages/GraphDashboard.jsx

import MermaidGraph from "../mermaid/MermaidGraph.jsx";
import { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const graphs = [
  {
    id: "graph1",
    title: "GetMax WFM - Entire Beta Version Workflow",
    chart: `
    graph TB

    %% -- Layout & Spacing Configuration --
    %%{
      init: {
        "theme": "base",
        "themeVariables": {
          "ranksep": 100,
          "nodesep": 160
        }
      }
    }%%

    %% === PLATFORM ONBOARDING PHASE ===
    subgraph "🏢 BILLING COMPANY ONBOARDING"
        A1[Billing Company Inquiry] --> A2[Demo & Consultation]
        A2 --> A3[Company Registration]
        A3 --> A4[Master Admin Review & Approval]
        A4 --> A5[Company Profile Setup]
        A5 --> A6[Subscription Plan Selection]
        A6 --> A7[Initial Configuration]
        A7 --> A8[Go-Live Preparation]
    end

    %% === ORGANIZATION SETUP PHASE ===
    subgraph "🏗️ ORGANIZATION STRUCTURE SETUP"
        B1[Department Creation] --> B2[Sub-Department Setup]
        B2 --> B3[Role Definition]
        B3 --> B4[Designation Creation]
        B4 --> B5[Reporting Hierarchy]
        B5 --> B6[Permission Matrix Setup]
        B6 --> B7[Organization Validation]
    end

    %% === EMPLOYEE MANAGEMENT PHASE ===
    subgraph "👥 EMPLOYEE LIFECYCLE MANAGEMENT"
        C1[Employee Onboarding] --> C2[Profile Creation]
        C2 --> C3[Role Assignment]
        C3 --> C4[Department Allocation]
        C4 --> C5[Skill Assessment]
        C5 --> C6[Training Assignment]
        C6 --> C7[Performance Setup]
        C7 --> C8[Active Employee Status]
    end

    %% === CLIENT ONBOARDING PHASE ===
    subgraph "🏥 CLIENT ONBOARDING & MANAGEMENT"
        D1[Healthcare Provider Inquiry] --> D2[Client Intake Process]
        D2 --> D3[Documentation Collection]
        D3 --> D4[Contract Negotiation]
        D4 --> D5[SOW Creation]
        D5 --> D6[Integration Setup]
        D6 --> D7[Payer Configuration]
        D7 --> D8[Patient Data Setup]
        D8 --> D9[Client Go-Live]
    end

    %% === TASK MANAGEMENT PHASE ===
    subgraph "📋 WORKFORCE TASK MANAGEMENT"
        E1[Task Creation] --> E2[Skill Matching]
        E2 --> E3[Priority Assignment]
        E3 --> E4[Employee Allocation]
        E4 --> E5[Task Distribution]
        E5 --> E6[Progress Tracking]
        E6 --> E7[Quality Monitoring]
        E7 --> E8[Task Completion]
    end

    %% === PERFORMANCE MANAGEMENT PHASE ===
    subgraph "📊 PERFORMANCE & PRODUCTIVITY"
        F1[Performance Metrics Collection] --> F2[Productivity Analysis]
        F2 --> F3[SLA Monitoring]
        F3 --> F4[Quality Scoring]
        F4 --> F5[Employee Ranking]
        F5 --> F6[Gamification Updates]
        F6 --> F7[Feedback Generation]
        F7 --> F8[Performance Reviews]
    end

    %% === RESOURCE MANAGEMENT PHASE ===
    subgraph "⚖️ RESOURCE ALLOCATION & OPTIMIZATION"
        G1[Workload Analysis] --> G2[Capacity Planning]
        G2 --> G3[Skill Gap Identification]
        G3 --> G4[Resource Reallocation]
        G4 --> G5[Floating Pool Management]
        G5 --> G6[Cross-training Needs]
        G6 --> G7[Optimization Recommendations]
    end

    %% === REPORTING & ANALYTICS PHASE ===
    subgraph "📈 REPORTING & BUSINESS INTELLIGENCE"
        H1[Data Collection] --> H2[Executive Dashboards]
        H2 --> H3[Operational Reports]
        H3 --> H4[Financial Analytics]
        H4 --> H5[Client Performance Reports]
        H5 --> H6[Employee Productivity Reports]
        H6 --> H7[Compliance Reporting]
        H7 --> H8[Strategic Insights]
    end

    %% === SYSTEM ADMINISTRATION PHASE ===
    subgraph "🔧 PLATFORM ADMINISTRATION"
        I1[Master Admin Dashboard] --> I2[Platform Monitoring]
        I2 --> I3[Company Management]
        I3 --> I4[User Management]
        I4 --> I5[Security Management]
        I5 --> I6[System Configuration]
        I6 --> I7[Audit & Compliance]
        I7 --> I8[Platform Optimization]
    end

    %% === CONNECTIONS BETWEEN PHASES ===
    A8 --> B1
    B7 --> C1
    C8 --> D1
    D9 --> E1
    E8 --> F1
    F8 --> G1
    G7 --> H1
    
    %% Admin oversight connections
    A1 --> I1
    B1 --> I2
    C1 --> I3
    D1 --> I4
    E1 --> I5
    
    %% Continuous feedback loops
    H8 --> G1
    H8 --> F1
    H8 --> E1
    
    %% -- Node Styling --
    classDef onboardingPhase 	fill:#eef6ff,stroke:#5c9ae5,color:#0b3b6f,font-weight:bold,rx:8,ry:8
    classDef orgPhase 		fill:#f6eefc,stroke:#a66fd1,color:#4a1b6d,font-weight:bold,rx:8,ry:8
    classDef employeePhase 	fill:#eef9ee,stroke:#66b96a,color:#1b5e20,font-weight:bold,rx:8,ry:8
    classDef clientPhase 		fill:#fff8e9,stroke:#e5b55c,color:#7a530b,font-weight:bold,rx:8,ry:8
    classDef taskPhase 		fill:#feeaef,stroke:#e56d8d,color:#880e4f,font-weight:bold,rx:8,ry:8
    classDef performancePhase 	fill:#e9f7f6,stroke:#5cb4a8,color:#004d40,font-weight:bold,rx:8,ry:8
    classDef resourcePhase 	fill:#f7fae9,stroke:#abc25f,color:#33691e,font-weight:bold,rx:8,ry:8
    classDef reportingPhase 	fill:#f0eef9,stroke:#8066c6,color:#311b92,font-weight:bold,rx:8,ry:8
    classDef adminPhase 		fill:#feebee,stroke:#e57373,color:#c62828,font-weight:bold,rx:8,ry:8

    %% -- Class Assignments --
    class A1,A2,A3,A4,A5,A6,A7,A8 onboardingPhase
    class B1,B2,B3,B4,B5,B6,B7 orgPhase
    class C1,C2,C3,C4,C5,C6,C7,C8 employeePhase
    class D1,D2,D3,D4,D5,D6,D7,D8,D9 clientPhase
    class E1,E2,E3,E4,E5,E6,E7,E8 taskPhase
    class F1,F2,F3,F4,F5,F6,F7,F8 performancePhase
    class G1,G2,G3,G4,G5,G6,G7 resourcePhase
    class H1,H2,H3,H4,H5,H6,H7,H8 reportingPhase
    class I1,I2,I3,I4,I5,I6,I7,I8 adminPhase

`,
  },
  {
    id: "graph2",
    title: "Employee Task Assignment & Workflow Management",
    chart: `
    sequenceDiagram
    participant C as Client/Healthcare Provider
    participant CS as Company System
    participant AM as Assignment Manager
    participant FP as Floating Pool
    participant E as Employee
    participant QA as QA Manager
    participant PM as Performance Manager
    participant NS as Notification System

    Note over C,NS: 📋 TASK ASSIGNMENT & MANAGEMENT WORKFLOW

    %% TASK CREATION
    C->>CS: Submit Work Request/Task
    CS->>CS: Validate Task Requirements
    CS->>AM: Create Task with Priority & Skills Needed
    
    %% ASSIGNMENT LOGIC
    AM->>AM: Analyze Task Requirements
    AM->>AM: Calculate Priority Score
    
    alt Auto-Assignment Available ✅
        AM->>AM: Find Available Employee with Matching Skills
        AM->>E: Assign Task Directly
        AM->>NS: Notify Employee of Assignment
        NS-->>E: Task Assignment Notification
    else No Direct Match ❌
        AM->>FP: Add Task to Floating Pool
        FP->>FP: Queue Task by Priority
        
        alt Employee Becomes Available ✅
            FP->>AM: Employee Available
            AM->>AM: Match Employee to Highest Priority Task
            AM->>E: Assign Task from Pool
            AM->>NS: Notify Employee
            NS-->>E: Task Assignment Notification
        else Manual Assignment Required 🔄
            AM->>CS: Escalate to Supervisor
            CS->>AM: Manual Assignment Decision
            AM->>E: Assign Task Manually
            AM->>NS: Notify Employee
            NS-->>E: Task Assignment Notification
        end
    end

    %% TASK EXECUTION
    E->>CS: Start Task
    CS->>PM: Log Task Start Time
    
    loop Task Progress Updates
        E->>CS: Update Task Progress
        CS->>PM: Track Time & Progress
        CS->>AM: Update Task Status
        
        alt Quality Check Required 📊
            CS->>QA: Trigger Quality Review
            QA->>QA: Perform Quality Assessment
            
            alt Quality Passed ✅
                QA-->>CS: Approve Task
                CS->>E: Continue Task
            else Quality Failed ❌
                QA-->>CS: Reject with Feedback
                CS->>E: Return for Correction
                E->>CS: Resubmit Corrected Work
            end
        end
    end

    %% TASK COMPLETION
    E->>CS: Submit Completed Task
    CS->>QA: Final Quality Review
    
    alt Final Quality Approved ✅
        QA-->>CS: Final Approval
        CS->>PM: Log Task Completion
        PM->>PM: Update Employee Performance Metrics
        CS->>C: Deliver Completed Work
        C-->>CS: Client Acknowledgment
        
        %% PERFORMANCE UPDATES
        PM->>PM: Calculate Productivity Score
        PM->>PM: Update SLA Compliance
        PM->>PM: Update Gamification Points
        PM->>NS: Send Performance Update
        NS-->>E: Performance Achievement Notification
        
    else Final Quality Failed ❌
        QA-->>CS: Final Rejection
        CS->>AM: Reassign Task
        AM->>FP: Return to Floating Pool
        AM->>NS: Notify Original Employee
        NS-->>E: Task Reassignment Notification
    end

    Note over C,NS: 🔄 Continuous monitoring for SLA compliance and performance optimization
    `,
  },
  {
    id: "graph3",
    title: "EMPLOYEE PERFORMANCE & GAMIFICATION MANAGEMENT",
    chart: `
    graph TB
    %% PERFORMANCE DATA COLLECTION
    subgraph "📊 PERFORMANCE DATA COLLECTION"
        A1[Task Completion Time] --> B1[Performance Calculator]
        A2[Quality Scores] --> B1
        A3[SLA Compliance] --> B1
        A4[Productivity Metrics] --> B1
        A5[Client Feedback] --> B1
        A6[Attendance Data] --> B1
    end

    %% PERFORMANCE CALCULATION ENGINE
    subgraph "⚙️ PERFORMANCE CALCULATION ENGINE"
        B1 --> C1[Weighted Score Calculation]
        C1 --> C2[Productivity Index = 30%]
        C1 --> C3[Quality Score = 25%]
        C1 --> C4[SLA Compliance = 20%]
        C1 --> C5[Task Complexity = 15%]
        C1 --> C6[Client Satisfaction = 10%]
        
        C2 --> D1[Final Performance Score]
        C3 --> D1
        C4 --> D1
        C5 --> D1
        C6 --> D1
    end

    %% GAMIFICATION ENGINE
    subgraph "🎮 GAMIFICATION ENGINE"
        D1 --> E1{Performance Tier Evaluation}
        E1 -->|90-100| E2[🏆 Platinum Tier]
        E1 -->|80-89| E3[🥇 Gold Tier]
        E1 -->|70-79| E4[🥈 Silver Tier]
        E1 -->|60-69| E5[🥉 Bronze Tier]
        E1 -->|<60| E6[📈 Improvement Needed]
        
        E2 --> F1[Award Bonus Points]
        E3 --> F2[Award Standard Points]
        E4 --> F3[Award Basic Points]
        E5 --> F4[Award Minimal Points]
        E6 --> F5[Coaching Assignment]
    end

    %% ACHIEVEMENT SYSTEM
    subgraph "🏅 ACHIEVEMENT & REWARDS SYSTEM"
        F1 --> G1[Unlock Premium Badges]
        F2 --> G2[Unlock Standard Badges]
        F3 --> G3[Unlock Basic Badges]
        F4 --> G4[Motivational Badges]
        F5 --> G5[Training Recommendations]
        
        G1 --> H1[Leaderboard Update]
        G2 --> H1
        G3 --> H1
        G4 --> H1
        
        H1 --> H2[Team Rankings]
        H2 --> H3[Department Rankings]
        H3 --> H4[Company-wide Rankings]
    end

    %% FEEDBACK & DEVELOPMENT
    subgraph "📈 FEEDBACK & DEVELOPMENT"
        H4 --> I1[Performance Dashboard Update]
        I1 --> I2[Individual Scorecards]
        I2 --> I3[Manager Reports]
        I3 --> I4[Development Plans]
        I4 --> I5[Skill Gap Analysis]
        I5 --> I6[Training Assignments]
        
        G5 --> J1[Coaching Sessions]
        J1 --> J2[Skill Development]
        J2 --> J3[Performance Improvement Plans]
        J3 --> J4[Progress Monitoring]
    end

    %% NOTIFICATION SYSTEM
    subgraph "🔔 NOTIFICATION & COMMUNICATION"
        H1 --> K1[Achievement Notifications]
        I2 --> K2[Performance Alerts]
        J4 --> K3[Progress Updates]
        
        K1 --> L1[Employee Dashboard]
        K2 --> L2[Manager Dashboard]
        K3 --> L3[HR Dashboard]
        
        L1 --> M1[Mobile App Notifications]
        L2 --> M2[Email Reports]
        L3 --> M3[System Alerts]
    end

    %% CONTINUOUS IMPROVEMENT LOOP
    subgraph "🔄 CONTINUOUS IMPROVEMENT"
        M1 --> N1[Employee Engagement Metrics]
        M2 --> N2[Manager Satisfaction Scores]
        M3 --> N3[System Performance Analytics]
        
        N1 --> O1[Feedback Collection]
        N2 --> O1
        N3 --> O1
        
        O1 --> O2[System Optimization]
        O2 --> O3[Algorithm Refinement]
        O3 --> B1
    end

    %% Styling
    classDef dataCollection fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef calculation fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef gamification fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef achievement fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef feedback fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef notification fill:#e0f2f1,stroke:#00796b,stroke-width:2px
    classDef improvement fill:#f1f8e9,stroke:#558b2f,stroke-width:2px
    
    class A1,A2,A3,A4,A5,A6 dataCollection
    class B1,C1,C2,C3,C4,C5,C6,D1 calculation
    class E1,E2,E3,E4,E5,E6,F1,F2,F3,F4,F5 gamification
    class G1,G2,G3,G4,G5,H1,H2,H3,H4 achievement
    class I1,I2,I3,I4,I5,I6,J1,J2,J3,J4 feedback
    class K1,K2,K3,L1,L2,L3,M1,M2,M3 notification
    class N1,N2,N3,O1,O2,O3 improvement
    `,
  },
];

export default function GraphDashboard() {
  const [selectedGraphId, setSelectedGraphId] = useState("graph1");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const hiddenGraphRefs = useRef({});

  const selectedGraph = graphs.find((g) => g.id === selectedGraphId);

  /**
   * Professional PDF Generation Function
   * Captures each graph by switching views and taking screenshots
   */
  const generatePDF = async () => {
    try {
      setIsGeneratingPdf(true);
      
      // Store original selected graph
      const originalGraphId = selectedGraphId;
      
      // Initialize PDF document with A4 size
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // PDF page dimensions (A4 landscape)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      // Add cover page
      pdf.setFontSize(24);
      pdf.setFont(undefined, 'bold');
      pdf.text('GetMax WFM', pageWidth / 2, 40, { align: 'center' });
      
      pdf.setFontSize(18);
      pdf.text('Workflow Documentation', pageWidth / 2, 55, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setFont(undefined, 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 70, { align: 'center' });
      pdf.text(`Total Diagrams: ${graphs.length}`, pageWidth / 2, 80, { align: 'center' });

      // Process each graph by switching to it and capturing
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        
        // Switch to this graph and wait for it to render
        setSelectedGraphId(graph.id);
        
        // Wait for state update and mermaid rendering
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Add new page for each graph (except first iteration since cover page exists)
        if (i === 0) {
          pdf.addPage();
        }

        try {
          // Find the main content area that contains the graph
          const mainContent = document.querySelector('main .bg-white.p-8.rounded-xl.shadow-md');
          
          if (!mainContent) {
            throw new Error('Could not find main content area');
          }

          console.log(`📸 Capturing graph ${i + 1}: ${graph.title}`);

          // Capture the main content area
          const canvas = await html2canvas(mainContent, {
            scale: 2, // Higher resolution
            useCORS: true,
            allowTaint: true,
            backgroundColor: 'white',
            logging: false,
            onclone: (clonedDoc) => {
              // Ensure all SVG elements are visible in the clone
              const svgElements = clonedDoc.querySelectorAll('svg');
              svgElements.forEach(svg => {
                svg.style.display = 'block';
                svg.style.visibility = 'visible';
              });
            }
          });

          console.log(`✅ Canvas captured for ${graph.title}: ${canvas.width}x${canvas.height}`);

          // Calculate image dimensions to fit in PDF page
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(contentWidth / (imgWidth * 0.264583), contentHeight / (imgHeight * 0.264583));
          const scaledWidth = imgWidth * 0.264583 * ratio;
          const scaledHeight = imgHeight * 0.264583 * ratio;

          // Center the image on the page
          const x = (pageWidth - scaledWidth) / 2;
          const y = (pageHeight - scaledHeight) / 2;

          // Convert canvas to image and add to PDF
          const imgData = canvas.toDataURL('image/png', 1.0);
          pdf.addImage(
            imgData,
            'PNG',
            x,
            y,
            scaledWidth,
            scaledHeight
          );

          // Add page number
          pdf.setFontSize(10);
          pdf.text(`Page ${i + 2} of ${graphs.length + 1}`, pageWidth - margin, pageHeight - 5, { align: 'right' });

          console.log(`✅ Added ${graph.title} to PDF`);

        } catch (captureError) {
          console.error(`❌ Error capturing graph ${graph.id}:`, captureError);
          
          // Add error message to PDF
          pdf.setFontSize(16);
          pdf.text(`Error capturing: ${graph.title}`, pageWidth / 2, pageHeight / 2, { align: 'center' });
          pdf.setFontSize(12);
          pdf.text('Graph failed to render properly', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
          pdf.text('Please try refreshing the page', pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
        }

        // Add new page for next graph (if not last)
        if (i < graphs.length - 1) {
          pdf.addPage();
        }
      }

      // Restore original selected graph
      setSelectedGraphId(originalGraphId);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `GetMax-WFM-Workflows-${timestamp}.pdf`;

      // Save the PDF
      pdf.save(filename);

      console.log(`🎉 PDF generated successfully: ${filename}`);
      alert(`✅ PDF downloaded successfully!\nFilename: ${filename}`);

    } catch (error) {
      console.error('💥 Error generating PDF:', error);
      alert(`❌ Error generating PDF: ${error.message}\n\nPlease check the console for more details.`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-60 flex-shrink-0 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Workflow Visuals
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Select a diagram to view
          </p>
        </div>
        
        {/* PDF Export Button */}
        <div className="px-4 mb-4">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPdf}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
              isGeneratingPdf
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isGeneratingPdf ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export to PDF</span>
              </>
            )}
          </button>
        </div>

        <nav className="px-4">
          <ul>
            {graphs.map((graph) => (
              <li key={graph.id} className="mb-2">
                <button
                  onClick={() => setSelectedGraphId(graph.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-200 ${
                    selectedGraphId === graph.id
                      ? "bg-blue-500 text-white font-semibold shadow"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {graph.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white p-8 rounded-xl shadow-md">
          {selectedGraph ? (
            <>
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-slate-900">
                  {selectedGraph.title}
                </h1>
                <div className="text-sm text-slate-500">
                  Graph {graphs.findIndex(g => g.id === selectedGraphId) + 1} of {graphs.length}
                </div>
              </div>
              <div className="border-t border-slate-200 pt-6 w-full">
                <MermaidGraph chart={selectedGraph.chart} />
              </div>
            </>
          ) : (
            <p className="text-center text-slate-500">
              Please select a graph to display.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
