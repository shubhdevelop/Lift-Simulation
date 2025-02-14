let parser = new DOMParser();

class Floor {
  constructor(id) {
    this.id = id;
    this.occupied = false;
    this.renderView();
  }

  buildElement() {
    let htmlString = ` <div class="floor ">
        <div class="control">
            <button data-floorNO="${this.id}" >Up</button>
            <p>${this.id}</p>
            <button data-floorNO="${this.id}">Down</button>
        </div>
        <div class="standing-area">
 
        </div>
    </div>`;
    let html = parser.parseFromString(htmlString, "text/html").body
      .firstElementChild;
    return html;
  }

  renderView() {
    let building = document.querySelector("body");
    building.appendChild(this.buildElement());
  }
}

class Lift {
  constructor(id) {
    //idle || running || transition
    this.status = "idle";
    this.currHightInPx = 0;
    this.occupiedFloor = 0;
    this.id = id;
    this.html;
    this.previousFloor = 0;
    this.renderView();
  }

  buildElement() {
    let htmlString = `<div class="lift" id="lift-${this.id}" data-id="${this.id}"  >
         <div class="door door-left"></div>
         <div class="door door-right"></div>
        </div>`;
    let html = parser.parseFromString(htmlString, "text/html").body
      .firstElementChild;

    return html;
  }

  renderView() {
    let building = document.querySelector(".standing-area");
    building.appendChild(this.buildElement());
    this.html = this.setReferenceToElement();
  }

  setReferenceToElement() {
    let element = document.querySelector(`#lift-${this.id}`);
    return element;
  }
  #calcTransitionTime(distance, factor = 1) {
    return Math.sign(distance) == -1
      ? distance * -1 * 2 * factor
      : distance * 2 * factor;
  }

  moveTo(destination, controller) {
    if (this.status == "idle") {
      if (destination != 0) controller.occupiedFloor[destination] = true;
      if (this.previousFloor != 0)
        controller.occupiedFloor[this.previousFloor] = false;
      this.previousFloor = destination;
      this.status = "moving";
      let netFloorToMove = this.occupiedFloor - destination;
      //making it state occupied as soon as possible
      this.occupiedFloor = destination;

      let transitionTime = this.#calcTransitionTime(netFloorToMove);

      let factor = netFloorToMove * 200 + netFloorToMove;
      this.currHightInPx = this.currHightInPx + factor;
      this.html.style.cssText = `transform: translateY(${this.currHightInPx}px);
        transition: ${transitionTime}s linear;`;
      setTimeout(() => {
        this.status = "transition";
        let movingLift = controller.movingLifts.shift();
        controller.transitioningLift.push(movingLift);
        this.html.childNodes[1].style.animation = `left-door-animation 5s linear `;
        this.html.childNodes[3].style.animation = `right-door-animation 5s linear `;
        setTimeout(() => {
          this.status = "idle";
          if (controller.unfullfilledCalls.length == 0) {
            let transitionedLift = controller.transitioningLift.shift();
            controller.idleLifts.push(transitionedLift);
            this.html.childNodes[1].style.animation = `none`;
            this.html.childNodes[3].style.animation = `none`;
          } else {
            console.log(
              "unfullfilledCalls",
              controller.unfullfilledCalls[0].callFloor
            );
            let transitionedLift = controller.transitioningLift.shift();
            controller.idleLifts.push(transitionedLift);
            callLift(undefined, controller.unfullfilledCalls.shift().callFloor);
            this.html.childNodes[1].style.animation = `none`;
            this.html.childNodes[3].style.animation = `none`;
          }
        }, 5000);
      }, this.#calcTransitionTime(netFloorToMove, 1000));
    }
  }
}

class Task {
  constructor(callFloor) {
    this.callFloor = callFloor;
    this.status;
  }
}

class Controller {
  constructor() {
    this.floors = [];
    this.currLift = 0;
    this.movingLifts = [];
    this.transitioningLift = [];
    this.liftQueue = [];
    this.occupiedFloor = [];
    this.idleLifts = [];
    this.unfullfilledCalls = [];
  }

  generateLift(noOfLift) {
    for (let i = 0; i < noOfLift; i++) {
      //this.liftQueue.push(new Lift(i));
      this.liftQueue.push(new Lift(i));
    }
  }

  generateFloor(noOfFloor) {
    for (let i = 0; i <= noOfFloor; i++) {
      this.floors.push(new Floor(i));
      this.occupiedFloor.push(false);
    }
  }

  static bindEventCallback(element, callback) {
    let elements = document.querySelectorAll(`${element}`);
    elements.forEach((element) => {
      element.addEventListener("click", callback);
    });
  }

  static dequeueMoveEnqueue(floorNo, controller) {
    console.log(controller, "queueEnqueue");
    controller.currLift = controller.liftQueue.shift();
    controller.currLift.moveTo(floorNo, controller);
    controller.movingLifts.push(controller.currLift);
  }
}

const controller = new Controller();
controller.generateFloor(localStorage.getItem("floor"));
controller.generateLift(localStorage.getItem("lift"));
Controller.bindEventCallback("button", callLift);
// Controller.bindEventCallback(".lift", setLiftActive);

function callLift(e, floor) {
  let floorNo;
  if (e == undefined) {
    floorNo = floor;
    console.log("this ran e is undefined");
  } else if (floor == undefined) {
    floorNo = e.target.dataset.floorno;
  }

  if (controller.occupiedFloor[floorNo] == false) {
    if (controller.idleLifts.length == 0 && controller.liftQueue.length != 0) {
      if (controller.currLift.status == undefined) {
        Controller.dequeueMoveEnqueue(floorNo, controller);
      } else if (controller.currLift.status !== "idle") {
        Controller.dequeueMoveEnqueue(floorNo, controller);
      }
    } else if (
      controller.idleLifts.length == 0 &&
      controller.liftQueue.length == 0
    ) {
      controller.unfullfilledCalls.push(new Task(floorNo));
      console.log("all lifts are busy", controller.unfullfilledCalls);
    } else if (controller.idleLifts.length != 0) {
      controller.currLift = controller.idleLifts.shift();
      controller.currLift.moveTo(floorNo, controller);
      controller.movingLifts.push(controller.currLift);
      console.log(controller, "ran from idleLifts");
    }
  }
}

//scroll to the bottom of the page ---> ground floor
window.scrollTo(0, document.body.scrollHeight);
