const parser = new DOMParser();
let State = {
    noOfLift:0,
    noOfFloor:0,
    currentFloor:"",
    isMoving:false,
    isDoorCLosed:true,
    currentLiftIndex: 0,
    activeLift:1,
    occupiedFloor:[],
    
}
State.noOfFloor = localStorage.getItem("floor")


State.noOfLift = localStorage.getItem("lift")

floorGeneration(State.noOfFloor);
liftGeneration(State.noOfLift);


for(let i = 0; i < State.noOfFloor; i++){
    State.occupiedFloor.push(undefined);
}
console.log(State.occupiedFloor.length);

let allLifts = document.querySelectorAll(".lift")
console.log(allLifts);

let allButtons = document.querySelectorAll("button")




//floor generation
function floorGeneration(noOfFloor){
    let building = document.querySelector(".building");
    for(let i = 1; i <= noOfFloor; i++){
        htmlString = ` <div class="floor">
        <div data-floor="${i}" class="control">
            <button data-floorNO="${i}" >up</button>
            <button data-floorNO="${i}">down</button>
        </div>
        <div class="standing-area">

            <p>

                ${i}st Floor
            </p>   
        </div>
    </div>`
        let htmlElement = parser.parseFromString(htmlString, "text/html").body.firstElementChild;
    
        building.appendChild(htmlElement);    
    }

}

//lift generation

function liftGeneration(noOfLifts){
    let groundFloor = document.querySelector('.ground-floor .standing-area');
    for(let i = 2; i <= noOfLifts; i++){
        htmlString = `<div data-lift="${i}"class="lift" data-previousFloor="0" data-occupiedFLoor='0'>
        <div class="door door-left"></div>
        <div class="door door-right"></div>
       </div>`
        
        let htmlElement = parser.parseFromString(htmlString, "text/html").body.firstElementChild; //parser returns a html document;
        groundFloor.appendChild(htmlElement);    
    }

}


document.querySelectorAll(".lift").forEach((lift)=>{
    lift.addEventListener("click", setLiftActive)
})


function setLiftActive(e){
    State.activeLift= e.target.dataset.lift
    console.log(State.activeLift)
}


allButtons.forEach((button)=>{
 button.addEventListener("click", (e)=>{

    let callFloorNo = e.target.dataset.floorno
    
    


    console.log(`called from , ${callFloorNo} for lift no ${State.activeLift}`);


    if(State.occupiedFloor[callFloorNo] === undefined){
        
        
        State.occupiedFloor[allLifts[State.activeLift-1].dataset.previousFloor] = undefined;

        //moving the active lift / selected
        allLifts[State.activeLift-1].style.cssText = `transform: translateY(-${e.target.dataset.floorno * 147}px);
        transition: 2s;`

        //updating the State floor as occupied
        if(callFloorNo == 0){
            State.occupiedFloor[0] = undefined;
        }else{

            State.occupiedFloor[callFloorNo] = true;
        }
        //setting the floorBeforeTheCall
        allLifts[State.activeLift-1].dataset.previousFloor = callFloorNo
        

        //updates the state
        allLifts[State.activeLift-1].dataset.occupiedFloor = callFloorNo;

        //resets the previously occupied floor to its initial value;
        // State.occupiedFloor[e.target.dataset.occupiedFloor] = undefined;

    }else{
        console.log("the floor is already occupied");
    }


    
 })
})
