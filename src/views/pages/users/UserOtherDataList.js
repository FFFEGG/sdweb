import React from 'react';
import {Box} from "@mui/system";
import {Form, Image, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../../utils/request";
import {AgGridReact} from "ag-grid-react";

const UserOtherDataList = () => {
    const [list,setList] = React.useState([])
    return (
        <div>
            <Box p={3} borderRadius={1}>
                <Box fontSize={18} mb={2}>获取用户其它数据列表</Box>
                <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=>{
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_User_Infos.UserOtherDataList',
                        ...e
                    })
                    setList(rew.data)
                }}>
                    {/*begintime	日期	必须			录入开始时间*/}
                    {/*endtime	日期	必须			录入结束时间*/}
                    {/*type	枚举类型	必须		范围：全部/供气合同	用户资料类型*/}
                    <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                    <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                    <Form.Select field={'type'} initValue={'全部'} label={'用户资料类型'} style={{width: 300}}>
                        <Form.Select.Option value={'全部'}>全部</Form.Select.Option>
                        <Form.Select.Option value={'供气合同'}>供气合同</Form.Select.Option>
                    </Form.Select>
                    <Form.Input field={'memberid'} label={'会员号'}/>
                    <Button variant={'contained'} type={'submit'}>搜索</Button>
                </Form>


                <Box mt={3} overflow={'scroll'} height={'60vh'}>
                    <AgGridReact
                        className={'ag-theme-balham'}
                        rowData={list}
                        columnDefs={[
                            // {
                            //     "id": "5",
                            //     "addtime": "2023-11-17 09:04:13.853",
                            //     "type": "供气合同",
                            //     "begintime": "2023-11-17",
                            //     "endtime": "2025-11-16",
                            //     "memberid": "165888",
                            //     "name": "雷兆春",
                            //     "workplace": "三燃",
                            //     "customertype": "家庭用户",
                            //     "attributiondepartment": "商用气开发二部",
                            //     "salesman": "admin",
                            //     "remarks": "拍照测试",
                            //     "imglist": [
                            //         "1028459",
                            //         "1028470"
                            //     ],
                            //     "department": "信息中心",
                            //     "operator": "邓洪武",
                            //     "canceltime": null,
                            //     "canceldepartment": null,
                            //     "canceloperator": null,
                            //     "cancelremarks": null,
                            //     "state": "正常"
                            // }
                            {field: 'id', headerName: 'ID', hide: true},
                            {field: 'addtime', headerName: '新增时间'},
                            {field: 'type', headerName: '用户资料类型'},
                            {field: 'begintime', headerName: '开始时间'},
                            {field: 'endtime', headerName: '结束时间'},
                            {field: 'memberid', headerName: '会员号'},
                            {field: 'name', headerName: '姓名'},
                            {field: 'workplace', headerName: '单位'},
                            {field: 'customertype', headerName: '用户类型'},
                            {field: 'attributiondepartment', headerName: '归属部门'},
                            {field: 'salesman', headerName: '业务员'},
                            {field: 'remarks', headerName: '备注'},
                            {field: 'imglist',pinned:'right', headerName: '图片列表',cellRendererFramework: ({data}) => <Button
                                    onClick={async ()=>{
                                        const rew = await request('post', '/api/getInfo', {
                                            url: 'Srapp.Action.GetImgList',
                                            id: JSON.stringify(data.imglist)
                                        })
                                            // [
                                            // {
                                            //     "imgurl": "https://nnsrosstest.oss-rg-china-mainland.aliyuncs.com/4DCBD3B226B939556A51DB1655E0225A.jpg",
                                            //     "imgtype": "用户资料",
                                            //     "id": "1028459"
                                            // },
                                            //     {
                                            //         "imgurl": "https://nnsrosstest.oss-rg-china-mainland.aliyuncs.com/56B80BA307C7D8BFE20979C77A7252B3.jpg",
                                            //         "imgtype": "用户资料",
                                            //         "id": "1028470"
                                            //     }
                                            // ]

                                        let str = ''
                                        Modal.info({
                                            title: '图片列表',
                                            content: <div>
                                                {rew.data.map(item => {
                                                    return <Image src={item.imgurl}
                                                                  width={300}
                                                                  height={450}/>
                                                })}
                                            </div>,
                                            onOk: () => {
                                            },

                                        })

                                    }}


                                >点击查看</Button>

                                },
                            {field: 'department', headerName: '部门'},
                            {field: 'operator', headerName: '操作员'},
                            {field: 'canceltime', headerName: '取消时间'},
                            {field: 'canceldepartment', headerName: '取消部门'},
                            {field: 'canceloperator', headerName: '取消操作员'},
                            {field: 'cancelremarks', headerName: '取消备注'},
                            {field: 'state', headerName: '状态'},
                            {headerName: '操作',pinned:'right',cellRendererFramework: ({data}) => <Button
                                onClick={async ()=>{
//                                     Srapp.Web_User_EditInfo.CancelUserOtherData
//                                     取消用户其它资料
//                                     接口地址：http://113.16.193.82:8203/?s=Srapp.Web_User_EditInfo.CancelUserOtherData
//                                         POST
//                                     接口描述：
//
// 接口参数
//                                     参数名字	类型	是否必须	默认值	其他	说明
//                                     id	整型	必须			记录ID
//                                     userid	整型	必须			userid
//                                     remarks	字符串	可选		最大：75	备注
                                    Modal.confirm({
                                        title: '确认取消',
                                        content: <div>
                                            <div>取消时间：{moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                                            <div>取消部门：{localStorage.getItem('department')}</div>
                                            <div>取消操作员：{localStorage.getItem('username')}</div>
                                            <div>取消备注：<input id={'remarks'} style={{width: 300}}/></div>
                                        </div>,
                                        onOk: async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_User_EditInfo.CancelUserOtherData',
                                                id: data.id,
                                                userid: data.userid,
                                                remarks: document.getElementById('remarks').value
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                Modal.success({
                                                    title: '取消成功'
                                                })
                                            } else {
                                                Modal.error({
                                                    title: '取消失败'
                                                })
                                            }
                                        },
                                    })
                                }}


                                >取消</Button>}
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }}
                        onFirstDataRendered={(params) => {
                            params.api.sizeColumnsToFit();
                        }}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default UserOtherDataList;
