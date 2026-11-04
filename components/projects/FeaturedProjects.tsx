import Image from "next/image";
import Link from "next/link";
import { projects, type PortfolioProject } from "@/lib/content/projects";

function ProjectLinks({ project }: { project: PortfolioProject }) {
  return (
    <div className="project-links">
      {project.links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {link.label}
          <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}

function ProjectDetails({ project }: { project: PortfolioProject }) {
  return (
    <details className="project-details">
      <summary>
        Behind the build <span aria-hidden="true">+</span>
      </summary>
      <p>{project.decision}</p>
      <p className="project-stack">{project.stack}</p>
    </details>
  );
}

function Screen({
  screen,
  desktop = false,
}: {
  screen: PortfolioProject["images"][number];
  desktop?: boolean;
}) {
  return (
    <a
      className={
        desktop
          ? "project-screen desktop-screen"
          : "project-screen phone-screen"
      }
      href={screen.src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open full-size screenshot: ${screen.label} (new tab)`}
    >
      <Image
        src={screen.src}
        alt={screen.alt}
        width={screen.width}
        height={screen.height}
        sizes={
          desktop
            ? "(max-width: 700px) 90vw, 550px"
            : "(max-width: 600px) 38vw, 230px"
        }
      />
    </a>
  );
}

export function FeaturedProjects() {
  return (
    <section
      id="projects"
      className="home-section home-container"
      aria-labelledby="projects-title"
    >
      <div className="section-heading">
        <div>
          <h2 id="projects-title">Selected work</h2>
          <p>From an idea to something people can use.</p>
        </div>
        <a
          className="home-text-link"
          href="https://github.com/Depthabdre"
          target="_blank"
          rel="noopener noreferrer"
        >
          My GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
      <article id="project-aplus" className="flagship-project">
        <div className="flagship-copy">
          <p className="project-category">{projects.aplus.platform}</p>
          <h3>{projects.aplus.name}</h3>
          <p className="project-tagline">{projects.aplus.summary}</p>
          <p className="project-description">{projects.aplus.description}</p>
          <ProjectLinks project={projects.aplus} />
          <ProjectDetails project={projects.aplus} />
          <p className="private-note">
            Client project · Source code is private
          </p>
        </div>
        <div className="flagship-visual" data-portfolio-reveal>
          <div className="screens-pair">
            {projects.aplus.images.map((screen) => (
              <Screen key={screen.src} screen={screen} />
            ))}
          </div>
          <p className="image-caption">
            Course library & offline downloads{" "}
            <span>Click a screen to explore</span>
          </p>
        </div>
      </article>
      <div className="supporting-projects">
        <article className="supporting-project">
          <div
            className="supporting-visual english-visual"
            data-portfolio-reveal
          >
            <div className="screens-pair">
              {projects.english.images.map((screen) => (
                <Screen key={screen.src} screen={screen} />
              ))}
            </div>
          </div>
          <div className="supporting-copy">
            <p className="project-category">{projects.english.platform}</p>
            <h3>{projects.english.name}</h3>
            <p className="project-tagline">{projects.english.summary}</p>
            <p className="project-description">
              {projects.english.description}
            </p>
            <ProjectLinks project={projects.english} />
            <ProjectDetails project={projects.english} />
          </div>
        </article>
        <article className="supporting-project">
          <div className="supporting-visual focus-visual" data-portfolio-reveal>
            <Screen screen={projects.focus.images[0]} desktop />
            <p className="focus-visual-note">
              A session at a time.
              <br />
              <span>A habit over time.</span>
            </p>
          </div>
          <div className="supporting-copy">
            <p className="project-category">{projects.focus.platform}</p>
            <h3>{projects.focus.name}</h3>
            <p className="project-tagline">{projects.focus.summary}</p>
            <p className="project-description">{projects.focus.description}</p>
            <ProjectLinks project={projects.focus} />
            <ProjectDetails project={projects.focus} />
          </div>
        </article>
      </div>
      <div className="more-work">
        <Image src="/icons/focus-mac.png" alt="" width={54} height={54} />
        <div>
          <h3>Small tools have a place, too.</h3>
          <p>
            Focus Session for Mac is a quiet timer that stays alongside your
            work.
          </p>
          <a
            href="https://github.com/Depthabdre/focus_session_for_mac"
            target="_blank"
            rel="noopener noreferrer"
            className="home-text-link"
          >
            View source <span aria-hidden="true">↗</span>
          </a>
        </div>
        <Link className="home-button home-button-secondary" href="/apps">
          Explore my apps <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
