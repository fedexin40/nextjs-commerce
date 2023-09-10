'use client';

import FilterListIcon from '@mui/icons-material/FilterList';
import { MenuItem } from '@mui/material';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { ListItem } from '.';

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function generateLink(item: any) {
    const href =
      item.slug && item.slug.length
        ? createUrl(pathname, new URLSearchParams({ sort: item.slug }))
        : pathname;
    return href;
  }

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
          <FilterListIcon />
          <div>Ordernar</div>
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
        {list.map((item) => (
          <MenuItem
            dense
            component={Link}
            onClick={handleClose}
            href={generateLink(item)}
            className="flex w-full items-center rounded-md px-2 py-2 text-left font-sans text-sm font-medium tracking-wide text-gray-900 hover:bg-violet-500 hover:text-white"
          >
            {item.title}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
