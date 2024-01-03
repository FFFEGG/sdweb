import React, {useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Form, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const ActiveUserNumOfPSB = () => {
    const [list,setlist] = useState([])
    const [list2,setlist2] = useState([])
    const [show,setshow] = useState(false)
    const api = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={3}>活跃用户数量</Box>
            <Form getFormApi={e=>api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async  e => {
                const rew = await  request('post','/api/getInfo',{
                    url:'Srapp.Web_Report_Business_Infos.ActiveUserNumOfPSB',
                    ...e
                })
                console.log(rew.data)
                setlist(rew.data.info)
            }}>
                {/*Srapp.Web_Report_Business_Infos.ActiveUserNumOfPSB*/}
                {/*活跃用户数量*/}
                {/*接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Report_Business_Infos.ActiveUserNumOfPSB*/}
                {/*POST*/}
                {/*接口描述：*/}

                {/*接口参数*/}
                {/*参数名字	类型	是否必须	默认值	其他	说明*/}
                {/*begintime	日期	必须			起始时间*/}
                {/*endtime	日期	必须			结束时间*/}
                <Form.Input field={'begintime'} label={'起始时间'} type={'date'}   initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'}   initValue={moment().format('YYYY-MM-DD')}/>
                <Button variant={'outlined'} type={'submit'} size={'small'}>搜索</Button>
            </Form>


            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[
                        {headerName: '门店',field:'department'},
                        {headerName: '客户换水数量',field:'num'},
                        {headerName: '活跃用户数量',field:'usernum'},
                    ]}
                    onCellClicked={async e=>{
//                         Srapp.Web_Report_Business_Infos.ActiveUserNumOfPSBDetailed
//                         活跃用户数量 明细
//                         接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Report_Business_Infos.ActiveUserNumOfPSBDetailed
//                             POST
//                         接口描述：
//
// 接口参数
//                         参数名字	类型	是否必须	默认值	其他	说明
//                         begintime	日期	必须			起始时间
//                         endtime	日期	必须			结束时间
//                         department	字符串	必须			江北店
                        console.log(e)
                        const rew = await request('post','/api/getInfo',{
                            url:'Srapp.Web_Report_Business_Infos.ActiveUserNumOfPSBDetailed',
                            begintime: api.current.getValue('begintime'),
                            endtime: api.current.getValue('endtime'),
                            department:e.data.department
                        })
                        setlist2(rew.data.info)
                        setshow(true)
                    }}
                />
            </Box>

            <Modal visible={show} onCancel={()=>setshow(false)} onOk={()=>setshow(false)} title={'明细'} size={'large'}>
                <Box height={'60vh'} overflow={'scroll'} >
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list2}
                        columnDefs={[
                            // {
                            //     "department": "朝阳店",
                            //     "memberid": "19986189537",
                            //     "address": "朝阳广西建工宿舍11栋1单元4楼左边房"
                            // }
                            {headerName: '门店',field:'department'},
                            {headerName: '客户编号',field:'memberid'},
                            {headerName: '地址',field:'address'},
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,

                        }}
                        onFirstDataRendered={params => params.api.sizeColumnsToFit()}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default ActiveUserNumOfPSB;
