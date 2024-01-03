import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { Form, Modal } from "@douyinfe/semi-ui";
import CylinderPriceTable from "../../comments/CylinderPriceTable";
// import './index.css'

const BuyUserTongPackingtypeMaterial = () => {




    const api = useRef(null)

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>

            <Box p={3} bgcolor="#fff" >
                <Box border={1} p={2} borderColor="#999">
                    <Typography fontSize={23} textAlign="center" fontWeight="bold"
                        marginBottom={2}>收购包装物物资业务(桶)</Typography>
                    <Form layout="vertical" getFormApi={e => api.current = e} onSubmit={async e => {
                        // nature	枚举类型	必须		范围：收购(外单位)/收购(本单位)	收购(外单位)
                        // code	字符串	必须		最大：75	识别码
                        // property_unit	字符串	必须		最大：75	产权单位
                        // manufacturing_unit	字符串	可选		最大：75	制造单位
                        // packingtype	字符串	必须		最大：75	包装物类型
                        // reg_number	字符串	必须		最大：75	登记编号（钢印）
                        // date4manufacture	日期	必须			生产日期
                        // production_number	字符串	必须		最大：75	出厂编号
                        // lasttestdate	字符串	可选			最近检测日期
                        // nexttestdate	日期	必须			下次检测日期
                        // volume	字符串	必须			容积（L）
                        // wall_thickness	字符串	必须			设计壁厚（MM）
                        // nominal_pressure	字符串	必须			公称压力(Mpa)
                        // weight	浮点型	必须			瓶重KG
                        // remarks	字符串	可选		最大：150	备注
                        // marketprice	浮点型	必须			收购指导金额
                        // price	浮点型	必须			收购金额
                        // num	整型	可选	1		数量
                        const rew = await request('post', '/api/getInfo', {
                            url: 'Srapp.Web_BusinessProcessing_Handle.BuyUserPackingtypeMaterial',
                            nature: '收购(外单位)',
                            code: '0o0o00o0',
                            property_unit: '三燃',
                            // manufacturing_unit: '梧州市沃华机械有限公司',
                            packingtype: '5加仑PC桶',
                            reg_number: '0o0o00o0',
                            date4manufacture: '2021-10-10',
                            production_number: '0o0o00o0',
                            lasttestdate: '2021-10-10',
                            nexttestdate: '2021-10-10',
                            volume: '0o0o00o0',
                            wall_thickness: '0o0o00o0',
                            nominal_pressure: '0o0o00o0',
                            weight: '0o0o00o0',
                            remarks: e.remarks,
                            marketprice: e.zd_price,
                            price: e.price,
                            num: e.num,
                        })
                        if (rew.data.msg == 'SUCCESS') {
                            toast.success('成功')
                            api.current.reset()
                        } else {
                            toast.error('失败')
                        }

                    }} >
                        <Form.Input label="收购价" field='price' type="text" rules={[{ required: true }]} />
                        <Form.Input label="指导价" field='zd_price' type="text" rules={[{ required: true }]} />
                        <Form.Input label="数量" field='num' type="text" rules={[{ required: true }]} />
                        <Form.Input label="备注" field='remarks' type="text" rules={[{ required: true }]} />
                        <br />
                        <Box>
                            <Button variant="contained" type="submit">提交</Button>
                        </Box>

                    </Form>
                    {/* 
                        <table className="BuyUserPackingtypeMaterialtable">
                            <thead>
                                <tr>
                                    <th>
                                        识别码
                                    </th>
                                    <td>
                                        <Form.Input noLabel={true} field='code' type="text" />
                                    </td>
                                    <th>
                                        产权单位
                                    </th>
                                    <td>
                                        <Form.Input noLabel={true} field='property_unit' initValue={'三燃'} type="text" />
                                    </td>
                                    <th>
                                        制造单位
                                    </th>
                                    <td>

                                        <Form.Select filter field='manufacturing_unit' initValue={'梧州市沃华机械有限公司'} noLabel={true} >
                                            {
                                                factory.map(({ value, label }, index) => <Form.Select.Option key={index}

                                                    value={label}>{label}</Form.Select.Option>)
                                            }
                                        </Form.Select>

                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>
                                        包装物类型
                                    </th>
                                    <td>
                                        <Form.Select
                                            noLabel={true}
                                            field='packingtype' >
                                            {
                                                initData.PackingtypeList.map(({ id, name }, index) => <Form.Select.Option key={index}
                                                    value={name}>{name}</Form.Select.Option>)
                                            }

                                        </Form.Select>
                                    </td>

                                    <th>
                                        登记编号（钢印）
                                    </th>
                                    <td>

                                        <Form.Input noLabel={true} field='reg_number' type="text" />
                                    </td>
                                    <th>
                                        出厂编号
                                    </th>
                                    <td>
                                        <Form.Input noLabel={true} field='production_number' type="text" />
                                    </td>


                                </tr>
                                <tr>
                                    <th>
                                        生产日期
                                    </th>
                                    <td>
                                        <Form.Input initValue={moment().format('YYYY-MM-DD')} noLabel={true} field='date4manufacture' type="date" />
                                    </td>
                                    <th>
                                        最近检测日期
                                    </th>
                                    <td>

                                        <Form.Input initValue={moment().format('YYYY-MM-DD')} noLabel={true} field='lasttestdate' type="date" />
                                    </td>
                                    <th>
                                        下次检测日期
                                    </th>
                                    <td>
                                        <Form.Input initValue={moment().format('YYYY-MM-DD')} noLabel={true} field='nexttestdate' type="date" />
                                    </td>
                                </tr>

                                <tr>
                                    <th>
                                        容积（L）
                                    </th>
                                    <td>
                                        <Form.Input noLabel={true} field='volume' type="text" />
                                    </td>

                                    <th>
                                        设计壁厚（MM）


                                    </th>
                                    <td>

                                        <Form.Input noLabel={true} field='wall_thickness' type="text" />
                                    </td>
                                    <th>
                                        公称压力(Mpa)

                                    </th>
                                    <td>

                                        <Form.Input noLabel={true} field='nominal_pressure' type="text" />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        瓶重KG

                                    </th>
                                    <td>

                                        <Form.Input noLabel={true} field='weight' type="text" />
                                    </td>

                                    <th>
                                        属性
                                    </th>
                                    <td>

                                        <Form.Select noLabel={true} field='nature' initValue={'收购(本单位)'} >
                                            <Form.Select.Option value="收购(本单位)">收购(本单位)</Form.Select.Option>
                                            <Form.Select.Option value="收购(外单位)">收购(外单位)</Form.Select.Option>
                                        </Form.Select>
                                    </td>

                                    <th>
                                        指导价格
                                    </th>
                                    <td>
                                        <input style={{ height: 'auto' }} value={zd_price} />
                        
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        收购金额
                                    </th>
                                    <td>

                                        <Form.Input noLabel={true} field='price' type="text" />
                                    </td>
                                    <th>
                                        是否报废
                                    </th>
                                    <td>
                                        <Form.Select noLabel={true} field='is_bf' initValue={'否'} >
                                            <Form.Select.Option value="是">是</Form.Select.Option>
                                            <Form.Select.Option value="否">否</Form.Select.Option>
                                        </Form.Select>
                                    </td>
                                    <th>
                                        备注
                                    </th>
                                    <td  >

                                        <Form.Input noLabel={true} field='remarks' type="text" />

                                    </td>
                                </tr>
                            </tbody>
                        </table> */}

                </Box>

            </Box>

            {/*<Box p={3}>*/}
            {/*    <CylinderPriceTable />*/}
            {/*</Box>*/}

        </Box >
    );
};

export default BuyUserTongPackingtypeMaterial;
