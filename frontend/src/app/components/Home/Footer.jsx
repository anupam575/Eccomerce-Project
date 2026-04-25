"use client";

import { Facebook, Instagram, Twitter, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 px-6 md:px-16">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Company Info */}
        <div>
          <h6 className="mb-4 font-semibold text-lg">Company</h6>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:text-gray-300 transition">About Us</a></li>
            <li><a href="/contact" className="hover:text-gray-300 transition">Contact Us</a></li>
            <li><a href="/careers" className="hover:text-gray-300 transition">Careers</a></li>
            <li><a href="/blog" className="hover:text-gray-300 transition">Blog</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h6 className="mb-4 font-semibold text-lg">Customer Service</h6>
          <ul className="space-y-2">
            <li><a href="/faq" className="hover:text-gray-300 transition">FAQs</a></li>
            <li><a href="/returns" className="hover:text-gray-300 transition">Return Policy</a></li>
            <li><a href="/shipping" className="hover:text-gray-300 transition">Shipping Info</a></li>
            <li><a href="/track" className="hover:text-gray-300 transition">Track Order</a></li>
            <li><a href="/payments" className="hover:text-gray-300 transition">Payment Methods</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h6 className="mb-4 font-semibold text-lg">Quick Links</h6>
          <ul className="space-y-2">
            <li><a href="/men" className="hover:text-gray-300 transition">Men</a></li>
            <li><a href="/women" className="hover:text-gray-300 transition">Women</a></li>
            <li><a href="/kids" className="hover:text-gray-300 transition">Kids</a></li>
            <li><a href="/sale" className="hover:text-gray-300 transition">Sale</a></li>
            <li><a href="/new" className="hover:text-gray-300 transition">New Arrivals</a></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h6 className="mb-4 font-semibold text-lg">Subscribe</h6>
          <p className="mb-3 text-gray-300 text-sm">Get latest offers & updates</p>

          {/* Subscribe Form */}
          <form className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded-md px-3 py-2 w-full sm:flex-1"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md font-medium w-full sm:w-auto sm:ml-auto"
            >
              Subscribe
            </button>
          </form>

          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            <Facebook className="cursor-pointer hover:text-blue-500 transition" />
            <Instagram className="cursor-pointer hover:text-pink-500 transition" />
            <Twitter className="cursor-pointer hover:text-blue-400 transition" />
            <YouTube className="cursor-pointer hover:text-red-600 transition" />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center">
        <p className="text-sm text-gray-400">© 2025 Mahakalbhakt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
