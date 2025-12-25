import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-darkGreen text-white mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="YouMatter Logo" className="h-8 w-8" />
              <span className="text-xl font-semibold">YouMatter</span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Supporting your mental wellness journey with tools, resources, and professional guidance. 
              You're not alone in this.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/checkIn" className="text-green-100 hover:text-white transition-colors text-sm">
                  Check-in
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-green-100 hover:text-white transition-colors text-sm">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/calming" className="text-green-100 hover:text-white transition-colors text-sm">
                  Calming Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/psychartists" className="text-green-100 hover:text-white transition-colors text-sm">
                  Find Psychartists
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('my_modal_5').showModal()}
                  className="text-green-100 hover:text-white transition-colors text-sm text-left"
                >
                  Crisis Support
                </button>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors text-sm">
                  About Us
                </a>
              </li>
              <li>
                <button 
                  onClick={() => document.getElementById('psychartist_modal').showModal()}
                  className="text-green-100 hover:text-white transition-colors text-sm text-left"
                >
                  Join as Professional
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="border-t border-green-700 mt-8 pt-6">
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚨</span>
              <div>
                <h4 className="font-semibold text-red-100 mb-1">Crisis Support Available 24/7</h4>
                <p className="text-red-200 text-sm">
                  If you're experiencing a mental health emergency, please call 988 (Suicide & Crisis Lifeline) 
                  or go to your nearest emergency room.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-100 text-sm">
            © {currentYear} YouMatter. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <p className="text-green-100 text-sm">
              Made with ❤️ for mental wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;