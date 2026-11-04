const roles = [
  {
    company: "rustLabs",
    role: "AI Trainer",
    current: true,
    href: "https://experts.rustlabs.ai/#fields",
    description:
      "Working on AI training projects, alongside my frontend and mobile development work.",
  },
  {
    company: "Horan Technologies",
    role: "Frontend Engineering Intern",
    current: false,
    description:
      "Responsive web interfaces, design implementation, and API integration for live client products.",
  },
  {
    company: "Revelo",
    role: "AI Trainer",
    current: false,
    href: "https://www.revelo.com",
    description: "Contributed to AI training projects.",
  },
  {
    company: "Eskalate",
    role: "Software Engineer Intern",
    current: false,
    description:
      "Built Flutter features for an e-commerce app, including authentication, product management, and real-time chat with Socket.IO.",
  },
];

export function ExperienceTimeline() {
  return (
    <section
      id="experience"
      className="home-section experience-section"
      aria-labelledby="experience-title"
    >
      <div className="home-container experience-layout">
        <div className="experience-intro">
          <h2 id="experience-title">Experience</h2>
          <p>A few places I’ve worked and contributed.</p>
          <a
            className="home-text-link"
            href="/AbdrehimMisbahResumeW2.pdf"
            download
          >
            Download my CV <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ol className="experience-list">
          {roles.map((item) => (
            <li
              className={`experience-item${item.current ? " experience-item-current" : ""}`}
              key={item.company}
            >
              <span className="experience-marker" aria-hidden="true" />
              <article className="experience-row">
                <div className="experience-row-top">
                  <h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.company} <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      item.company
                    )}
                  </h3>
                  {item.current && (
                    <span className="current-role">Present</span>
                  )}
                </div>
                <p className="role-title">{item.role}</p>
                <p className="role-description">{item.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
