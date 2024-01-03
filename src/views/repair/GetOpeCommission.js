import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {toast} from "react-toastify";

const GetOpeCommission = () => {
    const [list, setList] = React.useState([])
    const api = useRef()
    const [key, setKeys] = React.useState([])
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取员工维修配件提成</Box>
            <Form getFormApi={e => api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_RepairParts_Infos.GetOpeCommission',
                    ...e
                })
                setList(rew.data)
                let keys = new Set();
                rew.data.forEach(item => {
                    Object.keys(item).forEach(key => {
                        keys.add(key);
                    });
                });

                let keysArray = Array.from(keys);

                setKeys(keysArray);
            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'}
                            initValue={moment().format('YYYY-MM-DD')}/>
                <Button size={'small'} type={'submit'} variant={'contained'}>查询</Button>

            </Form>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={
                        // {
                        //     "counterparty": "李东刚",
                        //     "铝塑管[num]": 133,
                        //     "铝塑管[commission]": 0,
                        //     "胶管[num]": 73.5,
                        //     "胶管[commission]": 0,
                        //     "机械手[num]": 7,
                        //     "机械手[commission]": 0,
                        //     "报警器[num]": 12,
                        //     "报警器[commission]": 0
                        // }
                        key.map(item =>
                            ({
                                headerName: item === 'counterparty' ? '员工' : item.replace('[num]', '[数量]').replace('[commission]', '[提成]'),
                                field: item,
                                flex: 1
                            }))

                    }
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetOpeCommission;
