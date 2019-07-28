const Agent = require('ai-agents').Agent;
var INFINITY = 100;
let board = []
//let globalBoard = [[]];

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }
    
    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send() {
        let board = this.perception;
        // = board
        let size = board.length;
        let available = getEmptyHex(board);
        let nTurn = size * size - available.length;
        //matrix
        if (nTurn == 0) { // First move
            return [Math.floor(size / 2), Math.floor(size / 2) - 1];
        } else if (nTurn == 1){
            return [Math.floor(size / 2), Math.floor(size / 2)];
        }

        var id = this.id
        var auxBoard = board
        let move = available[Math.round(Math.random() * ( available.length -1 ))];
        var alpha = -INFINITY*2;
        var beta = INFINITY*2;
        let nodes = alphabetaminimax([[0,0],alpha], [[0,0],beta], 3, auxBoard, id)
        //console.log(id);
        //console.log(nodes);
        return nodes[0];
    }

}

module.exports = HexAgent;

/**
 * Return an array containing the id of the empty hex in the board
 * id = row * size + col;
 * @param {Matrix} board 
 */
function getEmptyHex(board) {
    let result = [];
    let size = board.length;
    for (let k = 0; k < size; k++) {
        for (let j = 0; j < size; j++) {
            if (board[k][j] === 0) {
                result.push([k,j]);//(k * size + j);
            }
        }
    }
    return result;
}

function isValid(newposition, board, size){
    let x = newposition[0];
    let y = newposition[1];
    if(x<0 || x>=size || y<0 || y>=size){
        return false;
    }else if(board[x][y]==1 || board[x][y]==2){
        return true;
    }
    return true;
}

function getNeighbors(position, board){    
    let size = board.length;
    let result = [];

    /*
    **  / \/ \
    **  |A||B|
    **  \_/\_/
    ** / \/ \/ \
    ** |C|| ||D|
    ** \_/\_/\_/
    **  / \/ \
    **  |E||F|
    **  \_/\_/
    */
    let AIsValid = isValid([position[0]-1,position[1]+0], board, size);
    let BIsValid = isValid([position[0]-1,position[1]+1], board, size);
    let CIsValid = isValid([position[0]+0,position[1]-1], board, size);
    let DIsValid = isValid([position[0]+0,position[1]+1], board, size);
    let EIsValid = isValid([position[0]+1,position[1]-1], board, size);
    let FIsValid = isValid([position[0]+1,position[1]+0], board, size);
    if(AIsValid){ result.push([position[0]-1,position[1]+0]); }
    else{ result.push([false,false]); }
    if(BIsValid){ result.push([position[0]-1,position[1]+1]); }
    else{ result.push([false,false]); }

    if(CIsValid){ result.push([position[0]+0,position[1]-1]); }
    else{ result.push([false,false]); }
    if(DIsValid){ result.push([position[0]+0,position[1]+1]); }
    else{ result.push([false,false]); }

    if(EIsValid){ result.push([position[0]+1,position[1]-1]); }
    else{ result.push([false,false]); }
    if(FIsValid){ result.push([position[0]+1,position[1]+0]); }
    else{ result.push([false,false]); }

    //alert(result);
    return result;
}

function getValidNeighbors(position, board){    
    let size = board.length;
    let result = [];

    /*
    **  / \/ \
    **  |A||B|
    **  \_/\_/
    ** / \/ \/ \
    ** |C|| ||D|
    ** \_/\_/\_/
    **  / \/ \
    **  |E||F|
    **  \_/\_/
    */
    let AIsValid = isValid([position[0]-1,position[1]+0], board, size);
    let BIsValid = isValid([position[0]-1,position[1]+1], board, size);

    let CIsValid = isValid([position[0]+0,position[1]-1], board, size);
    let DIsValid = isValid([position[0]+0,position[1]+1], board, size);

    let EIsValid = isValid([position[0]+1,position[1]-1], board, size);
    let FIsValid = isValid([position[0]+1,position[1]+0], board, size);

    if(AIsValid){ result.push(true); }
    else{ result.push(false); }
    if(BIsValid){ result.push(true); }
    else{ result.push(false); }

    if(CIsValid){ result.push(true); }
    else{ result.push(false); }
    if(DIsValid){ result.push(true); }
    else{ result.push(false); }

    if(EIsValid){ result.push(true); }
    else{ result.push(false); }
    if(FIsValid){ result.push(true); }
    else{ result.push(false); }

    return result;
}

//----------------------------------------------------------------------------------------------------------------------
function getCostoDjk(actualPosVal, player){
    //alert(actualPosVal);
    /*if(player==0){
        player = 2;
    }*/
    if(actualPosVal==0){
        return  2;
    }else if(actualPosVal==player){
        return 1;
    }else{
        return INFINITY;
    }
}


function setCostoDjk(actualPos, player, matrix, board){    
    let areValidMov = getValidNeighbors(actualPos,board);
    let validMov = getNeighbors(actualPos,board);
    let matrixCopia = JSON.parse(JSON.stringify(matrix));
    if(matrixCopia[actualPos[0]][actualPos[1]]!=INFINITY){
        for(var i=0; i<areValidMov.length; i++){
            if(areValidMov[i]){
                let costo = getCostoDjk(board[validMov[i][0]][validMov[i][1]], player);
                if(costo==2 || costo ==1){
                    let costoAcumulado = 0;
                    if(matrixCopia[actualPos[0]][actualPos[1]]==-INFINITY){
                        continue
                    }else{
                        costoAcumulado = matrixCopia[actualPos[0]][actualPos[1]]+costo; //EL costo actual + el costo de ir a la otra posicion
                    }
                    if(matrixCopia[validMov[i][0]][validMov[i][1]] == -INFINITY){
                        matrixCopia[validMov[i][0]][validMov[i][1]] = costoAcumulado;
    
                    }else if(matrixCopia[validMov[i][0]][validMov[i][1]] == INFINITY){
                        continue
                    }else if(costoAcumulado<matrixCopia[validMov[i][0]][validMov[i][1]]){
                        matrixCopia[validMov[i][0]][validMov[i][1]] = costoAcumulado;
                    }
                }else{
                   matrixCopia[validMov[i][0]][validMov[i][1]] = costo;
                }
            }        
        }
    }
    return matrixCopia;
}

function getMatrixCostosDjk(board, matrix, player){
    let matrixCopia = JSON.parse(JSON.stringify(matrix));
    if(player==1){
        for(var i=0; i<board.length; i++){
            for(var j=0; j<board.length; j++){
                matrixCopia = setCostoDjk([i,j], player, matrixCopia, board);
            }
        }
    }else{
        for(var i=0; i<board.length; i++){
            for(var j=0; j<board.length; j++){
                matrixCopia = setCostoDjk([j,i], player, matrixCopia, board);
            }
        }
    }    
    return matrixCopia;
}

function testDjk(board, player){
    let size = board.length;
    let matrix = [];
    for(var i=0; i<size; i++) {
        matrix[i] = [];
        for(var j=0; j<size; j++) {
            matrix[i][j] = 0;
        }
    }
    if(player==1){        
        for(var i=0; i<size; i++) {
            matrix[i] = [];
            for(var j=0; j<size; j++) {
                if(board[i][j]==player && j==0){
                    matrix[i][j] = 0;
                }
                else if(j==0){
                    matrix[i][j] = 3;
                }else if(board[i][j]==0 || board[i][j]==player){
                    matrix[i][j] = -INFINITY;
                }else{
                    matrix[i][j] = INFINITY;
                }
            }
        }        
    //-----------------------------------------------------------------------------------------------
    }else{ //PLAYER 2 
        for(var i=0; i<size; i++) {   
            for(var j=0; j<size; j++) {
                if(board[i][j]==player && i==0){
                    matrix[i][j] = 0;
                }
                else if(i==0){
                    matrix[i][j] = 3;
                }else if(board[i][j]==0 || board[i][j]==player){ // || board[i][j]==player   ----------------------------------------------------
                    matrix[i][j] = -INFINITY;
                }else{
                    matrix[i][j] = INFINITY;
                }
            }
        }        
    }
    let nMatrix = getMatrixCostosDjk(board, matrix, player);
    for(var i=0; i<size;i++){
        nMatrix = getMatrixCostosDjk(board, nMatrix, player);
    }
    let path=0;
    if(player==1){
        path = findNextCheaperNeighbor (board, nMatrix, 1);
    }else{
        path = findNextCheaperNeighbor (board, nMatrix, 0);
    }
    let info = [path,nMatrix];
    return info;
}


function include (array, value){
    let isEqual = false
    for (var i=0; i<array.length; i++){
        if(array[i].length!=value.length) {
            return isEqual; 
        }else{
            if(array[i][0]==value[0] && array[i][1]==value[1]) {
                isEqual = true; 
            }
        } 
    }
    return isEqual;
}

function findNextCheaperNeighbor (board, nMatrix, player){
    let shortestPath = [];
    let visitedNodes = [];
    let stopIterating = true;
    let size = board.length;
    let position = [];
    let menor = INFINITY;
    if(player == 1){
        for(var i=0; i<size;i++){
            if(nMatrix[i][size-1] == -INFINITY){
                continue
            } else if (nMatrix[i][size-1] <= menor && !include(visitedNodes, [i, size-1])){
                menor = nMatrix[i][size-1];
                shortestPath = [[i, size-1]];
                position = [i, size-1];
            }
        }
    }else {
        for(var i=0; i<size;i++){
            if(nMatrix[size-1][i] == -INFINITY){
                continue
            } else if (nMatrix[size-1][i] <= menor && !include(visitedNodes, [size-1, i])){
                menor = nMatrix[size-1][i];
                shortestPath = [[size-1, i]];
                position = [size-1, i];
            }
        }
    }
    if(shortestPath.length == 0){
        return []
    }
    visitedNodes.push(position);
    
    menor = INFINITY
    n=0
    while (stopIterating) {
        n=n+1
        let boolNeighbors = getValidNeighbors(position, board);
        let neighbors = getNeighbors(position, board);
        for (var i=0; i<neighbors.length; i++){
            if (boolNeighbors[i]) {
                if (position[player] == 0 || n > 50){
                    stopIterating = false;
                }
                if (include(visitedNodes, neighbors[i])){
                    continue;   
                }
                if(nMatrix[neighbors[i][0]][neighbors[i][1]] == -INFINITY){
                    visitedNodes.push(neighbors[i]);
                    continue;
                } else if (nMatrix[neighbors[i][0]][neighbors[i][1]] > menor){
                    visitedNodes.push(neighbors[i]);
                    continue;
                }else if (nMatrix[neighbors[i][0]][neighbors[i][1]] <= menor && !include(visitedNodes, neighbors[i])) {
                    visitedNodes.push(neighbors[i]);
                    menor = nMatrix[neighbors[i][0]][neighbors[i][1]];
                    position = neighbors[i];
                } else if (include(visitedNodes, neighbors[i])){
                    visitedNodes.push(neighbors[i]);
                } else {
                    visitedNodes.push(neighbors[i]);
                    menor = nMatrix[neighbors[i][0]][neighbors[i][1]];
                    position = neighbors[i]
                    
                }
            }
        }
        shortestPath.push(position);
    }
    return shortestPath
}

function getHeuristic(value){
    return value//Math.abs(100-value);
}

function removeAlreadyPLayed(board,path,player){
    /*var valPlayer = player;
    if(player!=1){
        valPlayer = 2;
    }*/
    var pos = [];
    var pathnew = path;

    for(var i=0; i<path.length; i++){
        pos = board[path[i][0]][path[i][1]];
        if(pos==player){
            pathnew.splice(i,1);
        }
    }
    return pathnew;
}

function alphaBetaMax(alpha, beta, depth, board ,player){    
    info = testDjk(board, player);
    let path = info[0];
    path = removeAlreadyPLayed(board,path,player);
    //console.log(path);
    if(depth==0){
        //console.log(path);
    }
    let nMatrix = info[1];
    delete info
    let score = [[3,3],0];
    if(depth==0 ){
        if(path.length == 0){
            return [[3,3],-100];
        }
        return [path[0],-1*nMatrix[path[0][0]][path[0][1]]];
    }
    for (var i=0; i<path.length; i++){
        var newBoard = JSON.parse(JSON.stringify(board));
        if(player==1){
            newBoard[path[i][0]][path[i][1]] = 1;
            score = alphaBetaMin(alpha, beta, depth-1, newBoard  ,2); //2
        }else{
            newBoard[path[i][0]][path[i][1]] = 2;
            score = alphaBetaMin(alpha, beta, depth-1, newBoard ,1); //1
        }
        if(score[1]>=beta[1]){
            if(beta[1]==INFINITY){
                //console.log(score);  //-------------------------------
            }
            return [path[i],beta[1]];
        }
        if(score[1]>alpha[1]){
            alpha=[path[i],score[1]];
        }
    }
    return alpha;
}

function alphaBetaMin(alpha, beta, depth, board ,player){
    info = testDjk(board, player);
    let path = info[0];
    path = removeAlreadyPLayed(board,path,player);
    if(depth==0){
        //console.log(path);
    }
    let nMatrix = info[1];
    delete info
    let score = [[3,3],0];
    if(depth==0){
        if(path.length == 0){
            return [[3,3],100];
        }
        //console.log(player);
        var heuristic = getHeuristic(nMatrix[path[0][0]][path[0][1]]);        
        return [path[0],heuristic];
    }
    for (var i=0; i<path.length; i++){
        var newBoard = JSON.parse(JSON.stringify(board));
        if(player==1){
            newBoard[path[i][0]][path[i][1]] = 1;
            score = alphaBetaMax(alpha, beta, depth-1, newBoard ,2);//2
        }else{
            newBoard[path[i][0]][path[i][1]] = 2;
            score = alphaBetaMax(alpha, beta, depth-1, newBoard ,1);//1
        }
        if (score[1]<=alpha[1]){            
            return [path[i],alpha[1]];
        }
        if(score[1]<beta[1]){
            beta=[path[i],score[1]];
        }
    }
    return beta;
}

function alphabetaminimax(alpha, beta, depth, board ,player){
    if(player == 2){
        //player = 0
        return alphaBetaMax(alpha, beta, depth, board ,player)
    } else{
        //player = 1
        return alphaBetaMax(alpha, beta, depth, board ,player)
    }
}