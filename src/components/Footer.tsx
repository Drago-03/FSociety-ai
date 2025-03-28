import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Settings, User, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 animate-gradient bg-[length:200%_200%] text-white py-4 px-4 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6">
            <Link to="/team" className="text-sm text-gray-300 hover:text-white transition-colors">
              Meet Our Team
            </Link>
            <Link to="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">© 2025 Indie Hub</span>
            <a href="https://github.com/Drago-03/FSociety-ai" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-gray-300 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;