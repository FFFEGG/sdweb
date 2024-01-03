import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {useForm} from "react-hook-form";
import moment from "moment/moment";
import {Box, Button} from "@mui/material";
import UserInfo from "./UserInfo";
import {Form,Popconfirm} from "@douyinfe/semi-ui";
import request from "../../../utils/request";
import {toast} from "react-toastify";

const CollectUserPackingtypeMaterialNoTraceTheSource = ({customization}) => {
    const initData = JSON.parse(localStorage.getItem('initData'))
    const loginuser = JSON.parse(localStorage.getItem('userinfo'))
    const [userinfo, setuserinfo] = useState('')
    const [formdata, setformdata] = useState('')


    useEffect(() => {
        setuserinfo(customization.user)
    }, [customization])

    return (
        <div>
            <Box marginBottom={3} p={3} bgcolor="#fff" borderRadius={1}>
                <UserInfo userinfo={userinfo}/>
            </Box>

            <Box marginBottom={3} p={3} bgcolor="#fff" borderRadius={1}>
                <Box>收取用户带入包装物物资信息（非溯源）</Box>

                <Form onChange={e=> setformdata(e.values)}>
                    <Form.Select label={'包装物'} field={'packingtypeid'} style={{width: '100%'}}>
                        {
                            initData.PackingtypeList.filter(item=>item.exchangemode !== '溯源').map(item=>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }

                    </Form.Select>

                    <Form.Input field={'num'} label={'数量'} />
                    <Form.Input field={'remarks'} label={'备注'} />
                    {
                          <Popconfirm title="提示" content="确认操作?" onConfirm={async () => {
                                          const rew = await request('post','/api/getInfo',{
                                              url: 'Srapp.Web_BusinessProcessing_Handle.CollectUserPackingtypeMaterialNoTraceTheSource',
                                                  ...formdata,
                                              userid: userinfo.userid,
                                              memberid: userinfo.memberid,
                                          })
                                          if (rew.data.msg === 'SUCCESS') {
                                              toast.success('操作成功')
                                          } else {
                                              toast.error(`操作失败 ${rew.data.tips}`)
                                          }
                                      }}>
                              <Button type={"submit"} variant={"contained"}>确认</Button>
                          </Popconfirm>
                    }

                </Form>
            </Box>
        </div>
    );
};


const mapStateToProps = (state) => state

export default  connect(mapStateToProps)(CollectUserPackingtypeMaterialNoTraceTheSource);
