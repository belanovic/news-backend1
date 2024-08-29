module.exports = function dateQuery(dateString) {

    if(!dateString) return {$gte: new Date(2020)}

    const date = new Date(dateString);
    let dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(),  0, 0, 0, 0);
    let dateEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(),  23, 59, 59, 999);
    dateStart = convertUTCDateToLocalDate(dateStart);
    dateEnd = convertUTCDateToLocalDate(dateEnd);

    return {$gte: dateStart, 
        $lte: dateEnd}

    function convertUTCDateToLocalDate(date) {
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds()));
    }
}