import React, {Component, useEffect, useState} from 'react';
import {
    Autocomplete,
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab,
    TextField,
    Typography
} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import {TabContext, TabList, TabPanel} from "@mui/lab";
import moment from "moment";
import {Popconfirm} from '@douyinfe/semi-ui';

const ConfirmSaleOrderRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const [type, settype] = useState('全部')
    const [list, setlist] = useState([])
    const [date, setdate] = useState(moment(new Date()).format('YYYY-MM-DD'))
    const [days, setdays] = useState(1)
    const [settlementmethod, setsettlementmethod] = useState('月结')
    const [department, setdepartment] = useState(initData.DepartmentList.map(item => item.name))
    const [attributiondepartment, setattributiondepartment] = useState(initData.DepartmentList.map(item => item.name))
    const getlist = async (url) => {
        // toast('dsads')
        const rew = request('post', '/api/getInfo', {
            url,
            settlementmethod,
            department: JSON.stringify(department),
            attributiondepartment: JSON.stringify(attributiondepartment),
            type,
            date,
            days

        })
        console.log(rew)
    }
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box alignItems="center" justifyItems="center" p={3} bgcolor={String('#FFF')}>


            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="超期销售欠款记录" value="1"/>
                        <Tab label="销售欠款记录" value="2"/>
                        <Tab label="余气记录" value="3"/>
                        <Tab label="未确认回款记录(不含月结欠款)" value="4"/>
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Box display="flex" flexWrap="wrap">

                        <Autocomplete
                            multiple
                            size="small"
                            limitTags={1}
                            id="department"
                            value={department}
                            onChange={(_, data) => setdepartment(data)}
                            options={initData.DepartmentList.map(item => item.name)}
                            sx={{mr: 1, mb: 1, width: 300}}
                            renderInput={(params) => <TextField  {...params} label="配送部门"/>}
                        />


                        <Autocomplete
                            multiple
                            size="small"
                            limitTags={1}
                            id="attributiondepartment"
                            value={attributiondepartment}
                            onChange={(_, data) => setattributiondepartment(data)}
                            options={initData.DepartmentList.map(item => item.name)}
                            sx={{mr: 1, mb: 1, width: 300}}
                            renderInput={(params) => <TextField  {...params} label="用户归属部门"/>}
                        />
                        <FormControl size="small" sx={{mr: 1, mb: 1}}>
                            <InputLabel>欠款方式</InputLabel>
                            <Select value={settlementmethod} onChange={data => setsettlementmethod(data.target.value)}
                                    label="欠款方式">
                                <MenuItem value="月结">月结</MenuItem>
                                <MenuItem value="现结">现结</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{mr: 1, mb: 1}}>
                            <InputLabel>属性</InputLabel>
                            <Select value={type}
                                    onChange={data => settype(data.target.value)}
                                    label="属性">
                                <MenuItem value="全部">全部</MenuItem>
                                <MenuItem value="已回款">已回款</MenuItem>
                                <MenuItem value="未回款">未回款</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField value={date} onChange={data => setdate(data.target.value)} type="date" size="small"
                                   sx={{mr: 1, mb: 1}} InputLabelProps={{shrink: true}}
                                   label="核定基准时间"/>
                        <TextField value={days} onChange={data => setdays(data.target.value)} type="number" size="small"
                                   sx={{mr: 1, mb: 1}} InputLabelProps={{shrink: true}}
                                   label="超期天数"/>
                        <Box>

                            <Button variant="contained"
                                    onClick={() => getlist('Srapp.Web_Report_Business_Infos.OverdueSalesArrearsRecord')}>搜索</Button>


                        </Box>
                    </Box>

                    <Box height={String('30vh')} mt={1}>
                        <AgGridReact
                            reactUi={Boolean(true)}
                            localeText={tanslations}
                            className="ag-theme-balham"
                            rowData={list}
                        />
                    </Box>

                </TabPanel>
                <TabPanel value="2">销售欠款记录</TabPanel>
                <TabPanel value="3">余气记录</TabPanel>
                <TabPanel value="4">未确认回款记录(不含月结欠款)</TabPanel>
            </TabContext>


        </Box>
    )
}

export default ConfirmSaleOrderRecord;
