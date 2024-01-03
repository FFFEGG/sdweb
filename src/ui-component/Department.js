import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Department = ({title,multiple,datavalues,setValue}) => {
    const initData = JSON.parse(localStorage.getItem('initData'))

    return (
        <div>
            <Autocomplete
                id="tags-outlined"
                multiple={multiple}
                options={initData.DepartmentList}
                getOptionLabel={(option) => option.name}
                defaultValue={datavalues}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={title}
                        placeholder="搜索或选择"
                    />
                )}
                onChange={(_,value) => {
                    // console.log(props);
                    setValue('departmentid',value.id)
                }}
            />
        </div>

    );
}


export default Department