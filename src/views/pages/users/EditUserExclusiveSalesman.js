import React, {useEffect, useState} from 'react';
import {Box} from "@mui/system";
import UserInfo from "./UserInfo";
import {connect} from "react-redux";
import {Form} from "@douyinfe/semi-ui";
import {Button, MenuItem} from "@mui/material";
import request from "../../../utils/request";

const EditUserExclusiveSalesman = ({customization}) => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))

    const [userinfo, setuserinfo] = useState('')

    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])


    return (
        <Box>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll">
                <UserInfo userinfo={userinfo}/>
            </Box>

            <Box p={3} mt={3} bgcolor={'#fff'} borderRadius={1}>

                <Box fontSize={18}>编辑专属业务员信息</Box>
                <Form onSubmit={async e=> {
                    const rew = await request('post','/api/getInfo',{
                        url: 'Srapp.Web_User_EditInfo.UserExclusiveSalesman',
                        userid: userinfo.userid,
                        ...e
                    })
                    console.log(rew);
                }}>
                    <Form.Select field={'catid'} label={'类型id'} style={{width: '100%'}}>
                        {
                            initData.GoodsCatList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'customertypeid'} label={'用户类型'} style={{width: '100%'}}>
                        {
                            initData.CustomertypeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'attributiondepartmentid'} label={'归属部门'} style={{width: '100%'}}>
                        {
                            initData.DepartmentList.filter(item=>item.manage_users == 1).map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'salesmanopeid'} label={'业务员'} style={{width: '100%'}}>
                        {
                            initData.OperatorList.map(item =>
                                <Form.Select.Option value={item.opeid}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>


                    <Form.Select field={'state'} label={'状态'} style={{width: '100%'}}>
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>


                    <Button variant={"contained"} type={"submit"}>确认</Button>
                </Form>
            </Box>

        </Box>

    );
};

const mapStateToProps = (state) => state

export default connect(mapStateToProps)(EditUserExclusiveSalesman);
