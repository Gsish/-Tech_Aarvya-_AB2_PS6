import React, { useState, useEffect } from 'react';
import { FaSun, FaShieldAlt, FaSearch, FaLock, FaEye, FaServer, FaAngleRight, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NavLink from './NavLink';
import FeatureCard from './FeatureCard';
import StepItem from './StepItem';
import NetworkGridAnimation from './NetworkGridAnimation';
import CyberObjectsAnimation from './CyberObjectsAnimation';

const DarkwebDetection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const features = [
    {
      title: "Real-time Threat Detection",
      description: "Identify darkweb threats as they emerge with our advanced AI-powered detection system.",
      icon: <FaExclamationTriangle className="icon" />
    },
    {
      title: "Proactive Security Measures",
      description: "Stay ahead of threats with predictive analysis and proactive security protocols.",
      icon: <FaShieldAlt className="icon" />
    },
    {
      title: "Comprehensive Monitoring",
      description: "Monitor multiple darkweb channels simultaneously with our powerful scanning technology.",
      icon: <FaSearch className="icon" />
    }
  ];

  return (
    <div className={`container ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      <div className="background">
        {isDarkTheme && (
          <>
            <div className="background-layer"></div>
            <div className="glossy-layer"></div>
            <div className="grid-overlay"></div>
            <div className="reflection"></div>
          </>
        )}
      </div>
      <NetworkGridAnimation isDarkTheme={isDarkTheme} />
      <CyberObjectsAnimation isDarkTheme={isDarkTheme} />
      <div className="content">
        <nav className="navbar highlighted-component navbar-component">
          <div className="nav-container">
            <div className="nav-brand">
              <FaShieldAlt className="logo-icon" />
              <h1 className="brand-name">DarkGuard</h1>
            </div>
            <div className="nav-right">
              <div className="nav-links">
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#how-it-works">How It Works</NavLink>
                <NavLink href="#about-us">About Us</NavLink>
              </div>
              <div className="nav-buttons">
                <button className="login-btn">Login</button>
                <button className="start-btn">Get Started</button>
                <button className="theme-toggle-btn" onClick={toggleTheme}>
                  <FaSun />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <section className="hero highlighted-component hero-component">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Detect and Monitor <span className="highlight">Darkweb Threats</span> in Real-Time
              </h1>
              <p className="hero-description">
                Our advanced AI platform scans the darkweb to identify threats before they become breaches, protecting your digital assets 24/7.
              </p>
              <div className="hero-buttons">
                <button className="trial-btn">
                  <span>Start Free Trial</span>
                  <FaAngleRight className="btn-icon" />
                </button>
                <button className="demo-btn">Watch Demo</button>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-overlay"></div>
              <AnimatePresence>
                {features.map((feature, index) => (
                  <motion.div 
                    key={index}
                    className={`feature-highlight ${activeFeature === index ? 'active' : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeFeature === index ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="feature-box">
                      <div className="feature-icon">{feature.icon}</div>
                      <h3 className="feature-title">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section id="features" className="features-section highlighted-component features-component">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Advanced Threat Detection Features</h2>
              <p className="section-description">
                Our platform combines cutting-edge technologies to provide comprehensive darkweb monitoring and threat detection capabilities.
              </p>
            </div>
            <div className="feature-grid">
              {[
                { icon: <FaExclamationTriangle className="icon" />, title: "Real-time Detection", description: "Identify emerging threats with millisecond response times." },
                { icon: <FaLock className="icon" />, title: "End-to-End Encryption", description: "Secure your data with enterprise-grade encryption." },
                { icon: <FaEye className="icon" />, title: "24/7 Monitoring", description: "Continuous scanning across darkweb forums and channels." },
                { icon: <FaServer className="icon" />, title: "Cloud Infrastructure", description: "Scalable architecture for all monitoring needs." },
                { icon: <FaShieldAlt className="icon" />, title: "Threat Intelligence", description: "AI-powered analysis for actionable insights." },
                { icon: <FaSearch className="icon" />, title: "Custom Alerts", description: "Personalized notifications based on your security needs." }
              ].map((card, index) => (
                <FeatureCard 
                  key={index}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works-section highlighted-component how-it-works-component">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">How DarkGuard Works</h2>
              <p className="section-description">
                Our platform employs a multi-layered approach to darkweb monitoring and threat detection.
              </p>
            </div>
            <div className="steps">
              {[
                { number: "01", title: "Advanced Scanning", description: "AI-powered crawlers continuously navigate the darkweb to collect threat data." },
                { number: "02", title: "Threat Analysis", description: "Machine learning algorithms classify threats based on severity and impact." },
                { number: "03", title: "Real-time Alerts", description: "Instant notifications and detailed reports for detected threats." },
                { number: "04", title: "Proactive Response", description: "Actionable recommendations to mitigate identified threats." }
              ].map((step, index) => (
                <StepItem 
                  key={index}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about-us" className="about-us-section highlighted-component about-us-component">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">About Us</h2>
              <p className="section-description">
                Learn more about DarkGuard and our mission to secure the digital world.
              </p>
            </div>
            <div className="about-us-content">
              <p>
                DarkGuard is a cutting-edge cybersecurity platform developed by a team of experts dedicated to protecting enterprises from the ever-evolving threats of the dark web. Launched in 2025, our project leverages advanced artificial intelligence and machine learning algorithms to provide real-time threat detection, comprehensive monitoring, and proactive security measures.
              </p>
              <p>
                Our mission is to safeguard your digital assets by identifying and mitigating risks before they escalate into breaches. With a robust cloud infrastructure and end-to-end encryption, DarkGuard ensures unparalleled security and scalability. We continuously scan darkweb forums, marketplaces, and hidden networks to deliver actionable threat intelligence and custom alerts tailored to your organization's needs.
              </p>
              <p>
                Backed by years of research and a passion for innovation, DarkGuard stands at the forefront of cybersecurity, empowering businesses to stay ahead of cybercriminals. Our team comprises industry veterans, data scientists, and security analysts committed to excellence and customer success.
              </p>
            </div>
          </div>
        </section>

        <footer className="footer highlighted-component footer-component">
          <div className="footer-content">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brand-container">
                  <FaShieldAlt className="footer-logo" />
                  <h2 className="footer-brand-name">DarkGuard</h2>
                </div>
                <p className="footer-description">
                  Advanced darkweb threat detection and monitoring for enterprises.
                </p>
              </div>
              <div>
                <h3 className="footer-section-title">Product</h3>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Features</a></li>
                  <li><a href="#" className="footer-link">Pricing</a></li>
                  <li><a href="#" className="footer-link">Case Studies</a></li>
                  <li><a href="#" className="footer-link">Documentation</a></li>
                </ul>
              </div>
              <div>
                <h3 className="footer-section-title">Company</h3>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">About Us</a></li>
                  <li><a href="#" className="footer-link">Careers</a></li>
                  <li><a href="#" className="footer-link">Blog</a></li>
                  <li><a href="#" className="footer-link">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="footer-section-title">Legal</h3>
                <ul className="footer-links">
                  <li><a href="#" className="footer-link">Privacy Policy</a></li>
                  <li><a href="#" className="footer-link">Terms of Service</a></li>
                  <li><a href="#" className="footer-link">Security</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2025 DarkGuard Technologies. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DarkwebDetection;