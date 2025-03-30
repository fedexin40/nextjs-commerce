'use client';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';

export default function AlertOxxo() {
  const [open, setOpen] = useState(true);
  const closeMessage = () => setOpen(false);
  return (
    <>
      <div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={open}
          autoHideDuration={10000}
          onClose={closeMessage}
        >
          <Alert onClose={closeMessage} severity="error" variant="filled" sx={{ width: '100%' }}>
            Los pagos con Oxxo pueden llegar a tardar hasta 48 horas en verse reflejados
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}
