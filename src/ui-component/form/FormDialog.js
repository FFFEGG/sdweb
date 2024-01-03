import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open,handleClose,children}) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>数据提交</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    );
}