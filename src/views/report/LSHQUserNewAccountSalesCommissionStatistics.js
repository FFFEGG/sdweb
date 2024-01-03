import {Form, Modal} from "@douyinfe/semi-ui";
import {Box, Button} from "@mui/material";
import {AgGridReact} from "ag-grid-react";
import moment from "moment";
import {useRef, useState} from "react";
import request from "utils/request";

const LSHQUserNewAccountSalesCommissionStatistics = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = useState([])
    const [sublist, setsubList] = useState([])
    const [show, setShow] = useState(false)
    const new_department_byname = JSON.parse(localStorage.getItem('new_department_byname'))
    const api = useRef(null)
    return <Box p={3} bgcolor={'white'} borderRadius={1}>
        <Box fontSize={18} mb={3}>零售后勤 开户换气统计</Box>
        <Form getFormApi={e => api.current = e} layout="horizontal" labelPosition="inset" onSubmit={async e => {
            const rew = await request('post', '/api/getInfo', {
                url: 'Srapp.Web_Report_Business_Infos.LSHQUserNewAccountSalesCommissionStatistics',
                ...e,
                department: JSON.stringify(e.department),
            })
            // console.log(rew)
            // rew.data.info.map(item => {
            //      item.price = 0.5
            //      item.num = item.num * 1
            //      item.total = item.num * item.price
            // })
            // rew.data.info.push({
            //      department: '合计',
            //      num: rew.data.info.reduce((a, b) => a + b.num, 0),
            //      total: rew.data.info.reduce((a, b) => a + b.total, 0),
            // })
            if (rew.data.info.length) {
                // 没有对应下标 默认值 0
                rew.data.info.map(item => {
                    // { field: '12KG液化气(0)[num]', headerName: '12kg液化气无优惠', sortable: true, filter: true, },
                    // { field: '12KG液化气(1)[num]', headerName: '12kg液化气优惠1', sortable: true, filter: true, },
                    // { field: '12KG液化气(2)[num]', headerName: '12kg液化气优惠2', sortable: true, filter: true, },
                    // { field: '12KG液化气(3)[num]', headerName: '12kg液化气优惠3', sortable: true, filter: true, },
                    // { field: '12KG液化气(4)[num]', headerName: '12kg液化气优惠4', sortable: true, filter: true, },
                    // { field: '12KG液化气(5)[num]', headerName: '12kg液化气优惠5', sortable: true, filter: true, },
                    // { field: '4KG液化气[num]', headerName: '4kg液化气', sortable: true, filter: true, },
                    item['12KG液化气(0)[num]'] = item['12KG液化气(0)[num]'] || 0
                    item['12KG液化气(1)[num]'] = item['12KG液化气(1)[num]'] || 0
                    item['12KG液化气(2)[num]'] = item['12KG液化气(2)[num]'] || 0
                    item['12KG液化气(3)[num]'] = item['12KG液化气(3)[num]'] || 0
                    item['12KG液化气(4)[num]'] = item['12KG液化气(4)[num]'] || 0
                    item['12KG液化气(5)[num]'] = item['12KG液化气(5)[num]'] || 0
                    item['4KG液化气[num]'] = item['4KG液化气[num]'] || 0
                })

            }
            setList(rew.data.info)
        }}>
            <Form.Input type="date" field="begintime" label="开始时间" initValue={moment().format('YYYY-MM-DD')}/>
            <Form.Input type="date" field="endtime" label="结束时间" initValue={moment().format('YYYY-MM-DD')}/>


            <Form.TreeSelect leafOnly filterTreeNode treeData={new_department_byname} label={'开户部门'}
                             style={{width: 300}} maxTagCount={1} multiple field={'department'} filter/>

            <Button variant="contained" size="small" type="submit">查询</Button>
        </Form>
        <Box mt={3} height={'60vh'}>
            <AgGridReact
                rowData={list}
                className="ag-theme-balham"
                columnDefs={[
                    // {
                    //      "salesman": "001",
                    //      "12KG液化气(0)[num]": "2.0",
                    //      "12KG液化气(0)[commission]": 6,
                    //      "12KG液化气(1)[num]": 0,
                    //      "12KG液化气(1)[commission]": 0,
                    //      "12KG液化气(5)[num]": 0,
                    //      "12KG液化气(5)[commission]": 0,
                    //      "4KG液化气[num]": 0,
                    //      "4KG液化气[commission]": 0,
                    //      "12KG液化气(2)[num]": 0,
                    //      "12KG液化气(2)[commission]": 0,
                    //      "12KG液化气(4)[num]": 0,
                    //      "12KG液化气(4)[commission]": 0,
                    //      "12KG液化气(3)[num]": 0,
                    //      "12KG液化气(3)[commission]": 0
                    //  }
                    {field: 'department', headerName: '开户部门', sortable: true, filter: true,},
                    {field: 'salesman', headerName: '开户员', sortable: true, filter: true,},
                    {field: '12KG液化气(0)[num]', headerName: '12kg液化气无优惠', sortable: true, filter: true,},
                    {field: '12KG液化气(1)[num]', headerName: '12kg液化气优惠1', sortable: true, filter: true,},
                    {field: '12KG液化气(2)[num]', headerName: '12kg液化气优惠2', sortable: true, filter: true,},
                    {field: '12KG液化气(3)[num]', headerName: '12kg液化气优惠3', sortable: true, filter: true,},
                    {field: '12KG液化气(4)[num]', headerName: '12kg液化气优惠4', sortable: true, filter: true,},
                    {field: '12KG液化气(5)[num]', headerName: '12kg液化气优惠5', sortable: true, filter: true,},
                    {field: '4KG液化气[num]', headerName: '4kg液化气', sortable: true, filter: true,},
                    // 合计提成
                    {
                        headerName: '合计提成', sortable: true, filter: true, valueGetter: ({data}) => {
                            let sum = 0
                            sum += ( parseFloat(data['12KG液化气(0)[commission]'])) || 0
                            sum += ( parseFloat(data['12KG液化气(1)[commission]'])) || 0
                            sum += ( parseFloat(data['12KG液化气(2)[commission]'])) || 0
                            sum += ( parseFloat(data['12KG液化气(3)[commission]'])) || 0
                            sum += ( parseFloat(data['12KG液化气(4)[commission]'])) || 0
                            sum += ( parseFloat(data['12KG液化气(5)[commission]'])) || 0
                            sum += ( parseFloat(data['4KG液化气[commission]'])) || 0

                            return parseFloat(sum).toFixed(2)

                        }
                    },


                ]}
                onCellDoubleClicked={async e => {
                    // console.log(e);


                    const {colDef} = e
                    // console.log(colDef);
                    if (colDef.field != 'salesman' && colDef.field != 'department') {
                        let preferential = 0
                        if (colDef.headerName == '12kg液化气优惠1') {
                            preferential = 1
                        }
                        if (colDef.headerName == '12kg液化气优惠2') {
                            preferential = 2
                        }
                        if (colDef.headerName == '12kg液化气优惠3') {
                            preferential = 3
                        }
                        if (colDef.headerName == '12kg液化气优惠4') {
                            preferential = 4
                        }
                        if (colDef.headerName == '12kg液化气优惠5') {
                            preferential = 5
                        }

                        const regex = /^(\d+KG液化气)/
                        let result = null
                        const match = colDef.field.match(regex)
                        result = match ? match[1] : null

                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_Report_Business_Infos.LSHQUserNewAccountSalesCommissionStatisticsDetails',
                            begintime: api.current.getValue('begintime'),
                            endtime: api.current.getValue('endtime'),
                            salesman: e.data.salesman,
                            goodsname: result,
                            preferential: preferential,
                            department: JSON.stringify([e.data.department])
                        })
                        setsubList(rew.data.info)
                        setShow(true)
                    }
                }}
            />
        </Box>
        <Modal title="明细" size="large" visible={show} onCancel={() => setShow(false)} footer={null}>
            <Box height={'60vh'}>

                <AgGridReact
                    rowData={sublist}
                    className="ag-theme-balham"
                    columnDefs={
                        // {
                        //      "addtime": "2023-06-16 00:00:00.000",
                        //      "memberid": "1137",
                        //      "username": "00",
                        //      "customertype": "家庭用户",
                        //      "address": "鲤湾路10-6号",
                        //      "accountopeningtime": "2023-06-16 17:07:41.847",
                        //      "goodsname": "12KG液化气",
                        //      "marketprice": "110.0000",
                        //      "price": "110.0000",
                        //      "salesprice": "110.0",
                        //      "num": "1.0",
                        //      "attributiondepartment": "零售江南分公司",
                        //      "developsalesman": "闭小珍",
                        //      "department": "鲤湾店",
                        //      "deliveryman": "李宝权"
                        // }
                        [
                            {field: 'addtime', headerName: '添加时间', sortable: true, filter: true,},
                            {field: 'memberid', headerName: '会员号', sortable: true, filter: true,},
                            {field: 'username', headerName: '姓名', sortable: true, filter: true,},
                            {field: 'customertype', headerName: '客户类型', sortable: true, filter: true,},
                            {field: 'address', headerName: '地址', sortable: true, filter: true,},
                            {field: 'accountopeningtime', headerName: '开户时间', sortable: true, filter: true,},
                            {field: 'goodsname', headerName: '商品名称', sortable: true, filter: true,},
                            {field: 'marketprice', headerName: '市场价', sortable: true, filter: true,},
                            {field: 'price', headerName: '单价', sortable: true, filter: true,},
                            {field: 'salesprice', headerName: '销售价', sortable: true, filter: true,},
                            {field: 'num', headerName: '数量', sortable: true, filter: true,},
                            {field: 'attributiondepartment', headerName: '归属部门', sortable: true, filter: true,},
                            {field: 'developsalesman', headerName: '业务员', sortable: true, filter: true,},
                            {field: 'department', headerName: '部门', sortable: true, filter: true,},
                            {field: 'deliveryman', headerName: '配送员', sortable: true, filter: true,},


                        ]
                    }
                />
            </Box>
        </Modal>

    </Box>;
}

export default LSHQUserNewAccountSalesCommissionStatistics;