import React from 'react';

const FeatureCard = ({ icon, title, description, animationClass }) => {
  return (
    <div className={`feature-card ${animationClass}`}>
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default FeatureCard;