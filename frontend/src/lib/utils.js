export function formatMessageTime(date){
    return new Date(date).toLocaleTimeString('en-us',{
        hour: '2-digit',
        minute: '2-digit',  // 01-12 format for hours
        hour12: false,
    })
}