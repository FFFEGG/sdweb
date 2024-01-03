import React, {useState} from 'react';
import {Box} from "@mui/system";
import {Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@mui/material";
import moment from "moment";
import request from "../../utils/request";

const NoTraceTheSourceMaterialStockBookkeeping = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [time,settime] = useState({
        begintime: moment().format('YYYY-MM-DD'),
        endtime: moment().format('YYYY-MM-DD'),
    })
    const getlist = async () => {
        const rew = await request('post','/api/getInfo',{
            url: 'Srapp.Web_Material_Infos.NoTraceTheSourceMaterialStockBookkeepingInfo',
            ...time
        })
        console.log(rew);
    }
    return (
        <Box p={3} bgcolor="#fff" borderRadius={1}>
            <Typography fontSize={18}>非溯源类包装物库存记账</Typography>
            <Box mt={3} p={3} bgcolor="#f2f2f2">
                <Box display="flex" alignItems="center">
                    <TextField value={time.begintime} size="small" type="date" label="开始时间"/>
                    <TextField value={time.endtime} size="small" type="date" label="结束时间"/>
                    <Button onClick={getlist} variant="contained">搜索</Button>
                </Box>
                <Box mt={3} display="flex" alignItems="center">
                    432
                </Box>
            </Box>
        </Box>
    );
};

export default NoTraceTheSourceMaterialStockBookkeeping;
