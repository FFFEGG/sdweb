import React, { useEffect, forwardRef, useRef } from 'react';
import NavCard from "../../ui-component/cards/NavCard";
import { Autocomplete, Box, Button, Card, Table, TextField } from "@mui/material";
import request from "../../utils/request";

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import { Form, Modal } from "@douyinfe/semi-ui";



const PackingtypeMode = () => {
    const [list, setList] = React.useState([]);
    const initData = JSON.parse(localStorage.getItem('initData'))
    const new_department = JSON.parse(localStorage.getItem('new_department'))
    const new_goodslist = JSON.parse(localStorage.getItem('new_goodslist'))

    const getlist = async () => {
        const response = await request('post', '/api/sysGetList', {
            url: 'PackingtypeModeList'
        })
        console.log(response);
        setList(response.data.info);
    }
    useEffect(async () => {
        getlist();
    }, [])
    const { register, handleSubmit, setValue, control, reset, getValues } = useForm({
        defaultValues: {
            formdata: {
                action: 'ADD'
            },
        }
    });

    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState('sm');

    const handleClickOpen = () => {
        setOpen(true);
        setTimeout(() => {
            api.current.setValues('')
            api.current.setValue('action', 'ADD')
            api.current.setValue('id', 0)
        }, 500)

    };

    const handleClose = () => {
        setOpen(false);
        reset({
            formdata: {
                action: 'ADD'
            },
        });
    };


    const api = useRef()

    return (
        <div>
            <NavCard title="包装物方式" subtitle="系统参数设置" />
            <Card sx={{
                mt: 1,
                p: 2

            }}>
                <Button variant="contained" sx={{ mb: 1 }} onClick={handleClickOpen}>新增</Button>
                <Button variant="contained" sx={{ mb: 1, ml: 1 }} onClick={getlist}>刷新</Button>

                <Box height="80vh">
                    <AgGridReact
                        className="ag-theme-balham"


                        rowData={list}
                        columnDefs={[
                            { headerName: 'id', field: 'id' },
                            { headerName: 'companyid', field: 'companyid' },
                            { headerName: '包装物名称', field: 'name' },
                            // {title: '接单模式', field: 'distributionmode'},
                            { headerName: '类型', field: 'type' },
                            { headerName: '模式', field: 'mode' },
                            { headerName: '状态', field: 'state' },
                            { headerName: '排序', field: 'sort' },
                            {
                                headerName: '操作', pinned: 'left', cellRendererFramework: (params) => <Button size={"small"} onClick={() => {
                                    console.log(params.data)
                                    // setValue('formdata',params.data)
                                    // const goods = initData.GoodsList.filter(item=>params.data.details.indexOf(item.id) > -1)
                                    // const packingtypeid = initData.PackingtypeList.filter(item=>params.data.packingtypeid.indexOf(item.id) > -1)
                                    // const customertypeidlist = initData.CustomertypeList.filter(item=>params.data.customertypeidlist.indexOf(item.id) > -1)
                                    // const depidlist = initData.DepartmentList.filter(item=>params.data.depidlist.indexOf(item.id) > -1)
                                    // setValue('packingtypeid',packingtypeid)
                                    // setValue('details',goods)
                                    // setValue('customertypeidlist',customertypeidlist)
                                    // setValue('depidlist',depidlist)
                                    //
                                    // setValue('formdata.action','UPDATE')
                                    //
                                    // handleClickOpen()
                                    //
                                    setOpen(true)
                                    setTimeout(() => {
                                        api.current.setValues(params.data)
                                        api.current.setValue('action', 'UPDATE')
                                        api.current.setValue('id', params.data.id)
                                        api.current.setValue('condition', JSON.stringify(params.data.condition))
                                    }, 500)
                                }}>编辑</Button>
                            }
                        ]}
                        defaultColDef={{
                            resizable: true,
                            sortable: true,
                            filter: 'agTextColumnFilter',
                            floatingFilter: true,
                        }}
                    />
                </Box>
            </Card>
            <Modal visible={open} onCancel={() => setOpen(false)} footer={<></>}>
                <Form getFormApi={e => api.current = e} onSubmit={async e => {
                    const rew = await request('post', '/api/getInfo', {
                        ...e,
                        customertypeidlist: JSON.stringify(e.customertypeidlist),
                        depidlist: JSON.stringify(e.depidlist),
                        details: JSON.stringify(e.details),
                        packingtypeid: JSON.stringify(e.packingtypeid),
                        packingtype: JSON.stringify(e.packingtype),
                        condition: e.condition instanceof Array ? '' : e.condition,
                        url: 'Srapp.Web_SystemSetting.SettingPackingtypeMode'
                    })

                    if (rew.code === 200) {
                        toast('操作成功');
                        getlist();
                        handleClose();
                    } else {
                        toast('操作失败');
                    }
                }}>
                    <Form.Input field={'name'} label={'名称'} style={{ width: '100%' }} />
                    <Form.Select field={'packingtypeid'} label={'可选范围'} multiple style={{ width: '100%', zIndex: 99999999999 }}>
                        {
                            initData.PackingtypeList.map(item =>
                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>
                            )
                        }
                    </Form.Select>



                    <Form.Select field={'mode'} label={'办理方式'} style={{ width: '100%', zIndex: 99999999999 }}>
                        <Form.Select.Option value="押金">押金</Form.Select.Option>
                        <Form.Select.Option value="销售">销售</Form.Select.Option>
                        <Form.Select.Option value="借用">借用</Form.Select.Option>
                        <Form.Select.Option value="带入">带入</Form.Select.Option>

                    </Form.Select>



                    <Form.Select field={'type'} label={'入库类型'} style={{ width: '100%', zIndex: 99999999999 }}>
                        <Form.Select.Option value="bill">bill</Form.Select.Option>
                        <Form.Select.Option value="material">material</Form.Select.Option>
                    </Form.Select>



                    {/*<Form.Select field={'details'} multiple label={'物品详情json'} style={{ width: '100%', zIndex: 99999999999 }}>*/}
                    {/*    {*/}
                    {/*        initData.GoodsList.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)*/}
                    {/*    }*/}

                    {/*</Form.Select>*/}


                    <Form.TreeSelect maxTagCount={1} field='details' placeholder="物品详情json" style={{ width: '100%', zIndex: 99999999999 }} rules={[
                        { required: true }
                    ]} label="商品" multiple filter filterTreeNode leafOnly treeData={new_goodslist} />


                    <Form.Input field={'price'} label={'单价'} style={{ width: '100%' }} />

                    <Form.Select field={'billingmodeid'} label={'包装物计费模式ID'} style={{ width: '100%', zIndex: 99999999999 }}>
                        {
                            initData.PackingtypeBillingModeList.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>


                    <Form.Select field={'verificationmethod'} label={'验证方式'} style={{ width: '100%', zIndex: 99999999999 }}>
                        <Form.Select.Option value="周转销售(扫描)">周转销售(扫描)</Form.Select.Option>
                        <Form.Select.Option value="周转销售(不扫描)">周转销售(不扫描)</Form.Select.Option>
                        <Form.Select.Option value="代充销售">代充销售</Form.Select.Option>
                        <Form.Select.Option value="快消品销售">快消品销售</Form.Select.Option>
                    </Form.Select>


                    <Form.Select field={'customertypeidlist'} multiple label={'可销用户类型'} style={{ width: '100%', zIndex: 99999999999 }}>
                        {
                            initData.CustomertypeList.map(item => <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>)
                        }
                    </Form.Select>
                    {/* 
                    <Button onClick={() => {
                        const depidlist = api.current.getValue('depidlist') || [];
                        //友爱分公司id
                        const yaids = initData.DepartmentList.filter(item => item.fid == 29).map(item => item.id);
                        let arr = new Set([...depidlist, ...yaids]);
                        const result = Array.from(arr);
                        api.current.setValue('depidlist', result);
                    }}>友爱分公司</Button>
                    <Button onClick={() => {
                        const depidlist = api.current.getValue('depidlist') || [];
                        //青秀分公司id
                        const yaids = initData.DepartmentList.filter(item => item.fid == 28).map(item => item.id);
                        let arr = new Set([...depidlist, ...yaids]);
                        const result = Array.from(arr);
                        api.current.setValue('depidlist', result);
                    }}>青秀分公司</Button> */}

                    {/* <Form.Select field={'depidlist'} multiple label={'可销售部门'} filter style={{ width: '100%', zIndex: 99999999999 }}>
                        {
                            initData.DepartmentList.map(item => <Form.Select.Option value={item.id}>{item.label}</Form.Select.Option>)
                        }
                    </Form.Select> */}
                    <Form.TreeSelect filterTreeNode leafOnly treeData={new_department} multiple field='depidlist' filter style={{ width: '100%' }} label="可销售部门" />


                    {/* <Form.Input field={'giveprogrammeid'} label={'赠品方案ID'} style={{ width: '100%' }} />
                     */}


                    <Form.Select filter field={'giveprogrammeid'} label={'赠品方案ID'} style={{ width: '100%' }} >

                        {
                            initData.GiveProgrammeList.filter(item => item.type == '包装物业务办理').map(item =>

                                <Form.Select.Option value={item.id}>{item.name}</Form.Select.Option>

                            )

                        }

                    </Form.Select>
                    <Form.Input field={'condition'} label={'condition'} style={{ width: '100%' }} />
                    <Form.Input field={'sort'} label={'排序'} style={{ width: '100%' }} />
                    <Form.Input field={'starttime'} label={'方案生效开始日期'} type="date" style={{ width: '100%' }} />
                    <Form.Input field={'endtime'} label={'方案生效结束日期'} type="date" style={{ width: '100%' }} />



                    <Form.Select field={'state'} label={'状态'} style={{ width: '100%', zIndex: 99999999999 }}>
                        <Form.Select.Option value="正常">正常</Form.Select.Option>
                        <Form.Select.Option value="取消">取消</Form.Select.Option>
                    </Form.Select>

                    <Button variant={"contained"} type={"submit"}>确认</Button>
                </Form>
            </Modal>


            {/*<Dialog*/}
            {/*    fullWidth="true"*/}
            {/*    maxWidth="md"*/}
            {/*    open={false}*/}
            {/*    onClose={handleClose}*/}
            {/*>*/}
            {/*    <DialogTitle>包装物方式新增/修改</DialogTitle>*/}
            {/*    <DialogContent>*/}

            {/*        <TextField   {...register('formdata.name')} label="名称" fullWidth sx={{marginTop: 1}}/>*/}

            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}

            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="packingtypeid"*/}
            {/*                render={({field}) => (*/}

            {/*                    <Autocomplete*/}
            {/*                        multiple*/}
            {/*                        {...field}*/}
            {/*                        id="tags-outlined"*/}

            {/*                        value={getValues('packingtypeid')}*/}
            {/*                        options={initData.PackingtypeList}*/}
            {/*                        getOptionLabel={(option) =>option.name}*/}
            {/*                        filterSelectedOptions*/}
            {/*                        renderInput={(params) => (*/}
            {/*                            <TextField*/}
            {/*                                {...params}*/}
            {/*                                label="可选范围"*/}
            {/*                            />*/}
            {/*                        )}*/}
            {/*                        onChange={(_, data) => field.onChange(data)}*/}
            {/*                    />*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}



            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}
            {/*            <InputLabel id="demo-simple-select-label">办理方式</InputLabel>*/}
            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="formdata.mode"*/}
            {/*                render={({field}) => (*/}
            {/*                    <Select*/}
            {/*                        label="办理方式"*/}
            {/*                        {...field}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="押金">押金</MenuItem>*/}
            {/*                        <MenuItem value="销售">销售</MenuItem>*/}
            {/*                        <MenuItem value="借用">借用</MenuItem>*/}
            {/*                        <MenuItem value="带入">带入</MenuItem>*/}
            {/*                    </Select>*/}
            {/*                )}*/}
            {/*            />*/}


            {/*        </FormControl>*/}

            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}
            {/*            <InputLabel id="demo-simple-select-label">入库类型</InputLabel>*/}
            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="formdata.type"*/}
            {/*                render={({field}) => (*/}
            {/*                    <Select*/}
            {/*                        label="入库类型"*/}
            {/*                        {...field}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="bill">bill</MenuItem>*/}
            {/*                        <MenuItem value="material">material</MenuItem>*/}
            {/*                    </Select>*/}
            {/*                )}*/}
            {/*            />*/}


            {/*        </FormControl>*/}



            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}

            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="details"*/}
            {/*                render={({field}) => (*/}

            {/*                    <Autocomplete*/}
            {/*                        multiple*/}
            {/*                        {...field}*/}
            {/*                        id="tags-outlined"*/}

            {/*                        options={initData.GoodsList}*/}
            {/*                        getOptionLabel={(option) =>option.name}*/}
            {/*                        // renderOption={(option) => {}}*/}
            {/*                        filterSelectedOptions*/}
            {/*                        renderInput={(params) => (*/}
            {/*                            <TextField*/}
            {/*                                {...params}*/}
            {/*                                label="物品详情json"*/}
            {/*                            />*/}
            {/*                        )}*/}
            {/*                        onChange={(_, data) => field.onChange(data)}*/}
            {/*                    />*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}


            {/*        <TextField   {...register('formdata.price')} label="单价" fullWidth sx={{marginTop: 1}}/>*/}

            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}
            {/*            <InputLabel id="demo-simple-select-label">包装物计费模式ID</InputLabel>*/}
            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="formdata.billingmodeid"*/}
            {/*                render={({field}) => (*/}
            {/*                    <Select*/}
            {/*                        label="包装物计费模式ID"*/}
            {/*                        {...field}*/}
            {/*                    >*/}
            {/*                        {*/}
            {/*                            initData.PackingtypeBillingModeList.map(item =>     <MenuItem value={item.id}>{item.name}</MenuItem>)*/}
            {/*                        }*/}

            {/*                    </Select>*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}


            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}
            {/*            <InputLabel id="demo-simple-select-label">验证方式</InputLabel>*/}
            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="formdata.verificationmethod"*/}
            {/*                render={({field}) => (*/}
            {/*                    <Select*/}
            {/*                        label="包装物计费模式ID"*/}
            {/*                        {...field}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="周转销售(扫描)">周转销售(扫描)</MenuItem>*/}
            {/*                        <MenuItem value="周转销售(不扫描)">周转销售(不扫描)</MenuItem>*/}
            {/*                        <MenuItem value="代充销售">代充销售</MenuItem>*/}
            {/*                        <MenuItem value="快消品销售">快消品销售</MenuItem>*/}
            {/*                    </Select>*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}


            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}

            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="customertypeidlist"*/}
            {/*                render={({field}) => (*/}

            {/*                    <Autocomplete*/}
            {/*                        multiple*/}
            {/*                        {...field}*/}
            {/*                        id="tags-outlined"*/}
            {/*                        options={initData.CustomertypeList}*/}
            {/*                        getOptionLabel={(option) =>option.name}*/}
            {/*                        // renderOption={(option) => {}}*/}
            {/*                        filterSelectedOptions*/}
            {/*                        renderInput={(params) => (*/}
            {/*                            <TextField*/}
            {/*                                {...params}*/}
            {/*                                label="	可销用户类型"*/}
            {/*                            />*/}
            {/*                        )}*/}
            {/*                        onChange={(_, data) => field.onChange(data)}*/}
            {/*                    />*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}

            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}

            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="depidlist"*/}
            {/*                render={({field}) => (*/}

            {/*                    <Autocomplete*/}
            {/*                        multiple*/}
            {/*                        {...field}*/}
            {/*                        id="tags-outlined"*/}
            {/*                        options={initData.DepartmentList}*/}
            {/*                        getOptionLabel={(option) =>option.name}*/}
            {/*                        // renderOption={(option) => {}}*/}
            {/*                        filterSelectedOptions*/}
            {/*                        renderInput={(params) => (*/}
            {/*                            <TextField*/}
            {/*                                {...params}*/}
            {/*                                label="	可销售部门"*/}
            {/*                            />*/}
            {/*                        )}*/}
            {/*                        onChange={(_, data) => field.onChange(data)}*/}
            {/*                    />*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}

            {/*        <TextField   {...register('formdata.giveprogrammeid')} label="赠品方案ID" fullWidth sx={{marginTop: 1}}/>*/}
            {/*        <TextField   {...register('formdata.sort')} label="排序" fullWidth sx={{marginTop: 1}}/>*/}
            {/*        <TextField  type="date"  {...register('formdata.starttime')} label="方案生效开始日期" fullWidth sx={{marginTop: 1}}/>*/}
            {/*        <TextField  type="date"  {...register('formdata.endtime')} label="方案生效结束日期" fullWidth sx={{marginTop: 1}}/>*/}






            {/*        <FormControl fullWidth sx={{marginTop: 1}}>*/}
            {/*            <InputLabel id="demo-simple-select-label">状态</InputLabel>*/}

            {/*            <Controller*/}
            {/*                control={control}*/}
            {/*                name="formdata.state"*/}
            {/*                render={({field}) => (*/}
            {/*                    <Select*/}
            {/*                        label="状态"*/}
            {/*                        {...field}*/}
            {/*                    >*/}
            {/*                        <MenuItem value="正常">正常</MenuItem>*/}
            {/*                        <MenuItem value="取消">取消</MenuItem>*/}
            {/*                    </Select>*/}
            {/*                )}*/}
            {/*            />*/}

            {/*        </FormControl>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={handleSubmit(submit)}>确认添加/修改</Button>*/}
            {/*        <Button onClick={handleClose}>关闭</Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
        </div>
    );
}

export default PackingtypeMode;
