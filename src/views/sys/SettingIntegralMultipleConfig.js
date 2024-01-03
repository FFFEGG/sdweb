import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Form, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import request from "../../utils/request";
import {toast} from "react-toastify";

const SettingIntegralMultipleConfig = () => {
    const [list,setList] = React.useState([])
    const [show,setShow] = React.useState(false)
    const api = useRef()
        const initData = JSON.parse(localStorage.getItem('initData'))
            const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    return (
        <Box p={3} bgcolor={'white'} borderRadius={1}>
            <Box>积分倍数配置</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url: 'Srapp.Web_SystemInfo.IntegralMultipleConfigList',
                    ...e
                })
                setList(rew.data.info)

            }}>
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                <Button size={'small'}  type={'submit'} variant={'contained'}>查询</Button>
                <Button sx={{ml:2}} onClick={()=>setShow(true)} size={'small'} variant={'contained'}>添加</Button>
            </Form>
            <Modal title={'积分倍数配置'} visible={show} onCancel={()=>setShow(false)} onOk={async ()=> {
                api.current.submitForm()
            }}>
                <Form initValues={{
                    id: 0,
                    action: 'ADD'
                }} getFormApi={e=>api.current = e}   onSubmit={async e=> {
                    console.log(e)
                    // name	字符串	必须		最大：75	积分翻倍配置名称
                    // multiple	整型	可选	0		积分倍数(设置签到时，该值为签到总积分)
                    // goodsid	整型	必须			商品ID，0为全部商品,-1为签到
                    // remarks	字符串	可选			备注
                    // starttime	日期	必须			方案生效开始日期
                    // endtime	日期	必须			方案生效结束日期
                    // state	枚举类型	必须		范围：正常/取消	状态（正常,取消）
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_SystemSetting.SettingIntegralMultipleConfig',
                        ...e
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                        setShow(false)
                        api.current.reset()
                    } else {
                        toast.error('操作失败' + rew.data.tips)
                    }



                }}>

                    <Form.Input field={'name'} label={'名称'} />
                    <Form.Input field={'multiple'} initValue={1} label={'倍数'} />
                    <Form.Select field={'goodsid'} label={'商品'} filter style={{width: '100%'}} >
                        {
                            initData.GoodsList.map(item=>{
                                return <Form.Select.Option key={item.id} value={item.id}>{item.name}</Form.Select.Option>
                            })
                        }
                        <Form.Select.Option key={-1} value={-1}>签到</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field={'remarks'} label={'备注'} />
                    <Form.Input field={'starttime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')} />
                    <Form.Select field={'state'} label={'状态'} filter style={{width: '100%'}} >
                        <Form.Select.Option key={0} value={'正常'}>正常</Form.Select.Option>
                        <Form.Select.Option key={1} value={'取消'}>取消</Form.Select.Option>
                    </Form.Select>
                </Form>
            </Modal>

            <Box mt={3} overflow={'scroll'} height={'60vh'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "id": "1",
                        //     "companyid": "101",
                        //     "name": "测试活动",
                        //     "goodsid": "2",
                        //     "multiple": "1",
                        //     "remarks": "1",
                        //     "starttime": "2023-12-25 00:00:00.000",
                        //     "endtime": "2023-12-25 00:00:00.000",
                        //     "state": "正常",
                        //     "goodsname": "12KG液化气"
                        // }
                        {field: 'name', headerName: '名称', flex: 1},
                        {field: 'goodsname', headerName: '商品', flex: 1},
                        {field: 'multiple', headerName: '倍数', flex: 1},
                        {field: 'remarks', headerName: '备注', flex: 1},
                        {field: 'starttime', headerName: '开始时间', flex: 1},
                        {field: 'endtime', headerName: '结束时间', flex: 1},
                        {field: 'state', headerName: '状态', flex: 1},
                        {
                            field: 'action', headerName: '操作', pinned: 'right', flex: 1, cellRendererFramework: params => {
                                return <Button size={'small'}
                                    onClick={()=>{
                                        setShow(true)
                                        setTimeout(()=>{
                                            api.current.setValues(params.data)
                                            //格式化时间
                                            api.current.setValue('starttime',moment(params.data.starttime).format('YYYY-MM-DD'))
                                            api.current.setValue('endtime',moment(params.data.endtime).format('YYYY-MM-DD'))
                                            api.current.setValue('action','UPDATE')
                                            api.current.setValue('id',params.data.id)

                                        }
                                        ,100)
                                    }}

                                >编辑</Button>
                            }
                        }

                    ]}
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

export default SettingIntegralMultipleConfig;
