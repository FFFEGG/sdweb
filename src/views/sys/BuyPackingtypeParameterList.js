import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import { Tabs, TabPane, Modal, Form } from '@douyinfe/semi-ui';
import moment from "moment";
import request from 'utils/request';
import { AgGridReact } from 'ag-grid-react';
import CylinderPriceTable from "../comments/CylinderPriceTable";


const BuyPackingtypeParameterList = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [show, setshow] = useState(false)
    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.BuyPackingtypeParameterList'
        })
        setList(rew.data.info[0]?.detailed || [])

    }, [])

    return (
        <Box bgcolor={'#FFF'} p={3} borderRadius={1}>

            {
                list.length && <CylinderPriceTable list={list} />
            }
        </Box>
    );
};

export default BuyPackingtypeParameterList;
