import React from 'react';
import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">About</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/team" className="text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Meet Our Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          {/* Legal section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Legal</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          {/* Resources section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a href="https://github.com/indiehub/fsociety-ai" target="_blank" rel="noopener noreferrer" 
                   className="text-base text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 group">
                  <Github className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
          {/* Company section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Company</h3>
            <p className="text-base text-gray-300">
              © 2025 Indie Hub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;