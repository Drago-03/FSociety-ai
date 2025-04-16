import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    { to: "/team", label: "Meet Our Team" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <footer 
      className={`
        relative mt-auto py-4 px-4
        bg-gradient-to-r from-primary-deep via-primary-light/90 to-primary-deep
        animate-gradient bg-[length:200%_200%] text-neutral-light
      `}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-4 md:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-neutral-light/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Copyright and Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-light/80">© 2025 Indie Hub</span>
            <a
              href="https://github.com/Drago-03/FSociety-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-light/80 hover:text-white transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;