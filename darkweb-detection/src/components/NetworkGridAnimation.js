// src/components/NetworkGridAnimation.js
import React from 'react';
import { motion } from 'framer-motion';

const NetworkGridAnimation = ({ isDarkTheme }) => {
  const gridVariants = {
    animate: {
      transition: {
        staggerChildren: 0.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  const nodeVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.5, 1, 0.5],
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const lineVariants = {
    animate: {
      strokeDashoffset: [0, -20, 0],
      transition: { duration: 3, ease: "linear" }
    }
  };

  return (
    <motion.svg className="network-grid-animation" width="100%" height="100%" variants={gridVariants} animate="animate">
      {/* Grid Lines */}
      <motion.line
        x1="10%"
        y1="20%"
        x2="90%"
        y2="20%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="10 10"
        variants={lineVariants}
      />
      <motion.line
        x1="10%"
        y1="50%"
        x2="90%"
        y2="50%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="10 10"
        variants={lineVariants}
      />
      <motion.line
        x1="10%"
        y1="80%"
        x2="90%"
        y2="80%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="10 10"
        variants={lineVariants}
      />
      <motion.line
        x1="20%"
        y1="10%"
        x2="20%"
        y2="90%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="10 10"
        variants={lineVariants}
      />
      <motion.line
        x1="50%"
        y1="10%"
        x2="50%"
        y2="90%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="10 10"
        variants={lineVariants}
      />
      <motion.line
        x1="80%"
        y1="10%"
        x2="80%"
        y2="90%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="10 10"
        variants={lineVariants}
      />

      {/* Nodes */}
      <motion.circle
        cx="20%"
        cy="20%"
        r="5"
        fill={isDarkTheme ? "#FFFFFF" : "#333333"}
        opacity="0.5"
        variants={nodeVariants}
      />
      <motion.circle
        cx="50%"
        cy="50%"
        r="5"
        fill={isDarkTheme ? "#FFFFFF" : "#333333"}
        opacity="0.5"
        variants={nodeVariants}
      />
      <motion.circle
        cx="80%"
        cy="80%"
        r="5"
        fill={isDarkTheme ? "#FFFFFF" : "#333333"}
        opacity="0.5"
        variants={nodeVariants}
      />

      {/* Connecting Lines */}
      <motion.line
        x1="20%"
        y1="20%"
        x2="50%"
        y2="50%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="5 5"
        variants={lineVariants}
      />
      <motion.line
        x1="50%"
        y1="50%"
        x2="80%"
        y2="80%"
        stroke={isDarkTheme ? "#FFFFFF" : "#333333"}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="5 5"
        variants={lineVariants}
      />
    </motion.svg>
  );
};

export default NetworkGridAnimation;