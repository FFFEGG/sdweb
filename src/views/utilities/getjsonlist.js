const getjsonlist = (data) => {
    const arr = Object.keys(data)
    const arrs = []
    for (let i = 0; i < arr.length; i += 1) {
        arrs.push({
            field: arr[i],
            headerName: arr[i]
        })
    }
    return arrs
}

export default getjsonlist