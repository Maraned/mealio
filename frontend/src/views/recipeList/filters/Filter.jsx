import './filters.css';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaAngleDown } from 'react-icons/fa';
import cc from 'classcat';

export default function Filter({
  Icon,
  title,
  children,
}) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="boxDivider" />

      <div className="filter__section flex vcenter wrap">
        <div className="clickable" onClick={() => setOpen(!open)}>
          <h4 className="flex vcenter margin--bottom--small">
            <Icon className="margin--right" />
            {title}
            <FaAngleDown className={cc(['rotateable margin--left--small', {
              'rotate': open
            }])} />
          </h4>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="fullWidth"
              layoutTransition
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100%' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
