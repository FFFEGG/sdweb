import React, { useEffect } from 'react';
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import request from "../../../utils/request";
import { toast } from "react-toastify";
import { getCode } from 'utils/getCode';

const CreateMaterialPackingtypeArchives = () => {
    const factory = [
        {
            value: 1,
            label: "安徽省枞阳县压力容器厂"
        },
        {
            value: 2,
            label: "安阳市液化气炉具厂"
        },
        {
            value: 3,
            label: "鞍山新澳特种压力容器有限公司"
        },
        {
            value: 4,
            label: "鞍山液化石油气钢瓶总厂"
        },
        {
            value: 5,
            label: "包头市火龙钢瓶制造有限公司"
        },
        {
            value: 6,
            label: "包头市金双菱金属制品有限公司"
        },
        {
            value: 7,
            label: "包头市煤气用具厂"
        },
        {
            value: 8,
            label: "北京市煤气用具厂"
        },
        {
            value: 9,
            label: "北京金海鑫压力容器制造有限公司"
        },
        {
            value: 10,
            label: "北京金属结构厂"
        },
        {
            value: 11,
            label: "北京天海工业有限公司"
        },
        {
            value: 12,
            label: "常州市飞机制造有限公司"
        },
        {
            value: 13,
            label: "成都高压容器厂"
        },
        {
            value: 14,
            label: "成都五冶钢瓶公司"
        },
        {
            value: 15,
            label: "大连连泰压力容器有限公司"
        },
        {
            value: 16,
            label: "德州鲁王化工机械有限公司"
        },
        {
            value: 17,
            label: "佛山市赛尔燃气具有限公司"
        },
        {
            value: 18,
            label: "佛山市顺德百福五金制造有限公司"
        },
        {
            value: 19,
            label: "抚顺机械制造有限责任公司"
        },
        {
            value: 20,
            label: "抚顺煤矿安全仪器总厂"
        },
        {
            value: 21,
            label: "广东粤海钢瓶厂茂石化联营厂"
        },
        {
            value: 22,
            label: "广东省台山市机械厂有限公司"
        },
        {
            value: 23,
            label: "卫国机械厂"
        },
        {
            value: 24,
            label: "广西建工集团二建公司压力容器制造厂"
        },
        {
            value: 25,
            label: "广州钢瓶五金制品厂"
        },
        {
            value: 26,
            label: "广州市荔湾钢管制品厂"
        },
        {
            value: 27,
            label: "国营红岗机械厂"
        },
        {
            value: 28,
            label: "国营建成机械厂钢瓶分厂"
        },
        {
            value: 29,
            label: "国营江北机械厂"
        },
        {
            value: 30,
            label: "国营江峡船舶柴油机厂"
        },
        {
            value: 31,
            label: "哈尔滨北方压力容器有限公司"
        },
        {
            value: 32,
            label: "哈尔滨哈飞机电产品制造有限责任公司"
        },
        {
            value: 33,
            label: "哈尔滨石油化工机械厂"
        },
        {
            value: 34,
            label: "海南省钢瓶厂"
        },
        {
            value: 35,
            label: "韩国NK公司"
        },
        {
            value: 36,
            label: "杭州美佳压力容器有限公司"
        },
        {
            value: 37,
            label: "杭州市鼎力容器厂"
        },
        {
            value: 38,
            label: "杭州天龙钢瓶有限公司"
        },
        {
            value: 39,
            label: "杭州余杭獐山钢瓶有限公司"
        },
        {
            value: 40,
            label: "河北百工实业有限公司"
        },
        {
            value: 41,
            label: "河北省冀州市厨房设备厂"
        },
        {
            value: 42,
            label: "河北省景县厨房设备厂"
        },
        {
            value: 43,
            label: "河北省任丘市旭丰钢瓶厂"
        },
        {
            value: 44,
            label: "新乡市钢瓶厂"
        },
        {
            value: 45,
            label: "河南英威东风机械制造有限公司"
        },
        {
            value: 46,
            label: "山东省科学院荷泽市高压容器实验厂"
        },
        {
            value: 47,
            label: "黑龙江华安工业（集团）公司"
        },
        {
            value: 48,
            label: "湖北东荣压力容器厂"
        },
        {
            value: 49,
            label: "嘉兴压力容器厂"
        },
        {
            value: 50,
            label: "江南机器（集团）有限公司"
        },
        {
            value: 51,
            label: "江苏常乐压力容器制造公司"
        },
        {
            value: 52,
            label: "江苏海龙压力容器厂"
        },
        {
            value: 53,
            label: "江苏玉华容器制造有限公司"
        },
        {
            value: 54,
            label: "江西长征机器厂"
        },
        {
            value: 55,
            label: "姜堰市西西钢瓶有限公司"
        },
        {
            value: 56,
            label: "解放军第5712工厂燃气具公司"
        },
        {
            value: 57,
            label: "晋西机器工业集团有限责任公司"
        },
        {
            value: 58,
            label: "江苏民生特种设备集团有限公司"
        },
        {
            value: 59,
            label: "靖江市民生高压容器制造有限公司"
        },
        {
            value: 60,
            label: "九江三钻机械有限责任公司"
        },
        {
            value: 61,
            label: "巨化集团公司工程有限公司"
        },
        {
            value: 62,
            label: "辽宁省鞍山高压容器厂"
        },
        {
            value: 63,
            label: "美国NORIES公司"
        },
        {
            value: 64,
            label: "南海澳华液化石油气设备有限公司"
        },
        {
            value: 65,
            label: "南海市粤海钢制品有限公司"
        },
        {
            value: 66,
            label: "南京锅炉厂"
        },
        {
            value: 67,
            label: "南京海洋高压容器制造有限公司"
        },
        {
            value: 68,
            label: "南通华鼎压力容器有限公司"
        },
        {
            value: 69,
            label: "宁波化工机械总厂"
        },
        {
            value: 70,
            label: "宁波美恪乙炔瓶有限公司"
        },
        {
            value: 71,
            label: "宁波明欣化工机械有限责任公司"
        },
        {
            value: 72,
            label: "宁波中洲集团有限公司"
        },
        {
            value: 73,
            label: "莆田市恒达压力容器有限公司"
        },
        {
            value: 74,
            label: "七一零钢瓶实业有限公司"
        },
        {
            value: 75,
            label: "青岛安吉钢瓶厂"
        },
        {
            value: 76,
            label: "青岛钢瓶厂"
        },
        {
            value: 77,
            label: "青岛琴畅制罐有限公司"
        },
        {
            value: 78,
            label: "山东环日集团有限公司"
        },
        {
            value: 79,
            label: "山东建设高压容器有限公司"
        },
        {
            value: 80,
            label: "山东莱州市鑫星压力容器有限公司"
        },
        {
            value: 81,
            label: "山东省莱州市煤气用具厂"
        },
        {
            value: 82,
            label: "汕头经济特区华信压力容器厂"
        },
        {
            value: 83,
            label: "上海华盛企业（集团）有限公司"
        },
        {
            value: 84,
            label: "上海容华高压容器有限公司"
        },
        {
            value: 85,
            label: "沈阳东基集团有限公司"
        },
        {
            value: 86,
            label: "沈阳航天新光集团有限公司"
        },
        {
            value: 87,
            label: "沈阳科金新材料开发总公司"
        },
        {
            value: 88,
            label: "沈阳金属薄板制品厂"
        },
        {
            value: 89,
            label: "石家庄市钢瓶厂"
        },
        {
            value: 90,
            label: "TPA集团丰安五金机械（深圳）有限公司"
        },
        {
            value: 91,
            label: "天津市北方钢瓶制造有限公司"
        },
        {
            value: 92,
            label: "天津天海高压容器有限责任公司"
        },
        {
            value: 93,
            label: "桐乡煤矿机械厂"
        },
        {
            value: 94,
            label: "潍坊东明消防器材有限公司"
        },
        {
            value: 95,
            label: "潍坊市煤气生产用品厂"
        },
        {
            value: 96,
            label: "温州玉苍机械制造有限公司"
        },
        {
            value: 97,
            label: "武进市恒安容器制造有限公司"
        },
        {
            value: 98,
            label: "西安昆仑机械厂压力容器分厂"
        },
        {
            value: 99,
            label: "西安天洁航天科技股份有限公司"
        },
        {
            value: 100,
            label: "香河万方锅炉压力容器有限公司"
        },
        {
            value: 101,
            label: "新奥集团石家庄化工机械股份公司"
        },
        {
            value: 102,
            label: "新疆巴州金波管道容器制造有限责任公司"
        },
        {
            value: 103,
            label: "新疆通用机械有限公司"
        },
        {
            value: 104,
            label: "新乡利民机械工业公司"
        },
        {
            value: 105,
            label: "意大利FABER公司"
        },
        {
            value: 106,
            label: "英国CHESTFIELD公司"
        },
        {
            value: 107,
            label: "豫新汽车空调实业有限公司"
        },
        {
            value: 108,
            label: "浙江坚利美钢瓶制造公司"
        },
        {
            value: 109,
            label: "嵊州市钢瓶厂"
        },
        {
            value: 110,
            label: "浙江省鄞县煤气用具厂"
        },
        {
            value: 111,
            label: "浙江省永康市鹰鹏化工机械有限公司"
        },
        {
            value: 112,
            label: "中山市长征机械厂"
        },
        {
            value: 113,
            label: "中山市广沙钢瓶厂"
        },
        {
            value: 114,
            label: "重庆益峰高压容器有限公司"
        },
        {
            value: 115,
            label: "重庆益民机械厂"
        },
        {
            value: 116,
            label: "涿鹿高压容器有限公司"
        },
        {
            value: 117,
            label: "淄博市沂源压力容器厂"
        },
        {
            value: 118,
            label: "安徽嘉山钢瓶厂"
        },
        {
            value: 119,
            label: "舒城金利达钢瓶厂"
        },
        {
            value: 120,
            label: "安庆钢瓶厂"
        },
        {
            value: 121,
            label: "六安钢瓶厂"
        },
        {
            value: 122,
            label: "南安市液化石油气钢瓶厂"
        },
        {
            value: 123,
            label: "福州新榕机械发展有限公司"
        },
        {
            value: 124,
            label: "凯旋压力容器厂"
        },
        {
            value: 125,
            label: "湖山钢瓶厂"
        },
        {
            value: 126,
            label: "广西建工集团一建公司压力容器制造厂"
        },
        {
            value: 127,
            label: "广西桂林化工机械厂"
        },
        {
            value: 128,
            label: "中国石油天然气第六建设公司金属结构厂"
        },
        {
            value: 129,
            label: "中原石油勘探局建筑集团公司金属结构厂"
        },
        {
            value: 130,
            label: "中国石化茂名石油化工建设公司"
        },
        {
            value: 131,
            label: "景县钢瓶厂"
        },
        {
            value: 132,
            label: "解放军第6410工厂工贸总公司"
        },
        {
            value: 133,
            label: "华北油田管理局第二油田建设公司金属制品厂"
        },
        {
            value: 134,
            label: "华北油建一公司液化气钢瓶制造厂"
        },
        {
            value: 135,
            label: "保定市液化气灶具厂"
        },
        {
            value: 136,
            label: "唐山神蝶燃具有限公司"
        },
        {
            value: 137,
            label: "富达煤气厂"
        },
        {
            value: 138,
            label: "国营向东机器厂"
        },
        {
            value: 139,
            label: "河南豫新机械厂"
        },
        {
            value: 140,
            label: "河南省中原机械厂"
        },
        {
            value: 141,
            label: "河南省荥阳市钢瓶厂"
        },
        {
            value: 142,
            label: "武汉燃气设备制造厂"
        },
        {
            value: 143,
            label: "武汉中北经济发展有限公司"
        },
        {
            value: 144,
            label: "武汉船机石油化工设备制造有限公司"
        },
        {
            value: 145,
            label: "江汉石油管理局金属容器制造厂"
        },
        {
            value: 146,
            label: "国营第6803厂"
        },
        {
            value: 147,
            label: "湖北东荣钢瓶厂"
        },
        {
            value: 148,
            label: "荆门掇刀开发区压力容器制造厂"
        },
        {
            value: 149,
            label: "长沙空军机械厂"
        },
        {
            value: 150,
            label: "宏图飞机制造厂"
        },
        {
            value: 151,
            label: "江南深压机械厂"
        },
        {
            value: 152,
            label: "柳河华龙实业集团总公司低压容器厂"
        },
        {
            value: 153,
            label: "常乐钢瓶厂"
        },
        {
            value: 154,
            label: "常熟市安乐压力容器厂"
        },
        {
            value: 155,
            label: "江苏启东钢瓶厂"
        },
        {
            value: 156,
            label: "江苏金虹钢瓶厂"
        },
        {
            value: 157,
            label: "江苏三水压力容器股份有限公司"
        },
        {
            value: 158,
            label: "盐城钢瓶厂"
        },
        {
            value: 159,
            label: "盐城盛泰钢瓶制造有限公司"
        },
        {
            value: 160,
            label: "江阴液化气设备厂"
        },
        {
            value: 161,
            label: "姜堰市海龙机械设备制造有限公司"
        },
        {
            value: 162,
            label: "姜堰市第三机械厂"
        },
        {
            value: 163,
            label: "靖江钢瓶厂"
        },
        {
            value: 164,
            label: "靖江市双帆环保机械厂"
        },
        {
            value: 165,
            label: "靖江第二农机厂"
        },
        {
            value: 166,
            label: "金坛钢瓶厂"
        },
        {
            value: 167,
            label: "火箭压力容器厂"
        },
        {
            value: 168,
            label: "昆山火炬钢瓶厂"
        },
        {
            value: 169,
            label: "南京中建金陵气瓶制造有限公司"
        },
        {
            value: 170,
            label: "南京市煤气用具厂"
        },
        {
            value: 171,
            label: "南通压力容器厂"
        },
        {
            value: 172,
            label: "祁江县压力容器厂"
        },
        {
            value: 173,
            label: "三河口钢瓶厂"
        },
        {
            value: 174,
            label: "苏州火箭容器集团公司"
        },
        {
            value: 175,
            label: "泰县水利机械厂"
        },
        {
            value: 176,
            label: "泰县钢瓶厂"
        },
        {
            value: 177,
            label: "泰县第三机械厂"
        },
        {
            value: 178,
            label: "武进市钢瓶厂"
        },
        {
            value: 179,
            label: "无锡西漳压力容器厂"
        },
        {
            value: 180,
            label: "扬州市第一压力容器厂"
        },
        {
            value: 181,
            label: "扬州锅炉压力容器厂"
        },
        {
            value: 182,
            label: "扬州豫泰钢瓶制造有限公司"
        },
        {
            value: 183,
            label: "镇江市钢瓶厂"
        },
        {
            value: 184,
            label: "张家港市轻工机械四厂"
        },
        {
            value: 185,
            label: "上海市工业设备安装公司压力容器制造厂"
        },
        {
            value: 186,
            label: "九江柴油机厂"
        },
        {
            value: 187,
            label: "九江船用机械厂"
        },
        {
            value: 188,
            label: "本溪压力容器厂"
        },
        {
            value: 189,
            label: "国营东北机器制造厂"
        },
        {
            value: 190,
            label: "沈阳乙炔气瓶厂"
        },
        {
            value: 191,
            label: "辽河石油勘探局机械修造公司钢瓶厂"
        },
        {
            value: 192,
            label: "辽阳煤气用具制造厂"
        },
        {
            value: 193,
            label: "莱州钢瓶厂"
        },
        {
            value: 194,
            label: "济南煤气用具总厂"
        },
        {
            value: 195,
            label: "潍坊市坊子蒙潍钢瓶有限公司"
        },
        {
            value: 196,
            label: "淄博东齐压力容器厂"
        },
        {
            value: 197,
            label: "淄博市临淄压力容器厂"
        },
        {
            value: 198,
            label: "淄博压力容器厂"
        },
        {
            value: 199,
            label: "山东煤矿机械厂"
        },
        {
            value: 200,
            label: "山东阳谷高压容器厂"
        },
        {
            value: 201,
            label: "山东省阳谷县机械厂"
        },
        {
            value: 202,
            label: "山东阳谷中兴压力容器有限公司"
        },
        {
            value: 203,
            label: "山东沂南煤气用具厂"
        },
        {
            value: 204,
            label: "山东柳城锅炉厂"
        },
        {
            value: 205,
            label: "山东荷泽市钢瓶厂"
        },
        {
            value: 206,
            label: "山东海化集团潍坊化工机械厂钢瓶厂"
        },
        {
            value: 207,
            label: "山东诸城市华升煤气用具厂"
        },
        {
            value: 208,
            label: "山西省曲沃县钢瓶厂"
        },
        {
            value: 209,
            label: "山西钢瓶厂"
        },
        {
            value: 210,
            label: "汾西机械厂"
        },
        {
            value: 211,
            label: "庆安宇航厂"
        },
        {
            value: 212,
            label: "庆安机电制造公司庆安压力容器厂"
        },
        {
            value: 213,
            label: "西安昆仑钢瓶厂"
        },
        {
            value: 214,
            label: "四川空分设备（集团）有限公司"
        },
        {
            value: 215,
            label: "新疆前进机械厂"
        },
        {
            value: 216,
            label: "云南省化学工业建设公司机械厂"
        },
        {
            value: 217,
            label: "岱山机械厂"
        },
        {
            value: 218,
            label: "嵊州市双灵灶具厂"
        },
        {
            value: 219,
            label: "萧山如宝钢瓶厂"
        },
        {
            value: 220,
            label: "萧山钢瓶厂"
        },
        {
            value: 221,
            label: "杭州双鼎力容器厂"
        },
        {
            value: 222,
            label: "杭州制氧机械厂"
        },
        {
            value: 223,
            label: "嘉兴宏图钢瓶厂"
        },
        {
            value: 224,
            label: "宁海机械厂"
        },
        {
            value: 225,
            label: "浙江金盾压力容器有限公司"
        },
        {
            value: 226,
            label: "日本"
        },
        {
            value: 227,
            label: "南斯拉夫-游击队气瓶厂"
        },
        {
            value: 228,
            label: "四川益明机械厂"
        },
        {
            value: 229,
            label: "大庆总机厂"
        },
        {
            value: 230,
            label: "哈尔滨飞机制造有限公司"
        },
        {
            value: 231,
            label: "张家港市圣达因化工机械有限公司"
        },
        {
            value: 232,
            label: "常州市查特深冷设备有限公司"
        },
        {
            value: 233,
            label: "江阴石化设备厂"
        },
        {
            value: 234,
            label: "张家港钢瓶厂"
        },
        {
            value: 235,
            label: "常熟阀门厂"
        },
        {
            value: 236,
            label: "武汉工业锅炉总厂"
        },
        {
            value: 237,
            label: "自贡机械一厂"
        },
        {
            value: 238,
            label: "河北沧州集装箱集团有限公司"
        },
        {
            value: 239,
            label: "高邮市阀门厂"
        },
        {
            value: 240,
            label: "光芒集团"
        },
        {
            value: 241,
            label: "河南新乡市赛特钢瓶有限公司"
        },
        {
            value: 242,
            label: "鞍山高压容器厂"
        },
        {
            value: 243,
            label: "晋机集团公司"
        },
        {
            value: 244,
            label: "北京长城化工设备制造厂"
        },
        {
            value: 245,
            label: "石家庄化工机械股份有限公司"
        },
        {
            value: 246,
            label: "武进容器厂"
        },
        {
            value: 247,
            label: "廊坊天海高压容器有限公司"
        },
        {
            value: 248,
            label: "齐齐哈尔华安特种容器有限公司"
        },
        {
            value: 249,
            label: "宝应钢瓶厂"
        },
        {
            value: 250,
            label: "宝菊钢瓶厂"
        },
        {
            value: 251,
            label: "安益钢瓶厂"
        },
        {
            value: 252,
            label: "银盾"
        },
        {
            value: 253,
            label: "新乡市新阳钢瓶有限公司"
        },
        {
            value: 254,
            label: "南京银富钢瓶制造有限公司"
        },
        {
            value: 255,
            label: "上海元支高压容器有限公司"
        },
        {
            value: 256,
            label: "浙江永润高压容器有限公司"
        },
        {
            value: 257,
            label: "上海铁锚压力容器(集团)有限公司"
        },
        {
            value: 258,
            label: "山东华宸高压容器有限公司"
        },
        {
            value: 259,
            label: "江西宝钢集团人民机械厂"
        },
        {
            value: 260,
            label: "浙江普阳深冷装备有限公司"
        },
        {
            value: 261,
            label: "哈尔滨高压容器有限公司"
        },
        {
            value: 262,
            label: "广东省南海市良奇钢瓶厂"
        },
        {
            value: 263,
            label: "广东省华信钢瓶有限公司"
        },
        {
            value: 264,
            label: "广东省中山市广沙百福压力容器制造有限公司"
        },
        {
            value: 265,
            label: "杭州市西湖钢瓶有限公司"
        },
        {
            value: 266,
            label: "湖北省仙桃钢瓶有限公司"
        },
        {
            value: 267,
            label: "江苏省民生钢瓶有限公司"
        },
        {
            value: 268,
            label: "浙江省苍南钢瓶有限公司"
        },
        {
            value: 269,
            label: "泰来华顿气体设备有限公司"
        },
        {
            value: 270,
            label: "张家港市华瑞科技有限公司"
        },
        {
            value: 271,
            label: "哈尔滨高压容器厂"
        },
        {
            value: 272,
            label: "龙岩市钢瓶检测有限公司"
        },
        {
            value: 273,
            label: "上海荣华高压容器有限公司"
        },
        {
            value: 274,
            label: "中材科技（苏州）有限公司"
        },
        {
            value: 275,
            label: "潮州市机械厂"
        },
        {
            value: 276,
            label: "广东省顺德市桂州钢瓶厂"
        },
        {
            value: 277,
            label: "常州蓝翼飞机装备制造有限公司"
        },
        {
            value: 278,
            label: "浙江汇金机械制造"
        },
        {
            value: 279,
            label: "上海化工机械厂"
        },
        {
            value: 280,
            label: "上海化工机械一厂"
        },
        {
            value: 281,
            label: "新乡市奥凯钢瓶有限公司"
        },
        {
            value: 282,
            label: "江苏泰丰钢瓶有限公司"
        },
        {
            value: 283,
            label: "山东临沂市河东区永安金属焊割气厂"
        },
        {
            value: 284,
            label: "南通中集罐式储运设备制造有限公司"
        },
        {
            value: 285,
            label: "河南升辉特种设备有限公司"
        },
        {
            value: 286,
            label: "青岛瑞丰气体有限公司"
        },
        {
            value: 287,
            label: "石家庄安瑞科气体机械有限公司"
        },
        {
            value: 288,
            label: "张家港富瑞特种装备股份有限公司"
        },
        {
            value: 289,
            label: "台州市金麟钢瓶有限公司"
        },
        {
            value: 290,
            label: "山东丰龙高压容器有限公司"
        },
        {
            value: 291,
            label: "江苏安宜集团有限公司"
        },
        {
            value: 292,
            label: "山东青岛亨利高压容器有限公司"
        },
        {
            value: 293,
            label: "临沂市河东区永安金属焊割气厂"
        },
        {
            value: 294,
            label: "河南升辉特种装备有限公司"
        },
        {
            value: 295,
            label: "横扇"
        },
        {
            value: 296,
            label: "无锡市振达能源设备技术有限公司"
        },
        {
            value: 297,
            label: "美国Zaklady Apatury Chemicznej"
        },
        {
            value: 298,
            label: "美国CP Industries park  plant"
        },
        {
            value: 299,
            label: "泰钢"
        },
        {
            value: 300,
            label: "仙滢"
        },
        {
            value: 301,
            label: "万福"
        },
        {
            value: 302,
            label: "青岛爱琴海"
        },
        {
            value: 303,
            label: "菊花"
        },
        {
            value: 304,
            label: "鸿立"
        },
        {
            value: 305,
            label: "金江"
        },
        {
            value: 306,
            label: "福旺"
        },
        {
            value: 307,
            label: "天津市耀浩实业有限公司"
        },
        {
            value: 308,
            label: "锡山市西漳压力容器厂"
        },
        {
            value: 309,
            label: "安吉轻工机械总厂"
        },
        {
            value: 310,
            label: "中国人民解放军第六四一零工厂工贸总公司"
        },
        {
            value: 311,
            label: "唐山家兴工贸有限公司"
        },
        {
            value: 312,
            label: "唐山旭源燃气用具有限公司"
        },
        {
            value: 313,
            label: "石家庄市大明冲压件厂钢瓶厂"
        },
        {
            value: 314,
            label: "国营汾西机械厂"
        },
        {
            value: 315,
            label: "山西省长子县钢瓶厂"
        },
        {
            value: 316,
            label: "包头市金属制品厂"
        },
        {
            value: 317,
            label: "浙江慈溪压力容器制造厂"
        },
        {
            value: 318,
            label: "内蒙古铸锻厂"
        },
        {
            value: 319,
            label: "东阳市煤气用具厂"
        },
        {
            value: 320,
            label: "浙江凯旋燃具股份有限公司钢瓶公司"
        },
        {
            value: 321,
            label: "锦州市煤气公司钢瓶厂"
        },
        {
            value: 322,
            label: "锦州市钢瓶厂"
        },
        {
            value: 323,
            label: "辽河油田总机械厂容器分厂"
        },
        {
            value: 324,
            label: "抚顺液化石油气钢瓶厂"
        },
        {
            value: 325,
            label: "白城七零机械厂"
        },
        {
            value: 326,
            label: "浙江双发炉具总厂"
        },
        {
            value: 327,
            label: "吉化公司容器冲压厂"
        },
        {
            value: 328,
            label: "公主岭市钢瓶厂"
        },
        {
            value: 329,
            label: "肖山如宝钢瓶厂"
        },
        {
            value: 330,
            label: "江都化工机械厂"
        },
        {
            value: 331,
            label: "安徽省水利机械疏浚公司"
        },
        {
            value: 332,
            label: "张家港中集圣达因低温装备有限公司"
        },
        {
            value: 333,
            label: "莆田市工业设备安装公司"
        },
        {
            value: 334,
            label: "潍坊市压力容器厂"
        },
        {
            value: 335,
            label: "国营豫鑫机械厂"
        },
        {
            value: 336,
            label: "南阳市工业设备安装工程总公司"
        },
        {
            value: 337,
            label: "新乡市压力容器厂"
        },
        {
            value: 338,
            label: "洛阳一拖动能公司"
        },
        {
            value: 339,
            label: "安阳市钢圈厂"
        },
        {
            value: 340,
            label: "河南省信阳地区安装公司压力容器厂"
        },
        {
            value: 341,
            label: "三江航天集团国营江北机械厂"
        },
        {
            value: 342,
            label: "湖北省建筑机械股份有限公司"
        },
        {
            value: 343,
            label: "中国人民解放军5712工厂"
        },
        {
            value: 344,
            label: "衡阳市钢瓶制造厂"
        },
        {
            value: 345,
            label: "江南机械厂第四分厂"
        },
        {
            value: 346,
            label: "江门市江南厨房设备厂"
        },
        {
            value: 347,
            label: "柳州市钢瓶厂"
        },
        {
            value: 348,
            label: "国营第四三四厂"
        },
        {
            value: 349,
            label: "铁道部贵阳车辆厂"
        },
        {
            value: 350,
            label: "中国人民解放军5707工厂"
        },
        {
            value: 351,
            label: "楚雄林业机械厂"
        },
        {
            value: 352,
            label: "西安市压力容器厂"
        },
        {
            value: 353,
            label: "西安秦川机械厂"
        },
        {
            value: 354,
            label: "玉门钢铁集团有限公司"
        },
        {
            value: 355,
            label: "玉门市轻工机械厂"
        },
        {
            value: 356,
            label: "兰州煤气用具厂"
        },
        {
            value: 357,
            label: "青海石油管理局总机械厂"
        },
        {
            value: 358,
            label: "宁夏平罗五金总厂"
        },
        {
            value: 359,
            label: "新疆石河子市万通钢瓶厂"
        },
        {
            value: 360,
            label: "新乡福鹰钢瓶有限公司"
        },
        {
            value: 361,
            label: "江西九江人民机器厂"
        },
        {
            value: 362,
            label: "新世纪纪念（安先生）RZZ皖001"
        },
        {
            value: 363,
            label: "江苏民盛钢瓶制造有限公司"
        },
        {
            value: 364,
            label: "沈阳美托材料科技有限公司"
        },
        {
            value: 365,
            label: "沈阳斯林达安科新技术有限公司"
        },
        {
            value: 366,
            label: "温州强力高压容器有限公司"
        },
        {
            value: 367,
            label: "扬州高得宝瓦斯器材制造有限公司"
        },
        {
            value: 368,
            label: "济南星火钢瓶厂"
        },
        {
            value: 369,
            label: "湖北大立机械制造有限公司"
        },
        {
            value: 370,
            label: "山东宏祥"
        },
        {
            value: 371,
            label: "美国CATALINA"
        },
        {
            value: 372,
            label: "美国LUXFER"
        },
        {
            value: 373,
            label: "浙江嵊州市钢瓶厂"
        },
        {
            value: 374,
            label: "抚顺洁能科技有限公司"
        },
        {
            value: 375,
            label: "山东省潍坊市红旗钢瓶厂"
        },
        {
            value: 376,
            label: "泰州市华海商贸有限公司"
        },
        {
            value: 377,
            label: "美国华盛顿压力容器有限公司"
        },
        {
            value: 378,
            label: "浙江省东阳化工机械有限公司"
        },
        {
            value: 379,
            label: "浙江天恩压力容器制造有限公司"
        },
        {
            value: 380,
            label: "天宁钢瓶厂"
        },
        {
            value: 381,
            label: "四川省军华燃气设备有限公司"
        },
        {
            value: 382,
            label: "杭州凯德空分设备制造有限公司"
        },
        {
            value: 383,
            label: "成都格瑞特高压容器有限责任公司"
        },
        {
            value: 384,
            label: "成都天人压力容器厂"
        },
        {
            value: 385,
            label: "天津仁和鼎盛钢瓶制造有限公司"
        },
        {
            value: 386,
            label: "天津消防器材总厂"
        },
        {
            value: 387,
            label: "无锡百纳容器有限公司"
        },
        {
            value: 388,
            label: "环工"
        },
        {
            value: 389,
            label: "江苏西西"
        },
        {
            value: 390,
            label: "衢州化学工业公司机械厂"
        },
        {
            value: 391,
            label: "上海森松压力容器有限公司"
        },
        {
            value: 392,
            label: "南京高压容器厂"
        },
        {
            value: 393,
            label: "韩国SECHANG M.I.CO.,LTD"
        },
        {
            value: 394,
            label: "南海市塞尔燃气有限公司"
        },
        {
            value: 395,
            label: "鞍山新河高压容器有限公司"
        },
        {
            value: 396,
            label: "TAYLOR-WHARTON MALAYSIA SDN.BHD"
        },
        {
            value: 397,
            label: "HanBee Co.,Ltd.[Korea]"
        },
        {
            value: 398,
            label: "杭州安泰钢瓶有限公司"
        },
        {
            value: 399,
            label: "北京市建安特工程公司"
        },
        {
            value: 400,
            label: "张家港圣汇气体化工装备有限公司"
        },
        {
            value: 401,
            label: "浙江亿田钢瓶有限公司"
        },
        {
            value: 402,
            label: "Shinko  Industrial  CO., LTD"
        },
        {
            value: 403,
            label: "江苏安益钢瓶制造有限公司"
        },
        {
            value: 404,
            label: "衡阳金化高压容器有限公司"
        },
        {
            value: 405,
            label: "唐山市丰意化工机械有限公司"
        },
        {
            value: 406,
            label: "湖北三江航天江北机械工程有限公司"
        },
        {
            value: 407,
            label: "广州市狮牌钢瓶有限公司"
        },
        {
            value: 408,
            label: "佛山市良琦燃气具有限公司"
        },
        {
            value: 409,
            label: "广东盈泉钢制品有限公司"
        },
        {
            value: 410,
            label: "东兴神骏燃气具有限公司"
        },
        {
            value: 411,
            label: "查特深冷工程系统（常州）有限公司"
        },
        {
            value: 412,
            label: "西安德森新能源装备有限公司"
        },
        {
            value: 413,
            label: "江苏民生高压容器制造有限公司"
        },
        {
            value: 414,
            label: "佛山市粤海钢制品有限公司"
        },
        {
            value: 415,
            label: "重庆恒祥石油液化气钢瓶制造有限公司"
        },
        {
            value: 416,
            label: "深圳飞英工业气体有限公司"
        },
        {
            value: 417,
            label: "新兴能源装备股份有限公司"
        },
        {
            value: 418,
            label: "重庆煤矿安全仪器厂"
        },
        {
            value: 419,
            label: "湖南核工业宏华机械有限公司"
        },
        {
            value: 420,
            label: "安徽联友压力容器有限公司"
        },
        {
            value: 421,
            label: "沈阳中复科金压力容器有限公司"
        },
        {
            value: 422,
            label: "南京富鑫压力容器有限公司"
        },
        {
            value: 423,
            label: "Sumikin Kikoh Company,Ltd."
        },
        {
            value: 424,
            label: "泰州市金星京泰钢瓶有限公司"
        },
        {
            value: 425,
            label: "无锡普维设备制造有限公司"
        },
        {
            value: 426,
            label: "宣城市百纳压力容器制造有限公司"
        },
        {
            value: 427,
            label: "天津丽兴仁和钢瓶制造有限公司"
        },
        {
            value: 428,
            label: "GAZ LIQUEFIES INDUSTRIE PLANT CITERGAZ"
        },
        {
            value: 429,
            label: "浙江蓝能燃气设备有限公司"
        },
        {
            value: 430,
            label: "江苏民诺特种设备有限公司"
        },
        {
            value: 431,
            label: "洛阳安合压力容器制造有限公司"
        },
        {
            value: 432,
            label: "湖南湘东化工机械有限公司"
        },
        {
            value: 433,
            label: "无厂家"
        },
        {
            value: 434,
            label: "泉州市梅亭钢瓶厂"
        },
        {
            value: 435,
            label: "东北机器制造厂"
        },
        {
            value: 436,
            label: "浙江南煌钢瓶有限公司"
        },
        {
            value: 437,
            label: "台州市宝泉钢瓶有限公司"
        },
        {
            value: 438,
            label: "自贡大业高压容器有限公司"
        },
        {
            value: 439,
            label: "宽城升华压力容器制造有限责任公司"
        },
        {
            value: 440,
            label: "苏州市海通钢瓶制造有限公司"
        },
        {
            value: 441,
            label: "安徽舒城金利达厂"
        },
        {
            value: 442,
            label: "包头煤气用具厂"
        },
        {
            value: 443,
            label: "北京科泰克科技发展有限公司"
        },
        {
            value: 444,
            label: "常熟安乐压力容器厂"
        },
        {
            value: 445,
            label: "德尔格中国安全设备有限公司"
        },
        {
            value: 446,
            label: "福建省南安市液化石油气钢瓶厂"
        },
        {
            value: 447,
            label: "广东卫国机械厂"
        },
        {
            value: 448,
            label: "国营洪庄机械厂"
        },
        {
            value: 449,
            label: "河南省新乡市钢瓶厂"
        },
        {
            value: 450,
            label: "湖北大立容器制造有限公司"
        },
        {
            value: 451,
            label: "华瑞科立恒北京科技有限公司"
        },
        {
            value: 452,
            label: "江苏秋林重工股份有限公司"
        },
        {
            value: 453,
            label: "江苏省泰州市华海商贸有限公司"
        },
        {
            value: 454,
            label: "江苏盐城钢瓶厂"
        },
        {
            value: 455,
            label: "江苏盐城盛泰钢瓶制造有限公司"
        },
        {
            value: 456,
            label: "姜堰第三机械厂"
        },
        {
            value: 457,
            label: "美国"
        },
        {
            value: 458,
            label: "南京煤气用具厂"
        },
        {
            value: 459,
            label: "青岛亨利压力容器有限公司"
        },
        {
            value: 460,
            label: "山东永安高压容器有限公司"
        },
        {
            value: 461,
            label: "上海化机一厂"
        },
        {
            value: 462,
            label: "上海康巴赛特科技发展有限公司"
        },
        {
            value: 463,
            label: "上海市容华高压容器有限公司"
        },
        {
            value: 464,
            label: "沈阳市金属薄板制品厂"
        },
        {
            value: 465,
            label: "天津天消安全设备有限公司"
        },
        {
            value: 466,
            label: "无锡梅思安安全设备有限公司"
        },
        {
            value: 467,
            label: "武进钢瓶厂"
        },
        {
            value: 468,
            label: "新乡市赛特钢瓶有限公司"
        },
        {
            value: 469,
            label: "扬州第一压力容器厂"
        },
        {
            value: 470,
            label: "扬州豫秦钢瓶厂"
        },
        {
            value: 471,
            label: "浙江汇金机械制造有限公司"
        },
        {
            value: 472,
            label: "浙江省嵊州市钢瓶厂"
        },
        {
            value: 473,
            label: "镇江钢瓶厂"
        },
        {
            value: 474,
            label: "淄博临淄压力容器厂"
        },
        {
            value: 475,
            label: "江阴天和深冷科技有限公司"
        },
        {
            value: 476,
            label: "张家港市科华化工装备制造有限公司"
        },
        {
            value: 477,
            label: "江苏深绿新能源科技有限公司"
        },
        {
            value: 478,
            label: "上海高压容器制造有限公司"
        },
        {
            value: 479,
            label: "南海市赛尔燃气具有限公司"
        },
        {
            value: 480,
            label: "苍南县钢瓶厂"
        },
        {
            value: 481,
            label: "潍坊市煤气用具厂"
        },
        {
            value: 482,
            label: "上海高压容器有限公司"
        },
        {
            value: 483,
            label: "辉县市升辉容器制造有限公司"
        },
        {
            value: 484,
            label: "南京百江液化气有限公司"
        },
        {
            value: 485,
            label: "FIBA Technologies,Inc."
        },
        {
            value: 486,
            label: "NK CO.,Ltd"
        },
        {
            value: 487,
            label: "浙江巨化装备制造有限公司"
        },
        {
            value: 488,
            label: "中材科技（成都）有限公司"
        },
        {
            value: 489,
            label: "山东蒙凌压力容器有限公司"
        },
        {
            value: 490,
            label: "安徽联友高压容器有限责任公司"
        },
        {
            value: 491,
            label: "山东蒙凌高压容器有限公司"
        },
        {
            value: 492,
            label: "永润高压容器有限公司"
        },
        {
            value: 493,
            label: "宜昌瑞洋机械制造有限公司"
        },
        {
            value: 494,
            label: "山东汇通气体能源设备有限公司"
        },
        {
            value: 495,
            label: "豫新航空工业制品有限公司"
        },
        {
            value: 496,
            label: "辽宁奥斯褔科技有限公司"
        },
        {
            value: 497,
            label: "武义西林德机械制造有限公司"
        },
        {
            value: 498,
            label: "临沂市永全气体有限公司"
        },
        {
            value: 499,
            label: "安徽大盘压力容器有限公司"
        },
        {
            value: 500,
            label: "浙江金象科技有限公司"
        },
        {
            value: 501,
            label: "湖北华仕顿容器制造有限公司"
        },
        {
            value: 502,
            label: "江南工业集团有限公司"
        },
        {
            value: 503,
            label: "江西省人民机械厂"
        },
        {
            value: 504,
            label: "台山市富华钢瓶厂"
        },
        {
            value: 505,
            label: "山东山海新能源装备有限公司"
        },
        {
            value: 506,
            label: "青岛青安钢瓶有限公司"
        },
        {
            value: 507,
            label: "广东华南特种气体研究所有限公司"
        },
        {
            value: 508,
            label: "宁波兴光燃气集团"
        },
        {
            value: 509,
            label: "湖南江南银箭新能源装备有限公司"
        },
        {
            value: 510,
            label: "浙江威能消防器材股份有限公司"
        },
        {
            value: 511,
            label: "鲁西新能源装备集团有限公司"
        },
        {
            value: 512,
            label: "洛阳安和压力容器制造有限公司"
        },
        {
            value: 513,
            label: "张家港市华机环保新能源科技有限公司"
        },
        {
            value: 514,
            label: "宁波云帅厨房设备有限公司"
        },
        {
            value: 515,
            label: "江苏大盘压力容器有限公司"
        },
        {
            value: 516,
            label: "嘉兴赛安富低温装备科技有限公司"
        },
        {
            value: 517,
            label: "湖南祁阳华泰钢瓶制造有限公司"
        },
        {
            value: 518,
            label: "山东天海高压容器有限公司"
        },
        {
            value: 519,
            label: "美钢容器（嘉兴）有限公司"
        },
        {
            value: 520,
            label: "四川中腾容器制造有限公司"
        },
        {
            value: 521,
            label: "梧州市沃华机械有限公司"
        },
        {
            value: 522,
            label: "佛山市杰超低温设备有限公司"
        },
        {
            value: 523,
            label: "佛山市华莱普气体设备有限公司"
        },
        {
            value: 524,
            label: "常州博朗低温设备有限公司"
        },
        {
            value: 525,
            label: "浙江凯博压力容器有限公司"
        },
        {
            value: 526,
            label: "北京吉祥德尔格安全设备有限公司"
        },
        {
            value: 527,
            label: "勒科斯弗气瓶（上海）有限公司"
        },
        {
            value: 528,
            label: "意大利 Dalmine"
        },
        {
            value: 529,
            label: "南阳英威东风压力容器制造有限公司"
        },
        {
            value: 530,
            label: "美国查特工业公司"
        },
        {
            value: 531,
            label: "南亮压力容器技术（上海）有限公司"
        },
        {
            value: 532,
            label: "浙江陶特容器科技有限公司"
        },
        {
            value: 533,
            label: "山东汇峰能源装备有限公司"
        },
        {
            value: 534,
            label: "新乡市福鹰车业有限公司"
        },
        {
            value: 535,
            label: "兰州巨星工贸有限公司"
        },
        {
            value: 536,
            label: "济南德洋低温科技有限公司"
        },
        {
            value: 537,
            label: "哈尔滨鼎丰特种气瓶制造有限公司"
        },
        {
            value: 538,
            label: "浙江银盾压力容器有限公司"
        },
        {
            value: 539,
            label: "佛山市顺德区广沙百福压力容器有限公司"
        },
        {
            value: 540,
            label: "辽宁美托科技有限公司"
        },
        {
            value: 541,
            label: "江苏华天能源装备有限公司"
        },
        {
            value: 542,
            label: "河北艺能锅炉有限责任公司"
        },
        {
            value: 543,
            label: "河北润丰压力容器有限公司"
        },
        {
            value: 544,
            label: "张家港保税区长江新能源装备有限公司"
        },
        {
            value: 545,
            label: "江苏民生重工有限公司"
        },
        {
            value: 546,
            label: "湖南长空电器有限公司"
        },
        {
            value: 547,
            label: "泰州市西西特种设备制造有限公司"
        },
        {
            value: 548,
            label: "浙江杭萧安泰钢瓶有限公司"
        },
        {
            value: 549,
            label: "安徽大盘特种装备车辆有限公司"
        },
        {
            value: 550,
            label: "山东索尔特种装备有限公司"
        },
        {
            value: 551,
            label: "南安市旺宸机械有限公司"
        },
        {
            value: 552,
            label: "安徽绿动能源有限公司"
        },
        {
            value: 553,
            label: "中材科技（九江）有限公司"
        },
        {
            value: 554,
            label: "迪威"
        },
        {
            value: 555,
            label: "广东铸辉钢瓶制造有限公司"
        },
        {
            value: 556,
            label: "浙江民泰钢瓶有限公司"
        },
        {
            value: 557,
            label: "欣泰"
        },
        {
            value: 558,
            label: "辽宁奥斯福科技有限公司"
        },
        {
            value: 559,
            label: "湖南富佳钢瓶制造有限公司"
        },
        {
            value: 560,
            label: "衡阳市柒益凌钢瓶有限公司"
        },
        {
            value: 561,
            label: "台山市机械厂有限公司"
        },
        {
            value: 562,
            label: "新乡市宇通压力容器有限公司"
        },
        {
            value: 563,
            label: "长沙赛江压力容器有限公司"
        },
        {
            value: 564,
            label: "浙江东锦能源设备有限公司"
        },
        {
            value: 565,
            label: "嘉兴南湖压力容器厂"
        },
        {
            value: 566,
            label: "台州市正安气瓶检验有限公司"
        },
        {
            value: 567,
            label: "贵州贵安腾隆钢瓶制造有限公司"
        },
        {
            value: 568,
            label: "张家港保税区蓝山装备科技有限公司"
        },
        {
            value: 569,
            label: "广西第一安装工程公司"
        },
        {
            value: 570,
            label: "山东龙翔实业有限公司"
        },
        {
            value: 571,
            label: "广州胜安消防设备有限公司"
        },
        {
            value: 572,
            label: "浙江金盾消防器材有限公司"
        },
        {
            value: 573,
            label: "江苏秋林特能装备股份有限公司"
        },
        {
            value: 574,
            label: "诸城奥扬深冷科技股份有限公司"
        },
        {
            value: 575,
            label: "广东泰莱华顿气体设备有限公司"
        },
        {
            value: 576,
            label: "EKC 工业（天津）有限公司"
        },
        {
            value: 577,
            label: "衡阳金化高压容器股份有限公司"
        },
        {
            value: 578,
            label: "重庆益峰新能源装备股份有限公司"
        },
        {
            value: 579,
            label: "四川广融压力容器有限公司"
        },
        {
            value: 580,
            label: "张家港富瑞深冷科技有限公司"
        },
        {
            value: 581,
            label: "江苏盛日机械设备制造有限公司"
        },
        {
            value: 582,
            label: "沧州海固安全防护科技有限公司"
        },
        {
            value: 583,
            label: "长春致远新能源设备有限责任公司"
        },
        {
            value: 584,
            label: "江西华特电子化学品有限公司"
        },
        {
            value: 585,
            label: "浙江江山大众锅炉有限公司"
        },
        {
            value: 599,
            label: "抚顺节能科技有限公司"
        },
        {
            value: 601,
            label: "南通中集能源装备有限公司"
        },
        {
            value: 602,
            label: "诸城市创惠容器科技有限公司"
        },
        {
            value: 603,
            label: "贵州九洲高压压力容器有限公司"
        },
        {
            value: 604,
            label: "中盐红四方金百纳能源技术无锡有限公司"
        },
        {
            value: 605,
            label: "洛阳双瑞特种装备有限公司"
        },
        {
            value: 606,
            label: "神钢机器工业株式会社"
        },
        {
            value: 607,
            label: "芜湖市海格瑞德科技有限责任公司"
        },
        {
            value: 608,
            label: "山东奥扬新能源科技股份有限公司"
        },
        {
            value: 609,
            label: "重庆康达机械(集团)有限责任公司"
        },
        {
            value: 610,
            label: "容桂百福五金制造有限公司"
        },
        {
            value: 611,
            label: "辽沈工业集团有限公司"
        },
        {
            value: 612,
            label: "宜昌市瑞洋机械制造有限公司"
        },
        {
            value: 613,
            label: "重庆烛照实业发展有限公司"
        },
        {
            value: 614,
            label: "四川广融科技股份有限公司"
        },
        {
            value: 615,
            label: "山东永安特种装备有限公司"
        },
        {
            value: 616,
            label: "广东良奇钢瓶有限公司"
        },
        {
            value: 617,
            label: "广西乾岳气瓶制造有限公司"
        },
        {
            value: 618,
            label: "云南富家钢瓶制造有限公司"
        },
        {
            value: 619,
            label: "广西传来特种设备制造有限公司"
        },
        {
            value: 999,
            label: "中华气瓶厂(演示用)"
        }
    ]


    const { register, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            property_unit: '三燃',
            date4manufacture: moment(new Date()).format('YYYY-MM-DD'),
            nexttestdate: moment(new Date()).format('YYYY-MM-DD'),
            lasttestdate: moment(new Date()).format('YYYY-MM-DD'),
            manufacturing_unit: '梧州市沃华机械有限公司',
            suttle: '12',
            volume: 12,
            wall_thickness: 5.7,
            nominal_pressure: 30,
            material: '钢',
            weight: 35,
        }
    })
    const initData = JSON.parse(localStorage.getItem('initData'))
    const onsubmit = async (data) => {
        console.log(data);
        // 如果 data.code 中包含 字符串'SR' 则不提交
        if (data.code.indexOf('SR') !== -1) {
            toast.error('临时码不可创建档案')
            return
        }

        const rew = await request('post', '/api/getInfo', {
            ...data,
            url: 'Srapp.Web_Material_Handle.CreateMaterialPackingtypeArchives'
        })
        if (rew.data.msg === 'SUCCESS') {
            toast.success('办理成功')
            reset()
        } else {
            toast.success('办理失败' + rew.data.tips)
        }
        // console.log(rew)
    }
    useEffect(() => {
        register('manufacturing_unit');
        register('type');
        register('packingtypeid');
    }, [register]);

    return (
        <Box sx={{ width: '100%', background: '#FFF' }}>
            <Box p={3} bgcolor="#fff" borderRadius={1} overflow="scroll" display="flex">
                <Box border={1} p={2} borderColor="#999">
                    <Typography fontSize={23} textAlign="center" fontWeight="bold"
                        marginBottom={2}>创建公司产权周转瓶包装物档案信息</Typography>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <table className="BuyUserPackingtypeMaterialtable">
                            <thead>
                                <tr>
                                    <th>
                                        产权单位
                                    </th>
                                    <td>
                                        <input {...register('property_unit')} type="text" />
                                    </td>
                                    <th>
                                        识别码
                                    </th>
                                    <td>
                                        <input {...register('code')} type="text" />
                                    </td>
                                    <th>
                                        追溯码
                                    </th>
                                    <td>
                                        <input {...register('trackingcode')} type="text" />
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>
                                        类型
                                    </th>
                                    <td>
                                        <select {...register('type')}>
                                            <option value="空">空</option>
                                            <option value="重">重</option>
                                        </select>

                                    </td>

                                    <th>
                                        包装物类型
                                    </th>
                                    <td>
                                        <select onChange={e => {

                                        }} {...register('packingtypeid')}>
                                            {
                                                initData.PackingtypeList.map(({ id, name }, index) => <option key={index}
                                                    value={id}>{name}</option>)
                                            }

                                        </select>
                                    </td>

                                    <th>
                                        制造单位
                                    </th>
                                    <td>
                                        <Autocomplete
                                            defaultValue="梧州市沃华机械有限公司"
                                            disablePortal
                                            id="combo-box-demo"
                                            sx={{ border: 'none', padding: 'inherit', minWidth: 300 }}
                                            options={factory}
                                            onChange={(e, options) => {
                                                console.log(options)
                                                if (options && options.label) {
                                                    setValue('manufacturing_unit', options.label)
                                                }
                                            }}

                                            renderInput={(params) =>
                                                <TextField
                                                    className="cccddds"
                                                    sx={{
                                                        border: 'none',
                                                        padding: 'inherit',
                                                        minWidth: 300,
                                                        verticalAlign: 'baseline',
                                                        borderRadius: 0
                                                    }}
                                                    {...params}
                                                />
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th>
                                        生产日期
                                    </th>
                                    <td>
                                        <input style={{ height: 'auto' }} {...register('date4manufacture')} type="date" />
                                    </td>
                                    <th>
                                        下次检测日期

                                    </th>
                                    <td>
                                        <input style={{ height: 'auto' }}  {...register('nexttestdate')} type="date" />
                                    </td>

                                    <th>
                                        最近检测日期
                                    </th>
                                    <td>
                                        <input style={{ height: 'auto' }} {...register('lasttestdate')} type="date" />
                                    </td>
                                </tr>
                                <tr>

                                    <th>
                                        登记编号（钢印）
                                    </th>
                                    <td>
                                        <input {...register('reg_number')} />
                                    </td>
                                    <th>
                                        出厂编号
                                    </th>
                                    <td>
                                        <input  {...register('production_number')} type="text" />
                                    </td>
                                    <th>
                                        充装量
                                    </th>
                                    <td>
                                        <input {...register('suttle')} type="text" />
                                    </td>


                                </tr>
                                <tr>
                                    <th>
                                        容积（L）
                                    </th>
                                    <td>
                                        <input type="text" {...register('volume')} />
                                    </td>

                                    <th>
                                        设计壁厚（MM）


                                    </th>
                                    <td>
                                        <input type="text" {...register('wall_thickness')} />
                                    </td>
                                    <th>
                                        公称压力(Mpa)

                                    </th>
                                    <td>
                                        <input {...register('nominal_pressure')} type="text" />
                                    </td>



                                </tr>
                                <tr>
                                    <th>
                                        材料
                                    </th>
                                    <td>
                                        <input {...register('material')} type="text" />
                                    </td>

                                    <th>
                                        瓶重
                                    </th>
                                    <td>
                                        <input {...register('weight')} type="text" />
                                    </td>

                                    <th>
                                        备注
                                    </th>
                                    <td colSpan={2}>
                                        <input {...register('remarks')} type="text" />
                                    </td>


                                </tr>
                            </tbody>
                        </table>
                    </form>

                </Box>

            </Box>
            <Box px={3} pb={3}>
                <Button sx={{ fontSize: 20 }} onClick={handleSubmit(onsubmit)} type="submit" variant="contained">确认办理</Button>
            </Box>

        </Box>
    );
};

export default CreateMaterialPackingtypeArchives;
