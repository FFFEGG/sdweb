import React, { useRef, useState } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { Form, Modal, Popover } from "@douyinfe/semi-ui";
import moment from "moment";
import request from "../../utils/request";
import { AgGridReact } from "ag-grid-react";
import { toast } from "react-toastify";
import translutions from "../../utils/translations.json"

const NewGetSalesSecurityCheckRecord = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [imglist, setimgList] = useState([])
    const [maindata, setdata] = useState('')
    const [show, setshow] = useState(false)
    const [ajshow, setajshow] = useState(false)
    const [img, setimg] = useState('')
    const api = useRef()
    const formapi = useRef()
    return (
        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
            <Typography mb={3} fontSize={18} color={"black"}>获取销售安检信息</Typography>

            <Form getFormApi={e=>formapi.current = e} layout={'horizontal'} onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_WorkSafety_Infos.NewGetSalesSecurityCheckRecord',
                    ...e,
                    department: JSON.stringify([loginuser.login_department]),
                    SecurityInspector: JSON.stringify(e.SecurityInspector)
                })
                if (rew.data.length) {
                    // 关键字筛选
                    if (e.keywords) {
                        // alert(e.keywords)
                        const keyword = e.keywords
                        rew.data = rew.data.filter(item => {
                            // 匹配所有字段包含关键字
                            for (let key in item) {
                                if (item[key] && item[key].toString().includes(keyword)) {
                                    return true
                                }
                            }
                            return false
                        })
                    }

                }

                //rew.data按照状态排序
                rew.data.sort((a, b) => {
                    // 正常的在最前面 其他在后面
                    if (a.state === '正常') {
                        return -1
                    }
                    if (b.state === '正常') {
                        return 1
                    }
                    return 0
                })
                rew.data.push({
                    addtime: '合计',
                    memberid: '安检条数',
                    name: rew.data.length,
                    customertype: '',
                    address: '',
                    department: '',
                    operator: '',
                    detailed: '[]',
                    state: '',
                    feedbackoperator: '',
                    imglist: []
                })
                // 排除 detailed 包含 ‘胶管不合格’，‘胶管与减压阀、灶具连接处未加喉码固定’，‘灶具不合格。’ 关键字的数据
                // rew.data = rew.data.filter(item=>{
                //     if(item.detailed.toString().includes('胶管不合格') || item.detailed.toString().includes('胶管与减压阀、灶具连接处未加喉码固定') || item.detailed.toString().includes('灶具不合格')){
                //         return false
                //     }
                //     return true
                // })

                setList(rew.data)
                // console.log(rew);
            }} >
                <Form.Input type="date" field={'begintime'} label={'开始时间'} initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input type="date" field={'endtime'} label={'结束时间'} initValue={moment().format('YYYY-MM-DD')} />
                {/* <Form.Select filter initValue={[loginuser.login_department]} maxTagCount={1} multiple label={'部门'} field={'department'} style={{ width: 230 }}>
                    {
                        initData.DepartmentList.map(item => <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>)
                    }
                </Form.Select> */}

                {/*
                <Form.Select filter maxTagCount={1} multiple label={'安检员'} field={'SecurityInspector'} style={{ width: 230 }}>
                    {
                        initData.OperatorList.map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }
                </Form.Select> */}
                <Form.Input field='keywords' placeholder={'搜索关键字'} />
                <Box display={"flex"} alignItems={"end"}>
                    <Button type={"submit"} variant={"contained"}>搜索</Button>
                </Box>
            </Form>


            <Box height={'60vh'} overflow={'scroll'} mt={3}>
                <AgGridReact
                    ref={api}
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translutions}
                    getRowStyle={(params) => {
                        if (params.data.state === '正常') {
                            return { background: '#fff' }
                        } else if (params.data.state === '取消') {
                            return { background: '#fdd' }
                        }
                        else if (params.data.state === '') {
                            return { color: '#000' }
                        }
                        else {
                            return { color: 'red' }
                        }
                    }}
                    columnDefs={[
                        { field: 'addtime', headerName: '添加时间' },
                        { field: 'memberid', headerName: '卡号' },
                        { field: 'name', headerName: '姓名' },
                        { field: 'customertype', headerName: '客户类型' },

                        { field: 'address', headerName: '地址' },
                        { field: 'department', headerName: '门店' },
                        { field: 'operator', headerName: '安检员' },
                        {
                            field: 'detailed', headerName: '安检项', cellRendererFramework: ({ data }) => {


                                let str = ''
                                const arr = JSON.parse(data?.detailed)
                                for (const i in arr) {
                                    str += (arr[i] + ',')
                                }
                                return str
                            }
                        },
                        { field: 'state', headerName: '状态' },
                        { field: 'feedbackoperator', headerName: '营业员' },
                        {
                            field: 'imglist', headerName: '图片', cellRendererFramework: ({ data }) => data.state !== '' && <Button onClick={async () => {
                                if (data.state == '') {
                                    toast.error('该条数据不可查看')
                                    return
                                }
                                setdata(data)

                                let arr = data?.imgids
                                let imgids = []
                                for (let i = 0; i < arr.length; i++) {

                                    imgids = [...imgids, ...arr[i].imgids]
                                }

                                const rew = await request('post', '/api/getInfo', {
                                    url: 'Srapp.Action.GetImgList',
                                    id: JSON.stringify(imgids)
                                })
                                const imgarr = rew.data

                                for (let i = 0; i < arr.length; i++) {
                                    arr[i].imgs = []
                                    for (let j = 0; j < imgarr.length; j++) {
                                        if (arr[i].explan === imgarr[j].imgtype) {
                                            arr[i].imgs.push(imgarr[j].imgurl)
                                        }
                                    }
                                }


                                setimgList(arr)


                                setajshow(true)
                            }} size={"small"}>查看图片</Button>
                        }
                    ]}

                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        sortable: true
                    }}
                />
            </Box>





            <Modal visible={ajshow} footer={<></>} onCancel={() => setajshow(false)} style={{ top: '10%', width: '60vw', left: '5%' }}>
                <Box fontSize={18} mb={3}>安检图片信息</Box>
                <Box height={'40vh'} overflow={'scroll'}>

                    <AgGridReact
                        rowData={imglist}
                        className="ag-theme-balham"
                        columnDefs={[
                            { headerName: '描述', field: 'explan' },
                            {
                                headerName: '描述', field: 'imgs', cellRendererFramework: ({ data }) => {
                                    const arr = data.imgs.map(item =>

                                        <img onClick={() => {
                                            setimg(item)
                                        }} style={{ width: '70px', height: '70px', padding: '3px', background: '#eee', borderRadius: '3px', cursor: 'pointer' }} src={item} />

                                    )

                                    return <div>{arr}</div>

                                }
                            },
                            // {headerName: '相关图片', field: 'imgurl',cellRendererFramework:({data})=>},
                        ]}
                        rowHeight={80}
                        defaultColDef={{
                            flex: 1
                        }}
                    />
                </Box>
                {
                    maindata.state == '正常' ? <Button onClick={() => {
                        setshow(true)
                    }} sx={{ mt: 3 }} variant={"contained"}>确认安检内容</Button> : ''
                }

            </Modal>

            <Modal visible={show} footer={<></>} onCancel={() => setshow(false)} style={{ top: '10%' }}>
                <Form onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        url: 'Srapp.Web_WorkSafety_Handle.FeedbackSalesSecurityCheck',
                        id: maindata.id,
                        ...e
                    })
                    if (rew.code === 200) {
                        toast.success('成功')
                    } else {
                        toast.error('失败')
                    }
                    setshow(false)
                    setajshow(false)
                    setdata('')
                    formapi.current.submitForm()
                }}>
                    <Form.Input field={'remarks'} label={'备注'} />

                    <Button variant={"contained"} type={'submit'}>确认录入</Button>
                </Form>
            </Modal>

            <Modal visible={img} style={{ width: '70vw' }} onCancel={() => setimg('')} onOk={() => setimg('')}>
                <img style={{ width: '60vw' }} src={img} />
            </Modal>



        </Box>
    );
};

export default NewGetSalesSecurityCheckRecord;
