import Image from "next/image";
import Link from "next/link";
import { heroContent } from "@/lib/content/hero";

export function AboutSection() {
  return (
    <section
      id="about"
      className="home-section home-container about-section"
      aria-labelledby="about-title"
    >
      <span id="work" className="legacy-anchor" aria-hidden="true" />
      <div className="about-photo" data-portfolio-reveal>
        <Image
          src={heroContent.profileImage}
          alt="Abdrehim Misbah smiling"
          width={915}
          height={1623}
          sizes="(max-width: 700px) 80vw, 360px"
        />
        <p>
          Abdrehim Misbah<span>Engineer, teacher, always learning.</span>
        </p>
      </div>
      <div className="about-copy">
        <h2 id="about-title">A little about me.</h2>
        <p className="about-lead">
          I enjoy making things useful—and helping people understand them.
        </p>
        <p>
          I study software engineering at AASTU and trained at A2SV. Building
          apps gives me a way to put what I learn into practice, whether that’s
          making a lesson available offline or helping someone stay focused.
        </p>
        <p>
          Teaching is part of that, too. I mentor the 2026 GDG Flutter batch,
          help developers work through technical blockers, and share lessons
          with students on YouTube.
        </p>
        <div className="about-links">
          <a
            className="home-text-link"
            href="https://www.youtube.com/@remedialAbdre"
            target="_blank"
            rel="noopener noreferrer"
          >
            My YouTube channel <span aria-hidden="true">↗</span>
          </a>
          <Link className="home-text-link" href="/journal">
            Read my journal <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="outside-work">
          <h3>Away from the keyboard</h3>
          <p>
            You’ll find me lifting weights, reading philosophy and psychology,
            or cheering on Liverpool FC.
          </p>
        </div>
      </div>
    </section>
  );
}
