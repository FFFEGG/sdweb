import React, {useEffect, useState} from 'react';
import options from '../../utils/city'
import 'antd/dist/antd.css'

const Cascader = ({cities,setCities}) =>  <Cascader options={options} onChange={(value) => {
    console.log(value);
}}   fieldNames={{label: 'value', value: 'value', children: 'children'}} placeholder="选择所属城市" />


export default Cascader;