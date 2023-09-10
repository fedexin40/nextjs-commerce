'use client';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import { MenuItem } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import { styled } from '@mui/material/styles';
import { Category, Collection } from 'lib/types';
import Link from 'next/link';
import * as React from 'react';
import { useEffect, useRef } from 'react';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

export default function CategoryMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const categories = useRef<Category[]>();
  const collections = useRef<Collection[]>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function testing() {
    console.log('siii');
  }

  useEffect(() => {
    const getcategories = async () => {
      let response = await fetch('/api/categories', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      categories.current = data.categories;
    };
    const getcollections = async () => {
      let response = await fetch('/api/collections', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      collections.current = data.collections;
    };
    getcategories();
    getcollections();
  }, []);

  return (
    <div>
      <button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <div className="flex-cols flex space-x-2">
          <FilterAltOutlinedIcon />
          <div>Categorias</div>
        </div>
      </button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        className="border-double border-pink-400"
      >
        <MenuItem
          dense
          onClick={testing}
          component={Link}
          href="/search"
          className="flex w-full items-center rounded-md px-2 py-2 text-left font-sans text-sm font-medium tracking-wide text-gray-900 hover:bg-violet-500 hover:text-white"
        >
          Todas las categorias
        </MenuItem>
        {categories
          ? categories.current?.map((item) => (
              <MenuItem
                dense
                component={Link}
                href={item.path}
                className="flex w-full items-center rounded-md px-2 py-2 text-left font-sans text-sm font-medium tracking-wide text-gray-900 hover:bg-violet-500 hover:text-white"
              >
                {item.title}
              </MenuItem>
            ))
          : null}
        {collections
          ? collections.current?.map((item) => (
              <MenuItem
                dense
                component={Link}
                href={item.path}
                className="flex w-full items-center rounded-md px-2 py-2 text-left font-sans text-sm font-medium tracking-wide text-gray-900 hover:bg-violet-500 hover:text-white"
              >
                {item.title}
              </MenuItem>
            ))
          : null}
      </Menu>
    </div>
  );
}
