import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t" style={{ borderColor: 'var(--border-light)' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              <Users className="w-6 h-6" style={{ color: 'var(--accent-strong)' }} />
              <span>Aumryx Teach</span>
            </Link>
            <p className="body-small mb-4">
              Where teachers build their future. A teacher-first platform helping educators reach students and earn sustainably.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/teachers" className="body-small hover:text-green-600 transition-colors">Find Teachers</Link></li>
              <li><Link to="/signup" className="body-small hover:text-green-600 transition-colors">Become a Teacher</Link></li>
              <li><Link to="/login" className="body-small hover:text-green-600 transition-colors">Student Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 body-small">
                <Mail className="w-4 h-4" />
                <span>support@aumryxteach.com</span>
              </li>
              <li className="flex items-center gap-2 body-small">
                <MessageCircle className="w-4 h-4" />
                <span>Help Center</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center" style={{ borderColor: 'var(--border-light)' }}>
          <p className="caption">
            © 2025 Aumryx Teach. All rights reserved. Built with purpose for educators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;