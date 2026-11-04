import Image from "next/image";
import { heroContent } from "@/lib/content/hero";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="home-hero home-container"
      aria-labelledby="intro-title"
    >
      <div className="hero-intro">
        <div className="intro-person">
          <Image
            src={heroContent.profileImage}
            alt=""
            width={44}
            height={44}
            className="intro-avatar"
          />
          <p>
            Hello, I’m Abdrehim.<span>{heroContent.subtitle}</span>
          </p>
        </div>
        <h1 id="intro-title">
          {heroContent.headline[0]}
          <br />
          {heroContent.headline[1]}
        </h1>
        <p className="hero-description">
          {heroContent.intro}
        </p>
        <div className="home-actions">
          <a className="home-button" href={heroContent.primaryCta.href}>
            {heroContent.primaryCta.label} <span aria-hidden="true">↓</span>
          </a>
          <a
            className="home-text-link"
            href={heroContent.secondaryCta.href}
            download
          >
            Download CV <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="hero-footnote">
          React, Flutter & Node.js <span aria-hidden="true">/</span> A2SV graduate
        </p>
      </div>
      <figure className="hero-product">
        <div className="hero-product-heading">
          <span>A+ Tutorial Class</span>
          <span>Built for learning</span>
        </div>
        <div className="hero-phone">
          <Image
            src="/APlus/NewCoursePage.jpg"
            alt="A+ Tutorial Class course library with psychology, physics, and other university subjects"
            width={1080}
            height={2350}
            sizes="(max-width: 600px) 190px, 230px"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <figcaption>
          <span>Real courses. Ready for offline study.</span>
          <a
            href="#project-aplus"
            aria-label="Explore project: A+ Tutorial Class"
          >
            Explore project <span aria-hidden="true">↗</span>
          </a>
        </figcaption>
      </figure>
    </section>
  );
}
