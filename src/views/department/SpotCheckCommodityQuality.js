import React, { useRef, useState } from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from "moment";
import { Button } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import request from "../../utils/request";
import initData from "../initData";
import { toast } from "react-toastify";

const test = () => {
    const [list, setList] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const api = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>商品抽检录入</Box>

            {/*<Form onSubmit={async e => {*/}
            {/*    const rew = await request('post','/api/getInfo',{*/}
            {/*        url: 'Srapp.Web_Other_Infos.test',*/}
            {/*        ...e*/}
            {/*    })*/}
            {/*    setList(rew.data)*/}

            {/*}}  layout={"horizontal"} labelPosition={"inset"}>*/}
            {/*    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />*/}
            {/*    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />*/}
            {/*    <Button type={"submit"} variant={"outlined"} size={"small"} >搜索</Button>*/}
            {/*</Form>*/}


            {/*<Box height={'60vh'} mt={3} overflow={"scroll"}>*/}
            {/*    <AgGridReact*/}
            {/*        className="ag-theme-balham"*/}
            {/*        rowData={list}*/}
            {/*        columnDefs={[*/}
            {/*            {headerName:'时间',field: 'addtime'},*/}
            {/*        ]}*/}
            {/*        defaultColDef={{*/}
            {/*            resizable: true,*/}
            {/*            sortable: true*/}
            {/*        }}*/}
            {/*        onFirstDataRendered={e=>e.api.sizeColumnsToFit()}*/}
            {/*    />*/}
            {/*</Box>*/}

            <Form getFormApi={e => api.current = e} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_WorkSafety_Handle.SpotCheckCommodityQuality',
                    ...e
                })
                if (rew.data.msg === 'SUCCESS') {
                    toast.success('录入成功')
                } else {
                    toast.error(`录入失败 ${rew.data.tips}`)
                }
                api.current.setValues('')
            }}>
                <Form.Input field={'code'} label={'识别码'} />
                <Form.Input field={'fillgunno'} label={'充装枪号'} />

                <Form.Select field={'packingtype'} label={'包装物类型'} style={{ width: '100%' }} >
                    {
                        initData.PackingtypeList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select>


                <Form.Input field={'fillafterweight'} label={'充后重量(重瓶重量)'} />
                <Form.Input field={'packingweight'} label={'包装物自重'} />

                <Button variant={"contained"} type={"submit"}>确认录入</Button>
            </Form>

        </Box>
    );
};

export default test;
