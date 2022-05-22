let addBtn = document.querySelector(".add-btn");
let modalWindow = document.querySelector(".modal-cont");
let taskAreaContent = document.querySelector(".textarea-cont");
let mai = document.querySelector(".main-cont");
let allPriorityCol = document.querySelectorAll(".priority-color");
let rmvBtn = document.querySelector(".remove-btn");
let rmvToggle = false;
let addModal = true;
let modalPriorityCol = "black";
let colors = ["lightPink", "lightBlue", "lightGreen", "black"];
let colLen = colors.length;
let uid = new ShortUniqueId();
let mainPriorityColors = document.querySelectorAll(".color");
let ticketArr = [];

// updating local storage
if (localStorage.getItem("tickets")) {
  let str = localStorage.getItem("tickets");
  let normalArr = JSON.parse(str);
  ticketArr = normalArr;
  for (let i = 0; i < normalArr.length; i++) {
    let ticketObj = normalArr[i];
    createTicket(ticketObj.color, ticketObj.task, ticketObj.id);
  }
}

// console.log(ticketArr);
//filtered array
for (let i = 0; i < mainPriorityColors.length; i++) {
  let priColor = mainPriorityColors[i];
  priColor.addEventListener("click", function () {
    let theColor = priColor.classList[1];
    let filteredArr = [];
    for (let j = 0; j < ticketArr.length; j++) {
      if (theColor == ticketArr[j].color) {
        filteredArr.push(ticketArr[j]);
      }
    }

    //remove all tickets
    let allTick = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTick.length; j++) {
      allTick[j].remove();
    }

    //show filtered
    for (let j = 0; j < filteredArr.length; j++) {
      let filter = filteredArr[j];
      let colr = filter.color;
      let tas = filter.task;
      let i = filter.id;
      createTicket(colr, tas, i);
    }

    //show all on double click
    mainPriorityColors[i].addEventListener("dblclick", function () {
      let allTick = document.querySelectorAll(".ticket-cont");
      for (let j = 0; j < allTick.length; j++) {
        allTick[j].remove();
      }

      //show alltickets
      //show filtered
      for (let j = 0; j < ticketArr.length; j++) {
        let tickAr = ticketArr[j];
        let colrs = tickAr.color;
        let tasC = tickAr.task;
        let iP = tickAr.id;
        createTicket(colrs, tasC, iP);
      }
    });
  });
}

addBtn.addEventListener("click", function () {
  if (addModal) {
    //show modal window
    modalWindow.style.display = "flex";
  } else {
    modalWindow.style.display = "none";
  }
  addModal = !addModal;
});

rmvBtn.addEventListener("click", function () {
  if (rmvToggle) {
    rmvBtn.style.color = "black";
  } else {
    rmvBtn.style.color = "red";
  }
  rmvToggle = !rmvToggle;
});

for (let i = 0; i < allPriorityCol.length; i++) {
  let priorityColClick = allPriorityCol[i];
  priorityColClick.addEventListener("click", function () {
    for (let j = 0; j < allPriorityCol.length; j++) {
      allPriorityCol[j].classList.remove("active");
    }
    priorityColClick.classList.add("active");
    modalPriorityCol = priorityColClick.classList[0];
  });
}

modalWindow.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key == "Enter") {
    createTicket(modalPriorityCol, taskAreaContent.value);
    taskAreaContent.value = "";
    modalWindow.style.display = "none";
    addModal = !addModal;
  }
});

function createTicket(divCol, task, tickid) {
  let id;
  if (tickid == undefined) {
    id = uid();
  } else {
    id = tickid;
  }

  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${divCol}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="task-area">${task}</div>
                            <div class="lock-unlock"><i class="fa fa-lock"></i></div>`;
  mai.appendChild(ticketCont);

  //unlock
  let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
  let divEditable = ticketCont.querySelector(".task-area");
  lockUnlockBtn.addEventListener("click", function () {
    if (lockUnlockBtn.classList.contains("fa-lock")) {
      lockUnlockBtn.classList.remove("fa-lock");
      lockUnlockBtn.classList.add("fa-unlock");
      divEditable.setAttribute("contentEditable", "true");
    } else {
      lockUnlockBtn.classList.remove("fa-unlock");
      lockUnlockBtn.classList.add("fa-lock");
      divEditable.setAttribute("contentEditable", "false");
    }
    let tickTaskId = getTicketIdx(id);
    // for(let i=0;i<ticketArr.length;i++){
    //     if(ticketArr[i].id==id){
    //      tickTaskId = i;
    //      break;
    //     }
    // }
    ticketArr[tickTaskId].task = divEditable.textContent;
    updateLocalStorage();
  });

  //deleting ticket
  ticketCont.addEventListener("click", function () {
    if (rmvToggle) {
      //deleting from UI
      ticketCont.remove();

      //deletign from ticket arr
      let tiIdx = getTicketIdx(id);
      ticketArr.splice(tiIdx, 1);
      updateLocalStorage();
    }
  });

  //changing colors of the ticket
  let ticketColorBand = ticketCont.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", function () {
    let currentColor = ticketColorBand.classList[1];
    let currentColoridx = -1;
    for (let i = 0; i < colors.length; i++) {
      if (currentColor == colors[i]) {
        currentColoridx = i;
      }
    }

    let nextColorIdx = (currentColoridx + 1) % colLen;
    let nextColor = colors[nextColorIdx];
    ticketColorBand.classList.remove(currentColor);
    ticketColorBand.classList.add(nextColor);

    //upadting ticket color in ticket arr
    let ticketIdx = getTicketIdx(id);
    // for(let i=0;i<ticketArr.length;i++){
    //     let pickTicket = ticketArr[i];
    //     if(pickTicket.id == id){
    //         ticketIdx = i;
    //         break;
    //     }
    // }
    ticketArr[ticketIdx].color = nextColor;
    updateLocalStorage();
  });

  if (tickid == undefined) {
    ticketArr.push({ color: divCol, task: task, id: id });
    updateLocalStorage();
  }
}

function getTicketIdx(id) {
  for (let i = 0; i < ticketArr.length; i++) {
    if (ticketArr[i].id == id) {
      return i;
    }
  }
}

function updateLocalStorage() {
  let stringyfyArr = JSON.stringify(ticketArr);
  localStorage.setItem("tickets", stringyfyArr);
}
