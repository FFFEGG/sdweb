import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { set, useForm } from "react-hook-form";
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';

import moment from "moment";
import request from "../../../utils/request";
import tanslations from '../../../utils/translations.json'
import { ArrayField, CheckboxGroup, Form, Image, Input, Modal, Popconfirm, Select, Button as Buttons } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import myprint from 'utils/myprint';

const OtherServicesOrderListKFZX = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: moment(new Date()).format('YYYY-MM-DD'),
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })
    const [list, setlist] = useState([])
    const [wxlist, setwxlist] = useState([])

    const getlist = async (data) => {
        if (loginuser.login_department !== '预约中心') {
            data.department = JSON.stringify([loginuser.login_department])
        }


        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_OtherServices_Infos.OtherServicesOrderList',
            ...data,
            state: JSON.stringify(["正常", "已安排", "已接单", "已完成", "取消", "已汇总"]),
        })
        setlist(rew.data)
        // console.log(rew)
    }

    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef('')

    const [rowdata, setRowdata] = useState('')
    const [serviceopeid, setsServiceopeid] = useState('')
    const [open, setopen] = useState(false)
    const [imgOpen, setImgOpen] = useState(false)
    const [imgurlList, setImgurl] = useState([])
    const remarksdata = useRef('')
    const gridApi = useRef('')
    const [rowlist, setRowlist] = useState([])

    const [keywork, setKeywork] = useState('')
    const [gastype, settype] = useState('')
    const [printtype, setPrinttype] = useState(['打印机打印'])
    useEffect(() => {
        gridApi.current.api.setQuickFilter(
            keywork
        );
    }, [keywork])

    useEffect(async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.RepairPartsList'
        })
        setwxlist(rew.data.info.filter(item=>item.state == '正常'))
    }, [])
    const [RepairPartsTypeList, seRepairPartsTypeList] = React.useState([])
    useEffect(async ()=>{
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.RepairPartsTypeList'
        })
        seRepairPartsTypeList(rew.data.info)
    },[])
    const [repairitem, setRepairitem] = useState('')
    const [reqairnum, setReqairnum] = useState(1)
    const [reqairList, setReqairList] = useState([])

    return (
        <Box>

            <Box fontSize={18} mb={2}>客服中心门店业务</Box>
            <Box display="flex" alignItems="center">

                <Form getFormApi={e => api.current = e} labelPosition="inset" layout="horizontal" onSubmit={async e => {
                    if (loginuser.login_department !== '预约中心') {
                        e.department = JSON.stringify([loginuser.login_department, '客服中心'])
                    }

                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_OtherServices_Infos.OtherServicesOrderList',
                        ...e,
                        state: JSON.stringify(["正常", "已安排", "已接单", "已完成", "取消", "已汇总"]),
                    })
                    setlist(rew.data)
                }}>
                    <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} field='begintime' label='开始时间' />
                    <Form.Input type="date" initValue={moment().format('YYYY-MM-DD')} field='endtime' label='结束时间' />
                    <Form.Input field='serial' label='单据号' />
                    <Button type="submit" size="small" variant="contained">搜索</Button>

                </Form>
            </Box>
            <Box height="60vh" overflow="scroll" marginTop={2}>
                <AgGridReact
                    className="ag-theme-balham"
                    reactUi="true"
                    rowData={list}
                    rowSelection="multiple"
                    ref={gridApi}
                    localeText={tanslations}
                    defaultColDef={{
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                        // flex: 1
                    }}
                    onSelectionChanged={(data) => {
                        // console.log(data.api.getSelectedRows())
                        setRowlist(data.api.getSelectedRows())
                    }}

                    getRowStyle={params => {
                        if (params.data && params.data.state === '已安排') {
                            return { color: "red" }
                        }
                        if (params.data && params.data.state === '已完成') {
                            return { color: "blue" }
                        }

                        if (params.data && params.data.state === '已汇总') {
                            return { color: "purple" }
                        }

                        if (params.data && params.data.state === '已接单') {
                            return { color: "green" }
                        }

                        if (params.data && params.data.state === '取消') {
                            return { color: "pink" }
                        }
                        return { color: "black" }
                    }}
                    isRowSelectable={data => data.data.state === '正常'}
                    columnDefs={[
                        { field: 'serial', headerName: '单据号' },
                        {
                            field: 'addtime',
                            headerName: '下单时间',
                            enableRowGroup: true,
                            valueGetter: data => moment(data?.data?.addtime).format('YYYY-MM-DD HH:mm:ss'),
                            checkboxSelection: true,
                            headerCheckboxSelection: true,
                        },
                        {
                            field: 'appointmenttime',
                            headerName: '上门时间',
                            enableRowGroup: true,
                            valueGetter: data => moment(data?.data?.appointmenttime).format('YYYY-MM-DD HH:mm:ss')
                        },
                        { field: 'servicetype', enableRowGroup: true, headerName: '服务类型' },
                        { field: 'department', enableRowGroup: true, headerName: '部门', hide: true },
                        { field: 'memberid', headerName: '会员号' },
                        { field: 'department', headerName: '部门' },
                        { field: 'address', headerName: '地址' },
                        { field: 'serviceope', headerName: '维修员' },
                        { field: 'booking_operator', enableRowGroup: true, headerName: '预约人' },
                        { field: 'remarks', enableRowGroup: true, headerName: '备注' },
                        { field: 'complete_remarks', headerName: '完成备注', hide: true },
                        { field: 'feedback_operator', headerName: '汇总人' },
                        { field: 'feedbacktime', headerName: '汇总时间' },
                        { field: 'complete_state', headerName: '汇总状态', hide: true },

                        { field: 'evaluate', headerName: '评价', hide: true },
                        {field: 'feedback_remarks', headerName: '汇总备注'},

                        { field: 'feedback_project', headerName: '汇总选项', hide: true },
                        { field: 'partslist', headerName: '配件', hide: true, valueGetter: data => data?.data?.partslist?.map(e => `${e.name} X ${e.num} 合计 ${e.price}`).join(',') },
                        { field: 'chargeinfo', headerName: '收费', hide: true },
                        { field: 'subsidy', headerName: '公司补贴', hide: true },
                        { field: 'state', enableRowGroup: true, headerName: '状态' },
                        {
                            field: 'id', headerName: '操作', pinned: 'left', width: 200, cellRendererFramework: (data) => <div>
                                {
                                    data?.data?.state == '正常' && <Button size={'small'} onClick={async () => {
                                        setopen(true)
                                        setRowdata(data?.data)
                                        // const rew = await request('post','/api/getInfo',{
                                        //     url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                        //     ids: data.value,
                                        //     serviceopeid: 2
                                        // })
                                        // console.log(rew);
                                    }}>安排</Button>
                                }

                                {

                                    data.data.state == '已完成' && <Button size={'small'} onClick={async () => {
                                        setopen(true)
                                        setRowdata(data.data)
                                        // const rew = await request('post','/api/getInfo',{
                                        //     url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                        //     ids: data.value,
                                        //     serviceopeid: 2
                                        // })
                                        // console.log(rew);
                                    }}>汇总</Button>
                                }
                                {
                                    ['已安排', '已接单', '已汇总', '已完成'].indexOf(data.data.state) !== -1 &&
                                    <Popconfirm style={{ width: 300 }} title="提示" content="确认操作?"
                                        onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_OtherServices_Handle.ResetUserOtherServicesOrder',
                                                ids: JSON.stringify([data.value]),
                                                remarks: `操作员 ${loginuser.name} 重置`
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                                api.current.submitForm()
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                        }}><Button size={'small'}>重置</Button>


                                    </Popconfirm>
                                }
                                {
                                    (data.data.state === '正常') &&
                                    <Popconfirm style={{ width: 300 }} title="提示" content={
                                        <Box>
                                            <Form onChange={e => {
                                                remarksdata.current = e.values.remarks
                                            }}>
                                                <Form.Input label="取消原因" field='remarks' />
                                            </Form>

                                        </Box>

                                    }
                                        onConfirm={async () => {
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Web_OtherServices_Handle.CancelUserOtherServicesOrder',
                                                ids: JSON.stringify([data.value]),
                                                remarks: `操作员 ${loginuser.name} 取消,原因 ${remarksdata.current}`
                                            })
                                            if (rew.data.msg === 'SUCCESS') {
                                                toast.success('操作成功')
                                                api.current.submitForm()
                                            } else {
                                                toast.error(`操作失败 ${rew.data.tips}`)
                                            }
                                        }}><Button size={'small'}>取消</Button>


                                    </Popconfirm>
                                }
                            </div>
                        },
                    ]}
                    onGridReady={params => {
                        params.api.sizeColumnsToFit();
                    }}
                />
            </Box>
            <Box bgcolor="" py={1}>
                <Box display={'flex'} alignItems={'center'}>
                    <Select filter onChange={e => {
                        setsServiceopeid(e)
                    }} prefix="维修员" style={{ width: 200, marginRight: 10 }}>
                        {
                            initData.OperatorList.filter(item => item.department === loginuser.login_department).map(item =>
                                <Select.Option value={item.opeid}>{item.name}</Select.Option>)
                        }

                    </Select>
                    <Input value={keywork} style={{ width: 200, marginRight: 10 }} type="text" placeholder='任意关键字搜索' id="filter-text-box" onChange={e => setKeywork(e)} />

                    <CheckboxGroup value={printtype} onChange={e => {
                        console.log(e)
                        setPrinttype(e)
                    }} options={[
                        { label: '打印机打印', value: '打印机打印' },
                        { label: '飞鹅打印', value: '飞鹅打印' },
                    ]} direction='horizontal' aria-label="CheckboxGroup 示例" />
                </Box>
                <Box display={'flex'} mt={1}>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('安装')} size="small">安装</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('安检')} size="small">安检</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('维修')} size="small">维修</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('预算')} size="small">预算</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('验收')} size="small">验收</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('正常')} size="small">正常</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('已安排')} size="small">已安排</Button>
                    <Button sx={{ mr: 1 }} variant={'outlined'} onClick={() => setKeywork('已接单')} size="small">已接单</Button>

                </Box>
                <Button onClick={async () => {


                    Modal.confirm({
                        title: '确认提交', content: '确认提交安排吗?', onOk: async () => {

                            for (let i = 0; i < rowlist.length; i++) {
                                const element = rowlist[i];
                                setTimeout(async () => {
                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                        ids: JSON.stringify([element.id]),
                                        serviceopeid,
                                        feieprint: printtype.indexOf('飞鹅打印') !== -1 ? '是' : '否',
                                    })
                                    if (rew.data.msg === 'SUCCESS') {
                                        toast.success('安排成功')
                                        if (rew.data.printinfo && printtype.indexOf('打印机打印') !== -1) {
                                            console.log('第' + i + '次打印')
                                            myprint(rew.data.printinfo)
                                        }
                                        // 最后一次循环 刷新列表
                                        if (i === rowlist.length - 1) {
                                            api.current.submitForm()
                                        }
                                    } else {
                                        toast.error(`安排失败 ${rew.data.tips}`)
                                    }
                                }, 4000 * i);

                            }

                            // const rew = await request('post', '/api/getInfo', {
                            //     url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                            //     ids: JSON.stringify(rowlist.map(item => item.id)),
                            //     serviceopeid
                            // })
                            // if (rew.data.msg === 'SUCCESS') {
                            //     toast.success('安排成功')
                            //     api.current.submitForm()
                            // } else {
                            //     toast.error(`安排失败 ${rew.data.tips}`)
                            // }


                        }
                    });


                }} variant={'outlined'} size="small" sx={{ mt: 1 }}>确认安排</Button>
            </Box>

            <Modal title="门店业务操作" size={rowdata.state === '正常' ? 'small' : 'large'} visible={open} onCancel={() => setopen(false)} footer={<></>} >
                {
                    rowdata.state === '正常' ? <Box style={{ top: 200 }}>
                        <Form onSubmit={async e => {
                            const rew = await request('post', '/api/getInfo', {
                                url: 'Srapp.Web_OtherServices_Handle.ArrangeUserOtherServicesOrder',
                                ...e,
                                ids: JSON.stringify([rowdata.id]),
                                feieprint: printtype.indexOf('飞鹅打印') !== -1 ? '是' : '否',
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                toast.success('安排成功')
                                api.current.submitForm()
                                if (rew.data.printinfo) {
                                    myprint(rew.data.printinfo)
                                }
                            } else {
                                toast.error(`安排失败 ${rew.data.tips}`)
                            }
                            setopen(false)
                        }}>
                            <Form.Select field={'serviceopeid'} label="选择服务人员" style={{ width: '100%' }}>
                                {
                                    initData.OperatorList.filter(item => item.department === loginuser.login_department).map(item =>
                                        <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>)
                                }

                            </Form.Select>

                            <Button type={"submit"} variant={"contained"} size={"small"} sx={{ mt: 1 }}>确认安排</Button>
                        </Form>

                    </Box> : ''
                }
                {
                    rowdata.state === '已完成' ? <Form onSubmit={async e => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_OtherServices_Handle.FeedbackUserOtherServicesOrder',
                            ...e,
                            id: rowdata.id,
                            partslist: JSON.stringify(reqairList),
                            feedbackproject: JSON.stringify(e.feedbackproject),
                        })
                        if (rew.data.msg === 'SUCCESS') {
                            toast.success('汇总成功')
                            setReqairList([])
                            api.current.submitForm()
                        } else {
                            toast.error(`汇总失败 ${rew.data.tips}`)
                        }
                        setopen(false)
                    }}><Box display={'flex'}>

                            <Box flex={1}>
                                <Box fontSize={15}>

                                    <Box fontWeight={800} mb={1}>订单详情</Box>
                                    <Box>会员号: {rowdata.memberid}</Box>
                                    <Box>模式: {rowdata.servicetype}</Box>
                                    <Box>备注: {rowdata.remarks}</Box>
                                    <Box>预约时间: {rowdata.appointmenttime}</Box>
                                    <Box>安排时间: {rowdata.arrangetime}</Box>

                                    <Form.Input field={'discountamount'} initValue={0} label={'抵扣金额'} style={{ width:'92%' }} />
                                    <Form.Select field='servicetypeid' label="服务类型" style={{ width:'92%' }}>
                                        {
                                            initData.ServiceTypeList
                                                .filter(item => item.type == 2)
                                                .map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                                        }

                                    </Form.Select>


                                    <Box fontWeight={800} my={1}>选择维修配件</Box>
                                    <Form.Select field='evaluate' label="维修评价" initValue={'满意'}>
                                        <Form.Select.Option value={'满意'}>满意</Form.Select.Option>
                                        <Form.Select.Option value={'一般'}>一般</Form.Select.Option>
                                        <Form.Select.Option value={'差'}>差</Form.Select.Option>
                                        <Form.Select.Option value={'用户不勾选'}>用户不勾选</Form.Select.Option>

                                    </Form.Select>
                                    <Box  >

                                        <Select onChange={e=>{
                                            settype(e)
                                            setRepairitem('')
                                        }} prefix="类型" style={{ width:'92%' }}>
                                            {
                                                RepairPartsTypeList.map(item => <Select.Option value={item.name}>{item.name}</Select.Option>)
                                            }
                                        </Select>

                                        <Select value={repairitem} onChange={e => setRepairitem(e)} prefix="配件" style={{  width:'92%', marginTop: 10 }}>
                                            {
                                                wxlist?.filter(item=>item.type == gastype).map(item => <Select.Option value={item.id}>{item.name}</Select.Option>)
                                            }
                                        </Select>
                                        <Input value={reqairnum} type="number" onChange={e => setReqairnum(e)} prefix="数量" style={{ width:'93%', marginTop: 10 }} />
                                    </Box>
                                    <Button sx={{ mt: 1 }} variant="outlined" onClick={() => {
                                        if (repairitem == '') {
                                            toast('请选择配件')
                                            return;
                                        }
                                        // 添加到数据 reqairlist ,如果已存在数量加1
                                        const index = reqairList.findIndex(item => item.id === repairitem)

                                        const pj = wxlist.find(item=>item.id === repairitem)
                                        if (index > -1) {
                                            reqairList[index].num = (parseFloat(reqairList[index].num) + parseFloat(reqairnum)).toFixed(2)
                                            reqairList[index].price = (parseFloat(reqairList[index].price) + parseFloat(pj?.price) * parseFloat(reqairnum)).toFixed(2)
                                            setReqairList([...reqairList])
                                            return
                                        }
                                        setReqairList([...reqairList, { ...pj, num: parseFloat(reqairnum), price: pj?.price * reqairnum }])
                                    }}>确认添加</Button>
                                </Box>

                            </Box>
                            <Box flex={1}>
                                {
                                    //展示图片信息  判断rowdata.imgids是数组才循环
                                    Array.isArray(rowdata.imgids) ? rowdata.imgids.map(item =>

                                        <Box> {item.explan} <span span onClick={async () => {
                                            setImgOpen(true)
                                            const rew = await request('post', '/api/getInfo', {
                                                url: 'Srapp.Action.GetImgList',
                                                id: JSON.stringify(item.imgids),
                                            })
                                            console.log(rew);
                                            setImgurl(rew.data)

                                        }} style={{ cursor: 'pointer', color: 'blue' }}>查看安检图片</span></Box>
                                    ) : ''
                                }


                                <Form.Input field={'num'} label={'数量'} initValue={1} />
                                <Form.Input field={'remarks'} label={'备注'} />
                                <Form.CheckboxGroup field={'feedbackproject'} direction='horizontal' label={'汇总内容'}>

                                    <Form.Checkbox value="胶管穿墙">胶管穿墙</Form.Checkbox>
                                    <Form.Checkbox value="胶管老化">胶管老化</Form.Checkbox>
                                    <Form.Checkbox value="胶管超长">胶管超长</Form.Checkbox>


                                    <Form.Checkbox value="双咀阀单用">双咀阀单用</Form.Checkbox>
                                    <Form.Checkbox value="使用双头阀">使用双头阀</Form.Checkbox>
                                    <Form.Checkbox value="胶管与减压阀、灶具连接处未加喉码固定">胶管与减压阀、灶具连接处未加喉码固定</Form.Checkbox>
                                    <Form.Checkbox value="胶管接三通使用">胶管接三通使用</Form.Checkbox>
                                    <Form.Checkbox value="未安装减压阀使用">未安装减压阀使用</Form.Checkbox>
                                    <Form.Checkbox value="减压阀漏气">减压阀漏气</Form.Checkbox>



                                    <Form.Checkbox value="热水器安装场所通风不良">热水器安装场所通风不良</Form.Checkbox>
                                    <Form.Checkbox value="热水器放在卫生间">热水器放在卫生间</Form.Checkbox>
                                    <Form.Checkbox value="热水器未安装烟管使用">热水器未安装烟管使用</Form.Checkbox>
                                    <Form.Checkbox value="热水器未安装烟馆">热水器未安装烟馆</Form.Checkbox>
                                    <Form.Checkbox value="热水器老化破损，超期限使用">热水器老化破损，超期限使用</Form.Checkbox>

                                    <Form.Checkbox value="火红">火红</Form.Checkbox>
                                    <Form.Checkbox value="钢瓶存放位置太密闭，通风不良">钢瓶存放位置太密闭，通风不良</Form.Checkbox>
                                    <Form.Checkbox value="钢瓶存放位置有插座或电源开关">钢瓶存放位置有插座或电源开关</Form.Checkbox>
                                    <Form.Checkbox value="钢瓶放在卫生间使用">钢瓶放在卫生间使用</Form.Checkbox>
                                    <Form.Checkbox value="钢瓶离火源或灶具太近">钢瓶离火源或灶具太近</Form.Checkbox>


                                    <Form.Checkbox value="灶堵">灶堵</Form.Checkbox>
                                    <Form.Checkbox value="灶具老化破损，超期限使用">灶具老化破损，超期限使用</Form.Checkbox>

                                    <Form.Checkbox value="瓶装气、管道气混合使用">瓶装气、管道气混合使用</Form.Checkbox>
                                    <Form.Checkbox value="建议按新国标进行整改">建议按新国标进行整改</Form.Checkbox>
                                    <Form.Checkbox value="建议安装一氧化碳报警器">建议安装一氧化碳报警器</Form.Checkbox>
                                    <Form.Checkbox value="建议安装燃气泄漏报警器">建议安装燃气泄漏报警器</Form.Checkbox>


                                    <Form.Checkbox value="用户不愿意整改">用户不愿意整改</Form.Checkbox>
                                    <Form.Checkbox value="用户自行整改">用户自行整改</Form.Checkbox>


                                </Form.CheckboxGroup>
                                {
                                    reqairList.length > 0 ? <Box>
                                        <Box fontWeight={800} my={1}>维修配件</Box>
                                        <Box display={'flex'} flexWrap={'wrap'}>
                                            {
                                                reqairList.map(item =>


                                                    <Box key={item.id} display={'flex'} alignItems={'center'} mr={2} mb={2}>
                                                        <Box mr={1}>{item.name} X </Box>
                                                        <Box mr={1}>{item.num}</Box>
                                                        <Box mr={1}>小计: {item.price}</Box>
                                                        <Button variant="text" size={'small'} onClick={() => {
                                                            const index = reqairList.findIndex(i => i.id === item.id)
                                                            reqairList.splice(index, 1)
                                                            setReqairList([...reqairList])
                                                        }
                                                        }>删除</Button>
                                                    </Box>)
                                            }
                                        </Box>
                                    </Box> : ''

                                }

                                <Form.Select field={'state'} label="选择状态" style={{ width: '100%' }}>
                                    <Form.Select.Option value={'已完工'}>已完工</Form.Select.Option>
                                    <Form.Select.Option value={'未完工'}>未完工</Form.Select.Option>
                                </Form.Select>
                                {/*<Form.RadioGroup field={'chargeinfo'} direction='horizontal' label={'收费情况'}>*/}
                                {/*    <Form.Radio value="不上门">不上门</Form.Radio>*/}
                                {/*    <Form.Radio value="上门不收费">上门不收费</Form.Radio>*/}
                                {/*    <Form.Radio value="上门收30">上门收30</Form.Radio>*/}
                                {/*    <Form.Radio value="上门收50">上门收50</Form.Radio>*/}
                                {/*</Form.RadioGroup>*/}
                                {/*<Form.Input field={'subsidy'} label={'公司补贴'} />*/}
                                <Button type={"submit"} variant={"contained"} size={"small"} sx={{ mt: 1 }}>确认汇总</Button>

                            </Box>



                        </Box >
                    </Form> : ''
                }

            </Modal >

            <Modal title="安检图片" visible={imgOpen} onCancel={() => {
                setImgOpen(false)
                setImgurl([])
            }} footer={<></>} style={{ top: 200 }}>
                <Box>
                    {
                        imgurlList.map(item =>
                            <Box>
                                <h2>{item.imgtype}</h2>
                                <Image src={item.imgurl} width={400} height={400} />
                            </Box>
                        )
                    }

                </Box>
            </Modal>

        </Box >
    );
};

export default OtherServicesOrderListKFZX;
