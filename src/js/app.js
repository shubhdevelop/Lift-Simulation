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
