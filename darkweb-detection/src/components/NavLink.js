import React from 'react';

const NavLink = ({ href, children }) => {
  return (
    <a href={href} className="nav-link">
      {children}
    </a>
  );
};

export default NavLink;