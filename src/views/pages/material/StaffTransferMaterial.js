import React from 'react';
import {Box, TextField} from "@mui/material";

const StaffTransferMaterial = () => {
    const x = () => {

    }
    return (
        <Box padding={3} bgcolor="#FFF">
            StaffTransferMaterial 物资调入调出
            <Box width="30vw">
                <TextField label="钢瓶码" fullWidth />
            </Box>

        </Box>
    );
};

export default StaffTransferMaterial;