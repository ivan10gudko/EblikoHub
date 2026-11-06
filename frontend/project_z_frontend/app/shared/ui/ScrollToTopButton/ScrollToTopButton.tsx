import React, { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface ScrollToTopProps {
  threshold?: number;
}

export const ScrollToTopButton: React.FC<ScrollToTopProps> = ({ threshold = 300 }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setOpen(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={open}>
      <Fab
        size="large"
        aria-label="scroll back to top"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: { xs: 64, sm: 64 },
          right: { xs: 32, sm: 64 },
          zIndex: 9999,

          width: { xs: '44px', sm: '56px' },
          height: { xs: '44px', sm: '56px' },
          minHeight: { xs: '44px', sm: '56px' },

          backgroundColor: 'var(--primary)',
          color: 'var(--background)',

          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border)',

          '&:hover': {
            backgroundColor: 'var(--primary-hover)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          transition: 'all 0.15s ease-in-out',
        }}
      >
        <KeyboardArrowUpIcon sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }} />
      </Fab>
    </Zoom>
  );
};