import React, {useEffect, useState} from 'react';
import {Box} from "@mui/system";
import {connect} from "react-redux";
import UserInfo from "../pages/users/UserInfo";
import {Form} from "@douyinfe/semi-ui";
import {Button} from "@mui/material";
import request from "../../utils/request";
import {toast} from "react-toastify";

const UserTransferDisplayInfo = ({ customization }) => {
    const [userinfo, setuserinfo] = useState('')
    const [userarrearsrecord, setuserarrearsrecord] = useState([])
    const [usergoodssalespromotion, setusergoodssalespromotion] = useState([])
    const [userpackingtypewarehouse, setuserpackingtypewarehouse] = useState([])
    const [usersalesrecord, setusersalesrecord] = useState([])
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    useEffect(async () => {
        if (!userinfo.userid) {
            return
        }
        const rew = await request('post','/api/getInfo',{
            url: 'Srapp.Web_User_Infos.UserTransferDisplayInfo',
            userid: userinfo.userid,
            page: 1
        })
        console.log(rew)
        setuserarrearsrecord(rew.data.userarrearsrecord)
        setusergoodssalespromotion(rew.data.usergoodssalespromotion)
        setuserpackingtypewarehouse(rew.data.userpackingtypewarehouse)
        setusersalesrecord(rew.data.usersalesrecord)
    }, [userinfo])
    return (
        <div>
            <Box p={3}>
                <Box fontSize={18} mb={3}>商用气客户移交</Box>
                <UserInfo userinfo={userinfo} />

                <Form style={{marginTop: 10}} onSubmit={async e=> {
                    // Srapp.Web_User_EditInfo.BatchChangeUserInfo
                    // 批量修改用户归属部门、业务员资料
                    //
                    // 参数名字	类型	是否必须	默认值	其他	说明
                    // userids	字符串	必须			userids json ["1","2","3"]
                    // attributiondepartmentid	整型	必须			归属部门ID
                    // salesmanopeid	字符串	可选			业务员opeid
                    // remarks	字符串	必须			备注
                    // token	字符串	必须
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_User_EditInfo.BatchChangeUserInfo',
                        userids: JSON.stringify([userinfo.userid]),
                        attributiondepartmentid: e.department,
                        salesmanopeid: e.salesman,
                        remarks: loginuser.name + '移交客户',
                    })
                    if (rew.data.msg === 'SUCCESS') {
                        toast.success('操作成功')
                    } else {
                        toast.error(`操作失败 ${rew.data.tips}`)
                    }
                }}>
                    <Form.Select filter field={'department'} label={'移交部门'} style={{width: '100%'}} size={'large'}>
                        {
                            initData.DepartmentList
                                .filter(item=>item.name.includes('商'))
                                .map(item=><Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>
                    <Form.Select filter field={'salesman'} label={'移交业务员'} style={{width: '100%'}} size={'large'}>
                        {
                            initData.OperatorList
                                .filter(item=>item.department.includes('商'))
                                .sort((a,b)=>a.department.localeCompare(b.department))
                                .map(item=><Form.Select.Option value={item.opeid}>[{item.department}]-{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>
                    <Button type={'submit'} variant={'contained'}>提交</Button>
                </Form>

                <br/>
                <br/>
                <table className={'my-table'} >
                    <thead>
                        <tr>
                            <th colSpan={16}>价格优惠信息</th>
                        </tr>
                    </thead>
                    <tbody>

                            {/*申请时间	开始时间	结束时间	商品名称	优惠方式	单价	部门	申请人	支付方式	授权部门	授权人	授权时间	撤销部门	撤销人	撤销时间	状态*/}
                            <tr>
                                <td>申请时间</td>
                                <td>开始时间</td>
                                <td>结束时间</td>
                                <td>商品名称</td>
                                <td>优惠方式</td>
                                <td>单价</td>
                                <td>部门</td>
                                <td>申请人</td>
                                <td>支付方式</td>
                                <td>授权部门</td>
                                <td>授权人</td>
                                <td>授权时间</td>
                                <td>撤销部门</td>
                                <td>撤销人</td>
                                <td>撤销时间</td>
                                <td>状态</td>
                            </tr>
                            {
                                usergoodssalespromotion.map(item=>
                                    <tr>
                                        {/*{*/}
                                        {/*    "addtime": "2023-06-24 17:39:14.580",*/}
                                        {/*    "starttime": "2023-06-24 00:00:00.000",*/}
                                        {/*    "endtime": "2025-02-13 00:00:00.000",*/}
                                        {/*    "goodsid": "2",*/}
                                        {/*    "goodsname": "12KG液化气",*/}
                                        {/*    "salestype": "市场价格优惠",*/}
                                        {/*    "price": 100,*/}
                                        {/*    "applican_department": "商用气开发三部",*/}
                                        {/*    "applicant_ope": "蓝浩元",*/}
                                        {/*    "payment": "现金支付",*/}
                                        {/*    "authorized_department": "商用气开发三部",*/}
                                        {/*    "authorized_ope": "黄家红",*/}
                                        {/*    "authorized_time": "2023-06-24 17:39:54.000",*/}
                                        {/*    "revoke_department": "",*/}
                                        {/*    "revoke_ope": "",*/}
                                        {/*    "revoke_time": null,*/}
                                        {/*    "state": "已授权"*/}
                                        {/*}*/}
                                        <td>{item.addtime}</td>
                                        <td>{item.starttime.substring(0,10)}</td>
                                        <td>{item.endtime.substring(0,10)}</td>
                                        <td>{item.goodsname}</td>
                                        <td>{item.salestype}</td>
                                        <td>{item.price}</td>
                                        <td>{item.applican_department}</td>
                                        <td>{item.applicant_ope}</td>
                                        <td>{item.payment}</td>
                                        <td>{item.authorized_department}</td>
                                        <td>{item.authorized_ope}</td>
                                        <td>{item.authorized_time}</td>
                                        <td>{item.revoke_department}</td>
                                        <td>{item.revoke_ope}</td>
                                        <td>{item.revoke_time}</td>
                                        <td>{item.state}</td>

                                    </tr>
                                )
                            }
                    </tbody>

                </table>

                <br/>
                <br/>

                {/*欠瓶信息*/}
                {/*物品名	方式	数量	计费方式	使用时间	计费时间	退物资时间	部门	操作员	状态*/}

                <table className={'my-table'} >
                    <thead>
                    <tr>
                        <th colSpan={10}>欠瓶信息</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>物品名</td>
                        <td>方式</td>
                        <td>数量</td>
                        <td>计费方式</td>
                        <td>使用时间</td>
                        <td>计费时间</td>
                        <td>退物资时间</td>
                        <td>部门</td>
                        <td>操作员</td>
                        <td>状态</td>
                    </tr>
                    {
                        userpackingtypewarehouse.map(item=>
                            <tr>
                                {/*{*/}
                                {/*    "name": "司机代办钢瓶",*/}
                                {/*    "mode": "借用",*/}
                                {/*    "num": "1",*/}
                                {/*    "billingmode": "不计费",*/}
                                {/*    "usetime": "2023-06-25 12:15:49.000",*/}
                                {/*    "billingtime": "2023-06-25 00:00:00.000",*/}
                                {/*    "retreat_time": "2023-06-28 10:55:50.000",*/}
                                {/*    "department": "商用气开发三部",*/}
                                {/*    "operator": "蓝浩元",*/}
                                {/*    "state": "已退物资"*/}
                                {/*}*/}
                                <td>{item.name}</td>
                                <td>{item.mode}</td>
                                <td>{item.num}</td>
                                <td>{item.billingmode}</td>
                                <td>{item.usetime}</td>
                                <td>{item.billingtime}</td>
                                <td>{item.retreat_time}</td>
                                <td>{item.department}</td>
                                <td>{item.operator}</td>
                                <td>{item.state}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
                <br/>
                <br/>

                {/*销售信息*/}
                {/*物品名	单价	数量	交易时间	方式	部门	操作员	状态*/}
                {/*45KG液化气	370	1	00:00.0	商品销售	运输公司	黄李春	正常*/}

                <table className={'my-table'} >
                    <thead>
                    <tr>
                        <th colSpan={8}>销售信息</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>物品名</td>
                        <td>单价</td>
                        <td>数量</td>
                        <td>交易时间</td>
                        <td>方式</td>
                        <td>部门</td>
                        <td>操作员</td>
                        <td>状态</td>
                    </tr>
                    {
                        usersalesrecord.map(item=>
                            <tr>
                                {/*{*/}
                                {/*    "goodsname": "45KG液化气",*/}
                                {/*    "price": "370.0000",*/}
                                {/*    "num": "1.0",*/}
                                {/*    "addtime": "2023-09-02 00:00:00.000",*/}
                                {/*    "mode": "商品销售",*/}
                                {/*    "department": "运输公司",*/}
                                {/*    "operator": "梁玉静"*/}
                                {/*}*/}
                                <td>{item.goodsname}</td>
                                <td>{item.price}</td>
                                <td>{item.num}</td>
                                <td>{item.addtime}</td>
                                <td>{item.mode}</td>
                                <td>{item.department}</td>
                                <td>{item.operator}</td>
                                <td>{item.state}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>

                <br/>
                <br/>

                {/*欠款信息*/}
                {/*生成时间	类型	商品名称	单价	数量	金额	还款时间	还款金额	操作员	状态*/}

                <table className={'my-table'} >
                    <thead>
                    <tr>

                        <th colSpan={10}>欠款信息</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>生成时间</td>
                        <td>类型</td>
                        <td>商品名称</td>
                        <td>单价</td>
                        <td>数量</td>
                        <td>金额</td>
                        <td>还款时间</td>
                        <td>还款金额</td>
                        <td>操作员</td>
                        <td>状态</td>
                    </tr>
                    {
                        userarrearsrecord.map(item=>
                            <tr>
                                {/*addtime,payment,goodsname,price,num,total,collection_date,total,collection_ope*/}
                                <td>{item.addtime}</td>
                                <td>{item.payment}</td>
                                <td>{item.goodsname}</td>
                                <td>{item.price}</td>
                                <td>{item.num}</td>
                                <td>{item.total}</td>
                                <td>{item.collection_date}</td>
                                <td>{item.collection_total}</td>
                                <td>{item.collection_ope}</td>
                                <td>{item.state}</td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>


            </Box>
        </div>
    );
};

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(UserTransferDisplayInfo);
