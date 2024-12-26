/**
 * 游戏主逻辑
 */
let mn = $('.minenum');
let fn = $('.flagnum');
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
function clearScene(){
    mineArea.innerHTML = '';
    flagArray = [];
    mn.innerHTML = currentLevel.mineNum;
    fn.innerHTML = "0";
    flagNum = 0;
}
/**
 * 初始化游戏
 */
function initGame(){
    clearScene()
    
    
    // 1.初始化雷的位置（随机）
    mineArray = initMine();
    // 2.绘制雷阵
    drawTable();
    // 2、点击事件
    mineArea.onmousedown  = function(e){
        
        let index = e.target.dataset.id;
        if(index != undefined){
        //左键
        if(e.button === 0){
            //点击到雷直接结束游戏
            index = parseInt(index);
            if(mineArray.includes(index)){
                showAnswer(e.target);
                gameOver(false);
                return;
            }
            else
            {
            //点击的不是雷，进行·区域搜索统计周围的雷数
                areaSearch(e.target);
            }
        }
        //右键插旗
        else if(e.button == 2)
        {
            plantFlag(e.target);
        }
    }
    
}
}
/**
 * 踩雷了
 * @param {HTMLElement} target 
 */
function showAnswer(target){

    let arr  = tableInfo.flat();
    let divs = $$('td>div');
    target.classList.add('error');
    for(let i = 0 ; i < arr.length;i++)
    {
        if(mineArray.includes(i))
        {
            divs[i].style.opacity = 1;
        }
    }
    for(let i = 0 ; i < flagArray.length;i++)
    {
        if(flagArray[i].classList.contains('mine'))
        {
            flagArray[i].classList.add('right');
        }
        else{
            flagArray[i].classList.add('error');
        }
    }
    mineArea.onmousedown = null;
}
/**
 * 
 * @param {object} jsObj 
 * @returns 边界下标
 */
function getBound(jsObj){
   let leftBound = jsObj.col === 0 ? 0 : jsObj.col - 1;
   let rightBound = jsObj.col === currentLevel.col - 1 ? currentLevel.col - 1 : jsObj.col + 1;
   let upBound = jsObj.row === 0 ? 0 : jsObj.row - 1;
   let downBound = jsObj.row === currentLevel.row - 1 ? currentLevel.row - 1 : jsObj.row + 1;
   return{
    leftBound,
    rightBound,
    upBound,
    downBound
   }
   
}

/**
 * 得到与js对象对应的dom对象
 * @param {object} target 
 * @returns 与js对象对应的dom对象
 */
function transToDom(jsObj){
    let divs = $$('td>div');
    return divs[jsObj.index];
}

/**
 * 区域搜索     
 * @param {HTMLElement} target 
 */

/**、
 * 结束游戏
 * @param {boolean} isWin
 */
function gameOver(isWin){
    let info;
    if(isWin)
    {
        info ='恭喜过关'
    }else{
       info = '游戏失败'
    }
    setTimeout(function(){
        window.alert(info);
    },200)
}
/**
 * 
 * @returns 返回一个布尔值，用于判断是否·所有旗都插对了
 */
function isWin(){
    for(let i = 0 ; i < flagArray.length ;i++){
        if(!flagArray[i].classList.contains('mine'))
        {
            return false
        }
    }
    return true;
}
function areaSearch(target){
    if(!target.classList.contains('flag')){
    target.classList.remove('canflag');
    let arr  = tableInfo.flat();
    let jsObj = arr[target.dataset.id];
    jsObj.checked = true;
    // 得到计数边界
    let{leftBound ,rightBound,upBound,downBound} = getBound(jsObj);
    //统计雷数
    let mineCnt = 0;
    for(let i = upBound;i <= downBound ;i++)
    {
        for(let j = leftBound ; j <= rightBound ;j++)
        {
            if(mineArray.includes(tableInfo[i][j].index)){

                mineCnt++;
               
            }
        }
    }
    target.parentNode.style.border = 'none'
    if(mineCnt){
        // 如果被点击的格子附近有雷，只搜索九宫格即可停止并显示雷数

        target.innerHTML = mineCnt;
        let mineNumarr = ["zero","one","two","three","four","five","six","seven","eight"];
        target.classList.add(mineNumarr[mineCnt]);
      
        

    }else{
        target.classList.add('zero');
     
        let{leftBound ,rightBound,upBound,downBound} = getBound(jsObj);
        for(let i = upBound;i <= downBound ;i++)
            {
                for(let j = leftBound ; j <= rightBound ;j++)
                {
                    let domObj = transToDom(tableInfo[i][j]);
                    if(tableInfo[i][j].checked == false){

                        areaSearch(domObj);
                        
                    }
                   
                }
            }
    }
    
    
    }
}
/**
 * 插旗
 * @param {HTMLElement} target 
 */
function plantFlag(target){
   
   
     if(target.classList.contains('canflag'))
     {
        
        if(target.classList.contains('flag')){
            target.classList.remove('flag');
            let index = flagArray.indexOf(target);
            flagArray.splice(index,1);
            flagNum--;
        }else{
            target.classList.add('flag');
            flagArray.push(target);
            flagNum++;
        }
     }
    fn.innerHTML = flagNum;
    if(flagNum == mineNum)
    {
        showAnswer(target);
        gameOver(isWin());
    }
     
}
/**
 * 事件绑定函数
 */
function bindEvent(){
    //取消右键的默认事件
    mineArea.oncontextmenu = (e) =>{
        e.preventDefault();
    }
    // 1.选择游戏模式
    let level = $('.level');
    level.onclick = function(e){

        let chooseBtn = e.target;
        let preBtn = $('.active');
        preBtn.classList.remove('active');
        chooseBtn.classList.add('active');
        switch(chooseBtn.innerHTML)
        {
            case("初级"):{
                currentLevel = config.level.low;
                break;
            }
            case("中级"):{
                currentLevel = config.level.mid
                break;
            }
            case("高级"):{
                currentLevel = config.level.high;
                break;
            }
        }
       initGame();

    }
    
    
    
}
/**
 * 主函数
 */
function main(){
    // 1.初始化游戏
    initGame();
    //2.绑定事件
    bindEvent();
}
main();
