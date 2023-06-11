const parser = new DOMParser();

let State = {
    noOfLift:0,
    noOfFloor:0,
    currentFloor:"",
    isMoving:false,
    isDoorCLosed:true,
    currentLiftIndex: 0
}
State.noOfFloor = localStorage.getItem("floor")
State.noOfLift = localStorage.getItem("lift")

floorGeneration(State.noOfFloor);
liftGeneration(State.noOfLift);





//floor generation
function floorGeneration(noOfFloor){
    let building = document.querySelector(".building");
    for(let i = 1; i <= noOfFloor; i++){
        htmlString = ` <div class="floor">
        <div data-floor="${i}" class="control">
            <button>up</button>
            <button>down</button>
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
    for(let i = 1; i <= noOfLifts; i++){
        htmlString = `<div data-lift="${i}"class="lift">
        <div class="door door-left"></div>
        <div class="door door-right"></div>
       </div>`
        
        let htmlElement = parser.parseFromString(htmlString, "text/html").body.firstElementChild; //parser returns a html document;
        groundFloor.appendChild(htmlElement);    
    }

}



