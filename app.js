// const{Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse} = Matter;

// const width = 800;
// const height=600;

// const engine = Engine.create();
// const {world} = engine;
// const render = Render.create({
//     element: document.body,
//     engine: engine,
//     options:{
//         wireframes: false,
//         width,
//         height
//     }
// });



// Render.run(render);
// Runner.run(Runner.create(),engine);

//add mouse clicking dragging feature
// World.add(world, MouseConstraint.create(engine,{
//     mouse: Mouse.create(render.canvas)
// }));

// const shape = Bodies.rectangle(200,200,50,50,{
//     isStatic: true
// });
// World.add(world, shape);

// const walls =[
//     Bodies.rectangle(400,0,800,40,{isStatic:true}),
//     Bodies.rectangle(400,600,800,40,{isStatic:true}),
//     Bodies.rectangle(0,300, 40,600, {isStatic:true}),
//     Bodies.rectangle(800,300, 40,600, {isStatic:true})
// ];

// World.add(world, walls);
// //Random Shapes
// for (let i=0; i<20; i++){
//     if(Math.random()>0.5){
//         World.add(
//         world,
//         Bodies.rectangle(Math.random()*width,Math.random()*height, 50,50,));
// } else {
//     World.add(
//         world,
//         Bodies.circle(Math.random()*width,Math.random()*height, 35,{
//             render:{
//                 fillStyle:'green'
//             }
//         })); 
         
//     }
// }


const{Engine, Render, Runner, World, Bodies, Body, Events} = Matter;


// const cells=5;
const cellsHorizontal= 14;
const cellsVertical = 12;
const width =window.innerWidth;
const height=window.innerHeight;

//unitLength = width/cells
const unitLengthX = width / cellsHorizontal
const unitLengthY = height/cellsVertical

const engine = Engine.create();
//changing gravity
engine.world.gravity.y=0;
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options:{
        wireframes: false,
        width,
        height
    }
});

Render.run(render);
Runner.run(Runner.create(),engine);

const walls =[
        Bodies.rectangle(width/2,0,width,2,{isStatic:true}),
        Bodies.rectangle(width/2,height,width,2,{isStatic:true}),
        Bodies.rectangle(0,height/2, 2,height, {isStatic:true}),
        Bodies.rectangle(width,height/2, 2,height, {isStatic:true})
    ];

World.add(world, walls);

// Maze Generation 

// const grid = [];
// for (let i=0; i<3; i++){
//     grid.push([]);
//     for (let j = 0; j<3;j++){
//         grid[i].push(false);
//     }
// }
// console.log(grid)

const shuffle =(arr) =>{
    let counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random()*counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
};

// const grid = Array(cells)
// .fill(null)
// .map(() => Array(cells).fill(false));

// const vartical = Array(cells).fill(null).map(()=>
//     Array(cells-1).fill(false))
// const horizontal = Array(cells-1).fill(null).map(()=>
//     Array(cells).fill(false)
// )

const grid = Array(cellsVertical)
.fill(null)
.map(() => Array(cellsHorizontal).fill(false));

const vartical = Array(cellsVertical).fill(null).map(()=>
    Array(cellsHorizontal -1).fill(false))
const horizontal = Array(cellsVertical -1).fill(null).map(()=>
    Array(cellsHorizontal).fill(false)
)


// const startRow= Math.floor(Math.random()* cells);
// const startColum=Math.floor(Math.random()*cells);

const startRow= Math.floor(Math.random()* cellsVertical);
const startColum=Math.floor(Math.random()* cellsHorizontal);

const stepThroughCells = (row, column) => {
    //if i have visited the cell at [row, column], then return
    if (grid[row][column]){
        return;
    }

    //mark this cell as being visited
    grid[row][column] = true

    //assemble randomly-rodered lost of neighbors
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column+1, 'right'],
        [row+1, column, 'down'],
        [row, column-1, 'left']
    ]);

    //For each nighbors...
    for (let neighbor of neighbors){
        const[nextRow, nextColumn, direction]=neighbor;
        //see if that neighbor is out of bounds
        // if (nextRow<0 ||nextRow>= cells || nextColumn < 0 || nextColumn >= cells){
        //     continue;
        // } 
        if (nextRow<0 ||
            nextRow>= cellsVertical || 
            nextColumn < 0 || 
            nextColumn >= cellsHorizontal){
            continue;
        } 
        //if we have visited that neighbors, continue to next nighbor
        if (grid[nextRow][nextColumn]){
            continue;
        }
        //remove a wall from either horizontal and vartical array
        if (direction === 'left'){
            vartical[row][column-1]=true;
        }else if (direction==='right'){
            vartical[row][column]= true;
        } else if (direction==='up'){
            horizontal[row-1][column] = true;
        }else if (direction === 'down'){
            horizontal[row][column] =true;
        }
        stepThroughCells(nextRow, nextColumn);
        
        //visit that next cells
    }
    
    //visit that next cell 
};

stepThroughCells(startRow, startColum)
// console.log(grid)
// stepThroughCells(1, 1)

horizontal.forEach((row, rowIndex) =>{
    row.forEach((open, columnIndex)=>{
        if (open ===true){
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            {
                label:'wall',isStatic:true, 
                render:{
                    fillStyle:'red'
                }
            }
        );
        World.add(world, wall);
    });
});

vartical.forEach((row,rowIndex)=>{
    row.forEach((open,columnIndex) =>{
        if (open){
            return;
        }
        const wall= Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            {
                label:'wall',
                isStatic:true,
                render:{
                    fillStyle:'red'
                }
            }

        );
        World.add(world, wall);
    });
});

//Goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        label:'goal',
        isStatic:true,
        render:{
            fillStyle:'green'
        }
    }
)

World.add(world, goal);

// Ball
const ballRadious = Math.min(unitLengthX, unitLengthY)/4

const ball= Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2, 
    ballRadious,
    {
        label:'ball',
        render:{
            fillStyle:'blue'
        }
        
    }
)

World.add(world, ball);

document.addEventListener('keydown', event =>{
    const{x,y}=ball.velocity;
    

    if (event.keyCode === 87){
        Body.setVelocity(ball, {x, y: y-5 });
    }
    if (event.keyCode === 68){
        Body.setVelocity(ball, {x:x+5, y })
    }
    if (event.keyCode === 83){
        Body.setVelocity(ball, {x, y: y+5 })
    }
    if (event.keyCode === 65){
        Body.setVelocity(ball, {x:x-5, y})
    }
});

// Win condition 
Events.on(engine, 'collisionStart', event =>{
    event.pairs.forEach(collision =>{
        const labels = ['ball', 'goal'];

        if(
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ){
            document.querySelector('.winner').classList.remove('hidden')
            world.gravity.y=1;
            world.bodies.forEach(body =>{
                if(body.label==='wall'){
                    Body.setStatic(body, false);
                }
            })
        }
    })
});

