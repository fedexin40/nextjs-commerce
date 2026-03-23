'use client';

import { Accordion, AccordionBody, AccordionHeader } from '@material-tailwind/react';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import { useState } from 'react';

export function CartMobile({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(0);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <>
      <Accordion
        className="pb-5"
        open={open === 1}
        placeholder={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <AccordionHeader
          onClick={() => handleOpen(1)}
          className="text-[13.5px] font-normal tracking-[1.4px]"
          placeholder={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex flex-row">
            <div>Resumen de la compra</div>
            {open == 0 ? <KeyboardArrowDownSharpIcon /> : <KeyboardArrowUpSharpIcon />}
          </div>
        </AccordionHeader>
        <AccordionBody>{children}</AccordionBody>
      </Accordion>
    </>
  );
}
