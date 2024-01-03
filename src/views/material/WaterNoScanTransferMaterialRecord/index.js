import React from 'react';
import { Box } from "@mui/system";
import { Form } from "@douyinfe/semi-ui";
import moment from 'moment';
import { Button } from '@mui/material';
import request from 'utils/request';
import { AgGridReact } from 'ag-grid-react';
import translations from 'utils/translations';


const Index = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    let new_department = JSON.parse(localStorage.getItem('new_department_byname'))
    let new_goodslist = JSON.parse(localStorage.getItem('new_goodslist_byname'))
    new_department.push({
        label: '水厂配送员',
        value: '水厂配送员',
        key: '水厂配送员',
        children: initData.DispatchDepartmentList.map(item => ({
            label: item.name,
            value: item.name,
            key: item.name
        }))
    })
    const [list, setList] = React.useState([])
    const getlist = async (e) => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_Material_Infos.NoScanTransferMaterialRecord',
            ...e,
            department: JSON.stringify(e.department),
            goodsname: JSON.stringify(e.goodsname),
            handler: e.handler ? JSON.stringify([e.handler]) : '',
        })
        rew.data.push({
            addtime: '合计',
            mode: '',
            type: '',
            num: rew.data.reduce((a, b) => a + b.num * 1, 0)
        })
        setList(rew.data)
        // console.log(rew);
    }
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1} >
            <Box fontSize={18} mb={3}>水业务调运明细</Box>
            <Form layout={'horizontal'} labelPosition={'inset'} onSubmit={e => getlist(e)}>
                <Form.Input field='begintime' label='开始时间' type='date' initValue={moment().format('YYYY-MM-DD')} />
                <Form.Input field='endtime' label='结束时间' type='date' initValue={moment().format('YYYY-MM-DD')} />
                <Form.Select label="方式" field='mode' initValue={'调入'}>
                    <Form.Select.Option value={'调入'}>调入</Form.Select.Option>
                    <Form.Select.Option value={'调出'}>调出</Form.Select.Option>
                </Form.Select>
                <Form.Select label="类型" field='type' initValue={'重'}>
                    <Form.Select.Option value={'重'}>重</Form.Select.Option>
                    <Form.Select.Option value={'空'}>空</Form.Select.Option>
                </Form.Select>
                {/* <Form.Select label="部门" field='department' initValue={initData.DepartmentList.filter(item => item.type === '业务门店').map(item => item.name)} multiple maxTagCount={1} placeholder="不选默认查全部">

                    {
                        initData.DispatchDepartmentList.map(item =>
                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>

                        )
                    }
                    {

                        initData.DepartmentList.filter(item => item.type === '业务门店').map(item =>

                            <Form.Select.Option value={item.name}>{item.label}</Form.Select.Option>
                        )
                    }
                </Form.Select> */}



                <Form.TreeSelect maxTagCount={1} field='department' rules={[
                    { required: true }
                ]} label="部门" multiple filter filterTreeNode leafOnly treeData={new_department}
                />



                {/* <Form.Select filter label="商品" field='goodsname' multiple maxTagCount={1} placeholder="不选默认查全部">
                    {
                        initData.GoodsList.filter(item => item.stocktype !== '液化气').map(item =>

                            <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                        )
                    }
                </Form.Select> */}


                <Form.TreeSelect maxTagCount={1} field='goodsname' placeholder="不选默认查全部" rules={[
                    { required: true }
                ]} label="商品" multiple filter filterTreeNode leafOnly treeData={new_goodslist} />

                <Form.Input label='经手人' field='handler' />
                <Button size='small' type="submit" variant="contained" >搜索</Button>
            </Form>



            <Box mt={3} height={'60vh'} overflow={'scroll'}>

                <AgGridReact
                    className='ag-theme-balham'
                    localeText={translations}
                    rowData={list}
                    columnDefs={[
                        { field: 'addtime', headerName: '日期', width: 150 },
                        { field: 'mode', headerName: '方式', valueGetter: ({ data }) => data.mode + data.type, width: 150 },
                        { field: 'grant_department', headerName: '调出方', width: 150 },
                        { field: 'goodsname', headerName: '商品名称', width: 150 },
                        { field: 'num', headerName: '数量', width: 150 },
                        { field: 'department', headerName: '接收方', width: 150 },
                        { field: 'handler', headerName: '经手人', width: 150 },
                    ]}
                    defaultColDef={{
                        sortable: true,
                        resizable: true,
                    }}
                />

            </Box>
        </Box>
    );
};

export default Index;