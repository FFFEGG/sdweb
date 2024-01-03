import React, { useEffect, useState } from 'react';
import request from "../../../utils/request";
import { Box, Button, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";
import { AgGridReact } from "ag-grid-react";
import { Toast, Popconfirm, Popover, Modal, Image } from "@douyinfe/semi-ui";
import { toast } from "react-toastify";
import translations from "../../../utils/translations.json";

const UserSalesSecurityCheckRecord = ({ userinfo }) => {
    const [list, setlist] = useState([])
    const [formdata, setdata] = useState('')
    const [pageNumber, setpageNumber] = useState(1)

    const [imgOpen, setImgOpen] = useState(false)
    const [imgurlList, setImgurl] = useState([])
    const { register, handleSubmit } = useForm({
        defaultValues: {
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        }
    })

    const submit = async (page) => {
        const rew = await request('post', '/api/getInfo', {
            ...formdata,
            userid: userinfo.userid,
            url: 'Srapp.Web_User_Infos.UserSalesSecurityCheckRecord',
            row: 10,
            pageNumber: page
        })
        if (rew.code === 200) {
            setlist(rew.data)
        }
    }
    const getlist = async (data) => {
        setlist([])
        setdata(data)
        const rew = await request('post', '/api/getInfo', {
            ...data,
            userid: userinfo.userid,
            url: 'Srapp.Web_User_Infos.UserSalesSecurityCheckRecord',
            row: 10,
            pageNumber: 1
        })
        if (rew.code === 200) {


            setlist(rew.data)

        }
    }



    return (
        <div>
            <Box borderColor="#ccc" minHeight={600} >
                <TextField {...register('begintime')} type="date" size="small" />  <TextField {...register('endtime')} type="date" size="small" />  <Button size="small" sx={{ p: 1, px: 4 }} onClick={handleSubmit(getlist)} variant="outlined">查询</Button>
                <Box mt={2} overflow="scroll" height="70vh">
                    <AgGridReact
                        localeText={translations}
                        reactUi="true"
                        className="ag-theme-balham"
                        columnDefs={[
                            { field: 'addtime', headerName: '添加时间' },
                            { field: 'memberid', headerName: '卡号' },
                            { field: 'name', headerName: '姓名' },
                            { field: 'address', headerName: '地址' },
                            { field: 'department', headerName: '门店' },
                            { field: 'detailed', headerName: '安检项' },
                            { field: 'operator', headerName: '安检人' },
                            { field: 'feedbacktime', headerName: '安检完成时间' },
                            // {
                            //     field: 'imglist' ,headerName: '图片',cellRendererFramework: ({data}) => data.imglist.map(item=> <Popover position="topLeft"  content={
                            //         <img width={200} src={item.imgurl} />
                            //     }> <Button size="small">{item.imgtype}</Button></Popover>)
                            // }
                            {
                                headerName: '操作', cellRendererFramework: ({ data }) => <Button variant={"text"} size="small" onClick={async () => {
                                    setImgOpen(true)
                                    /*
                                    data.imgids = [
                                        {
                                            "explan": "热水器安装不合格",
                                            "imgids": [
                                            "104"
                                            ]
                                        }]
                                    循环取出imgids组成数组
                                    */
                                    let imgids = []
                                    data.imgids.forEach(item => {
                                        imgids.push(...item.imgids)
                                    })
                                    // console.log(imgids);

                                    const rew = await request('post', '/api/getInfo', {
                                        url: 'Srapp.Action.GetImgList',
                                        id: JSON.stringify(imgids),
                                    })
                                    console.log(rew);
                                    setImgurl(rew.data)

                                }}>查看安检图片</Button>
                            },
                        ]}
                        pagination="true"
                        rowSelection="single"
                        rowClass="my-row"
                        rowData={list}
                        defaultColDef={{
                            sortable: true, // 开启排序
                            resizable: true,
                            // flex: 1,
                        }}

                    />
                </Box>
            </Box>
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
        </div>
    );
};

export default UserSalesSecurityCheckRecord;
