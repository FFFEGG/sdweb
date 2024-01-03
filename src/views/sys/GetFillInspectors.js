import React from 'react';
import {Box} from "@mui/system";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {toast} from "react-toastify";
import {AgGridReact} from "ag-grid-react";
import {Form, Modal} from "@douyinfe/semi-ui";

const GetFillInspectors = () => {
    const [list, setList] = React.useState([])
    const [show, setshow] = React.useState(false)
    return (
        <Box p={3} borderRadius={1}>
            <Box fontSize={18} mb={3}>获取充装检查人员</Box>

            <Button variant={'outlined'} sx={{mr:2}} onClick={async ()=>{
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_Other_Infos.GetFillInspectors'
                })
                setList(rew.data)
            }}>获取</Button>
            <Button variant={'outlined'} onClick={async ()=>{

                setshow(true)
            }}>设置</Button>
            <Modal title="设置充装检查人员" visible={show} onCancel={()=>setshow(false)} footer={<></>}>
                <Form onSubmit={async e=> {
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_Other_Handle.SettingFillInspectors',
                        ...e
                    })
                    console.log(rew);
                    if (rew.data.msg == 'SUCCESS') {
                        toast.success('设置成功')
                        setshow(false)
                    } else {
                        toast.error('设置失败' + rew.data.tips)
                    }
                }}>
                    {/*<Form.Select field={'packingtype'} label={'瓶型'} style={{width: 300}}>*/}
                    {/*    <Form.Select.Option value={'YSP118型钢瓶'}>YSP118型钢瓶</Form.Select.Option>*/}
                    {/*    <Form.Select.Option value={'其它规格'}>其它规格</Form.Select.Option>*/}
                    {/*</Form.Select> */}

                    <Form.Select field={'mode'} label={'检查类型'} style={{width: 300}}>
                        <Form.Select.Option value={'气瓶充前检查'}>气瓶充前检查</Form.Select.Option>
                        <Form.Select.Option value={'气瓶充后检查'}>气瓶充后检查</Form.Select.Option>
                    </Form.Select>
                    <Form.Select field={'inspectors'} label={'检查人员姓名'} style={{width: 300}}>
                        {
                            ['覃廷渭','黄东','唐桂宁','何军宁','甘海龙','张亚保','杨仁昆','黄广平',
                            '黄彩色','黄月莲','梁桂莲','李剑作','卢宝娟','蒙广洋','黄伟安','梁月莲',
                            '李文柳','苏有华','覃凤娟','梁爱雄','杨绍享','陈显芝','杨绍精','蒙世发'].map((item,index)=>{
                                return <Form.Select.Option key={index} value={item}>{item}</Form.Select.Option>
                            })
                        }
                    </Form.Select>
                    <Button variant={'contained'} type={'submit'}>确认</Button>
                </Form>
            </Modal>
            <Box height={'60vh'} overflow={'auto'} mt={2}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "companyid": "101",
                        //     "packingtype": "YSP118型钢瓶",
                        //     "name": "001",
                        //     "updatetime": "2023-10-20"
                        // }
                        {field: 'companyid', headerName: '公司ID'},
                        // {field: 'packingtype', headerName: '瓶型'},
                        {field: 'mode', headerName: '检查类型'},
                        {field: 'name', headerName: '检查人员姓名'},
                        {field: 'updatetime', headerName: '更新时间'},

                    ]}
                    defaultColDef={{
                        flex: 1,
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

export default GetFillInspectors;
