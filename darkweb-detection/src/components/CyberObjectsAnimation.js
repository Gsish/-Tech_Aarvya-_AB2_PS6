// src/components/CyberObjectsAnimation.js
import React from 'react';
import { motion } from 'framer-motion';

const CyberObjectsAnimation = ({ isDarkTheme }) => {
  const objectVariants = {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const moveVariants = {
    animate: {
      x: ["-20%", "20%", "-20%"],
      y: ["-20%", "20%", "-20%"],
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.svg className="cyber-objects-animation" width="100%" height="100%">
      {/* Padlock */}
      <motion.g
        variants={moveVariants}
        animate="animate"
        initial={{ x: "10%", y: "20%" }}
      >
        <motion.path
          d="M12 2C9.24 2 7 4.24 7 7v3H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3v3H9V7c0-1.66 1.34-3 3-3zm-1 8h2v4h-2v-4z"
          fill={isDarkTheme ? "#FFFFFF" : "#333333"}
          opacity="0.4"
          variants={objectVariants}
        />
      </motion.g>

      {/* Shield */}
      <motion.g
        variants={moveVariants}
        animate="animate"
        initial={{ x: "70%", y: "30%" }}
      >
        <motion.path
          d="M12 2L4 6v8c0 5.55 8 10 8 10s8-4.45 8-10V6l-8-4zm0 2.83l4.93 2.47c-.34 4.02-4.93 7.7-4.93 7.7s-4.59-3.68-4.93-7.7L12 4.83z"
          fill={isDarkTheme ? "#FFFFFF" : "#333333"}
          opacity="0.4"
          variants={objectVariants}
        />
      </motion.g>

      {/* Eye */}
      <motion.g
        variants={moveVariants}
        animate="animate"
        initial={{ x: "40%", y: "70%" }}
      >
        <motion.path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 13C8.13 17.5 5 15.31 3.55 12 5 8.69 8.13 6.5 12 6.5s7 2.19 8.45 5.5C19 15.31 15.87 17.5 12 17.5zm0-11c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
          fill={isDarkTheme ? "#FFFFFF" : "#333333"}
          opacity="0.4"
          variants={objectVariants}
        />
      </motion.g>
    </motion.svg>
  );
};

export default CyberObjectsAnimation;