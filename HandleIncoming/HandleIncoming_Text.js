


const ACTION_TEXT_DRAW_BEAUTY = 'ACTION_TEXT_DRAW_BEAUTY'
const ACTION_TEXT_PASS = 'ACTION_TEXT_PASS'


const switchIncomingType = (string) => {

    //只有第一個字是抽能近來
    if (string.substring(0,1) === '抽') {

        if (string === '抽' ) {
            return {type:ACTION_TEXT_DRAW_BEAUTY,value:string}
        }else{
            return {type:ACTION_TEXT_PASS,value:string}
        }
    }else{
        return {type:ACTION_TEXT_PASS,value:string}
    }

}

module.exports.switchIncomingType = switchIncomingType
module.exports.ACTION_TEXT_DRAW_BEAUTY = ACTION_TEXT_DRAW_BEAUTY
module.exports.ACTION_TEXT_PASS = ACTION_TEXT_PASS



