import { socialLinks } from "@/lib/content/hero";

export function FooterSection() {
  return (
    <footer id="contact" className="home-footer">
      <div className="home-container">
        <div className="contact-layout">
          <div>
            <h2>
              Have something
              <br />
              in mind?
            </h2>
            <p>
              A role, a project, or just a conversation.
              <br />
              I’d be glad to hear from you.
            </p>
          </div>
          <a className="contact-email" href="mailto:abdrehimmisbah@gmail.com">
            abdrehimmisbah@gmail.com <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-bottom">
          <a href="#hero" className="footer-name">
            Abdrehim Misbah
          </a>
          <div className="footer-socials">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
