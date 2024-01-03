// ActionButton.js
import { Box, Button } from '@mui/material';
import React from 'react';


const ActionButton = ({ data, navigate }) => (
    <Box>
        <Button
            onClick={() => {
                navigate('/material/MaterialTransferPlanRecord?department=' + data.department)
            }}
            size="small"
            variant="text"
        >
            安排
        </Button>
    </Box>
);

export default ActionButton;
