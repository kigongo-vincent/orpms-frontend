import * as React from 'react';
import Box from '@mui/material/Box';
import { Gauge } from '@mui/x-charts/Gauge';
import { Container, Typography, colors } from '@mui/material';

export default function GaugeValueRangeNoSnap({approved, pending,delayed, total}) {
    
    return (
            <Box display="flex" alignItems="center" bgcolor={"#ffffff"} flexWrap={"wrap"} className="rounded px-1 px-lg-4 py-4 my-4 my-lg-0 ">
            <Box  className="d-lg-flex text-center align-items-center d-block px-0">
                <Typography>Approved</Typography>
                <Gauge width={100} height={100} value={Math.round(approved/total * 100)} text={`${Math.round(approved/total * 100)}%`}/>
            </Box>
            <Box className="d-lg-flex mx-3 text-center align-items-center d-block px-0">
                <Typography>Pending</Typography>

                <Gauge  width={100} height={100} text={`${Math.round(pending/total * 100)}%`} value={Math.round(pending/total * 100)}/>
            </Box>
            <Box className="d-lg-flex text-center align-items-center d-block px-0">
                <Typography>Late Approval</Typography>

                <Gauge width={100} height={100} text={`${Math.round(delayed/total * 100)}%`} value={Math.round(delayed/total * 100)}/>
            </Box>
        </Box>
    );
}