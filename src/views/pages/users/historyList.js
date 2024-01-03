import React from 'react';
import { Box, Button, Typography } from "@mui/material";

const HistoryList = ({ setdepartment, settel, transactiondetails }) => {
    console.log('===> HistoryList', transactiondetails)
    return (
        <Box variant="outlined" sx={{ p: 1, height: '100%', border: '1px #babfc7 solid' }}>
            <Typography fontWeight="bold" fontSize={18} marginBottom={1}>最近下单记录</Typography>
            <Box maxHeight={205} overflow="hidden" sx={{ overflowY: "scroll" }}>
                {
                    transactiondetails
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((item, index) =>
                        <Box key={index} display="flex" borderBottom="#ccc 1px dashed" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography fontWeight="bold" marginRight={2}>{item.date}</Typography>
                                <Typography fontWeight="bold">[{item.mode}]  {item.goodsname}X {item.num} (<span onClick={() => settel(item.telephone)} >{item.telephone}</span>)</Typography>
                            </Box>

                            <Button onClick={() => setdepartment(item.department)} fontWeight="bold">{item.department}</Button>
                        </Box>)
                }
            </Box>
        </Box>
    );
};

export default HistoryList;
