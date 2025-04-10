import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faFacebook, faXTwitter, faLinkedin, faDiscord, faYoutube, faTiktok, faInstagram }  from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom';
import LanguageDropdown from '../language-selector/LanguageDropdown';

const socialIcons = [
  { icon: faFacebook, url: 'https://www.facebook.com/' },
  { icon: faXTwitter, url: 'https://www.x.com/' },
  { icon: faLinkedin, url: 'https://www.linkedin.com/' },
  { icon: faDiscord, url: 'https://www.discord.com/' },
  { icon: faYoutube, url: 'https://www.youtube.com/' },
  { icon: faTiktok, url: 'https://www.tiktok.com/' },
  { icon: faInstagram, url: 'https://www.instagram.com/' }
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="text-white bg-[#0f0f0f] pt-20 pb-8 px-8 lg:px-32">
      {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <div className="flex flex-col gap-4">
          <div className="font-bold text-xl">COMPANY</div>
          <div className="font-bold text-gray-400 flex flex-col gap-4">
            <div>About Us</div>
            <div>Careers</div>
            <div>Contact Us</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-xl">PRODUCTS</div>
          <div className="font-bold text-gray-400 flex flex-col gap-4">
            <div>Tools</div>
            <div>Product Changelog</div>
            <div>Feature Request</div>
            <div>Frags Captions</div>
            <div>How does Frags work</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-xl">RESOURCES</div>
          <div className="font-bold text-gray-400 flex flex-col gap-4">
            <div>Customer Stories</div>
            <div>Blogs</div>
            <div>Become an Affiliate</div>
            <div>Frags Media Assets</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-xl">SUPPORT</div>
          <div className="font-bold text-gray-400 flex flex-col gap-4">
            <div>Help Center</div>
            <div>Customer Support</div>
            <div>2025 Ultimate Guide</div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="font-bold text-xl">LEGAL</div>
          <div className="font-bold text-gray-400 flex flex-col gap-4">
            <div>Terms and Conditions</div>
            <div>Privacy Policy</div>
            <div>Cookie Preferences</div>
            <div>Accessbility Statement</div>
            <div>Trust Center</div>
          </div>
        </div>
      </div>
      <div className="my-8 w-full border-b border-gray-400 border-2"></div>
      <div className="flex flex-col lg:flex-row justify-start lg:justify-between w-full items-center gap-5">
        <div className="font-bold text-lg lg:text-xl">
          <p>&copy; {currentYear} Frags AI by Frags Inc. All rights reserved.</p>
        </div>
        <div className="flex gap-5 flex-wrap justify-center mb-3">
            {socialIcons.map((icon) => (
              <a href={icon.url} target="_blank" rel="noopener noreferrer" className='bg-[#181818] p-3 rounded-xl w-14 h-14 flex items-center justify-center hover:bg-[#232323] transition duration-250 shadow-xs shadow-gray-700'>
                <FontAwesomeIcon icon={icon.icon} size="lg" className=""></FontAwesomeIcon>
              </a>
            ))}
        </div>
      </div> */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-16">
        <div className="flex flex-col gap-8">
          <Link to="/">
              <img src="../assets/frags_logo.svg" alt="Frags Logo" className=""/>
          </Link>
          <div className="text-[#A0AABA]">Free all-in-one video editor for everyone to create anything anywhere. Contact us at: support@frags.com</div>
          <LanguageDropdown />
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex font-bold text-lg">Product</div>
          <div className="text-[#A0AABA] flex flex-col gap-2">
            <div>Tools</div>
            <div>Product Changelog</div>
            <div>Feature Request</div>
            <div>Frags Captions</div>
            <div>How does Frags work</div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex font-bold text-lg">Create</div>
          <div className="text-[#A0AABA] flex flex-col gap-2">
            <div>Customer stories</div>
            <div>Blogs</div>
            <div>Frags media assets</div>
            <div>Creator Terms of Service</div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex font-bold text-lg">Resources</div>
          <div className="text-[#A0AABA] flex flex-col gap-2">
            <div>Affiliate Marketing</div>
            <div>Help Center</div>
            <div>Customer Support</div>
            <div>2025 Ultimate Guide</div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="flex font-bold text-lg">Legal and Regulation</div>
          <div className="text-[#A0AABA] flex flex-col gap-2">
            <div>Terms of Service</div>
            <div>Privacy Center</div>
            <div>Privacy Policy</div>
            <div>Cookies Policy</div>
            <div>License Agreement</div>
            <div>Community Guidelines</div>
          </div>
        </div>
      </div>
      <div className="flex gap-5 mt-8">
        {/* {socialIcons.map((icon) => (
          <a href={icon.url} target="_blank" rel="noopener noreferrer" className='bg-[#181818] p-3 rounded-xl w-14 h-14 flex items-center justify-center hover:bg-[#232323] transition duration-250 shadow-xs shadow-gray-700'>
            <FontAwesomeIcon icon={icon.icon} size="lg" className=""></FontAwesomeIcon>
          </a>
        ))} */}
        <div className='flex-1 flex gap-4 justify-center lg:justify-start'>
          {socialIcons.map((icon) => (
            <a href={icon.url} target="_blank" rel="noopener noreferrer" className='flex items-center justify-center'>
              <FontAwesomeIcon icon={icon.icon} size="xl" className=""></FontAwesomeIcon>
            </a>
          ))}
        </div>
      </div>
      {/* <div className='text-[#A0AABA] mt-32 flex gap-4 flex-wrap justify-between'>
        <div>Terms of Service</div>
        <div>Prviacy Center</div>
        <div>Privacy Policy</div>
        <div>Cookies Policy</div>
        <div>License Agreement</div>
        <div>Creator Terms of Service</div>
        <div>Community Guidelines</div>
      </div> */}
      
    </footer>
  )
}

export default Footer;