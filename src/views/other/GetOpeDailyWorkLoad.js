import React, { useRef, useState } from 'react';
import { Form } from "@douyinfe/semi-ui";
import { Box } from "@mui/system";
import moment from "moment";
import { Button } from "@mui/material";
import request from "../../utils/request";
import translations from '../../utils/translations.json'
import { AgGridReact } from "ag-grid-react";

const GetOpeDailyWorkLoad = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setlist] = useState([])
    const [list2, setlist2] = useState([])

    const getTitle = (data) => {
        var arr = []
        for (const k in data) {
            if (k === 'deliveryman') {
                arr.push({
                    headerName: '配送员', field: k
                })
            } else if (k === 'department') {
                arr.push({
                    headerName: '部门', field: k
                })
            } else {
                arr.push({
                    headerName: k, field: k
                })
            }


        }
        return arr
    }
    const api = useRef(null);

    return (
        <Box p={3} bgcolor="#fff">
            <Form getFormApi={e => api.current = e} layout='horizontal' labelPosition='inset' onSubmit={async e => {
                const rew = await request('post', '/api/getInfo', {
                    url: 'Srapp.Web_Other_Infos.GetOpeDailyWorkLoad',
                    ...e,
                    deliveryman: JSON.stringify(e.deliveryman)
                })
                setlist(rew.data)
                // {
                //     "department": "朝阳店",
                //     "deliveryman": "石小民",
                //     "mode": "商品销售",
                //     "goodsname": "18.9L巴马丽琅矿泉水",
                //     "num": "1.0"
                // }
                //rew.data  根据 goodsname 分组 格式为['18.9L巴马丽琅矿泉水 X 2','xxx X 2']
                let arr = {}
                rew.data.forEach(item => {
                    if (arr[item.goodsname]) {
                        arr[item.goodsname] += Number(item.num)
                    }
                    else {
                        arr[item.goodsname] = Number(item.num)
                    }

                })

                // console.log('arr', arr)
                // 将arr转为数组 {goodsname: '18.9L巴马丽琅矿泉水', num: 2}
                let arr2 = []
                for (const k in arr) {
                    arr2.push({
                        goodsname: k,
                        num: arr[k]
                    })
                }
                console.log('arr2', arr2)
                setlist2(arr2)


            }}>
                <Form.Select label="员工" filter field={'deliveryman'} multiple maxTagCount={1} style={{ width: 180 }}>
                    {
                        initData?.OperatorList?.filter(item => item.departmentid == loginuser.login_departmentid).map(item => <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>)
                    }

                </Form.Select>
                {/* <Form.Input field='date' label="日期" type="date" initValue={moment().format('YYYY-MM-DD')} /> */}
                {/* begintime	日期	必须			开始时间
                endtime	日期	必须			结束时间 */}
                <Form.Input field='begintime' label="开始时间" type="date" initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field='endtime' label="结束时间" type="date" initValue={moment().format('YYYY-MM-DD')} />

                <Button sx={{ mr: 2 }} variant="contained" onClick={() => {
                    api.current.setValue('deliveryman', initData?.OperatorList?.filter(item => item.departmentid == loginuser.login_departmentid).map(item => item.name))
                }} size="small">全选</Button>
                <Button variant="contained" type={"submit"} size="small">搜索</Button>
            </Form>

            {
                list2.length > 0 && <Box mt={3} display={'flex'} flexWrap={'wrap'}>
                    {
                        list2.map(item => <Box style={{ border: '1px solid #ccc', padding: 5, marginRight: 6, color: '#000', marginBottom: 6 }}>{item.goodsname} X {item.num}</Box>)
                    }
                </Box>

            }

            <Box mt={3} height={'60vh'} overflow={"scroll"}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    localeText={translations}
                    columnDefs={
                        // list.length > 0 ? getTitle(list[0]) : []
                        [
                            // {
                            //     "department": "朝阳店",
                            //     "deliveryman": "石小民",
                            //     "mode": "商品销售",
                            //     "goodsname": "18.9L巴马丽琅矿泉水",
                            //     "num": "1.0"
                            // }
                            { headerName: '部门', field: 'department' },
                            { headerName: '配送员', field: 'deliveryman' },
                            { headerName: '模式', field: 'mode' },
                            { headerName: '商品名称', field: 'goodsname' },
                            { headerName: '数量', field: 'num' },
                        ]
                    }
                    defaultColDef={{
                        resizable: true,
                        flex: 1,
                        sortable: true,
                    }}
                />
            </Box>
        </Box>
    );
};

export default GetOpeDailyWorkLoad;
