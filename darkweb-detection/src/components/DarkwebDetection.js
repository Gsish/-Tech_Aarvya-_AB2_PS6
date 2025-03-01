import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Search, Lock, Eye, Server, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavLink from './NavLink';
import FeatureCard from './FeatureCard';
import StepItem from './StepItem';

const DarkwebDetection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
  const [isHowItWorksVisible, setIsHowItWorksVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 1000); // Fast cycling (1s)
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'features') {
            setIsFeaturesVisible(entry.isIntersecting);
          } else if (entry.target.id === 'how-it-works') {
            setIsHowItWorksVisible(entry.isIntersecting);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    const featuresSection = document.getElementById('features');
    const howItWorksSection = document.getElementById('how-it-works');
    if (featuresSection) observer.observe(featuresSection);
    if (howItWorksSection) observer.observe(howItWorksSection);

    return () => {
      if (featuresSection) observer.unobserve(featuresSection);
      if (howItWorksSection) observer.unobserve(howItWorksSection);
    };
  }, []);

  const features = [
    {
      title: "Real-time Threat Detection",
      description: "Identify darkweb threats as they emerge with our advanced AI-powered detection system.",
      icon: <AlertTriangle className="icon-white" />
    },
    {
      title: "Proactive Security Measures",
      description: "Stay ahead of threats with predictive analysis and proactive security protocols.",
      icon: <Shield className="icon-white" />
    },
    {
      title: "Comprehensive Monitoring",
      description: "Monitor multiple darkweb channels simultaneously with our powerful scanning technology.",
      icon: <Search className="icon-white" />
    }
  ];

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" }
    })
  };

  const stepItemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="container">
      <div className="background">
        <div className="background-layer"></div>
        <div className="glossy-layer"></div>
        <div className="grid-overlay"></div>
        <div className="reflection"></div>
        <svg className="cyber-grid" width="100%" height="100%">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="10%" cy="20%" r="5" fill="rgba(255, 255, 255, 0.3)" className="node node-1" />
          <circle cx="80%" cy="30%" r="5" fill="rgba(255, 255, 255, 0.3)" className="node node-2" />
          <circle cx="40%" cy="70%" r="5" fill="rgba(255, 255, 255, 0.3)" className="node node-3" />
          <line x1="10%" y1="20%" x2="80%" y2="30%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" className="line line-1" />
          <line x1="80%" y1="30%" x2="40%" y2="70%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" className="line line-2" />
          <line x1="40%" y1="70%" x2="10%" y2="20%" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" className="line line-3" />
        </svg>
      </div>

      <div className="content">
        <nav className="navbar highlighted-component navbar-component">
          <div className="nav-container">
            <div className="nav-brand">
              <Shield className="logo-icon" />
              <h1 className="brand-name">DarkGuard</h1>
            </div>
            <div className="nav-right">
              <div className="nav-links">
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#how-it-works">How It Works</NavLink>
              </div>
              <div className="nav-buttons">
                <button className="login-btn">Login</button>
                <button className="start-btn">Get Started</button>
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
                  <ChevronRight className="btn-icon" />
                </button>
                <button className="demo-btn">Watch Demo</button>
              </div>
            </div>
            <motion.div 
              className="hero-image"
              initial={{ boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
              animate={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)" }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
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
            </motion.div>
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
                { icon: <AlertTriangle className="icon-white" />, title: "Real-time Detection", description: "Identify emerging threats with millisecond response times." },
                { icon: <Lock className="icon-white" />, title: "End-to-End Encryption", description: "Secure your data with enterprise-grade encryption." },
                { icon: <Eye className="icon-white" />, title: "24/7 Monitoring", description: "Continuous scanning across darkweb forums and channels." },
                { icon: <Server className="icon-white" />, title: "Cloud Infrastructure", description: "Scalable architecture for all monitoring needs." },
                { icon: <Shield className="icon-white" />, title: "Threat Intelligence", description: "AI-powered analysis for actionable insights." },
                { icon: <Search className="icon-white" />, title: "Custom Alerts", description: "Personalized notifications based on your security needs." }
              ].map((card, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate={isFeaturesVisible ? "visible" : "hidden"}
                  variants={featureCardVariants}
                >
                  <FeatureCard 
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                  />
                </motion.div>
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
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate={isHowItWorksVisible ? "visible" : "hidden"}
                  variants={stepItemVariants}
                >
                  <StepItem 
                    number={step.number}
                    title={step.title}
                    description={step.description}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer highlighted-component footer-component">
          <div className="footer-content">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brand-container">
                  <Shield className="footer-logo" />
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