/*
Searching Algorithms:
1) BFS
2) DFS
3) A*
*/

A= Array.from(document.getElementsByClassName("box"))

const n= 225
const k= Math.floor(Math.random()*100)+15
const indices= new Set()
const s= 15

while(indices.size < k){
    let randomnum= Math.floor(Math.random()*n)
    indices.add(randomnum)
}

for(const ele of indices){
    A[ele].style.backgroundColor= "black"
}

const start= Math.floor(Math.random()*45)
const end= Math.floor(Math.random()*75)+150

A[start].style.backgroundColor= "aqua"
A[end].style.backgroundColor= "green"

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const dirs= [-1,0,1,0,-1]

let endrow= Math.floor(end/s)
let endcol= end%s

function heuristic(node){
    let row= Math.floor(node/s)
    let col= node%s

    return Math.abs(endrow-row)+ Math.abs(endcol-col)
}



let curridx= 0
const queue= [start]
const visited= new Set()
visited.add(start)
let target_reached= false

async function bfs(){
    while(curridx!=queue.length && !target_reached){
        let n= queue.length-curridx

        await sleep(100)
            
        for(let i=curridx;i<curridx+n;i++){
            let curr= queue[i]
            let currrow= Math.floor(curr/s)
            let currcol= curr%s

            for(let k=0;k<4;k++){
                let newrow= currrow+dirs[k]
                let newcol= currcol+dirs[k+1]
                
                let newcell= newrow*s+newcol
            
                if(newrow>=0 && newrow<s && newcol>=0 && newcol<s && !indices.has(newcell) && !visited.has(newcell)){
                    queue.push(newcell)
                    visited.add(newcell)
                    A[newcell].style.backgroundColor= "yellow"

                    if(newcell==end) target_reached= true, A[end].style.backgroundColor= "red"
                }
            }
        }

        curridx+= n
    }

    await sleep(2000)
    location.reload()
}



let q= [{node:start,g:0,h:heuristic(start),f:heuristic(start)}]

async function astar(){
    while(q.length && q[0].node!=end){
        await sleep(100)

        q.sort((a,b)=>a.f-b.f)
        let current= q.shift()
        let currrow= Math.floor((current.node)/s)
        let currcol= (current.node)%s

        for(let k=0;k<4;k++){
            let newrow= currrow+dirs[k]
            let newcol= currcol+dirs[k+1]
            
            let newcell= newrow*s+newcol
        
            if(newrow>=0 && newrow<s && newcol>=0 && newcol<s && !indices.has(newcell)){
                const node= q.find(n=> n.node==newcell)
                let h= heuristic(newcell)

                if(!node) q.push({node:newcell,g:current.g+1,h:h,f:current.g+1+h})
                else if(current.g+1 < node.g) node.g=current.g+1, node.f= node.g+h  

                A[newcell].style.backgroundColor= "yellow"
                if(newcell==end) A[end].style.backgroundColor= "red"
            }
        }
    }

    await sleep(2000)
    location.reload()
}

async function dfs(currNode){
    await sleep(100)

    let currrow= Math.floor(currNode/s)
    let currcol= currNode%s

    for(let k=0;k<4;k++){
        if(target_reached) return

        let newrow= currrow+dirs[k]
        let newcol= currcol+dirs[k+1]
        
        let newcell= newrow*s+newcol
        
        if(newrow>=0 && newrow<s && newcol>=0 && newcol<s && !indices.has(newcell) && !visited.has(newcell)){
            visited.add(newcell)
            
            if(newcell==end) {
                A[end].style.backgroundColor= "red"
                target_reached= true

                await sleep(2000)
                return
            }

            A[newcell].style.backgroundColor= "yellow"
            await dfs(newcell)
            await sleep(50)
            A[newcell].style.backgroundColor= "white"
        }
    }
}

function dfsViz(){
    dfs(start)
    location.reload()
}

bfsbtn= document.getElementById("bfs")
dfsbtn= document.getElementById("dfs")
astarbtn= document.getElementById("astar")

bfsbtn.addEventListener('click',bfs)
dfsbtn.addEventListener('click',dfsViz)
astarbtn.addEventListener('click',astar)
