setDefaultValue();

function setDefaultValue(){
    console.log("this Ran");
    localStorage.setItem("floor", 3) 
    localStorage.setItem("lift", 1)
}

console.log(localStorage)

let button = document.querySelector('button');

let fetchData = (e) => {
    let noOfLift = document.querySelector("#liftInput")
    let noOfFloor = document.querySelector("#floorInput")
    storeDataLocal(noOfFloor.value, noOfLift.value);
}

let storeDataLocal = (floor,lift)=>{
    localStorage.setItem("floor", floor) 
    localStorage.setItem("lift", lift)
}





button.addEventListener("click", fetchData)


