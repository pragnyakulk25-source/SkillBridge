
import { useMemo, useState } from "react";
import "./App.css";

const initialJobs = [
  {
    id: 1,
    title: "Junior Data Analyst",
    company: "Walmart",
    initials: "W",
    color: "blue",
    location: "Bengaluru, India",
    type: "Full-time",
    mode: "Hybrid",
    category: "Data Analytics",
    level: "Entry level",
    skills: ["SQL", "Excel", "Python", "Power BI"],
    description:
      "Work with data, build reports, and help teams make informed business decisions.",
    source: "Demo listing",
  },
  {
    id: 2,
    title: "Associate Software Engineer",
    company: "Infosys",
    initials: "I",
    color: "orange",
    location: "Mysuru, India",
    type: "Full-time",
    mode: "On-site",
    category: "Software Development",
    level: "Entry level",
    skills: ["Java", "SQL", "Git", "Problem Solving"],
    description:
      "Build, test, and maintain software solutions while learning from experienced engineers.",
    source: "Demo listing",
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    company: "TechNova",
    initials: "T",
    color: "purple",
    location: "Remote",
    type: "Internship",
    mode: "Remote",
    category: "Software Development",
    level: "Internship",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    description:
      "Create responsive user interfaces and collaborate with a product development team.",
    source: "Demo listing",
  },
  {
    id: 4,
    title: "Business Intelligence Intern",
    company: "Deloitte",
    initials: "D",
    color: "green",
    location: "Bengaluru, India",
    type: "Internship",
    mode: "Hybrid",
    category: "Data Analytics",
    level: "Internship",
    skills: ["Excel", "SQL", "Power BI", "Communication"],
    description:
      "Help turn business data into insights through dashboards and analytical reports.",
    source: "Demo listing",
  },
  {
    id: 5,
    title: "QA Engineer Trainee",
    company: "CloudPeak",
    initials: "C",
    color: "pink",
    location: "Pune, India",
    type: "Full-time",
    mode: "On-site",
    category: "Software Testing",
    level: "Entry level",
    skills: ["Testing", "SQL", "Java", "Attention to Detail"],
    description:
      "Test applications, report defects, and help deliver reliable software.",
    source: "Demo listing",
  },
  {
    id: 6,
    title: "Python Developer Intern",
    company: "DataNest",
    initials: "N",
    color: "teal",
    location: "Remote",
    type: "Internship",
    mode: "Remote",
    category: "Software Development",
    level: "Internship",
    skills: ["Python", "SQL", "Git", "APIs"],
    description:
      "Develop small backend features and learn to work with APIs and databases.",
    source: "Demo listing",
  },
];

const initialSkills = ["SQL", "Excel", "Python"];

function calculateMatch(studentSkills, requiredSkills) {
  const normalized = studentSkills.map((skill) =>
    skill.trim().toLowerCase()
  );

  const matched = requiredSkills.filter((skill) =>
    normalized.includes(skill.toLowerCase())
  );

  return {
    score: Math.round((matched.length / requiredSkills.length) * 100),
    matched,
    missing: requiredSkills.filter((skill) => !matched.includes(skill)),
  };
}

function App() {
  const [page, setPage] = useState("discover");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All fields");
  const [workMode, setWorkMode] = useState("All modes");
  const [jobType, setJobType] = useState("All types");
  const [savedJobs, setSavedJobs] = useState([]);
  const [studentSkills, setStudentSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState("");

  const jobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const query = search.toLowerCase();

      const matchesSearch =
        `${job.title} ${job.company} ${job.location} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All fields" || job.category === category;

      const matchesMode =
        workMode === "All modes" || job.mode === workMode;

      const matchesType =
        jobType === "All types" || job.type === jobType;

      const matchesSaved =
        page !== "saved" || savedJobs.includes(job.id);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMode &&
        matchesType &&
        matchesSaved
      );
    });
  }, [search, category, workMode, jobType, page, savedJobs]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  function toggleSaved(jobId) {
    const isSaved = savedJobs.includes(jobId);

    setSavedJobs((previous) =>
      isSaved
        ? previous.filter((id) => id !== jobId)
        : [...previous, jobId]
    );

    notify(isSaved ? "Job removed from saved list" : "Job saved successfully");
  }

  function addSkill(event) {
    event.preventDefault();
    const skill = newSkill.trim();

    if (
      skill &&
      !studentSkills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setStudentSkills((previous) => [...previous, skill]);
      setNewSkill("");
      notify("Skill added to your profile");
    }
  }

  const averageMatch = Math.round(
    initialJobs.reduce(
      (total, job) =>
        total + calculateMatch(studentSkills, job.skills).score,
      0
    ) / initialJobs.length
  );

  const navigation = [
    { id: "discover", icon: "⌕", label: "Discover jobs" },
    { id: "saved", icon: "♡", label: "Saved jobs" },
    { id: "roadmap", icon: "↗", label: "My roadmap" },
    { id: "profile", icon: "◎", label: "My profile" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setPage("discover")}>
          <span className="brand-symbol">S</span>
          <span>
            <strong>skillbridge</strong>
            <small>FROM STUDENT TO HIRED</small>
          </span>
        </button>

        <div className="side-label">WORKSPACE</div>

        <nav className="side-nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => {
                setPage(item.id);
                setSelectedJob(null);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.id === "saved" && savedJobs.length > 0 && (
                <span className="nav-count">{savedJobs.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <strong>Your career, your plan.</strong>
            <p>Build skills that move you closer to your dream role.</p>
            <button onClick={() => setPage("roadmap")}>
              Explore roadmap →
            </button>
          </div>

          <div className="user-mini">
            <div className="avatar">PK</div>
            <div>
              <strong>Student profile</strong>
              <small>BCA · Undergraduate</small>
            </div>
            <button
              className="more-button"
              aria-label="Open profile"
              onClick={() => setPage("profile")}
            >
              ···
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            {navigation.find((item) => item.id === page)?.label || "Discover jobs"}
          </div>
          <div className="topbar-right">
            <span className="demo-indicator">
              <span /> Prototype mode
            </span>
            <button
              className="top-avatar"
              onClick={() => setPage("profile")}
              aria-label="View profile"
            >
              PK
            </button>
          </div>
        </header>

        {page === "discover" && (
          <>
            <section className="welcome-section">
              <div>
                <div className="eyebrow">
                  <span className="sparkle">✦</span> YOUR NEXT CHAPTER STARTS HERE
                </div>
                <h1>Find work that fits <span>your future.</span></h1>
                <p>
                  Discover opportunities, understand your skill gaps, and build
                  a practical path to your first job.
                </p>
              </div>
              <div className="welcome-art" aria-hidden="true">
                <div className="art-circle circle-one" />
                <div className="art-circle circle-two" />
                <div className="art-document">
                  <div className="art-document-top">✦</div>
                  <div className="art-line long" />
                  <div className="art-line" />
                  <div className="art-line short" />
                  <div className="art-check">✓</div>
                </div>
                <div className="art-star">✳</div>
              </div>
            </section>

            <section className="stats-grid">
              <StatCard
                icon="▤"
                label="Opportunities"
                value={initialJobs.length}
                detail="Sample listings"
                tone="lavender"
              />
              <StatCard
                icon="♡"
                label="Saved jobs"
                value={savedJobs.length}
                detail="Your shortlist"
                tone="peach"
              />
              <StatCard
                icon="◎"
                label="Your skills"
                value={studentSkills.length}
                detail="In your profile"
                tone="mint"
              />
              <StatCard
                icon="↗"
                label="Average match"
                value={`${averageMatch}%`}
                detail="Across sample jobs"
                tone="sky"
              />
            </section>

            <section className="search-panel">
              <div className="section-heading">
                <div>
                  <h2>Explore opportunities</h2>
                  <p>Find roles that match your interests and skills.</p>
                </div>
                <span className="results-label">
                  {jobs.length} roles found
                </span>
              </div>

              <div className="search-input-wrap">
                <span>⌕</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, company, location or skill..."
                  aria-label="Search jobs"
                />
                {search && (
                  <button onClick={() => setSearch("")}>Clear</button>
                )}
              </div>

              <div className="filter-row">
                <label className="filter-control">
                  <span>Field</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option>All fields</option>
                    <option>Data Analytics</option>
                    <option>Software Development</option>
                    <option>Software Testing</option>
                  </select>
                </label>

                <label className="filter-control">
                  <span>Work mode</span>
                  <select
                    value={workMode}
                    onChange={(event) => setWorkMode(event.target.value)}
                  >
                    <option>All modes</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </label>

                <label className="filter-control">
                  <span>Job type</span>
                  <select
                    value={jobType}
                    onChange={(event) => setJobType(event.target.value)}
                  >
                    <option>All types</option>
                    <option>Internship</option>
                    <option>Full-time</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="jobs-section">
              <div className="jobs-heading">
                <div>
                  <h2>Recommended for you</h2>
                  <p>Explore the role, then check your skill match.</p>
                </div>
                <span className="demo-tag">DEMO DATA</span>
              </div>

              {jobs.length === 0 ? (
                <div className="empty-state">
                  <span>⌕</span>
                  <h3>No matching jobs found</h3>
                  <p>Try changing your search or filters.</p>
                  <button
                    className="button-secondary"
                    onClick={() => {
                      setSearch("");
                      setCategory("All fields");
                      setWorkMode("All modes");
                      setJobType("All types");
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      match={calculateMatch(studentSkills, job.skills)}
                      isSaved={savedJobs.includes(job.id)}
                      onSave={() => toggleSaved(job.id)}
                      onView={() => setSelectedJob(job)}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {page === "saved" && (
          <section className="page-content">
            <div className="eyebrow">YOUR SHORTLIST</div>
            <h1>Saved opportunities</h1>
            <p className="page-description">
              Keep track of the roles you want to explore.
            </p>
            {jobs.length ? (
              <div className="jobs-grid">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    match={calculateMatch(studentSkills, job.skills)}
                    isSaved
                    onSave={() => toggleSaved(job.id)}
                    onView={() => setSelectedJob(job)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span>♡</span>
                <h3>No saved jobs yet</h3>
                <p>Save opportunities from Discover jobs to see them here.</p>
                <button
                  className="button-primary"
                  onClick={() => setPage("discover")}
                >
                  Discover jobs
                </button>
              </div>
            )}
          </section>
        )}

        {page === "profile" && (
          <section className="page-content">
            <div className="eyebrow">YOUR STARTING POINT</div>
            <h1>Build your student profile</h1>
            <p className="page-description">
              Add the skills you have today. SkillBridge will use them to
              compare you with sample job requirements.
            </p>
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">PK</div>
                <div>
                  <h2>Student profile</h2>
                  <p>BCA · Undergraduate · Early career</p>
                </div>
              </div>
              <div className="profile-field">
                <label>Current skills</label>
                <div className="skill-chips">
                  {studentSkills.map((skill) => (
                    <span className="skill-chip" key={skill}>
                      {skill}
                      <button
                        aria-label={`Remove ${skill}`}
                        onClick={() =>
                          setStudentSkills((previous) =>
                            previous.filter((item) => item !== skill)
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <form className="add-skill-form" onSubmit={addSkill}>
                  <input
                    value={newSkill}
                    onChange={(event) => setNewSkill(event.target.value)}
                    placeholder="Add a skill, e.g. JavaScript"
                  />
                  <button className="button-primary" type="submit">
                    Add skill
                  </button>
                </form>
              </div>
              <div className="profile-note">
                <span>✦</span>
                <p>
                  Tip: Add only skills you can currently demonstrate. You can
                  use the roadmap to identify what to learn next.
                </p>
              </div>
            </div>
          </section>
        )}

        {page === "roadmap" && (
          <section className="page-content">
            <div className="eyebrow">YOUR LEARNING JOURNEY</div>
            <h1>Turn skill gaps into progress.</h1>
            <p className="page-description">
              Start with the missing skills that appear most often in your
              sample job matches.
            </p>
            <div className="roadmap-card">
              <div className="roadmap-title">
                <div>
                  <span className="roadmap-kicker">STARTER ROADMAP</span>
                  <h2>Build your job-ready foundation</h2>
                </div>
                <span className="roadmap-symbol">✦</span>
              </div>
              {[
                {
                  n: "01",
                  title: "Strengthen SQL",
                  description: "Practise SELECT, JOIN, GROUP BY and subqueries.",
                  tag: "Data foundations",
                },
                {
                  n: "02",
                  title: "Learn data visualization",
                  description: "Create a simple Power BI dashboard using sample data.",
                  tag: "Analytics",
                },
                {
                  n: "03",
                  title: "Build a portfolio project",
                  description: "Analyse a dataset and explain three useful findings.",
                  tag: "Portfolio",
                },
                {
                  n: "04",
                  title: "Practise interview questions",
                  description: "Explain your project and solve beginner SQL questions.",
                  tag: "Preparation",
                },
              ].map((task) => (
                <div className="roadmap-task" key={task.n}>
                  <span className="task-number">{task.n}</span>
                  <div className="task-copy">
                    <h3>{task.title}</h3>
                    <p>{task.description}</p>
                    <span className="task-tag">{task.tag}</span>
                  </div>
                </div>
              ))}
              <p className="roadmap-footnote">
                This is a starter roadmap. Personalized tasks and progress
                saving will be connected to the backend later.
              </p>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>skillbridge © 2026</span>
          <span>Learn with purpose. Apply with confidence.</span>
        </footer>
      </main>

      {selectedJob && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedJob(null)}
          role="presentation"
        >
          <section
            className="job-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-job-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedJob(null)}
              aria-label="Close job details"
            >
              ×
            </button>

            <div className="modal-company-row">
              <CompanyLogo job={selectedJob} />
              <div>
                <span className="eyebrow">{selectedJob.company}</span>
                <h2 id="modal-job-title">{selectedJob.title}</h2>
                <p>{selectedJob.location} · {selectedJob.mode}</p>
              </div>
            </div>

            <div className="match-summary">
              <div
                className="match-ring"
                style={{
                  "--match": `${calculateMatch(studentSkills, selectedJob.skills).score}%`,
                }}
              >
                <strong>
                  {calculateMatch(studentSkills, selectedJob.skills).score}%
                </strong>
              </div>
              <div>
                <h3>Your skill overlap</h3>
                <p>
                  Based on your profile and this listing's sample required
                  skills. This is not a hiring probability.
                </p>
              </div>
            </div>

            <h3 className="modal-section-title">About this role</h3>
            <p className="modal-description">{selectedJob.description}</p>

            <h3 className="modal-section-title">Required skills</h3>
            <div className="skill-chips">
              {selectedJob.skills.map((skill) => {
                const hasSkill = studentSkills.some(
                  (item) => item.toLowerCase() === skill.toLowerCase()
                );

                return (
                  <span
                    key={skill}
                    className={`skill-chip ${hasSkill ? "matched-chip" : "missing-chip"}`}
                  >
                    {hasSkill ? "✓ " : "+ "}
                    {skill}
                  </span>
                );
              })}
            </div>

            <p className="modal-disclaimer">
              This is a demonstration listing, not a verified live vacancy.
            </p>

            <div className="modal-actions">
              <button
                className="button-secondary"
                onClick={() => toggleSaved(selectedJob.id)}
              >
                {savedJobs.includes(selectedJob.id)
                  ? "♥ Saved"
                  : "♡ Save job"}
              </button>
              <button
                className="button-primary"
                onClick={() => {
                  setSelectedJob(null);
                  setPage("roadmap");
                }}
              >
                Build my roadmap →
              </button>
            </div>
          </section>
        </div>
      )}

      {toast && <div className="toast-message">{toast}</div>}
    </div>
  );
}

function StatCard({ icon, label, value, detail, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>{icon}</div>
      <div className="stat-info">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function CompanyLogo({ job }) {
  return (
    <div className={`company-logo ${job.color}`}>
      {job.initials}
    </div>
  );
}

function JobCard({ job, match, isSaved, onSave, onView }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <CompanyLogo job={job} />
        <button
          className={`save-button ${isSaved ? "saved" : ""}`}
          onClick={onSave}
          aria-label={isSaved ? "Unsave job" : "Save job"}
          title={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? "♥" : "♡"}
        </button>
      </div>

      <div className="job-company">{job.company}</div>
      <h3>{job.title}</h3>
      <div className="job-location">⌖ {job.location}</div>

      <div className="job-tags">
        <span>{job.type}</span>
        <span>{job.mode}</span>
      </div>

      <div className="job-match">
        <div className="job-match-heading">
          <span>Skill match</span>
          <strong>{match.score}%</strong>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${match.score}%` }}
          />
        </div>
        <small>
          {match.matched.length} of {job.skills.length} required skills matched
        </small>
      </div>

      <div className="job-card-footer">
        <span className="demo-source">{job.source}</span>
        <button className="view-job-button" onClick={onView}>
          View details <span>→</span>
        </button>
      </div>
    </article>
  );
}

export default App;
