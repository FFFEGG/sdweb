import React, {useRef} from 'react';
import {Box} from "@mui/system";
import {Button} from "@mui/material";
import {Button as Buttons, Form, Upload} from "@douyinfe/semi-ui";
import * as XLSX from "xlsx";
import {IconUpload} from "@douyinfe/semi-icons";
import moment from "moment";
import request from "../../utils/request";
import {AgGridReact} from "ag-grid-react";
import {toast} from "react-toastify";
// 引用图片
import tjfile from '../../assets/调价模板.xlsx'

const VerifyPriceAdjustment = () => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const api = useRef()
    const [show, setShow] = React.useState(false);
    const [list, setList] = React.useState([])
    return (
        <Box p={3} borderRadius={1} >
            <Box fontSize={18} mb={3}>验证调价用户信息</Box>
            {
                show &&
                <Upload action="http://srsdapi.sanrangas.com/" onFileChange={async e => {
                    if (api.current.getValue('attributiondepartmentid') == '') {
                        alert('请选择归属部门')
                        return
                    }
                    // console.log(e);
                    const file = e[0];
                    const reader = new FileReader();
                    // reader.readAsText(file);
                    if (reader.readyState === FileReader.DONE || reader.readyState === FileReader.EMPTY) {
                        reader.onload = async function (event) {
                            const data = new Uint8Array(event.target.result)
                            const workbook = XLSX.read(data, {type: 'array'})
                            const sheetName = workbook.SheetNames[0]
                            const worksheet = workbook.Sheets[sheetName]
                            const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1})

                            const dataArray = []
                            for (let i = 0; i < rows.length; i++) {
                                const row = rows[i]
                                console.log('第' + i + '条+++++', row)

                                if (i === 1) {
                                    api.current.setValue('goodsid', initData.GoodsList.find(item => item.name === row[0]).id)
                                    // api.current.setValue('salestype',row[1])
                                    api.current.setValue('sellbykilogram', row[2])
                                    api.current.setValue('price', row[3])
                                    api.current.setValue('starttime', moment(row[4]).format('YYYY-MM-DD'))
                                    api.current.setValue('endtime', moment(row[5]).format('YYYY-MM-DD'))

                                    api.current.setValue('payment', row[6])
                                    api.current.setValue('applican_department', row[7])
                                    api.current.setValue('applicant_ope', row[8])
                                    api.current.setValue('authorized_ope', row[9])

                                }
                                if (i > 2) {
                                    dataArray.push(row[0].toString())
                                }
                            }

                            console.log('dataArray', dataArray)
                            const rew = await request('post','/api/getInfo',{
                                url: 'Srapp.Web_Other_Infos.VerifyPriceAdjustment',
                                memberids: JSON.stringify(dataArray),
                                attributiondepartmentid: api.current.getValue('attributiondepartmentid'),
                            })
                            console.log('rew', rew)
                            setList(rew.data)
                        }

                        reader.readAsArrayBuffer(file)
                    } else {
                        console.log('FileReader is busy')
                    }

                }}>
                    <Buttons icon={<IconUpload />} theme="light">
                        点击上传
                    </Buttons>
                </Upload>
            }

            <Box mt={2}></Box>
           <Form onSubmit={async e=>{
               const rew = await request('post','/api/getInfo',{
                   ...e,
                   userinfo: JSON.stringify(list),
                   url: 'Srapp.Web_Other_Handle.BatchPriceAdjustment'
               })

               if (rew.data.msg === 'SUCCESS') {
                   toast.success('操作成功')
                } else {
                     toast.error('操作失败' + rew.data.tips)
                }


           }} getFormApi={e=>api.current = e} layout={'horizontal'} labelPosition={'inset'}>
               <Form.Select label={'归属部门'} onChange={e=> setShow(true)} filter field={'attributiondepartmentid'} style={{width: 300}}>
                   {
                       initData.DepartmentList
                           .filter(item=>item.manage_users == 1)
                           .map((item,index)=>{
                           return <Form.Select.Option key={index} value={item.id}>{item.label}</Form.Select.Option>
                       })
                   }
               </Form.Select>

               <Form.Select label={'商品'} field={'goodsid'} style={{width: 300}}>
                   {
                       initData.GoodsList.map((item,index)=>{
                           return <Form.Select.Option key={index} value={item.id}>{item.name}</Form.Select.Option>
                       })
                   }
               </Form.Select>
               {/*salestype	枚举类型	必须		范围：市场价格优惠/固定价格优惠	市场价格优惠,固定价格优惠*/}
               {/*sellbykilogram	枚举类型	必须		范围：是/否	折公斤售卖（是否可录余气）*/}
               {/*price	浮点型	必须			优惠金额*/}
               {/*starttime	日期	必须			开始时间*/}
               {/*endtime	日期	必须			结束时间*/}
               {/*remarks	字符串	可选		最大：150	备注*/}
               {/*payment	枚举类型	必须		范围：现金支付/月结支付	支付方式（所有支付都可享受优惠，仅月结支付时用户才能使用月结支付方式）*/}
               {/*applican_department	字符串	可选		最大：150	申请部门*/}
               {/*applicant_ope	字符串	可选		最大：150	申请人*/}
               {/*authorized_ope	字符串	可选		最大：150*/}
               <Form.Select label={'优惠类型'} initValue={'市场价格优惠'} field={'salestype'} style={{width: 300}}>
                     <Form.Select.Option value={'市场价格优惠'}>市场价格优惠</Form.Select.Option>
                     {/*<Form.Select.Option value={'固定价格优惠'}>固定价格优惠</Form.Select.Option>*/}
                </Form.Select>
                <Form.Select label={'是否可录余气'} field={'sellbykilogram'} style={{width: 300}}>
                     <Form.Select.Option value={'是'}>是</Form.Select.Option>
                     <Form.Select.Option value={'否'}>否</Form.Select.Option>
                </Form.Select>
                <Form.Input label={'优惠金额'} field={'price'} style={{width: 300}}/>
                <Form.Input type={'date'} label={'开始时间'}  field={'starttime'} style={{width: 300}}/>
                <Form.Input type={'date'} label={'结束时间'} field={'endtime'} style={{width: 300}}/>

                <Form.Select label={'支付方式'} field={'payment'} style={{width: 300}}>
                     <Form.Select.Option value={'现金支付'}>现金支付</Form.Select.Option>
                     <Form.Select.Option value={'月结支付'}>月结支付</Form.Select.Option>
                </Form.Select>
                <Form.Input label={'申请部门'} field={'applican_department'} style={{width: 300}}/>
                <Form.Input label={'申请人'} field={'applicant_ope'} style={{width: 300}}/>
                <Form.Input label={'授权人'} field={'authorized_ope'} style={{width: 300}}/>
                <Button size={'small'} variant={'outlined'} type={'submit'}>提交</Button>
                <Button sx={{ml:2}} onClick={()=>{
                    //下载调价模板 tjfile
                    window.open(tjfile)
                }} size={'small'} variant={'outlined'} type={'button'}>调价模版</Button>
           </Form>

            <Box mt={3} overflow={'scroll'} height={'60vh'}>
                <AgGridReact
                    className={'ag-theme-balham'}
                    rowData={list}
                    columnDefs={[
                        // {
                        //     "userid": "267817",
                        //     "memberid": "165888",
                        //     "name": "雷兆春",
                        //     "telephone": "17677153715",
                        //     "workplace": "三燃",
                        //     "address": "广西壮族自治区南宁市白沙北四里116号401房",
                        //     "customertypeid": "1",
                        //     "attributiondepartmentid": "91",
                        //     "attributiondepartment": "商用气开发二部",
                        //     "customertype": ""
                        // }

                        {field: 'memberid', headerName: '会员', width: 150},
                        {field: 'name', headerName: '姓名', width: 150},
                        {field: 'telephone', headerName: '电话', width: 150},
                        {field: 'workplace', headerName: '工作单位', width: 150},
                        {field: 'address', headerName: '地址', width: 150},
                        {field: 'attributiondepartment', headerName: '归属部门', width: 150},
                        {field: 'customertype', headerName: '用户类型', width: 150},

                    ]}
                />
            </Box>
        </Box>
    );
};

export default VerifyPriceAdjustment;
