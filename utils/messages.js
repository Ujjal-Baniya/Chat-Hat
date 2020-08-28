const { text } = require("express");

const moment = require("moment")

function formatMessage(userName , text){
    return {
        userName,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage