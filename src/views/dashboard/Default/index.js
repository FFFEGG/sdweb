import { useEffect, useState } from 'react';

// material-ui
import { Button, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import QRCode from 'qrcode.react';
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import MainCard from "../../../ui-component/cards/MainCard";
import { red } from "@mui/material/colors";
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";
import request from "../../../utils/request";
import { Pie, G2, Column } from '@ant-design/plots';
import { Tabs, TabPane } from "@douyinfe/semi-ui";
import BaiduMap from "../../comments/BaiduMap";
import copy from 'copy-to-clipboard';


// ==============================|| DEFAULT DASHBOARD ||============================== //

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));


const Dashboard = () => {

    const userinfo = JSON.parse(localStorage.getItem('userinfo'))

    const [isLoading, setLoading] = useState(true);
    const [UserGroups, setUserGroups] = useState([]);
    const [GoodsDistributionTime, setGoodsDistributionTime] = useState([]);
    const [WorkDepdeliverymanList, setWorkDepdeliverymanList] = useState([]);

    const GetBasicOverviewOfUserGroups = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_HomePageInformation.GetBasicOverviewOfUserGroups',
            type: '用户类型'
        })
        console.log('用户群体基本概况', rew);
        const arr = rew.data.map(item => {
            return {
                type: item.customertype,
                value: parseInt(item.num)
            }
        })
        console.log(arr)
        setUserGroups(arr)
    }

    const GetTotalOrderGoodsDistributionTime = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_HomePageInformation.GetTotalOrderGoodsDistributionTime'
        })
        const data = rew.data
        let arr = []
        for (const k in data) {

            for (const ki in data[k]) {
                // console.log(data[k][ki])
                arr.push({
                    name: k,
                    time: parseInt(ki) + '点',
                    value: parseInt(data[k][ki].wsd) + parseInt(data[k][ki].ysd)
                })
            }
        }
        setGoodsDistributionTime(arr)
        console.log('当天订单商品预约时间分布', rew);
    }
    const GetTotalSalesSecurityCheck = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_HomePageInformation.GetTotalSalesSecurityCheck'
        })
        console.log('当天销售安检小计', rew);
    }
    const GetWorkDepdeliverymanList = async () => {
        const rew = await request('post', '/api/getInfo', {
            url: 'Srapp.Web_HomePageInformation.GetWorkDepdeliverymanList'
        })
        setWorkDepdeliverymanList(rew.data)
        console.log('配送人员上班列表(用于显示地图)', rew);
    }

    const DemoColumn = () => {
        const data = GoodsDistributionTime
        const config = {
            data,
            isGroup: true,
            xField: 'time',
            yField: 'value',
            seriesField: 'name',

            /** 设置颜色 */
            //color: ['#1ca9e6', '#f88c24'],

            /** 设置间距 */
            // marginRatio: 0.1,
            label: {
                // 可手动配置 label 数据标签位置
                position: 'middle',
                // 'top', 'middle', 'bottom'
                // 可配置附加的布局方法
                layout: [
                    // 柱形图数据标签位置自动调整
                    {
                        type: 'interval-adjust-position',
                    }, // 数据标签防遮挡
                    {
                        type: 'interval-hide-overlap',
                    }, // 数据标签文颜色自动调整
                    {
                        type: 'adjust-color',
                    },
                ],
            },
        };
        return <Column {...config} />;
    };

    // useEffect(() => {
    //     setLoading(false);
    //
    // }, []);



    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={6}>
                        <CardWrapper style={{ background: '#f2f2f2' }}>


                            <Tabs type={"line"} onChange={e => {
                                // console.log(e)
                                if (e == 3) {
                                    setLoading(true)
                                }

                            }}>
                                <TabPane tab="APP授权登录" itemKey="1">

                                    <QRCode
                                        onClick={() => {

                                            copy(CryptoJS.AES.encrypt(userinfo.login_department_appkey, 'JmYcAEiTql5EEyPW').toString())
                                            alert('复制成功')
                                        }}
                                        id="qrCode"
                                        value={CryptoJS.AES.encrypt(userinfo.login_department_appkey, 'JmYcAEiTql5EEyPW').toString()}
                                        size={295} // 二维码的大小
                                        fgColor="#000000" // 二维码的颜色
                                        style={{ borderRadius: '10px' }}
                                        imageSettings={{ // 二维码中间的logo图片
                                            src: 'logoUrl',
                                            height: 100,
                                            width: 100,
                                            excavate: false, // 中间图片所在的位置是否镂空
                                        }}
                                    />
                                </TabPane>
                                <TabPane tab="APP下载" itemKey="2">
                                    <QRCode

                                        id="qrCode"
                                        value="https://nnsrosstest.oss-rg-china-mainland.aliyuncs.com/speed.apk"
                                        size={295} // 二维码的大小
                                        fgColor="#000000" // 二维码的颜色
                                        style={{ borderRadius: '10px' }}
                                        imageSettings={{ // 二维码中间的logo图片
                                            src: 'logoUrl',
                                            height: 100,
                                            width: 100,
                                            excavate: false, // 中间图片所在的位置是否镂空
                                        }}
                                    />
                                </TabPane>

                                <TabPane tab="刷新数据" itemKey="3">
                                    <Box height={300}>
                                        {
                                            isLoading && <Button onClick={() => {
                                                setLoading(false);
                                                GetBasicOverviewOfUserGroups()
                                                GetTotalOrderGoodsDistributionTime()
                                                GetTotalSalesSecurityCheck()
                                                GetWorkDepdeliverymanList()
                                            }}>点击刷新</Button>
                                        }

                                    </Box>

                                </TabPane>
                            </Tabs>



                        </CardWrapper>

                    </Grid>


                    <Grid item xs={6}>
                        <CardWrapper>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>用户分布 </Typography>
                            <Pie
                                height={300}
                                data={UserGroups}
                                angleField='value'
                                colorField='type'
                                radius={0.9}
                                label={
                                    {
                                        type: 'inner',
                                        offset: '-30%',
                                        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
                                        style: {
                                            fontSize: 14,
                                            textAlign: 'center',
                                            color: 'white'
                                        }
                                    }
                                }
                            />
                        </CardWrapper>
                    </Grid>

                    <Grid item xs={12}>
                        <CardWrapper sx={{ background: '#FFF' }}>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: '#000' }}>下单 </Typography>
                            <DemoColumn />
                        </CardWrapper>
                    </Grid>
                    <Grid item xs={12} >
                        <Box p={3} borderRadius={1} bgcolor={'#fff'}>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: '#000' }}>配送员地图 </Typography>

                            {
                                WorkDepdeliverymanList.length && <BaiduMap WorkDepdeliverymanList={WorkDepdeliverymanList} />
                            }



                        </Box>

                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    );
};

export default Dashboard;
