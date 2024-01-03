import React, {useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Form, Modal} from "@douyinfe/semi-ui";
import moment from "moment";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";

const KfzxServiceOrderCompletionStatistics = () => {
        const initData = JSON.parse(localStorage.getItem('initData'))
            const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list,setlist] = useState([])
    const [list2,setlist2] = useState([])
    const [show,setshow] = useState(false)
    const api = useRef()
    return (
        <Box>
            <Box fontSize={18} mb={3}>客服中心服务订单完成统计</Box>
            <Form getFormApi={e=>api.current = e} layout={'horizontal'} labelPosition={'inset'} onSubmit={async e=> {
                const rew = await request('post','/api/getInfo',{
                    url:'Srapp.Web_Report_Manage_Infos.KfzxServiceOrderCompletionStatistics',
                    ...e,
                    state: JSON.stringify(e.state),
                    serviceope: JSON.stringify(e.serviceope),
                })
                // console.log(rew.data
                rew.data.info.forEach(item=>{
                    item.安全检查 = item.安全检查 || 0
                    item.灶具维修 = item.灶具维修 || 0
                    item.热水器维修 = item.热水器维修 || 0
                    item.安装 = item.安装 || 0
                    item.预算 = item.预算 || 0
                    item.热水器整改 = item.热水器整改 || 0
                    item.验收 = item.验收 || 0
                    item.钢瓶维修 = item.钢瓶维修 || 0
                    item.报警器维修 = item.报警器维修 || 0
                    item.其他派工 = item.其他派工 || 0

                    item.合计 = item.安全检查 + item.灶具维修 + item.热水器维修 + item.安装 + item.预算 + item.热水器整改 + item.验收 + item.钢瓶维修 + item.报警器维修 + item.其他派工
                })
                rew.data.info.push({
                    serviceope: '合计',
                    安全检查: rew.data.info.reduce((a,b)=>a+b.安全检查,0),
                    灶具维修: rew.data.info.reduce((a,b)=>a+b.灶具维修,0),
                    热水器维修: rew.data.info.reduce((a,b)=>a+b.热水器维修,0),
                    安装: rew.data.info.reduce((a,b)=>a+b.安装,0),
                    预算: rew.data.info.reduce((a,b)=>a+b.预算,0),
                    热水器整改: rew.data.info.reduce((a,b)=>a+b.热水器整改,0),
                    验收: rew.data.info.reduce((a,b)=>a+b.验收,0),
                    钢瓶维修: rew.data.info.reduce((a,b)=>a+b.钢瓶维修,0),
                    报警器维修: rew.data.info.reduce((a,b)=>a+b.报警器维修,0),
                    其他派工: rew.data.info.reduce((a,b)=>a+b.其他派工,0),
                    合计: rew.data.info.reduce((a,b)=>a+b.合计,0),
                })

                setlist(rew.data.info)
            }}>
                {/*begintime	日期	必须			起始时间*/}
                {/*endtime	日期	必须			结束时间*/}
                {/*state	字符串	可选			状态 JSON ["正常","取消","撤销","已安排","已接单","已完成","已汇总"]*/}
                {/*serviceope	字符串	可选			服务人员(默认全部) JSON ["张三","李四"]*/}
                <Form.Input field={'begintime'} label={'开始时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Input field={'endtime'} label={'结束时间'} type={'date'} initValue={moment().format('YYYY-MM-DD')}/>
                <Form.Select field={'state'} filter multiple maxTagCount={1} label={'状态'} style={{width:200}}>
                    <Form.Select.Option value={'正常'}>正常</Form.Select.Option>
                    <Form.Select.Option value={'取消'}>取消</Form.Select.Option>
                    <Form.Select.Option value={'撤销'}>撤销</Form.Select.Option>
                    <Form.Select.Option value={'已安排'}>已安排</Form.Select.Option>
                    <Form.Select.Option value={'已接单'}>已接单</Form.Select.Option>
                    <Form.Select.Option value={'已完成'}>已完成</Form.Select.Option>
                    <Form.Select.Option value={'已汇总'}>已汇总</Form.Select.Option>
                </Form.Select>
                <Form.Select field={'serviceope'} filter multiple maxTagCount={1} label={'服务人员'} style={{width:200}}>
                    {
                        initData.OperatorList.filter(item=>item.department == loginuser.login_department).map(item=><Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }
                </Form.Select>
                <Button variant={'contained'} size={'small'} type={'submit'}>查询</Button>

            </Form>

            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[

                        // 安全检查	灶具维修	热水器维修	安装	预算	热水器整改	验收	钢瓶维修	报警器维修	其他派工
                        {field: 'serviceope', headerName: '服务人员', },
                        {field: '安全检查', headerName: '安全检查', },
                        {field: '灶具维修', headerName: '灶具维修', },
                        {field: '热水器维修', headerName: '热水器维修', },
                        {field: '安装', headerName: '安装', },
                        {field: '预算', headerName: '预算', },
                        {field: '热水器整改', headerName: '热水器整改', },
                        {field: '验收', headerName: '验收', },
                        {field: '钢瓶维修', headerName: '钢瓶维修', },
                        {field: '报警器维修', headerName: '报警器维修', },
                        {field: '其他派工', headerName: '其他派工', },
                        {field: '合计', headerName: '合计', },





                    ]}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        flex:1
                    }}
                    onCellDoubleClicked={async (e)=>{
                        console.log(e)
                        // begintime	日期	必须			起始时间
                        // endtime	日期	必须			结束时间
                        // state	字符串	可选			状态 JSON ["正常","取消","撤销","已安排","已接单","已完成","已汇总"]
                        // serviceope	字符串	可选			服务人员(默认全部) JSON ["张三","李四"]
                        // project	字符串	必须			项目
                        const rew = await request('post','/api/getInfo',{
                            url: 'Srapp.Web_Report_Manage_Infos.KfzxServiceOrderCompletionStatisticsOfDetails',
                            begintime: api.current.getValue('begintime'),
                            endtime: api.current.getValue('endtime'),
                            state: JSON.stringify(api.current.getValue('state')),
                            serviceope: JSON.stringify([e.data.serviceope]),
                            project: e.colDef.headerName,
                        })
                        setlist2(rew.data.info)
                        setshow(true)
                    }}
                />
            </Box>
            <Modal title={'详情'} visible={show} footer={<></>} size={'large'} onCancel={()=>setshow(false)}>
                <Box height={'60vh'} overflow={'scroll'} >
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list2}
                        columnDefs={[
                            // {
                            //     "addtime": "2023-10-08 11:46:58.263",
                            //     "memberid": "199842",
                            //     "telephone": "13978847119",
                            //     "address": "民主路33号劳教2栋2单元3楼左房",
                            //     "servicetype": "安装",
                            //     "complete_remarks": "",
                            //     "complete_detailed": "",
                            //     "complete_state": null
                            // }
                            {field: 'addtime', headerName: '订单时间', },
                            {field: 'memberid', headerName: '会员号', },

                            {field: 'telephone', headerName: '电话', },
                            {field: 'address', headerName: '地址', },
                            {field: 'servicetype', headerName: '服务类型', },
                            {field: 'complete_remarks', headerName: '完成备注', },
                            {field: 'complete_detailed', headerName: '完成详情', },
                            {field: 'complete_state', headerName: '完成状态', },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }   }
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default KfzxServiceOrderCompletionStatistics;
