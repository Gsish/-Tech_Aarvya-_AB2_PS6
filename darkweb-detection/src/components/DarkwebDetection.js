import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Search, Lock, Eye, Server, ChevronRight } from 'lucide-react';
import NavLink from './NavLink';
import FeatureCard from './FeatureCard';
import StepItem from './StepItem';

const DarkwebDetection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Real-time Thread Detection",
      description: "Identify darkweb threats as they emerge with our advanced AI-powered detection system.",
      icon: <AlertTriangle className="icon-red" />
    },
    {
      title: "Proactive Security Measures",
      description: "Stay one step ahead of threats with predictive analysis and proactive security protocols.",
      icon: <Shield className="icon-blue" />
    },
    {
      title: "Comprehensive Monitoring",
      description: "Monitor multiple darkweb channels simultaneously with our powerful scanning technology.",
      icon: <Search className="icon-purple" />
    }
  ];

  return (
    <div className="container">
      <div className="background">
        <div className="background-layer"></div>
        <div className="glossy-layer"></div>
        <div className="grid-overlay"></div>
        <div className="reflection"></div>
      </div>

      <div className="content">
        <nav className="navbar">
          <div className="nav-brand">
            <Shield className="logo-icon" />
            <h1 className="brand-name">DarkGuard</h1>
          </div>

          <div className="nav-links">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#about">About</NavLink>
          </div>

          <div className="nav-buttons">
            <button className="login-btn">Login</button>
            <button className="start-btn">Get Started</button>
          </div>
        </nav>

        <section className="hero">
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
            <div className="hero-image">
              <div className="image-overlay"></div>
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`feature-highlight ${activeFeature === index ? 'active' : ''}`}
                >
                  <div className="feature-box">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">Advanced Threat Detection Features</h2>
              <p className="section-description">
                Our platform combines cutting-edge technologies to provide comprehensive darkweb monitoring and threat detection capabilities.
              </p>
            </div>
            <div className="feature-grid">
              <FeatureCard 
                icon={<AlertTriangle className="icon-red" />}
                title="Real-time Detection"
                description="Identify emerging threats as they appear with millisecond response times."
              />
              <FeatureCard 
                icon={<Lock className="icon-green" />}
                title="End-to-End Encryption"
                description="All your data and monitoring activities are secured with enterprise-grade encryption."
              />
              <FeatureCard 
                icon={<Eye className="icon-purple" />}
                title="24/7 Monitoring"
                description="Continuous scanning across darkweb forums, marketplaces, and chat channels."
              />
              <FeatureCard 
                icon={<Server className="icon-blue" />}
                title="Cloud Infrastructure"
                description="Scalable architecture to handle any volume of monitoring requirements."
              />
              <FeatureCard 
                icon={<Shield className="icon-yellow" />}
                title="Threat Intelligence"
                description="AI-powered analysis provides actionable intelligence about potential threats."
              />
              <FeatureCard 
                icon={<Search className="icon-red" />}
                title="Custom Alerts"
                description="Configure personalized notification systems based on your security needs."
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="how-it-works-section">
          <div className="section-content">
            <div className="section-header">
              <h2 className="section-title">How DarkGuard Works</h2>
              <p className="section-description">
                Our advanced platform employs a multi-layered approach to darkweb monitoring and threat detection.
              </p>
            </div>
            <div className="steps">
              <StepItem 
                number="01"
                title="Advanced Scanning Technology"
                description="Our AI-powered crawlers navigate the darkweb continuously, accessing forums, marketplaces, and communication channels to collect data on potential threats."
              />
              <StepItem 
                number="02"
                title="Threat Analysis & Classification"
                description="Sophisticated machine learning algorithms analyze collected data to identify and classify threats based on severity, relevance, and potential impact."
              />
              <StepItem 
                number="03"
                title="Real-time Alerts & Reporting"
                description="When threats are detected, the system immediately notifies your security team through customizable alert channels and generates detailed reports."
              />
              <StepItem 
                number="04"
                title="Proactive Security Response"
                description="Our platform provides actionable recommendations to help your team respond effectively to identified threats and vulnerabilities."
              />
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Secure Your Digital Assets?</h2>
            <p className="cta-description">
              Join thousands of organizations that trust DarkGuard for their darkweb threat detection needs.
            </p>
            <div className="cta-buttons">
              <button className="cta-trial-btn">Start Your Free Trial</button>
              <button className="cta-demo-btn">Schedule a Demo</button>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="brand-container">
                  <Shield className="footer-logo" />
                  <h2 className="footer-brand-name">DarkGuard</h2>
                </div>
                <p className="footer-description">
                  Advanced darkweb threat detection and monitoring for enterprises and security teams.
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