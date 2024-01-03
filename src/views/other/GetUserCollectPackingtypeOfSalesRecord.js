import React from 'react';
import {Box} from "@mui/system";
import {Form} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const GetUserCollectPackingtypeOfSalesRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setlist] = React.useState([])
    return (
        <div>
            <Box p={3} bgcolor={'#fff'} borderRadius={1}>
                <Box fontSize={18} mb={2}>
                    获取用户办理带入方式包装物销售记录
                </Box>
                <Form labelPosition={'inset'} layout={"horizontal"} onSubmit={async e => {
                    {/*Srapp.Web_Other_Infos.GetUserCollectPackingtypeOfSalesRecord*/}
                    {/*获取用户办理带入方式包装物销售记录*/}
                    {/*接口地址：http://113.16.193.82:8203/?s=Srapp.Web_Other_Infos.GetUserCollectPackingtypeOfSalesRecord*/}
                    {/*POST*/}
                    {/*接口描述：*/}

                    {/*接口参数*/}
                    {/*参数名字	类型	是否必须	默认值	其他	说明*/}
                    {/*begintime	日期	必须			开始时间*/}
                    {/*endtime	日期	必须			结束时间*/}
                    {/*memberid	字符串	必须			会员号*/}
                    {/*department	字符串	可选			涉及部门(不传默认全部) JSON ["二区店","二桥店"]*/}
                    const rew = await  request('post','/api/getInfo',{
                        url:'Srapp.Web_Other_Infos.GetUserCollectPackingtypeOfSalesRecord',
                        ...e,
                        department:JSON.stringify(e.department)
                    })
                    setlist(rew.data.info)
                    console.log(rew);
                }}>

                    <Form.Input field={'begintime'} label={'开始时间'} placeholder={'请输入开始时间'} type={'date'}
                                initValue={moment().format('YYYY-MM-DD')}/>
                    <Form.Input field={'endtime'} label={'结束时间'} placeholder={'请输入结束时间'} type={'date'}
                                initValue={moment().format('YYYY-MM-DD')}/>
                    <Form.Input rules={[{required: true,message: '必填'}]} field={'memberid'} label={'会员号'} placeholder={'请输入会员号'}/>
                    <Form.Select style={{width: 300}} maxTagCount={1} multiple filter field={'department'} label={'涉及部门'} placeholder={'请选择涉及部门'}
                                 >
                        {
                            initData?.DepartmentList?.map((item, index) => {
                                    return <Form.Select.Option key={index} value={item.name}>{item.label}</Form.Select.Option>
                                }
                            )
                        }
                    </Form.Select>
                    <Box>
                        <Button type={'submit'} variant={'outlined'} size={'small'}>搜索</Button>
                    </Box>
                </Form>


                <Box height={'60vh'} mt={2} overflow={'scroll'}>
                    <AgGridReact
                        className={'ag-theme-balham'}
                        rowData={list}
                        defaultColDef={{
                            flex: 1,
                            minWidth: 100,
                            resizable: true,
                            sortable: true,
                            floatingFilter: true,
                            filter: 'agTextColumnFilter'
                        }}
                        columnDefs={[
                            {headerName: '会员号', field: 'memberid'},
                        ]}
                    />
                </Box>
            </Box>

        </div>
    );
};

export default GetUserCollectPackingtypeOfSalesRecord;