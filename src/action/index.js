const sendAction = () => {
    console.log('action')
    return {
        type: 'send_type',
        value: '我是一个action'
    }
}
module.exports = {
    sendAction
}