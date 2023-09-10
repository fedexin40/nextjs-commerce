import Logout from '@mui/icons-material/Logout';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Fade from '@mui/material/Fade';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useContext } from 'react';
import { Action, TasksDispatchContext } from '../context';

export default function UserMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const dispatch = useContext(TasksDispatchContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeSession = async () => {
    await fetch('/api/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'closeSession'
      })
    });
    dispatch({ type: Action.hiddenUserLogged });
    router.refresh();
    router.push('/');
  };

  return (
    <>
      <button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Image
          className="me-3 cursor-pointer rounded-full hover:scale-110"
          src="/loginUser.png"
          alt="userProfileImage"
          width="40"
          height="40"
        />
      </button>
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <SentimentSatisfiedAltOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <ShoppingCartOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Mis pedidos
        </MenuItem>
        <MenuItem onClick={closeSession}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar sesion
        </MenuItem>
      </Menu>
    </>
  );
}
