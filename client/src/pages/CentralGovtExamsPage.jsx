import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CentralGovtExams.css";

export default function CentralGovtExamsPage() {
  const navigate = useNavigate();

  const exams = [
    {
      title: "UPSC Civil Services Examination (CSE)",
      eligibility: "Bachelor’s Degree from any recognized university. Age limit: 21–32 years (relaxation for reserved categories).",
      roles: ["IAS", "IPS", "IFS", "IRS", "Administrative Officers"],
      description: `
        The UPSC CSE is India's most elite exam conducted by the Union Public Service Commission for recruitment to higher civil services.
        It consists of three stages – Prelims, Mains, and Interview. The syllabus includes subjects like current affairs, polity, economy,
        history, geography, and ethics. Selected candidates serve as top administrators shaping national policies and governance.
        The job offers immense power, respect, and responsibility to bring social impact across India.
        Extensive preparation, time management, and analytical ability are crucial for success in this exam.
      `,
      link: "https://upsconline.nic.in",
    },
    {
      title: "SSC Combined Graduate Level (CGL) Examination",
      eligibility: "Graduation in any discipline. Age limit: 18–32 years.",
      roles: ["Assistant Section Officer", "Income Tax Officer", "Inspector", "Auditor"],
      description: `
        SSC CGL recruits graduates for Group B and C posts in central government ministries and departments.
        The exam is divided into four tiers – two objective, one descriptive, and one skill test/document verification.
        It tests general awareness, reasoning, English, and quantitative aptitude. CGL jobs provide steady promotions,
        stable pay, and a respected position in offices like the CBI, External Affairs, and Finance Ministry.
        It is one of the most popular and competitive government exams after graduation.
      `,
      link: "https://ssc.nic.in",
    },
    {
      title: "RRB NTPC (Railway Recruitment Board Non-Technical)",
      eligibility: "12th Pass or Graduate depending on post. Age: 18–33 years.",
      roles: ["Station Master", "Clerk", "Goods Guard", "Traffic Assistant"],
      description: `
        RRB NTPC is conducted for recruitment in Indian Railways under non-technical positions.
        The exam process includes CBT 1, CBT 2, Typing Test (if applicable), and Document Verification.
        It evaluates reasoning, mathematics, and general awareness. Working in the Indian Railways provides
        excellent pay, travel benefits, pension, and long-term stability. The NTPC roles are known for
        comfort, authority, and respect in one of the largest government sectors in India.
      `,
      link: "https://indianrailways.gov.in",
    },
    {
      title: "IBPS Probationary Officer (PO) Examination",
      eligibility: "Graduate in any discipline. Age: 20–30 years.",
      roles: ["Probationary Officer", "Assistant Manager in Nationalized Banks"],
      description: `
        The Institute of Banking Personnel Selection (IBPS) conducts PO exams to recruit officers in public sector banks.
        The process includes Preliminary, Mains, and Interview rounds. It tests reasoning, quantitative aptitude,
        English, computer skills, and general awareness. The selected candidates undergo training and are posted
        as Assistant Managers. IBPS PO is a gateway to a secure banking career with steady promotions and opportunities
        to move into higher managerial positions.
      `,
      link: "https://ibps.in",
    },
    {
      title: "SBI Probationary Officer (SBI PO) Examination",
      eligibility: "Bachelor’s Degree in any discipline. Age: 21–30 years.",
      roles: ["Probationary Officer", "Deputy Manager", "Branch Manager"],
      description: `
        The SBI PO exam is conducted by the State Bank of India for recruitment of officers in its branches across India.
        The exam includes Preliminary, Mains, Group Discussion, and Interview stages.
        It tests logical reasoning, quantitative aptitude, English, and banking awareness.
        SBI offers excellent salary packages, allowances, and a fast career growth path.
        The PO role involves customer relationship management, loan processing, and branch operations.
        It’s one of the most sought-after banking careers in the country.
      `,
      link: "https://sbi.co.in",
    },
    {
      title: "LIC Assistant Administrative Officer (AAO)",
      eligibility: "Graduate in any stream. Age: 21–30 years.",
      roles: ["Administrative Officer", "Assistant Manager", "Insurance Analyst"],
      description: `
        The LIC AAO exam is organized by the Life Insurance Corporation of India to recruit candidates for managerial roles.
        The selection process includes Prelims, Mains, and Interview.
        The exam assesses reasoning, quantitative aptitude, insurance awareness, and current affairs.
        AAOs play a key role in managing policy claims, investments, and client relations.
        Working with LIC offers job security, excellent benefits, and pension schemes, making it one of the most prestigious
        insurance sector jobs in India.
      `,
      link: "https://licindia.in",
    },
    {
      title: "GATE (Graduate Aptitude Test in Engineering)",
      eligibility: "Bachelor’s degree in Engineering/Technology or M.Sc. in relevant field. No age limit.",
      roles: ["PSU Engineer", "Researcher", "M.Tech/M.E. Admission"],
      description: `
        GATE is a national-level exam for engineering graduates conducted jointly by IITs and IISc.
        It tests technical knowledge in engineering disciplines, mathematics, and general aptitude.
        Scores are used for postgraduate admissions (M.Tech, MS, PhD) and for recruitment in PSUs like NTPC, BHEL, ONGC, and IOCL.
        GATE-qualified candidates are often offered high-paying technical roles in government R&D and energy sectors.
        The exam also opens doors for higher education and international opportunities.
      `,
      link: "https://gate.iitkgp.ac.in",
    },
    {
      title: "ISRO Scientist/Engineer Examination",
      eligibility: "BE/B.Tech in relevant engineering stream with minimum 65% marks. Age: below 35 years.",
      roles: ["Scientist", "Engineer", "Research Associate"],
      description: `
        The Indian Space Research Organisation conducts exams to recruit engineers and scientists for its prestigious projects.
        Candidates undergo a written test and personal interview. The work involves developing satellites, launch vehicles,
        and space applications for national development. ISRO provides research-oriented careers with high intellectual
        satisfaction and global recognition. It’s ideal for candidates passionate about space technology and innovation.
      `,
      link: "https://isro.gov.in",
    },
    {
      title: "DRDO Scientist Entry Test (SET)",
      eligibility: "B.E./B.Tech in Engineering or M.Sc. in relevant fields. Age: up to 28 years.",
      roles: ["Scientist ‘B’", "Technical Officer"],
      description: `
        The Defense Research and Development Organisation conducts SET to hire scientists and technical experts.
        The exam evaluates analytical, technical, and research skills. DRDO professionals work on advanced defense systems,
        missiles, AI, robotics, and cybersecurity technologies. It provides an exciting environment for innovation
        and hands-on experience in defense R&D. DRDO careers offer respect, research exposure, and long-term stability.
      `,
      link: "https://drdo.gov.in",
    },
    {
      title: "Combined Defence Services (CDS) & NDA Examination",
      eligibility: "CDS – Graduate degree, NDA – 10+2. Age: 16.5–24 years.",
      roles: ["Army Officer", "Navy Officer", "Air Force Pilot"],
      description: `
        Conducted by the UPSC, the NDA and CDS exams are gateways to join India’s Armed Forces.
        The selection includes written exams, SSB interviews, and medical fitness tests.
        Training is provided at NDA Pune or respective defense academies. Officers serve the nation with pride and discipline.
        The career provides adventure, leadership, and lifelong benefits including pensions, housing, and global respect.
        Ideal for those who aspire to protect and lead the nation.
      `,
      link: "https://upsc.gov.in",
    },
        {
      title: "EPFO (Employees' Provident Fund Organisation) Examination",
      eligibility: "Bachelor’s Degree in any discipline. Age: 21–30 years.",
      roles: ["Enforcement Officer", "Accounts Officer"],
      description: `
        EPFO exams are conducted by the UPSC to recruit officers managing provident fund accounts.
        The role involves auditing, compliance monitoring, and ensuring employee welfare schemes.
        It includes a written exam followed by an interview.
        The job offers high social respect, pension benefits, and stable work-life balance.
      `,
      link: "https://epfindia.gov.in",
    },
    {
      title: "Indian Coast Guard Assistant Commandant Examination",
      eligibility: "Bachelor’s Degree or Engineering Graduate. Age: 21–25 years.",
      roles: ["Assistant Commandant", "Naval Officer"],
      description: `
        The Indian Coast Guard exam recruits officers to protect India’s maritime interests.
        It includes a written test, group discussion, and physical efficiency test.
        Officers lead operations like rescue, anti-smuggling, and coastal security.
        The job offers adventure, honor, and a chance to serve the nation at sea.
      `,
      link: "https://joinindiancoastguard.gov.in",
    },
  ];

  return (
    <div className="central-exams-container">
      <button className="back-btn" onClick={() => navigate("/govt-exams")}>
        ← Back to Govt Exams
      </button>

      <h1>Central Government Examinations in India</h1>
      <p className="intro">
        Central Government exams are conducted by prestigious organizations like UPSC, SSC, IBPS, RRB, and PSU bodies.
        These exams provide an opportunity to work in India’s top government departments, defense organizations,
        space agencies, and banking sectors. Explore below the top examinations with detailed information
        about eligibility, career roles, and growth opportunities.
      </p>

      <div className="exam-cards">
        {exams.map((exam, index) => (
          <div key={index} className="exam-card">
            <h2>{exam.title}</h2>
            <p><strong>Eligibility:</strong> {exam.eligibility}</p>
            <p><strong>Roles:</strong> {exam.roles.join(", ")}</p>
            <p>{exam.description}</p>
            <a href={exam.link} target="_blank" rel="noopener noreferrer" className="apply-link">
              Visit Official Website
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
