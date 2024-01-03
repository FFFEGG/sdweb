import { Highlight, Timeline } from '@douyinfe/semi-ui';
import { Box, Button } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import React, { useState } from 'react';
import request from 'utils/request';

const UserInformationUpdateRecord = ({ userinfo }) => {
    console.log('UserInformationUpdateRecord', userinfo)
    const [list, setlist] = useState([])
    const getlist = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_User_Infos.UserInformationUpdateRecord',
            userid: userinfo.userid,
            begintime: '1999-01-01',
            endtime: moment(new Date()).format('YYYY-MM-DD'),
        })
        // 按照时间排序
        let arr = rew.data.sort((a, b) => {
            return new Date(b.addtime).getTime() - new Date(a.addtime).getTime()
        })

        // 两个对象的差异
        arr = arr.map((item, index) => {
            item.difference = getData(JSON.parse(item.newinfo), JSON.parse(item.oldinfo))
            return item
        })
        console.log('arr', arr)
        setlist(arr)

    }

    function getData(obj1, obj2) {
        const arr = []
        for (const key in obj1) {
            // 两个对象都有这个key，并且值不等
            if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key) && obj1[key] !== obj2[key]) {
                arr.push(key)
            }
        }
        return arr
    }


    return (

        <div style={{ marginTop: 10 }}>
            <Button variant="contained" onClick={getlist}>搜索</Button>
            <Box height={'60vh'} overflow={'scroll'} sx={{ mt: 2 }}>

                <Timeline>
                    {list.map((item, index) =>
                        <Timeline.Item time={
                            <>
                                <Box fontSize={13} color={'black'} mb={1}>
                                    操作类型:{item.type} 操作人:{item.operator} 操作部门:{item.department}
                                </Box>
                                <Box fontSize={13} color={'black'} mb={1}>
                                    旧信息: <Highlight sourceString={item.oldinfo} searchWords={item.difference} />
                                </Box>
                                <Box fontSize={13} color={'black'} mb={1}>
                                    新信息: <Highlight sourceString={item.newinfo} searchWords={item.difference} />
                                </Box>

                            </>

                        }>
                            {item.addtime}

                        </Timeline.Item>
                    )}
                </Timeline>





            </Box>

        </div>
    );
};

export default UserInformationUpdateRecord;