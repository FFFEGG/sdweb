import React, { useEffect, useRef, useState } from 'react';
import { connect } from "react-redux";
import {
    Autocomplete,
    Box,
    Button, Dialog, DialogActions, DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import UserInfo from "../pages/users/UserInfo";
import { useForm } from "react-hook-form";
import moment from "moment/moment";
import { Form, Popconfirm } from "@douyinfe/semi-ui";
import request from "../../utils/request";
import translations from '../../utils/translations.json'
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";


const AddContributionRecord = ({ customization }) => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const new_department = JSON.parse(localStorage.getItem('new_department_byname'))
    const [userinfo, setuserinfo] = useState('')
    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            collectiondate: moment(new Date()).format('YYYY-MM-DD'),
            contributiondate: moment(new Date()).format('YYYY-MM-DD'),
        }
    })

    const submit = async (data) => {
        console.log(data);
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_Other_Handle.AddContributionRecord\n'
        })
        if (rew.data.msg === 'SUCCESS') {
            toast.success('操作成功')
        } else {
            toast.error('操作失败')
        }
        api.current.submitForm()
        // console.log(rew);
    }


    const [index, setindex] = useState(1)
    const [list, setlist] = useState([])
    const getlist = async (data) => {
        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_Report_Manage_Infos.ContributionRecordReport',
            department: JSON.stringify(data.department)
        })
        // console.log(rew);
        setlist(rew.data.info)
    }
    const api = useRef(null)
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    return (
        <Box>
            <Box display="flex" alignItems="center" mb={3}>
                <Button style={{ marginRight: 10 }} onClick={() => setindex(1)}
                    variant={index === 1 ? "contained" : 'outlined'}>查询</Button>
                <Button onClick={() => setindex(2)} variant={index === 2 ? "contained" : 'outlined'}>录入</Button>
            </Box>
            {
                index === 2 ?
                    <Box sx={{ width: '100%', background: '#FFF' }}>
                        <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll" display="flex">
                            <Box border={1} p={2} borderColor="#999" width="100%">
                                <Typography fontSize={23} textAlign="center" fontWeight="bold"
                                    marginBottom={2}>录入缴款记录</Typography>
                                <FormControl sx={{ width: '100%', mb: 1 }}>
                                    <InputLabel id="432">业务类型</InputLabel>
                                    <Select {...register('type')} InputLabelProps={{ shrink: true }} id="432"
                                        label="业务类型">
                                        <MenuItem value="液化气业务">液化气业务</MenuItem>
                                        <MenuItem value="桶装水业务">桶装水业务</MenuItem>
                                        <MenuItem value="燃安业务">燃安业务</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField {...register('collectiondate')} InputLabelProps={{ shrink: true }}
                                    sx={{ width: '100%', mb: 1 }} label="收款日期" type="date" />


                                <TextField {...register('contributiondate')} InputLabelProps={{ shrink: true }}
                                    sx={{ width: '100%', mb: 1 }} label="缴款日期" type="date" />
                                <TextField {...register('total', { required: true })} InputLabelProps={{ shrink: true }}
                                    sx={{ width: '100%', mb: 1 }} label="合计金额" type="number" />


                                <TextField {...register('contributionserial')} InputLabelProps={{ shrink: true }}
                                    sx={{ width: '100%', mb: 1 }} label="缴款单据号" />

                                <FormControl sx={{ width: '100%', mb: 1 }}>
                                    <InputLabel id="432">缴款方式</InputLabel>
                                    <Select {...register('mode')} InputLabelProps={{ shrink: true }} id="432"
                                        label="缴款方式">
                                        <MenuItem value="北部湾银行">北部湾银行</MenuItem>
                                        <MenuItem value="兴E付">兴E付</MenuItem>
                                        <MenuItem value="农村信用社">农村信用社</MenuItem>
                                        <MenuItem value="工商银行">工商银行</MenuItem>
                                        <MenuItem value="建设银行">建设银行</MenuItem>
                                        <MenuItem value="交通银行">交通银行</MenuItem>
                                        <MenuItem value="邮政储蓄银行">邮政储蓄银行</MenuItem>
                                        <MenuItem value="农业银行">农业银行</MenuItem>
                                        <MenuItem value="中国银行">中国银行</MenuItem>
                                        <MenuItem value="中信银行">中信银行</MenuItem>
                                        <MenuItem value="光大银行">光大银行</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField {...register('remarks')} InputLabelProps={{ shrink: true }}
                                    sx={{ width: '100%', mb: 1 }} label="备注" />
                            </Box>

                        </Box>
                        <Box px={3} pb={3}>
                            <Popconfirm title="提示" content="确认操作？" onConfirm={handleSubmit(submit)}>
                                <Button sx={{ fontSize: 20 }} variant="contained">确认录入</Button>
                            </Popconfirm>
                        </Box>

                    </Box>
                    : (
                        <Box p={3} bgcolor="#FFF" mt={3}>
                            <Form getFormApi={e => api.current = e} onSubmit={(values) => getlist(values)} layout='horizontal'
                                onValueChange={values => console.log(values)}>
                                {
                                    loginuser.login_department == '运营监督' ?


                                    //
                                    //     <Form.Select multiple filter style={{width: 200}} maxTagCount={1} field={'department'} label={'业务部门'}>
                                    //     {
                                    //         initData.DepartmentList.filter(item=>item.type == '业务门店')
                                    //             .map(item=>
                                    //                 <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                                    //             )
                                    //     }
                                    // </Form.Select>

                                        <Form.TreeSelect leafOnly multiple filterTreeNode treeData={new_department} field={'department'} label={'业务部门'} style={{width: 200}} maxTagCount={1} />

                                        : ''
                                }

                                <Form.Select initValue="全部业务" field="type" label='业务类型' style={{ width: 176 }}>
                                    <Form.Select.Option value="全部业务">全部业务</Form.Select.Option>
                                    <Form.Select.Option value="液化气业务">液化气业务</Form.Select.Option>
                                    <Form.Select.Option value="桶装水业务">桶装水业务</Form.Select.Option>
                                    <Form.Select.Option value="燃安业务">燃安业务</Form.Select.Option>
                                </Form.Select>
                                <Form.Select initValue="录入时间" field="timetype" label='时间类型' style={{ width: 176 }}>
                                    <Form.Select.Option value="缴款时间">缴款时间</Form.Select.Option>
                                    <Form.Select.Option value="收款时间">收款时间</Form.Select.Option>
                                    <Form.Select.Option value="录入时间">录入时间</Form.Select.Option>
                                </Form.Select>
                                <Form.Input initValue={moment().format('YYYY-MM-DD')} field='begintime' label='开始时间'
                                    type="date" style={{ width: 176 }} />
                                <Form.Input initValue={moment().format('YYYY-MM-DD')} field='endtime' label='结束时间'
                                    type="date" style={{ width: 176 }} />

                                <Box display="flex" alignItems="flex-end">
                                    <Button variant="outlined" type="primary" htmlType="submit"
                                        className="btn-margin-right">搜索</Button>
                                </Box>

                            </Form>

                            <Box mt={3} overflow="scroll" height="60vh">
                                <AgGridReact
                                    className="ag-theme-balham"
                                    rowData={list}
                                    localeText={translations}
                                    columnDefs={[

                                        { headerName: '部门', field: 'department' },
                                        { headerName: '业务类型', field: 'type' },
                                        { headerName: '收款时间', field: 'collectiondate' },
                                        { headerName: '缴款时间', field: 'contributiondate' },
                                        { headerName: '缴款单据号', field: 'contributionserial' },
                                        { headerName: '缴款方式', field: 'mode' },
                                        { headerName: '缴款金额', field: 'total' },
                                        { headerName: '备注', field: 'remarks' },
                                        { headerName: '录入时间', field: 'addtime' },
                                        { headerName: '录入人', field: 'operator' },
                                        { headerName: '确认部门', field: 'confirm_department' },
                                        { headerName: '确认人', field: 'confirm_ope' },
                                        { headerName: '确认时间', field: 'confirm_time' },
                                        { headerName: '作废部门', field: 'cancel_department' },
                                        { headerName: '作废人', field: 'cancel_ope' },
                                        { headerName: '作废时间', field: 'cancel_time' },
                                        { headerName: '状态', field: 'state' },

                                        {
                                            headerName: '操作', pinned:'left', cellRendererFramework: ({ data }) =>
                                                data?.state == '正常' &&
                                                    <Box>

                                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                                            const rew = await request('post', '/api/getInfo', {
                                                                url: 'Srapp.Web_Other_Handle.ConfirmContributionRecord',
                                                                id: data.id
                                                            })
                                                            if (rew.data.msg === 'SUCCESS') {
                                                                toast.success('操作成功')
                                                            } else {
                                                                toast.error(`操作失败 ${rew.data.tips}`)
                                                            }
                                                        }}>

                                                            <Button>确认</Button>
                                                        </Popconfirm>

                                                        <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                                            const rew = await request('post', '/api/getInfo', {
                                                                url: 'Srapp.Web_Other_Handle.CancelContributionRecord',
                                                                id: data.id
                                                            })
                                                            if (rew.data.msg === 'SUCCESS') {
                                                                toast.success('操作成功')
                                                            } else {
                                                                toast.error(`操作失败 ${rew.data.tips}`)
                                                            }
                                                        }}>
                                                            <Button>取消</Button>
                                                        </Popconfirm>
                                                    </Box>  || <Box></Box>



                                        },
                                    ]}
                                />
                            </Box>
                        </Box>
                    )
            }
        </Box>
    );
};


const mapStateToProps = (state) => state

export default connect(mapStateToProps)(AddContributionRecord);
