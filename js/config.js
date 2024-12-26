/**
 * 游戏配置
 */



let config = {
    level :{
        low :{
            row : 10,
            col : 10,
            mineNum : 10
        },
        mid :{
            row : 15,
            col : 15,
            mineNum : 70
        },
        high :{
            row : 25,
            col : 25,
            mineNum : 100 
        },
    },

}

let currentLevel = config.level.low;
let mineArray = [];
let tableInfo  = [];
let flagArray = [];
let mineNum = currentLevel.mineNum;
let flagNum = 0;
let mineArea = $('.minearea');


