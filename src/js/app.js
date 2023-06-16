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
            <button data-floorNO="${this.id}" >up</button>
            <p>${this.id}</p>
            <button data-floorNO="${this.id}">down</button>
        </div>
        <div class="standing-area">
 
        </div>
    </div>`;
    let html = parser.parseFromString(htmlString, "text/html").body
      .firstElementChild;
    return html;
  }

  renderView() {
    let building = document.querySelector(".building");
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

  moveTo(destination) {
    if (this.status == "idle") {
      this.status = "moving";
      let netFloorToMove = this.occupiedFloor - destination;
      //making it occupied as soon as possible
      this.occupiedFloor = destination;
      let transitionTime = this.#calcTransitionTime(netFloorToMove);

      let factor = netFloorToMove * 147;
      this.currHightInPx = this.currHightInPx + factor;
      this.html.style.cssText = `transform: translateY(${this.currHightInPx}px);
        transition: ${transitionTime}s ease-out`;
      console.log(transitionTime);
      setTimeout(() => {
        this.status = "transition";
        this.html.childNodes[1].style.animation = `left-door-animation 5s linear `;
        this.html.childNodes[3].style.animation = `right-door-animation 5s linear `;
        setTimeout(() => {
          this.status = "idle";
          this.html.childNodes[1].style.animation = `none`;
          this.html.childNodes[3].style.animation = `none`;
        }, 5000);
      }, this.#calcTransitionTime(netFloorToMove, 1000));
    }
  }
}

class Controller {
  constructor() {
    this.floors = [];
    this.nxtLift = 0;
    this.currLift = 0;
    this.movingLifts = [];
    this.liftQueue = [];
    this.occupiedFloor = [];
  }

  generateLift(noOfLift) {
    for (let i = 0; i < noOfLift; i++) {
      this.liftQueue.push(new Lift(i));
    }
    console.debug("no of lifts generated: ", noOfLift);
    this.currLift = this.liftQueue[0];
  }

  generateFloor(noOfFloor) {
    for (let i = 0; i <= noOfFloor; i++) {
      this.floors.push(new Floor(i));
    }
    console.debug("no of floors generated: ", noOfFloor);
  }

  static bindEventCallback(element, callback) {
    let elements = document.querySelectorAll(`${element}`);
    elements.forEach((element) => {
      element.addEventListener("click", callback);
    });
  }
}

const controller = new Controller();
controller.generateFloor(localStorage.getItem("floor"));
controller.generateLift(localStorage.getItem("lift"));

Controller.bindEventCallback("button", callLift);
Controller.bindEventCallback(".lift", setLiftActive);

function callLift(e) {
  let floorNo = e.target.dataset.floorno;
  controller.currLift.moveTo(floorNo);
}

function setLiftActive(e) {
  let activeLift = e.target.dataset.id;
  controller.currLift = controller.liftQueue[activeLift];
}
