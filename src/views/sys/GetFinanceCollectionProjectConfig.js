import React, {useEffect, useRef, useState} from 'react';
import {Box} from "@mui/system";
import {Button} from "@mui/material";
import request from "../../utils/request";

import { ArrayField, TextArea, Form,Modal, Button as Btn, useFormState } from '@douyinfe/semi-ui';
import { IconPlusCircle, IconMinusCircle } from '@douyinfe/semi-icons';
import {toast} from "react-toastify";
import {AgGridReact} from "ag-grid-react/lib/agGridReact";

const GetFinanceCollectionProjectConfig = () => {
    const [list, setlist] = useState([])
    const [rowdata, setrowdata] = useState([])
    const [show,setshow] = useState(false)
    const [show2,setshow2] = useState(false)
    const [arr_all,setarr_all] = useState([])
    const [keyindex,setkeyindex] = useState('')
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GetFinanceCollectionProjectConfig'
        })
        if (rew.data.msg == 'SUCCESS') {
            setlist(rew.data.info.info)

        } else {
            setlist([])
        }

        const rews = await request('post','/api/getInfo', {
            url: 'Srapp.Web_SystemInfo.GetFinanceCorrespondingCollectionProject'
        })
        setrowdata(rews.data.info.info)
    }




    const api = useRef()
    const api2 = useRef()
    return (
        <Box p={3} bgcolor={'#fff'} borderRadius={1}>
            <Box fontSize={18} mb={2}>获取财务收款项目配置</Box>
            <Button variant={'contained'} onClick={()=>getlist()} >搜索</Button>
            <Button variant={'contained'} sx={{ml:2}} onClick={()=> {
                setshow(true)

            }} >新增</Button>



            <Modal title={'新增财务收款项目配置'} size={'large'} visible={show} onCancel={()=>setshow(false)} footer={()=><></>} onOk={async (e)=>{}}>
                <Form getFormApi={e=>api.current = e} onSubmit={async e=> {
                    const rew = await  request('post','/api/getInfo',{
                        url: 'Srapp.Web_SystemSetting.SettingFinanceCollectionProjectConfig',
                        info: JSON.stringify(e.info)
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('新增成功')
                        setshow(false)
                        getlist()
                    }

                }}>
                    <ArrayField field='info' initValue={list}>
                        {({ add, arrayFields, addWithInitValue }) => (
                            <React.Fragment>
                                <Btn onClick={add} icon={<IconPlusCircle />} theme='light'>新增配置</Btn>
                                 {
                                    arrayFields.map(({ field, key, remove }, i) => (
                                        <div key={key} style={{ width: 1000, display: 'flex' }}>
                                            <Form.Input
                                                field={`${field}[project]`}
                                                label={`项目名`}
                                                style={{ width: 200, marginRight: 16 }}
                                            >
                                            </Form.Input>

                                            <Form.TagInput
                                                onFocus={e=> {
                                                    console.log(e)
                                                    // alert(111)
                                                    console.log('field',field)
                                                    setshow2(true)
                                                    setkeyindex(field)
                                                    setTimeout(()=>{
                                                        let apiarr = api.current.getValue('info')

                                                        let arr = apiarr.map(item=>item.value)
                                                        // let arr = list.map(item=>item.value)
                                                        //转一维数组
                                                        arr = arr.flat(Infinity)
                                                        // rowdata 过滤 arr
                                                        const arrs = rowdata.filter(item=>!arr.includes(item))
                                                            setarr_all(arrs)
                                                        //api2.current.setValue('list',api.current.getValue(`${field}[value]`))
                                                    }
                                                    , 500)
                                                }}
                                                field={`${field}[value]`}
                                                label={`收款项 多个收款项按回车录入`}
                                                style={{ width: 600, marginRight: 16 }}
                                            >
                                            </Form.TagInput>

                                            <Btn
                                                type='danger'
                                                theme='borderless'
                                                icon={<IconMinusCircle />}
                                                onClick={remove}

                                            />
                                        </div>
                                    ))
                                }
                            </React.Fragment>
                        )}
                    </ArrayField>
                    <Box sx={{width: '100%'}} mt={3}>
                        <Button variant={'contained'} type={'submit'}>确认添加</Button>
                    </Box>

                </Form>
            </Modal>
            <Modal title={'选择配置项'} size={'large'} visible={show2} onOk={()=>{
                api2.current.submitForm()
                setTimeout(()=>{
                    setshow2(false)
                },100)
                // console.log('api2.current.getValue()',api2.current.getValue())
                // console.log('api.current.getValue()',api.current.getValue(`${keyindex}[value]`))
            }} onCancel={()=> {
                api2.current.submitForm()
                setTimeout(()=>{
                    setshow2(false)
                },100)
                // console.log('api2.current.getValue()',api2.current.getValue())
                // console.log('api.current.getValue()',api.current.getValue(`${keyindex}[value]`))
            }}>
                <Box height={'60vh'} overflow={'scroll'}>
                    <Form getFormApi={e=>api2.current = e} onSubmit={e=>{
                        if (e.list.length === 0) {
                            toast.error('请选择配置项')
                            return false
                        }
                        let arr = api.current.getValue(`${keyindex}[value]`) || []
                        arr = arr.concat(e.list)
                        console.log('arr',arr)
                        api.current.setValue(`${keyindex}[value]`,arr)
                    }}>
                        <Form.CheckboxGroup field={'list'} label={'配置项'}>
                            {
                                arr_all.map((item,index)=>{
                                    return <Form.Checkbox key={index} value={item} label={item} >{item}</Form.Checkbox>
                                })
                            }
                        </Form.CheckboxGroup>
                    </Form>
                </Box>
            </Modal>
            <Box mt={3} height={'60vh'} overflow={'scroll'}>
                <AgGridReact
                    className="ag-theme-balham"
                    rowData={list}
                    columnDefs={[

                        { headerName: "项目名", field: "project", sortable: true, },
                        { headerName: "收款项", field: "value", sortable: true, },
                        { headerName: "操作", cellRendererFramework: (params) => {
                            //修改
                            return <Button size="small" onClick={()=>{
                                setshow(true)
                                setTimeout(()=>{
                                    api.current.setValue('info',list)
                                }, 500)
                            }} >修改</Button>

                            }}
                    ]}
                    defaultColDef={{
                        flex: 1,
                        resizable: true,
                        sortable: true,
                        filter: 'agTextColumnFilter',
                        floatingFilter: true,
                    }}

                />
            </Box>
        </Box>
    );
};

export default GetFinanceCollectionProjectConfig;