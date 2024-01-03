import { Box, Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import React, { useRef } from 'react';
import translations from '../../utils/translations';
import { Form, Modal, ArrayField, Button as Buttons } from '@douyinfe/semi-ui';
import request from 'utils/request';
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import { toast } from 'react-toastify';

const GetTransportationExpensesParameter = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [list, setList] = React.useState([]);
    const [add, setAdd] = React.useState(false);
    const api = useRef(null);
    const [data, setArr] = React.useState([
        { name: 'Semi D2C', role: 'Engineer' },
        { name: 'Semi C2D', role: 'Designer' },
    ])
    return (
        <div>
            <Box p={3} bgcolor={'#FFF'} borderRadius={1}>
                <Box fontSize={18} mb={3}>
                    运输费用参数
                </Box>
                <Box>
                    <Button onClick={async () => {
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_SystemInfo.GetTransportationExpensesParameter',
                        })
                        setList(rew.data.info);
                    }} variant="outlined">搜索</Button>
                    <Button onClick={() => {
                        setAdd(true);
                    }} variant="outlined" sx={{ ml: 1 }}>新增</Button>
                </Box>

                <Box height={'60vh'} mt={3} overflow={'scroll'}>
                    <AgGridReact
                        className="ag-theme-balham"
                        rowData={list}
                        localeText={translations}
                        columnDefs={[

                            { headerName: 'ID', field: 'id' },
                            { headerName: '类型', field: 'type' },
                            { headerName: '名称', field: 'name' },
                            { headerName: '详情', field: 'detailed' },
                            { headerName: '状态', field: 'state' },
                            { headerName: '备注', field: 'remarks' },
                            {
                                headerName: '操作', field: 'action', cellRendererFramework: (e) => {
                                    return (
                                        e.data.type != '不计直送用户' && <Box>
                                            <Button onClick={() => {
                                                setAdd(true);
                                                setTimeout(() => {
                                                    api.current.setValues({
                                                        action: 'UPDATE',
                                                        id: e.data.id,
                                                        type: e.data.type,
                                                        name: e.data.name,
                                                        state: e.data.state,
                                                        detailed: e.data.detailed,
                                                    })

                                                    api.current.setValue('id', e.data.id)
                                                    api.current.setValue('action', 'UPDATE')

                                                }, 1000);
                                            }} variant="text" size="small" sx={{ ml: 1 }}>修改</Button>
                                        </Box>
                                    )
                                }
                            },
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                        }}
                        onFirstDataRendered={e => e.api.sizeColumnsToFit()}
                    />
                </Box>


                <Modal visible={add} title="新增/修改" onOk={() => {
                    api.current.submitForm();
                }} onCancel={() => { setAdd(false) }}>
                    <Form
                        initValues={{
                            action: 'ADD',
                            id: 0,
                        }}
                        getFormApi={e => api.current = e}
                        onSubmit={async e => {
                            // Srapp.Web_SystemSetting.SettingTransportationExpensesParameter
                            // 设置运输公司运费装卸费参数
                            // 接口地址：http://113.16.193.82:8203/?s=Srapp.Web_SystemSetting.SettingTransportationExpensesParameter
                            // POST
                            // 接口描述：

                            // 接口参数
                            // 参数名字	类型	是否必须	默认值	其他	说明
                            // action	枚举类型	必须		范围：ADD/UPDATE	状态（ADD,UPDATE）
                            // id	整型	可选	0		ID
                            // type	字符串	必须			类型
                            // name	字符串	必须			名称
                            // detailed	字符串	可选			详情
                            // 'kg15zyf'     => 5, //15kg重运费
                            // 'kg15kyf'     => 2, //15kg空运费
                            // 'kg15zzxf'    => 1, //15kg重装卸费
                            // 'kg15kzxf'    => 0.5, //15k空装卸费
                            // 'kg5zyf'      => 2, //5kg重运费
                            // 'kg5kyf'      => 1, //5kg空运费
                            // 'kg5zzxf'     => 0.5,//5kg重装卸费
                            // 'kg5kzxf'     => 0.5,//5k空装卸费            
                            // 'kg50zyf'     => 7,//50kg重运费
                            // 'kg50kyf'     => 3,//50kg空运费
                            // 'kg50zzxf'    => 2,//50kg重装卸费
                            // 'kg50kzxf'    => 1,//50k空装卸费   
                            // 'kg2zyf'      => 2, //2kg重运费
                            // 'kg2kyf'      => 1, //2kg空运费
                            // 'kg2zzxf'     => 0.5,//2kg重装卸费
                            // 'kg2kzxf'     => 0.5,//2k空装卸费                        
                            // 'zzddj'       => 1,//重折吨单价
                            // 'kzddj'       => 1,//空折吨单价
                            e.detailed.kg15zyf = parseFloat(e.detailed.kg15zyf);
                            e.detailed.kg15kyf = parseFloat(e.detailed.kg15kyf);
                            e.detailed.kg15zzxf = parseFloat(e.detailed.kg15zzxf);
                            e.detailed.kg15kzxf = parseFloat(e.detailed.kg15kzxf);
                            e.detailed.kg5zyf = parseFloat(e.detailed.kg5zyf);
                            e.detailed.kg5kyf = parseFloat(e.detailed.kg5kyf);
                            e.detailed.kg5zzxf = parseFloat(e.detailed.kg5zzxf);
                            e.detailed.kg5kzxf = parseFloat(e.detailed.kg5kzxf);
                            e.detailed.kg50zyf = parseFloat(e.detailed.kg50zyf);
                            e.detailed.kg50kyf = parseFloat(e.detailed.kg50kyf);
                            e.detailed.kg50zzxf = parseFloat(e.detailed.kg50zzxf);
                            e.detailed.kg50kzxf = parseFloat(e.detailed.kg50kzxf);
                            e.detailed.kg2zyf = parseFloat(e.detailed.kg2zyf);
                            e.detailed.kg2kyf = parseFloat(e.detailed.kg2kyf);
                            e.detailed.kg2zzxf = parseFloat(e.detailed.kg2zzxf);
                            e.detailed.kg2kzxf = parseFloat(e.detailed.kg2kzxf);
                            e.detailed.zzddj = parseFloat(e.detailed.zzddj);
                            e.detailed.kzddj = parseFloat(e.detailed.kzddj);


                            const rew = await request('post', '/api/getInfo', {

                                url: 'Srapp.Web_SystemSetting.SettingTransportationExpensesParameter',
                                ...e,
                                detailed: JSON.stringify(e.detailed),
                            })
                            if (rew.data.msg === 'SUCCESS') {
                                setAdd(false);
                                toast.success('操作成功');
                            } else {
                                console.log(rew.data.msg);
                                toast.success('操作失败');
                            }
                            console.log(e);
                        }}
                    >

                        <Form.Select field='type' label="类型" >
                            <Form.Select.Option value="代销运费">代销运费</Form.Select.Option>
                            <Form.Select.Option value="工商气运费">工商气运费</Form.Select.Option>
                            <Form.Select.Option value="零售调拨运费">零售调拨运费</Form.Select.Option>
                        </Form.Select>
                        <Form.Input field='name' label="名称" />
                        {/* 'kg15zyf'     => 5, //15kg重运费
                        'kg15kyf'     => 2, //15kg空运费
                        'kg15zzxf'    => 1, //15kg重装卸费
                        'kg15kzxf'    => 0.5, //15k空装卸费
                        'kg5zyf'      => 2, //5kg重运费
                        'kg5kyf'      => 1, //5kg空运费
                        'kg5zzxf'     => 0.5,//5kg重装卸费
                        'kg5kzxf'     => 0.5,//5k空装卸费            
                        'kg50zyf'     => 7,//50kg重运费
                        'kg50kyf'     => 3,//50kg空运费
                        'kg50zzxf'    => 2,//50kg重装卸费
                        'kg50kzxf'    => 1,//50k空装卸费   
                        'kg2zyf'      => 2, //2kg重运费
                        'kg2kyf'      => 1, //2kg空运费
                        'kg2zzxf'     => 0.5,//2kg重装卸费
                        'kg2kzxf'     => 0.5,//2k空装卸费                        
                        'zzddj'       => 1,//重折吨单价
                        'kzddj'       => 1,//空折吨单价
                        */}
                        <Form.Input field='detailed.kg15zyf' label="15kg重运费" />
                        <Form.Input field='detailed.kg15kyf' label="15kg空运费" />
                        <Form.Input field='detailed.kg15zzxf' label="15kg重装卸费" />
                        <Form.Input field='detailed.kg15kzxf' label="15kg空装卸费" />
                        <Form.Input field='detailed.kg5zyf' label="5kg重运费" />
                        <Form.Input field='detailed.kg5kyf' label="5kg空运费" />
                        <Form.Input field='detailed.kg5zzxf' label="5kg重装卸费" />
                        <Form.Input field='detailed.kg5kzxf' label="5kg空装卸费" />
                        <Form.Input field='detailed.kg50zyf' label="50kg重运费" />
                        <Form.Input field='detailed.kg50kyf' label="50kg空运费" />
                        <Form.Input field='detailed.kg50zzxf' label="50kg重装卸费" />
                        <Form.Input field='detailed.kg50kzxf' label="50kg空装卸费" />
                        <Form.Input field='detailed.kg2zyf' label="2kg重运费" />
                        <Form.Input field='detailed.kg2kyf' label="2kg空运费" />
                        <Form.Input field='detailed.kg2zzxf' label="2kg重装卸费" />
                        <Form.Input field='detailed.kg2kzxf' label="2kg空装卸费" />
                        <Form.Input field='detailed.zzddj' label="重折吨单价" />
                        <Form.Input field='detailed.kzddj' label="空折吨单价" />
                        <Form.Input field='detailed.kzddj' label="空折吨单价" />
                        <Form.Select field='detailed.deliveryman' multiple filter label="司机" style={{ width: '100%' }}>
                            {
                                initData.OperatorList.filter(item => item.department == '运输公司').map(item =>

                                    <Form.Select.Option value={item.name}>{item.name}</Form.Select.Option>
                                )
                            }
                        </Form.Select>

                        {/* <Form.Input field='detailed' label="详情" /> */}

                        {/* 
                        <ArrayField field='detailed' initValue={data}>
                            {({ add, arrayFields, addWithInitValue }) => (
                                <React.Fragment>
                                    <Buttons onClick={add} icon={<IconPlusCircle />} theme='light'>添加新规则</Buttons>
                                    {
                                        arrayFields.map(({ field, key, remove }, i) => (
                                            <div key={key} style={{ width: 1000, display: 'flex' }}>
                                        
                                                <Form.Input
                                                    labelPosition="inset"
                                                    field={`${field}[kg15zyf]`}
                                                    label={`15kg重运费`}
                                                    style={{ width: 200, }}
                                                >
                                                </Form.Input>

                                                <Buttons
                                                    type='danger'
                                                    theme='borderless'
                                                    icon={<IconMinusCircle />}
                                                    onClick={remove}
                                                    style={{ margin: 12 }}
                                                />
                                            </div>
                                        ))
                                    }
                                </React.Fragment>
                            )}
                        </ArrayField> */}
                        <Form.Input field='remarks' label="备注" />

                        <Form.Select field='state' label="状态">
                            <Form.Select.Option value="正常">正常</Form.Select.Option>
                            <Form.Select.Option value="取消">取消</Form.Select.Option>
                        </Form.Select>
                    </Form>
                </Modal>


            </Box>
        </div >
    );
};

export default GetTransportationExpensesParameter;