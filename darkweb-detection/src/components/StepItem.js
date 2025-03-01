import React from 'react';

const StepItem = ({ number, title, description }) => {
  return (
    <div className="step-item">
      <div className="step-number-container">
        <div className="step-number">{number}</div>
      </div>
      <div className="step-content">
        <h3 className="step-title">{title}</h3>
        <p className="step-description">{description}</p>
      </div>
    </div>
  );
};

export default StepItem;