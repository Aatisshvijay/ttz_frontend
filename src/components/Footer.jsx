// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
<footer className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8" style={{ minHeight: '100px' }}>      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-8">
          {/* Branding and Copyright */}
          <div>
            <h3 className="text-2xl font-bold">TempleTravellerZ</h3>
            <p className="text-sm mt-2 opacity-90">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex space-x-4">
            {/* Email */}
            <a
              href="mailto:contact@templetravellerz.com"
              target='_blank'
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M2.5 5.5C2.5 4.67157 3.17157 4 4 4H20C20.8284 4 21.5 4.67157 21.5 5.5V18.5C21.5 19.3284 20.8284 20 20 20H4C3.17157 20 2.5 19.3284 2.5 18.5V5.5ZM4 6.09641V18.5H20V6.09641L12.062 12.8732C12.0289 12.9019 11.9711 12.9019 11.938 12.8732L4 6.09641ZM19.9238 5.5H4.0762L12 12.3551L19.9238 5.5Z" />
              </svg>
            </a>
            
            {/* X (Twitter) */}
            <a
              href="https://x.com/temple88220"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.693l-5.243-6.825-6.001 6.825H1.58l7.73-8.793L1.084 2.25h6.843l4.727 6.231 5.59-6.231z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/templetravellerz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm4.25 3.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.5-.88a1.13 1.13 0 1 1-2.26 0 1.13 1.13 0 0 1 2.26 0z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UCcG7TANYhl4LPUknIWXrpdg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M23.498 6.186a2.97 2.97 0 0 0-2.09-2.103C19.64 3.5 12 3.5 12 3.5s-7.64 0-9.408.583a2.97 2.97 0 0 0-2.09 2.103C0 7.963 0 12 0 12s0 4.037.502 5.814a2.97 2.97 0 0 0 2.09 2.103C4.36 20.5 12 20.5 12 20.5s7.64 0 9.408-.583a2.97 2.97 0 0 0 2.09-2.103C24 16.037 24 12 24 12s0-4.037-.502-5.814zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;