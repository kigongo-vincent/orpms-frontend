import {useState} from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Button, Typography, colors } from '@mui/material';

export default function DateCalendarFormProps({date}) {


  
  return (
    <LocalizationProvider  dateAdapter={AdapterDayjs}>
    
     
      <Typography className='text-success'>Deadline for submission</Typography>
          <DateCalendar value={dayjs(date)}  readOnly />
    </LocalizationProvider>
  );
}