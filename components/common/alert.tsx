import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Slide, { SlideProps } from '@mui/material/Slide';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type AlertColor = 'success' | 'info' | 'warning' | 'error';
type handleClose = (event: React.SyntheticEvent<any> | Event, reason: SnackbarCloseReason) => void;
type SnackbarCloseReason = 'timeout' | 'clickaway' | 'escapeKeyDown';
type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionDown(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

export default function AlertMessage({
  severity,
  open,
  handleClose,
  message
}: {
  severity: AlertColor;
  open: boolean;
  handleClose: handleClose;
  message: string;
}) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      TransitionComponent={TransitionDown}
      autoHideDuration={5000}
      onClose={handleClose}
    >
      <Alert severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
