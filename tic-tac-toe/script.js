/*
Minimax Algorithm

minimax value of a node is utility of being in corresponding state, assuming both players play optimally from there to end of game.
minimax value of terminal state is just its utility

Player2 is bot

use transposition table for caching later to avoid recomputations.
*/


let a=Array.from(document.getElementsByClassName("box"))
b=[0,0,0,0,0,0,0,0,0]
left_moves= 9

let start=document.getElementById('start')

// for both non-terminal and terminal state
function utility(playerid=2){
    // 8 possible ways in which game can end

    // check rows
    for(let i=0;i<3;i++){
        if(b[i*3]!=0 && b[i*3]==b[i*3+1] && b[i*3]==b[i*3+2]){
            if(b[i*3]==playerid) return 1
            return -1
        }
    }

    // check columns
    for(let i=0;i<3;i++){
        if(b[i]!=0 && b[i]==b[i+3] && b[i]==b[i+6]){
            if(b[i]==playerid) return 1
            return -1
        }
    }

    // check diagonals
    if(b[0]!=0 && b[0]==b[4] && b[0]==b[8]){
        if(b[0]==playerid) return 1
        return -1
    }

    if(b[2]!=0 && b[2]==b[4] && b[2]==b[6]){
        if(b[2]==playerid) return 1
        return -1
    }

    return 0 // draw
}

let container=document.getElementById("container")

function handlePlayer1(e){
    let box=e.target.closest(".box")
    let id=parseInt(box.getAttribute("id"))
    container.removeEventListener('click',handlePlayer1)

    if(b[id]!=0) Player1()

    box.innerText= "X"
    b[id]= 1
    left_moves-= 1

    if(utility()==-1){
        start.innerText="Player1 Wins!"
        start.style.backgroundColor="rgb(129, 64, 88)"
    }

    else{
        start.innerText="Turn for Bot!"
        start.style.backgroundColor="rgb(213, 219, 43)"
        
        Player2()
    }
}

function minimax(state,rem_moves,maximum){
    win_score= utility()
    if(win_score!=0 || rem_moves==0) return [win_score,-1]

    //  all possible moves from here
    let best_score
    if(maximum) best_score= -1
    else best_score= 1

    let best_move= 0

    for(let i=0;i<9;i++){
        if(state[i]!=0) continue

        if(maximum){
            state[i]= 2 // place O
            let [score,move]= minimax(state,rem_moves-1,!maximum)

            if(score>=best_score) best_move= i, best_score= score 
        }
        else{
            state[i]= 1 // place X (opponent tries to minimize score)
            let [score,move]= minimax(state,rem_moves-1,!maximum)

            if(score<=best_score) best_move= i, best_score= score 
        }

        state[i]= 0 // remove O 
    }

    return [best_score,best_move]
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function Player2(){
    if(left_moves==0){
        start.innerText="Draw!"
        start.style.backgroundColor="rgb(63, 145, 153)"
        return
    }

    let [score,cell]= minimax(b,left_moves,true)

    await sleep(1000) // pausing for 1s

    box= a[cell]
    box.innerText= "O"
    b[cell]= 2
    left_moves-= 1

    if(utility()==1){
        start.innerText="Bot Wins!"
        start.style.backgroundColor="rgb(129, 64, 88)"
    }    

    else{
        start.innerText="Turn for Player1!"
        start.style.backgroundColor="rgb(62, 80, 140)"

        Player1()
    }
}

function Player1(){
    container.addEventListener('click',handlePlayer1)
}

function playgame(){
    start.innerText="Turn for Player1!"
    start.style.backgroundColor="rgb(74, 121, 33)"

    Player1()
}

playgame()