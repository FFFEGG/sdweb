import React, {useEffect} from 'react';
import { Button } from "@mui/material";
import copy from "copy-to-clipboard";
import request from "../../../utils/request";

const UserInfo = ({ userinfo }) => {
    // console.log(userinfo)
    const [list, setList] = React.useState([])
    useEffect(async ()=>{
        //获取用户地址信息
        if (userinfo) {
            const rew = await request('post','/api/getInfo',{
                url:"Srapp.Web_User_Infos.UserAddress",
                userid: userinfo.userid
            });
            setList(rew.data)
        }

    },[userinfo])
    const copymsg = (text) => {
        copy(text)
    }
    return (
        <>
            <table className="tableuser">
                <tbody>
                    <tr>
                        <th>会员号</th>
                        <th><Button p={0} onClick={() => copymsg(userinfo.memberid)}
                            sx={{ color: "#000" }}>{userinfo.memberid}</Button></th>
                        <th>姓名</th>
                        <th><Button p={0} onClick={() => copymsg(userinfo.name)}
                            sx={{ color: "#000" }}>{userinfo.name}</Button></th>
                        <th>单位</th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.workplace)}
                                sx={{ color: "#000" }}>{userinfo.workplace}</Button>
                        </th>

                    </tr>
                    <tr>
                        <th>
                            电话
                        </th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.telephone)}
                                sx={{ color: "#000" }}>{userinfo.telephone}</Button>
                        </th>
                        <th>
                            信用额度
                        </th>
                        <th>
                            <Button p={0} onClick={() => copymsg(parseFloat(userinfo.quota).toFixed(2))}
                                sx={{ color: "#000" }}>{parseFloat(userinfo.quota).toFixed(2)}</Button>

                        </th>
                        <th>
                            发卡点
                        </th>

                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.department)}
                                sx={{ color: "#000" }}>{userinfo.department}</Button>

                        </th>

                    </tr>
                    <tr>
                        <th>类型</th>
                        <th><Button p={0} onClick={() => copymsg(userinfo.customertype)}
                            sx={{ color: "#000" }}>{userinfo.customertype}</Button></th>
                        <th>开户时间</th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.addtime)}
                                sx={{ color: "#000" }}>{userinfo?.addtime?.substr(0, 10) ?? ''}</Button>
                        </th>
                        <th>专项款</th>
                        <th><Button p={0} onClick={() => copymsg(parseFloat(userinfo.cashgiftbalance).toFixed(2))}
                            sx={{ color: "#000" }}>{parseFloat(userinfo.cashgiftbalance).toFixed(2)}</Button>
                        </th>
                    </tr>
                    <tr>
                        <th>
                            余额
                        </th>
                        <th>

                            <Button p={0} onClick={() => copymsg(userinfo.balance)}
                                sx={{ color: "#000" }}><span style={{ color: 'red' }}>{parseFloat(userinfo.balance).toFixed(2)}</span></Button>
                        </th>

                        <th>
                            住所类型
                        </th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.housingproperty)}
                                sx={{ color: "#000" }}>{userinfo.housingproperty}</Button>

                        </th>
                        <th>
                            开户业务员
                        </th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.developsalesman)}
                                sx={{ color: "#000" }}>{userinfo.developsalesman}</Button>

                        </th>


                    </tr>
                    <tr>

                        <th>用户等级</th>
                        <th><Button p={0} onClick={() => copymsg(userinfo.viplevel)}
                            sx={{ color: "#000" }}>{userinfo.viplevel}</Button></th>
                        <th>归属部门</th>

                        <th><Button p={0} onClick={() => copymsg(userinfo.attributiondepartment)}
                            sx={{ color: "#000" }}>{userinfo.attributiondepartment}</Button>
                        </th>
                        <th>发卡人</th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.operator)}
                                sx={{ color: "#000" }}>{userinfo.operator}</Button>
                        </th>
                    </tr>
                    <tr>

                        <th>
                            状态
                        </th>
                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.state)}
                                sx={{ color: "#000" }}>{userinfo.state}</Button>
                        </th>
                        <th>
                            维护业务员

                        </th>

                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.salesman)}
                                sx={{ color: "#000" }}>{userinfo.salesman}</Button>

                        </th>

                        <th>
                            备注
                        </th>

                        <th>
                            <Button p={0} onClick={() => copymsg(userinfo.remarks)}
                                sx={{ color: "#000" }}>{userinfo.remarks}</Button>
                        </th>

                    </tr>
                    <tr>
                        <th>积分</th>
                        <th><Button p={0} onClick={() => copymsg(userinfo.integral)}
                                           sx={{ color: "#000" }}>{userinfo.integral}</Button></th>
                        <th >地址信息</th>
                        <th colSpan={3}>
                            <select style={{
                                fontSize: 16,
                                border: "none",
                                padding: '2px'
                            }}>
                                {
                                    list.filter(item=>item.state === '正常').map(item=>
                                    <option value={item.address}>{item.address}</option>
                                    )
                                }
                            </select>
                            {/*<Button p={0} onClick={() => copymsg(userinfo.address)}*/}
                            {/*        sx={{ color: "#000" }}>{userinfo.address}</Button>*/}
                        </th>
                    </tr>


                </tbody>
            </table>
        </>


    );
};

export default UserInfo;
