import React from 'react';

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

export default function Card({ children, className = '', as: Component = 'div', ...props }) {
  return React.createElement(
    Component,
    { className: joinClasses('surface-panel rounded-lg', className), ...props },
    children,
  );
}
