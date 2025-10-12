import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/GovtExams.css";

const stateData = {
  "tamil-nadu": {
    name: "Tamil Nadu",
    description: `The Tamil Nadu Public Service Commission (TNPSC) is the premier organization responsible for recruiting candidates for various state administrative and subordinate services. TNPSC conducts Group I, Group II/IIA, and Group IV exams for a wide range of positions. Group I recruits top-tier administrative officials such as Deputy Collector, DSP, and Assistant Commissioner of Revenue. Group II/IIA and Group IV focus on clerical and subordinate roles like Municipal Commissioner, Sub-Registrar, and Village Administrative Officer. These exams are highly competitive, attracting thousands of aspirants annually. Eligibility varies based on exam type, ranging from +2 (Intermediate) to a Bachelor's Degree. Age limits also differ for various categories. TNPSC also publishes syllabus, notifications, and application forms online, ensuring transparency. The exams test general knowledge, aptitude, administrative ability, and subject-specific knowledge. Candidates undergo rigorous screening to secure a position in Tamil Nadu's civil services.`,
    exams: [
      {
        title: "TNPSC Group I (CCE I)",
        eligibility: "Bachelor's Degree, Age: 21–35 years",
        positions: ["Deputy Collector", "DSP", "Assistant Commissioner of Revenue", "District Registrar"],
        details: "Top-tier administrative and non-technical Gazetted posts in the state.",
        syllabus: "General Studies, Aptitude, Tamil/English language, and Administrative topics",
        importantDates: "Notifications: April, Exam: June, Results: September",
        applicationProcess: "Online application on TNPSC website, followed by preliminary, mains, and interview stages."
      },
      {
        title: "TNPSC Group II/IIA (CCE II)",
        eligibility: "Bachelor's Degree, Age: 18–30 years",
        positions: ["Municipal Commissioner (Grade II)", "Sub-Registrar (Grade II)", "Assistant Section Officer (ASO)"],
        details: "Services include Gazetted and non-Gazetted posts in the state civil services.",
        syllabus: "General Studies, Aptitude, English/Tamil, and Administrative topics",
        importantDates: "Notifications: March, Exam: May, Results: August",
        applicationProcess: "Apply online, complete preliminary exam, main exam, and interview process."
      },
      {
        title: "TNPSC Group IV",
        eligibility: "+2 (Intermediate), Age: 18–30 years",
        positions: ["Village Administrative Officer (VAO)", "Junior Assistant", "Bill Collector", "Steno-Typist"],
        details: "Recruitment for entry-level, non-technical, non-Gazetted posts.",
        syllabus: "General Tamil, Aptitude, General Knowledge, Simple Arithmetic",
        importantDates: "Notifications: January, Exam: March, Results: June",
        applicationProcess: "Apply through TNPSC online portal, complete written test and certificate verification."
      },
    ],
  },

  "maharashtra": {
    name: "Maharashtra",
    description: `The Maharashtra Public Service Commission (MPSC) is the central body for recruiting candidates for state administrative and subordinate services in Maharashtra. It conducts exams like the State Service Exam and Combined Subordinate Services Exam to fill a variety of top-level and mid-level positions. The State Service Exam recruits administrative officers, Tehsildars, Deputy Collectors, and DSPs. The Combined Subordinate Services Exam focuses on Group B and non-Gazetted posts including PSI, STI, and ASO. The exams are structured with preliminary, main, and interview stages. Syllabus includes General Studies, aptitude, Marathi, English, and administrative topics. Eligibility generally requires a Bachelor's degree, with age limits varying across exams. MPSC also provides comprehensive exam notifications, application guidelines, and past papers online to help aspirants. The exams are known for their rigor and competitiveness, drawing thousands of candidates annually. Maharashtra also encourages reserved category candidates through age relaxation and specific eligibility norms.`,
    exams: [
      {
        title: "MPSC State Service Exam",
        eligibility: "Bachelor's Degree, Age: 19–38 years",
        positions: ["Deputy Collector", "DSP", "Tehsildar", "Block Development Officer (BDO)"],
        details: "Combined competitive exam for top administrative services in the state.",
        syllabus: "General Studies, Aptitude, Marathi, English, Administrative topics",
        importantDates: "Notifications: March, Exam: June, Results: September",
        applicationProcess: "Apply online via MPSC portal, complete prelims, mains, and interview stages."
      },
      {
        title: "MPSC Combined Subordinate Services Exam",
        eligibility: "Bachelor's Degree, Age: 18–38 years",
        positions: ["Police Sub Inspector (PSI)", "Sales Tax Inspector (STI)", "Assistant Section Officer (ASO)"],
        details: "Recruitment for Group B (Non-Gazetted) posts.",
        syllabus: "General Knowledge, Aptitude, Marathi, English, Basic Administrative Knowledge",
        importantDates: "Notifications: February, Exam: May, Results: August",
        applicationProcess: "Online application and written exam followed by document verification."
      },
    ],
  },

  "karnataka": {
    name: "Karnataka",
    description: `The Karnataka Public Service Commission (KPSC) conducts exams to recruit candidates for state administrative, technical, and subordinate posts. The primary exam, Karnataka Administrative Service (KAS), is equivalent to UPSC for state-level administrative roles, including Assistant Commissioners, DSPs, Tehsildars, and other Gazetted posts. KPSC also recruits for clerical and technical positions through subordinate service exams. The selection process includes preliminary, main, and interview stages. Eligibility generally requires a Bachelor's degree, with age criteria between 21–35 years, and relaxations for reserved categories. The syllabus covers General Knowledge, Aptitude, Language (Kannada/English), and administrative subjects. Notifications, syllabus, and online applications are available on KPSC’s official website. Thousands of aspirants prepare each year, making it highly competitive. Candidates need to understand local administrative laws and state-specific governance rules. KPSC is known for transparent recruitment and rigorous evaluation.`,
    exams: [
      {
        title: "KPSC Gazetted Probationers Exam (KAS)",
        eligibility: "Bachelor's Degree, Age: 21–35 years",
        positions: ["Assistant Commissioner", "DSP", "Tehsildar Grade-I", "Commercial Tax Officer"],
        details: "Equivalent to UPSC Civil Services for state administrative roles.",
        syllabus: "General Knowledge, Aptitude, Kannada, English, Administrative topics",
        importantDates: "Notifications: February, Exam: May, Results: September",
        applicationProcess: "Online application via KPSC, prelims, mains, interview stages."
      },
    ],
  },

  "kerala": {
    name: "Kerala",
    description: `Kerala Public Service Commission (KPSC) recruits candidates for administrative, technical, and clerical roles in the state. Popular exams include Kerala Administrative Service (KAS), Secretariat Assistant, and various other departmental exams. KAS is a prestigious exam for administrative posts with rigorous testing of aptitude, reasoning, language, and subject knowledge. Secretariat Assistant exams cater to clerical recruitment. Eligibility ranges from +2 (Intermediate) to Bachelor’s degree based on the exam, with age limits typically 18–36 years. Syllabus and application procedures are available on KPSC's official portal. Candidates are tested through written exams and interviews. Kerala also emphasizes transparency and fair selection processes. Thousands of aspirants compete annually, making proper planning and guidance essential. KPSC also provides mock tests, past papers, and guidance materials for aspirants.`,
    exams: [
      {
        title: "Kerala Administrative Service (KAS)",
        eligibility: "Bachelor's Degree, Age: 21–32 years",
        positions: ["Junior Time Scale Posts (KAS Officer) in various departments"],
        details: "Recruitment for the state's most sought-after administrative service.",
        syllabus: "General Knowledge, Aptitude, Language, Administrative topics",
        importantDates: "Notifications: January, Exam: April, Results: July",
        applicationProcess: "Apply online via KPSC, complete preliminary, main, and interview stages."
      },
      {
        title: "KPSC Secretariat Assistant",
        eligibility: "Bachelor's Degree, Age: 18–36 years",
        positions: ["Secretariat Assistant", "Office Assistant"],
        details: "Recruitment for the administrative staff in the State Secretariat.",
        syllabus: "General Knowledge, Arithmetic, English/Kannada, Administrative skills",
        importantDates: "Notifications: March, Exam: June, Results: September",
        applicationProcess: "Apply via KPSC online portal, written exam, and document verification."
      },
    ],
  },

  "west-bengal": {
    name: "West Bengal",
    description: `The West Bengal Public Service Commission (WBPSC) conducts exams for recruitment to administrative, police, revenue, and other state services. The most prominent exam is the West Bengal Civil Service (WBCS), a multi-tiered competitive examination for Group A, B, C, and D posts. Eligibility generally requires a Bachelor’s degree, with age limits between 21–36 years, varying across groups. Syllabus includes general studies, aptitude, language, administrative knowledge, and optional subjects. Notifications, guidelines, and application forms are provided on WBPSC’s official site. Candidates undergo preliminary, main, and interview rounds. The exam ensures a rigorous selection process for aspirants aiming for state administrative positions. WBPSC also conducts departmental exams for technical and clerical posts. Thousands of candidates compete annually, emphasizing preparation, planning, and understanding of state governance and laws.`,
    exams: [
      {
        title: "West Bengal Civil Service (WBCS) Exam",
        eligibility: "Bachelor's Degree, Age: 21–36 years",
        positions: ["WBCS Executive (Group A)", "DSP (Group B)", "Revenue Service (Group C)", "BDO (Group D)"],
        details: "Multi-tiered exam conducted for four groups (A, B, C, and D) of services.",
        syllabus: "General Studies, Aptitude, Bengali/English, Administrative topics",
        importantDates: "Notifications: February, Exam: May, Results: August",
        applicationProcess: "Apply online, complete prelims, mains, and interview stages."
      },
    ],
  },

  "bihar": {
    name: "Bihar",
    description: `Bihar Public Service Commission (BPSC) is the state recruitment authority for administrative and technical posts. The BPSC Combined Competitive Exam (CCE) is the flagship exam for civil services in Bihar. Posts include SDM, DSP, Revenue Officers, and Probation Services. Eligibility requires a Bachelor's degree, with age 20/21–37 years. The selection process involves preliminary, main, and interview stages. Syllabus covers general studies, aptitude, reasoning, and language skills. Notifications, past papers, and guidelines are available online. Candidates undergo a rigorous evaluation to ensure fair selection. BPSC also recruits for subordinate and departmental exams for clerical, technical, and specialized positions. Thousands of aspirants prepare annually for competitive posts. Proper planning, preparation, and reference to official resources are key to success in BPSC exams.`,
    exams: [
      {
        title: "BPSC Combined Competitive Exam (CCE)",
        eligibility: "Bachelor's Degree, Age: 20/21–37 years",
        positions: ["Bihar Administrative Service (SDM)", "Bihar Police Service (DSP)", "Revenue Officer", "Bihar Probation Service"],
        details: "Recruitment for various Gazetted posts in the Bihar State Government.",
        syllabus: "General Knowledge, Aptitude, Reasoning, Language skills",
        importantDates: "Notifications: January, Exam: April, Results: August",
        applicationProcess: "Apply online, pass prelims, mains, and interview stages."
      },
    ],
  },

  "uttar-pradesh": {
    name: "Uttar Pradesh",
    description: `Uttar Pradesh Public Service Commission (UPPSC) recruits candidates for administrative, clerical, and specialized state services. The UPPCS (Combined State/Upper Subordinate) exam is the premier exam for civil services in UP, including posts like Deputy Collector, DSP, BDO, and Assistant Commissioner. The UPPSC RO/ARO exam is for secretariat posts. Eligibility is a Bachelor’s degree with age criteria 21–40 years, varying by category. The selection process includes preliminary, main, and interview stages. Syllabus covers general studies, aptitude, reasoning, English/Hindi, and administrative topics. Notifications, online applications, and guidelines are available on UPPSC’s official website. Thousands of aspirants compete annually. Effective preparation and understanding of state governance are crucial to success.`,
    exams: [
      {
        title: "UPPSC Combined State/Upper Subordinate (PCS)",
        eligibility: "Bachelor's Degree, Age: 21–40 years",
        positions: ["Deputy Collector", "DSP", "BDO", "Assistant Commissioner"],
        details: "The most prestigious state civil service exam in UP for administrative posts.",
        syllabus: "General Studies, Aptitude, Hindi/English, Administrative topics",
        importantDates: "Notifications: February, Exam: May, Results: September",
        applicationProcess: "Apply online via UPPSC, pass prelims, mains, and interview stages."
      },
      {
        title: "UPPSC RO/ARO",
        eligibility: "Bachelor's Degree, Age: 21–40 years",
        positions: ["Review Officer", "Assistant Review Officer"],
        details: "Recruitment for posts within the UP Secretariat and UP Public Service Commission.",
        syllabus: "General Knowledge, Reasoning, Administrative skills, Hindi/English",
        importantDates: "Notifications: March, Exam: June, Results: September",
        applicationProcess: "Online application, written exam, and document verification."
      },
    ],
  },

  "rajasthan": {
    name: "Rajasthan",
    description: `Rajasthan Public Service Commission (RPSC) recruits candidates for administrative and allied posts. The main exam is Rajasthan Administrative Service (RAS) along with allied services. Posts include RAS officers, Rajasthan Police Service officers, Tehsildars, and Accounts officers. Eligibility requires a Bachelor's degree, age 21–40 years. The selection process includes preliminary, mains, and interview stages. Syllabus covers general studies, reasoning, administrative knowledge, language, and aptitude. Notifications, online applications, and guidance are available on RPSC official website. Thousands of aspirants compete annually. Proper planning, knowledge of Rajasthan history, geography, administration, and laws is crucial for success.`,
    exams: [
      {
        title: "Rajasthan Administrative Service (RAS) & Allied Services",
        eligibility: "Bachelor's Degree, Age: 21–40 years",
        positions: ["RAS", "RPS", "Rajasthan Accounts Service", "Tehsildar"],
        details: "The main exam for state civil service and allied posts.",
        syllabus: "General Knowledge, Aptitude, Administrative Knowledge, Language skills",
        importantDates: "Notifications: January, Exam: April, Results: August",
        applicationProcess: "Online application via RPSC portal, prelims, mains, and interview."
      },
    ],
  },

  "punjab": {
    name: "Punjab",
    description: `Punjab Public Service Commission (PPSC) conducts exams for state civil services, including Punjab Civil Service (PCS) exam and allied posts. Positions include Executive Branch officers, DSPs, Excise and Taxation Officers. Eligibility generally requires a Bachelor's degree, with age 21–37 years. The selection process involves preliminary, main, and interview stages. Syllabus covers general knowledge, aptitude, language, reasoning, and administrative topics. Notifications and online applications are available on PPSC's official website. Thousands of aspirants compete for prestigious state posts. The exams are known for rigor and focus on administrative and legal understanding. Reserved categories get age relaxation as per government rules.`,
    exams: [
      {
        title: "Punjab Civil Service (PCS) Exam",
        eligibility: "Bachelor's Degree, Age: 21–37 years",
        positions: ["PCS (Executive Branch)", "DSP", "Excise and Taxation Officer"],
        details: "Combined Competitive Examination for various top state government posts.",
        syllabus: "General Knowledge, Aptitude, Punjabi/English, Administrative topics",
        importantDates: "Notifications: February, Exam: May, Results: August",
        applicationProcess: "Online application, prelims, mains, interview stages."
      },
    ],
  },

  "haryana": {
    name: "Haryana",
    description: `Haryana Public Service Commission (HPSC) recruits candidates for administrative, police, excise, and other state services. The Haryana Civil Service (HCS) exam is the primary competitive exam for administrative posts including Deputy Superintendent of Police, HCS officers, and District Food and Supplies Controllers. Eligibility requires a Bachelor's degree, with age limits 21–42 years. The selection process includes written exams and interviews. Syllabus includes General Knowledge, Aptitude, reasoning, administrative knowledge, and language. HPSC ensures transparency and fairness. Notifications, guidelines, and online applications are available on HPSC official portal. Thousands of candidates compete annually, making preparation critical. Reserved categories benefit from age relaxations.`,
    exams: [
      {
        title: "Haryana Civil Service (HCS) Exam",
        eligibility: "Bachelor's Degree, Age: 21–42 years",
        positions: ["HCS (Executive Branch)", "Deputy Superintendent of Police", "Excise and Taxation Officer", "District Food and Supplies Controller"],
        details: "Annual exam for administrative and allied services.",
        syllabus: "General Knowledge, Aptitude, English/Hindi, Administrative topics",
        importantDates: "Notifications: February, Exam: May, Results: September",
        applicationProcess: "Online application via HPSC portal, written exam, and interview stages."
      },
    ],
  },
};

export default function StateGovtExamsPage() {
  const { state } = useParams();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(state || null);
  const [expandedExam, setExpandedExam] = useState(null);

  const handleStateClick = (stateSlug) => {
    setSelectedState(stateSlug);
    setExpandedExam(null);
    navigate(`/govt-exams/state/${stateSlug}`);
  };

  const toggleExam = (index) => {
    setExpandedExam(expandedExam === index ? null : index);
  };

  const stateInfo = stateData[selectedState];

  return (
    <div className="govt-exams-page">
         <div className="sticky-back">
        <button className="back-btn" onClick={() => navigate("/govt-exams")}>
          ← Back to Govt Exams
        </button>
      </div>
      <aside className="sidebar">
        <h3>States</h3>
        <ul>
          {Object.keys(stateData).map((st) => (
            <li
              key={st}
              className={selectedState === st ? "active" : ""}
              onClick={() => handleStateClick(st)}
            >
              {stateData[st].name}
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        {!selectedState ? (
          <div className="welcome-section">
          
            <h1>Welcome to the State Government Exams </h1>
            <p>
              Explore detailed information about various state government exams
              across India. Select a state from the left sidebar to view its
              recruitment notifications, eligibility, positions, syllabus,
              important dates, and detailed exam guidance.
            </p>
            <p>
              Each state offers multiple exams for administrative, clerical,
              police, and technical services. Proper planning and preparation
              are essential for success.
            </p>
          </div>
        ) : (
          <div>
            <h1>{stateInfo.name} Government Exams</h1>
            <p>{stateInfo.description}</p>

            <div className="exam-cards">
              {stateInfo.exams.map((exam, idx) => (
                <div key={idx} className="exam-card">
                  <h2>{exam.title}</h2>
                  <p><strong>Eligibility:</strong> {exam.eligibility}</p>
                  <p><strong>Positions:</strong> {exam.positions.join(", ")}</p>
                  <p><strong>Details:</strong> {exam.details}</p>
                  <p><strong>Syllabus:</strong> {exam.syllabus}</p>
                  <p><strong>Important Dates:</strong> {exam.importantDates}</p>
                  <p><strong>Application Process:</strong> {exam.applicationProcess}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
