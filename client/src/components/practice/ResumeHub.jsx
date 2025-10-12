/* eslint-disable no-irregular-whitespace */
import React, { useState, useRef, useMemo } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Global Data Structures for multiple-entry sections
const initialEntry = { title: "", company: "", duration: "", description: "" };
const initialEducation = { degree: "", institution: "", duration: "" };
const initialProject = { projectTitle: "", projectDescription: "" };

/**
 * Main Application Component to handle navigation and state.
 */
export default function App() {
  const [activeNav, setActiveNav] = useState("builder"); // 'builder', 'tips', 'tools', 'scorer'

  const renderContent = () => {
    switch (activeNav) {
      case "builder":
        // FIX 1: Pass both activeNav and setActiveNav to ResumeHub
        return <ResumeHub activeNav={activeNav} setActiveNav={setActiveNav} />;
      case "tips":
        return <SmartTips />;
      case "tools":
        return <ResumeToolsBlog />;
      case "scorer":
        // ResumeHub will contain the data/logic for the scorer to display
        return <ResumeHub activeNav={activeNav} setActiveNav={setActiveNav} />;
      default:
        return <ResumeHub activeNav={activeNav} setActiveNav={setActiveNav} />;
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.navBar}>
        <div style={styles.logo}>✨ Resume Pro</div>
        <nav>
          <button
            style={activeNav === "builder" ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveNav("builder")}
          >
            Resume Builder 📝
          </button>
          <button
            style={activeNav === "tips" ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveNav("tips")}
          >
            Smart Tips 💡
          </button>
          <button
            style={activeNav === "tools" ? styles.navLinkActive : styles.navLink}
            onClick={() => setActiveNav("tools")}
          >
            External Tools 🔗
          </button>
        </nav>
      </header>
      <div style={styles.contentContainer}>
        {renderContent()}
      </div>
    </div>
  );
}

// --------------------
// PROFESSIONAL RESUME BUILDER (Main Component)
// --------------------
// FIX 2: Accept activeNav as a prop
function ResumeHub({ activeNav, setActiveNav }) {
  const resumeRef = useRef();

  const [formData, setFormData] = useState({
    name: "John Doe",
    title: "Senior Full Stack Developer",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    summary: "Highly motivated Senior Full Stack Developer with 7+ years of experience in building scalable web applications using React, Node.js, and AWS. Proven ability to lead small teams and deliver high-quality, efficient code.",
    skills: "JavaScript, React, Node.js, AWS, Python, SQL, REST APIs, Git, Agile/Scrum", // Comma-separated list
  });
  
  const [experienceList, setExperienceList] = useState([
    { title: "Senior Developer", company: "TechCorp Solutions", duration: "Jan 2021 - Present", description: "Led a team of 4 developers to re-platform the main product using React and Node, resulting in a 30% reduction in load time.\nMentored junior developers on best practices and code reviews." },
  ]);
  
  const [educationList, setEducationList] = useState([
    { degree: "M.S. Computer Science", institution: "State University", duration: "2018" },
  ]);

  const [projectList, setProjectList] = useState([
    { projectTitle: "E-commerce Platform Redesign", projectDescription: "Developed the entire front-end using React with Redux, improving conversion rates by 15%." },
  ]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handlers for dynamic lists
  const handleListChange = (list, setList, index, e) => {
    const { name, value } = e.target;
    const newList = [...list];
    newList[index] = { ...newList[index], [name]: value };
    setList(newList);
  };

  const addEntry = (setList, initialData) => {
    setList(list => [...list, initialData]);
  };

  const removeEntry = (list, setList, index) => {
    const newList = list.filter((_, i) => i !== index);
    setList(newList);
  };

  const handlePrint = async () => {
    const resume = resumeRef.current;
    if (!resume) return;
    const canvas = await html2canvas(resume, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 1.0); 
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let position = 0;
    while (position < imgHeight) {
        pdf.addImage(imgData, "JPEG", 0, position * -1, pdfWidth, imgHeight);
        position += pdfHeight;
        if (position < imgHeight) {
            pdf.addPage();
        }
    }
    pdf.save(`${formData.name || "My_Professional_Resume"}.pdf`);
  };

  const renderList = (data) =>
    data ? data.split(",").map((item, i) => <li key={i}>{item.trim()}</li>) : null;

  // Combine all data for the Scorecard
  const resumeData = useMemo(() => ({
    ...formData,
    experienceList,
    educationList,
    projectList,
  }), [formData, experienceList, educationList, projectList]);

  return (
    <div style={styles.container}>
      <h1 style={styles.contentHeader}>Professional Resume Builder 🛠️</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Form Section (60% Width) */}
        <div style={styles.formContainer}>
          <h2 style={styles.sectionHeading}>Personal Details</h2>
          {["name", "title", "email", "phone", "linkedin", "github"].map((key) => (
            // FIX: Removed duplicate key attribute
            <div key={key} style={styles.inputGroup}>
              <label style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input name={key} value={formData[key]} onChange={handleChange} placeholder={`Enter your ${key}`} style={styles.input} />
            </div>
          ))}
          
          <h2 style={styles.sectionHeading}>Summary / Profile</h2>
          <textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Write a compelling 3-4 line summary." style={{ ...styles.input, minHeight: "80px" }} />
          
          <h2 style={styles.sectionHeading}>Skills (Comma Separated)</h2>
          <input name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., JavaScript, React, Node.js, AWS, Agile" style={styles.input} />

          {/* Experience Section */}
          <h2 style={styles.sectionHeading}>Experience</h2>
          {experienceList.map((exp, index) => (
            <div key={index} style={styles.dynamicEntry}>
              <input name="title" value={exp.title} onChange={(e) => handleListChange(experienceList, setExperienceList, index, e)} placeholder="Job Title" style={styles.input} />
              <input name="company" value={exp.company} onChange={(e) => handleListChange(experienceList, setExperienceList, index, e)} placeholder="Company Name" style={styles.input} />
              <input name="duration" value={exp.duration} onChange={(e) => handleListChange(experienceList, setExperienceList, index, e)} placeholder="Start Date - End Date" style={styles.input} />
              <textarea name="description" value={exp.description} onChange={(e) => handleListChange(experienceList, setExperienceList, index, e)} placeholder="Key achievements/responsibilities (use bullet points, one per line)" style={{ ...styles.input, minHeight: "60px" }} />
              <div style={styles.actionButtons}>
                <button style={styles.addButton} onClick={() => addEntry(setExperienceList, initialEntry)}>+ Add Job</button>
                {experienceList.length > 1 && (<button style={styles.removeButton} onClick={() => removeEntry(experienceList, setExperienceList, index)}>Remove</button>)}
              </div>
            </div>
          ))}
          
          {/* Projects Section */}
          <h2 style={styles.sectionHeading}>Key Projects</h2>
          {projectList.map((proj, index) => (
            <div key={index} style={styles.dynamicEntry}>
              <input name="projectTitle" value={proj.projectTitle} onChange={(e) => handleListChange(projectList, setProjectList, index, e)} placeholder="Project Title (e.g., Portfolio Site, Data Analysis Tool)" style={styles.input} />
              <textarea name="projectDescription" value={proj.projectDescription} onChange={(e) => handleListChange(projectList, setProjectList, index, e)} placeholder="Project details and key technologies used (use bullet points, one per line)" style={{ ...styles.input, minHeight: "60px" }} />
              <div style={styles.actionButtons}>
                <button style={styles.addButton} onClick={() => addEntry(setProjectList, initialProject)}>+ Add Project</button>
                {projectList.length > 1 && (<button style={styles.removeButton} onClick={() => removeEntry(projectList, setProjectList, index)}>Remove</button>)}
              </div>
            </div>
          ))}
          
          {/* Education Section */}
          <h2 style={styles.sectionHeading}>Education</h2>
          {educationList.map((edu, index) => (
            <div key={index} style={styles.dynamicEntry}>
              <input name="degree" value={edu.degree} onChange={(e) => handleListChange(educationList, setEducationList, index, e)} placeholder="Degree/Certification" style={styles.input} />
              <input name="institution" value={edu.institution} onChange={(e) => handleListChange(educationList, setEducationList, index, e)} placeholder="Institution Name" style={styles.input} />
              <input name="duration" value={edu.duration} onChange={(e) => handleListChange(educationList, setEducationList, index, e)} placeholder="Year Graduated or Duration" style={styles.input} />
              <div style={styles.actionButtons}>
                <button style={styles.addButton} onClick={() => addEntry(setEducationList, initialEducation)}>+ Add Education</button>
                {educationList.length > 1 && (<button style={styles.removeButton} onClick={() => removeEntry(educationList, setEducationList, index)}>Remove</button>)}
              </div>
            </div>
          ))}
          
          {/* Bottom Actions */}
          <button style={styles.pdfButton} onClick={handlePrint}>⬇️ Download Resume as PDF</button>
          {/* Scorer Button */}
          <button style={{...styles.pdfButton, backgroundColor: '#F59E0B', marginTop: '10px'}} onClick={() => setActiveNav('scorer')}>✨ Get Resume Scorecard</button>
        </div>

        {/* Resume Preview (40% Width) */}
        <div style={styles.resumePreviewWrapper}>
          <div style={styles.resumePreview} ref={resumeRef}>
            {/* ... Resume Preview Content (as before) ... */}
            <div style={styles.resumeHeader}>
              <h2 style={styles.name}>{formData.name || "YOUR NAME HERE"}</h2>
              <p style={styles.title}>{formData.title || "Professional Title"}</p>
              <div style={styles.links}>
                {formData.email && <span style={styles.contactItem}>{formData.email}</span>}
                {formData.phone && <span style={styles.contactItem}>| {formData.phone}</span>}
                {formData.linkedin && <a href={`https://${formData.linkedin}`} style={styles.contactItem}>| LinkedIn</a>}
                {formData.github && <a href={`https://${formData.github}`} style={styles.contactItem}>| GitHub</a>}
              </div>
            </div>

            {formData.summary && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>SUMMARY</h3>
                    <p style={styles.bulletList}>{formData.summary}</p>
                </div>
            )}

            {formData.skills && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>SKILLS</h3>
                    <ul style={styles.bulletList}>
                        {renderList(formData.skills)}
                    </ul>
                </div>
            )}

            {experienceList.some(exp => exp.title) && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</h3>
                {experienceList.filter(exp => exp.title).map((exp, index) => (
                  <div key={index} style={styles.experienceItem}>
                    <div style={styles.jobTitleContainer}>
                      <p style={styles.jobTitle}>{exp.title || "Job Title"}</p>
                      <p style={styles.jobDuration}>{exp.duration || "Dates"}</p>
                    </div>
                    <p style={styles.companyName}>{exp.company || "Company Name"}</p>
                    {exp.description && (
                      <ul style={styles.bulletList}>
                        {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i}>{line.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Projects Preview */}
            {projectList.some(proj => proj.projectTitle) && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>KEY PROJECTS</h3>
                {projectList.filter(proj => proj.projectTitle).map((proj, index) => (
                  <div key={index} style={styles.experienceItem}>
                    <p style={styles.jobTitle}>{proj.projectTitle || "Project Title"}</p>
                    {proj.projectDescription && (
                      <ul style={styles.bulletList}>
                        {proj.projectDescription.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i}>{line.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {educationList.some(edu => edu.degree) && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>EDUCATION</h3>
                {educationList.filter(edu => edu.degree).map((edu, index) => (
                  <div key={index} style={styles.educationItem}>
                    <div style={styles.jobTitleContainer}>
                      <p style={styles.jobTitle}>{edu.degree || "Degree Name"}</p>
                      <p style={styles.jobDuration}>{edu.duration || "Dates"}</p>
                    </div>
                    <p style={styles.companyName}>{edu.institution || "Institution Name"}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Conditionally Render Scorer when activeNav is 'scorer' */}
      {activeNav === 'scorer' && <ResumeScorer resumeData={resumeData} />}
    </div>
  );
}

// --------------------
// Resume Scorer Component (Unchanged)
// --------------------
function ResumeScorer({ resumeData }) {
    const { name, email, summary, skills, experienceList, projectList, educationList } = resumeData;
    let score = 0;
    const improvementAreas = [];

    // Scoring Logic (Simplified)
    
    // 1. Basic Content Check (10 points each)
    if (name && email) score += 10; else improvementAreas.push("Complete Contact Information (Name & Email).");
    if (summary.length > 50) score += 10; else improvementAreas.push("Write a concise Professional Summary (min 50 chars).");
    if (skills.split(',').filter(s => s.trim().length > 0).length >= 5) score += 10; else improvementAreas.push("Include at least 5 relevant Skills (comma-separated).");

    // 2. Experience & Projects Check (15 points each)
    const hasExperience = experienceList.filter(exp => exp.title).length > 0;
    if (hasExperience) score += 15; else improvementAreas.push("Add at least one Professional Experience entry.");

    const hasQuantifiedExperience = experienceList.some(exp => exp.description && exp.description.match(/\d+[%$]/));
    if (hasQuantifiedExperience) score += 15; else improvementAreas.push("Quantify achievements in Experience (use %, $, or numbers).");
    
    const hasProjects = projectList.filter(proj => proj.projectTitle).length > 0;
    if (hasProjects) score += 15; else improvementAreas.push("Include at least one Key Project (crucial for technical roles).");
    
    // 3. Length/Structure Check (5 points each)
    const totalExperienceBullets = experienceList.reduce((acc, exp) => acc + (exp.description ? exp.description.split('\n').filter(line => line.trim()).length : 0), 0);
    if (totalExperienceBullets >= 5) score += 5; else improvementAreas.push(`Add more detail to experience (only ${totalExperienceBullets} bullets found, aim for 5+).`);
    
    const hasEducation = educationList.some(edu => edu.degree);
    if (hasEducation) score += 5; else improvementAreas.push("Include your Education details.");

    // Final Score Calculation (Scale to 100)
    const maxScore = 85; // Base max score from rules
    const finalScore = Math.round((score / maxScore) * 100);
    const displayScore = finalScore > 100 ? 100 : finalScore; // Cap at 100

    return (
        <div style={styles.scorerContainer}>
            <h2 style={styles.scorerHeader}>⭐ Resume Scorer: Your Results</h2>
            <div style={styles.scoreBox}>
                <div style={{fontSize: '3rem', fontWeight: 'bold', color: displayScore > 80 ? '#10B981' : displayScore > 50 ? '#F59E0B' : '#EF4444'}}>
                    {displayScore}%
                </div>
                <p style={{marginTop: '5px', color: '#374151'}}>Scored based on ATS and best practice standards.</p>
            </div>

            <h3 style={styles.improvementHeader}>🎯 Areas for Improvement ({improvementAreas.length})</h3>
            {improvementAreas.length > 0 ? (
                <ul style={styles.improvementList}>
                    {improvementAreas.map((area, i) => (
                        <li key={i} style={styles.improvementItem}>{area}</li>
                    ))}
                </ul>
            ) : (
                <div style={{textAlign: 'center', padding: '20px', backgroundColor: '#ECFDF5', borderRadius: '8px', border: '1px solid #10B981'}}>
                    <strong style={{color: '#065F46'}}>Excellent! Your resume meets all basic best practice requirements.</strong>
                </div>
            )}
        </div>
    );
}

// --------------------
// Smart Tips & Tools components (Unchanged for brevity, assumed correct)
// --------------------
function SmartTips() { /* ... implementation unchanged ... */ return (
    <div style={styles.tipsContainer}>
      <h2 style={styles.tipsHeader}>💡 Smart Resume Tips & Strategies</h2>
      <ul style={styles.tipsList}>
        {["**Quantify achievements** — Use the **X-Y-Z formula** (Accomplished **X** as measured by **Y**, by doing **Z**).", "Start every experience bullet with a **strong action verb**.", "**Customize for ATS (Applicant Tracking Systems)**: Tailor keywords to match the job description.", "Keep the resume **concise**: Target **one page** for candidates with under 10 years of experience."].map((tip, i) => (
          <li key={i} style={styles.tipItem}>
            <span dangerouslySetInnerHTML={{ __html: tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </li>
        ))}
      </ul>
    </div>
)}

function ResumeToolsBlog() { /* ... implementation unchanged ... */ return (
    <div style={styles.blogContainer}>
      <h2 style={styles.blogHeader}>🌐 Explore External Resume Builders & Tools</h2>
      {[{name: "Canva Resume Builder", url: "#", note: "Modern templates and easy customization."}, {name: "Novorésumé", url: "#", note: "ATS-friendly designs with suggestions."}, {name: "Resume.io", url: "#", note: "Clean, professional templates with export options."}].map((tool, i) => (
        <div key={i} style={styles.blogItem}>
          <div>
            <strong>{tool.name}</strong>
            <p style={{ margin: 0, color: "#4B5563" }}>{tool.note}</p>
          </div>
          <a href={tool.url} target="_blank" rel="noreferrer" style={styles.visitLink}>Visit Site →</a>
        </div>
      ))}
    </div>
)}

// --------------------
// Inner CSS (Unchanged)
// --------------------
const styles = {
    // --- App Layout ---
    appContainer: { fontFamily: "'Inter', sans-serif", backgroundColor: "#F3F4F6", minHeight: "150vh", },
    navBar: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 50px", backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 10, },
    logo: { fontSize: "1.5rem", fontWeight: "800", color: "#1D4ED8", },
    navLink: { background: "none", border: "none", color: "#4B5563", fontSize: "1rem", padding: "8px 15px", margin: "0 5px", cursor: "pointer", borderRadius: "6px", transition: "background-color 0.2s", },
    navLinkActive: { background: "#E0E7FF", color: "#1D4ED8", fontWeight: "600", border: "none", fontSize: "1rem", padding: "8px 15px", margin: "0 5px", cursor: "pointer", borderRadius: "6px", },
    contentContainer: { maxWidth: "1800px", margin: "20px auto", padding: "20px", },
    
    // --- ResumeHub Specific ---
    container: { color: "#111827", },
    contentHeader: { textAlign: "center", fontSize: "2rem", fontWeight: "700", color: "#1D4ED8", marginBottom: "30px", },
    formContainer: { flex: 1.5, background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.08)", marginBottom: "20px", },
    resumePreviewWrapper: { flex: 1, minWidth: "850px", maxHeight: "80vh", overflowY: "auto", position: "sticky", top: "85px", },
    sectionHeading: { fontSize: "1.3rem", color: "#1F2937", borderBottom: "2px solid #D1D5DB", paddingBottom: "5px", marginTop: "20px", marginBottom: "15px", fontWeight: "700", },
    inputGroup: { marginBottom: "15px" },
    label: { display: "block", fontWeight: "600", marginBottom: "5px", color: "#374151" },
    input: { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s", marginBottom: "5px" },
    dynamicEntry: { border: "1px dashed #D1D5DB", padding: "15px", borderRadius: "8px", marginBottom: "15px", backgroundColor: "#FAFAFA", },
    actionButtons: { display: "flex", gap: "10px", marginTop: "10px", },
    addButton: { background: "#10B981", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", },
    removeButton: { background: "#EF4444", color: "white", padding: "8px 12px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", },
    pdfButton: { background: "#1D4ED8", color: "white", padding: "12px 20px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "1.1rem", width: "100%", marginTop: "20px", transition: "background-color 0.2s", },
    
    // --- Resume Preview (The A4 Document) ---
    resumePreview: { backgroundColor: "white", padding: "30px", borderRadius: "6px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)", lineHeight: "1.4", },
    resumeHeader: { textAlign: "center", borderBottom: "2px solid #1D4ED8", paddingBottom: "15px", marginBottom: "15px", },
    name: { fontSize: "2rem", fontWeight: "800", color: "#111827", margin: 0 },
    title: { color: "#6B7280", fontSize: "1.2rem", margin: "5px 0 0 0" },
    links: { marginTop: "10px", fontSize: "0.9rem" },
    contactItem: { color: "#374151", margin: "0 5px", textDecoration: "none" },
    section: { marginBottom: "20px" },
    sectionTitle: { fontSize: "1.2rem", color: "#1D4ED8", fontWeight: "700", borderBottom: "1px solid #1D4ED8", paddingBottom: "3px", marginTop: "10px", marginBottom: "10px", },
    experienceItem: { marginBottom: "15px" },
    educationItem: { marginBottom: "10px" },
    jobTitleContainer: { display: "flex", justifyContent: "space-between", fontWeight: "600", marginBottom: "3px", },
    jobTitle: { margin: 0, fontSize: "1.05rem" },
    jobDuration: { margin: 0, color: "#6B7280", fontSize: "0.95rem" },
    companyName: { margin: "0 0 5px 0", fontStyle: "italic", color: "#4B5563" },
    bulletList: { paddingLeft: "20px", margin: "5px 0", fontSize: "0.95rem", },

    // --- Scorer Component Styles ---
    scorerContainer: {
        marginTop: '40px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        borderTop: '5px solid #F59E0B',
    },
    scorerHeader: {
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: '700',
        color: '#F59E0B',
        marginBottom: '20px',
    },
    scoreBox: {
        textAlign: 'center',
        padding: '20px',
        border: '3px solid #FCD34D',
        borderRadius: '10px',
        marginBottom: '30px',
        backgroundColor: '#FFFBEB',
    },
    improvementHeader: {
        fontSize: '1.5rem',
        color: '#EF4444',
        borderBottom: '2px solid #FEE2E2',
        paddingBottom: '5px',
        marginBottom: '15px',
    },
    improvementList: {
        paddingLeft: '25px',
        listStyleType: 'disc',
        color: '#4B5563',
    },
    improvementItem: {
        marginBottom: '10px',
        lineHeight: '1.5',
        fontWeight: '500',
    },

    // --- Tips/Tools Component Styles (for completeness) ---
    tipsContainer: { background: "linear-gradient(135deg, #E0E7FF 0%, #EEF2FF 100%)", padding: "30px", borderRadius: "12px", marginTop: "40px", boxShadow: "0 4px 10px rgba(0,0,0,0.05)", },
    tipsHeader: { fontSize: "1.8rem", color: "#1D4ED8", marginBottom: "20px", textAlign: "center", fontWeight: "700", },
    tipsList: { paddingLeft: "25px", listStyleType: "disc" },
    tipItem: { marginBottom: "12px", color: "#1F2937", lineHeight: "1.6" },
    blogContainer: { marginTop: "40px", background: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", },
    blogHeader: { fontSize: "1.8rem", color: "#059669", marginBottom: "20px", textAlign: "center", fontWeight: "700", },
    blogItem: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E5E7EB", padding: "15px 0", },
    visitLink: { color: "#1D4ED8", textDecoration: "none", fontWeight: "600", padding: "5px 10px", borderRadius: "4px", border: "1px solid #1D4ED8", transition: "background-color 0.2s", },
};
