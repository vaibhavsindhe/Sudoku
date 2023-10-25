let numSelected=null;
var tileSelected=null;
let url="https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value}}}";
let board=null;
let ansboard=[[0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0],
              [0,0,0,0,0,0,0,0,0]];



setInstructions();
let start=document.querySelector(".startBtn");
start.addEventListener("click",()=>{
    if(start.id=="start1"){
        play();
    }
    else{
        getans();
    }
});


//play sudoku
async function play(){
        document.querySelector(".instructions").classList.add("animation");  
        await getboard();
        setansboard(board);
        setGame(board);
    
    let btn=document.getElementById("submit");
    btn.addEventListener("click",check);

    async function getboard(){
        await axios.get(url)
        .then((responce)=>{
            board = responce.data.newboard.grids[0].value;
        })
        .catch((error)=>{
           console.log(error);
        });
     }
}


//get solution of sudoku
async function getans(){
    document.querySelector(".instructions").classList.add("animation");
        board=null;
        setansboard(board);
        setGame(ansboard);
    
    let btn=document.getElementById("getsolution");
    btn.addEventListener("click",getsolution);
    
    function getsolution(){
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                if(ansboard[i][j]!="*"){
                    if(!isSafe(i,j,ansboard[i][j],ansboard)){
                        alert("Wrong placement of numbers");
                        return;
                    }
                    else{
                        getsolutionhelper(0,0);
                    }
                }
            }
        }
    }
    function getsolutionhelper(row,col){
        let nxtrow=row;
        let nxtcol=col+1;
    
        if(row==9){
            displayBoard();
            return true;
        }
       
        if(nxtcol==9){
            nxtrow=row+1;
            nxtcol=0;
        }
    
        if(ansboard[row][col]!='*'){
           return getsolutionhelper(nxtrow,nxtcol);
        }
        else{
            for(let n=1;n<=9;n++){
                if(isSafe(row,col,n,ansboard)){
                    ansboard[row][col]=n;
                    if(getsolutionhelper(nxtrow,nxtcol)){
                        return true;
                    }
                    ansboard[row][col]='*';
                }
            }
            return false;
        }
    }
    function displayBoard(){
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                let tile=document.getElementById(i.toString()+"-"+j.toString());
                tile.innerText=ansboard[i][j];
            }
        }
    }
    
}


//common functions
document.getElementById("home").addEventListener("click",()=>{
    window.location.href="index.html";
});
function setansboard(){
    if(board==null){
        setansboardhelper(ansboard,true);
    }
    else{
        setansboardhelper(board,false);
    }
}
function setansboardhelper(sudokuBoard,exception){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(exception || sudokuBoard[i][j]!=0){
                ansboard[i][j]='*';
            }
        }
    }
}
function setGame(sudokuBoard){
    //digits 1-9
    for(let i=1;i<=9;i++){
        let number=document.createElement("div");
        number.id=i;
        number.innerText=i;
        number.addEventListener("click",selectNumber)
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    //sudokuBoard
    for(let r=0;r<9;r++){
        for(let c=0;c<9;c++){
            let tile=document.createElement("div");
            tile.id=r.toString()+"-"+c.toString();
            if(sudokuBoard[r][c]!=0 && sudokuBoard[r][c]!='*'){
              tile.innerText=sudokuBoard[r][c];
              tile.classList.add("ocupied");
            }
            tile.addEventListener("click",selectTile);
            tile.classList.add("tile");
            if(r==2 || r==5){
               tile.classList.add("horizontal-line");
            }
            if(c==2 || c==5){
               tile.classList.add("vertical-line");
            }
            document.getElementById("board").appendChild(tile);
        }
    }
}

function selectNumber(){
    if(numSelected!=null){
        numSelected.classList.remove("number-selected");
    }
    numSelected=this;
    numSelected.classList.add("number-selected");
}

function selectTile(){
    if(numSelected){
        if(board!=null){
            if(this.innerText!=""){
                return;
            }
            this.innerText=numSelected.id;
            this.classList.add("number-color");
            board[this.id.split("-")[0]][this.id.split("-")[1]]=numSelected.id;
        }  
        else{
            this.innerText=numSelected.id;
            this.classList.add("number-color");
            ansboard[this.id.split("-")[0]][this.id.split("-")[1]]=numSelected.id;
            check();
        }     
    }
}

function check(){
    let sudokuBoard
    if(board==null){
        sudokuBoard=ansboard;
    }  
    else{
        sudokuBoard=board;
    }  
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            if(ansboard[i][j]!='*'){
                if(! isSafe(i,j,sudokuBoard[i][j],sudokuBoard)){
                    document.getElementById(i.toString()+"-"+j.toString()).classList.add("wrong");
                }
                else{
                    document.getElementById(i.toString()+"-"+j.toString()).classList.add("correct");    
                }
            }
        }
    }
}

function isSafe(row,col,digit,sudokuBoard){
   
    //row check
    for(let i=0;i<9;i++){
        if(i!=col){
            if(sudokuBoard[row][i]==digit){
                return false;
            }
        }
    }
 
    //col check
    for(let j=0;j<9;j++){
       if(j!=row){
            if(sudokuBoard[j][col]==digit){
                return false;
            }
       }
    }
 
    //3*3 grid check
    let sr=Math.floor(row/3)*3;
    let sc=Math.floor(col/3)*3;
    for(let i=sr;i<sr+3;i++){
       for(j=sc;j<sc+3;j++){
         if(i!=row && j!=col){
            if(sudokuBoard[i][j]==digit){
                return false;
            }
         }
       }
    }
 
    return true;
 }


 function setInstructions(){
    let instrBoard=document.getElementById("instrBoard");
    for(let i=0;i<9;i++){
        let tile=document.createElement("div");
        if(i==4){
            tile.classList.add("numbox");  
        }
        tile.classList.add("box");
        instrBoard.appendChild(tile);
    }
    let tile=document.createElement("div");
    tile.innerText=2;
    tile.id="num"
    tile.classList.add("box");
    document.getElementById("instrBoard2").appendChild(tile);
}

setInterval(()=>{
   document.querySelector(".numbox").innerText=2;
},4000);
setInterval(()=>{
    document.querySelector(".numbox").innerText="";
 },4300);
 setInterval(()=>{
    document.querySelector("#num").classList.add("number-selected");
 },2000);
 setInterval(()=>{
    document.querySelector("#num").classList.remove("number-selected");
 },4000);
