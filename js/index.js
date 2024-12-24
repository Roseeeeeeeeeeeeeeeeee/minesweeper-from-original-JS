/**
 * 游戏主逻辑
 */


/**
 * 生成雷的位置
 * @returns 雷位置数组
 */
function initMine(){
    let arr  = new Array(currentLevel.col * currentLevel.row);
    for(let i = 0 ; i < arr.length;i++)
        {
            arr[i] = i;
        }
        arr.sort(() => 0.5 - Math.random());
        //截取所需雷数
        arr = arr.slice(0,currentLevel.mineNum);
       
        return arr; 

}
/**
 * 绘制表格
 */
function drawTable(){
    let table =  document.createElement('table');
    let index = 0;
    for(let i = 0 ; i < currentLevel.row;i++)
    {
        let tr =  document.createElement('tr');
        tableInfo[i] = [];
        for(let j = 0 ; j < currentLevel.col ;j++)
        {
            let td = document.createElement('td');
            let div = document.createElement('div');
            //每一个小格子（一个dom对象）都对应一个js对象来储存其对应信息
            tableInfo[i][j] = {
                row : i,
                col : j,
                mineAround : null,
                index ,
                type : "number",
                checked : false,
            }
            if(mineArray.includes(index))
            {
                tableInfo[i][j].type = 'mine';
            }
            td.textContent = tableInfo[i][j].mineAround;
            div.classList.add(tableInfo[i][j].type);
            div.classList.add('canflag');
            div.dataset.id = index;
            td.appendChild(div);
            tr.appendChild(td);
            index++;
        }
        table.appendChild(tr);
    }
    let mineArea = $(".minearea");
    mineArea.appendChild(table);

}
/**
 * 初始化游戏
 */
function initGame(){
    // 1.初始化雷的位置（随机）
    mineArray = initMine();
    // 2.绘制雷阵
    drawTable();
    
}
/**
 * 主函数
 */
function main(){
    // 1.初始化游戏
    initGame();
    //2.绑定事件
}
main();
