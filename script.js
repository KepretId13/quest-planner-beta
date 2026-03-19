const diffImage = {
  1: "peaceful.png",
  2: "easy.png",
  3: "normal.png",
  4: "hard.png",
  5: "insane.png",
  6: "crazy.png"
};

let mode = 1;
let mood = 2;
let kondisi = 1;
let aktivitas = 3;

const diffName = ["Peaceful","Easy","Normal","Hard","Insane","Crazy"];

function setMode(x){ mode = x; }
function setMood(x){ mood = x; }
function setKondisi(x){ kondisi = x; }
function setAktivitas(x){ aktivitas = x; }

function nextStep(current, next){
  let currentEL = document.getElementById("step"+current);
  let nextEL = document.getElementById("step"+next);

  currentEL.classList.remove("active");

  setTimeout(() => {
    currentEL.style.display = "none";
    nextEL.style.display = "block";

    setTimeout(()=>{
      nextEL.classList.add("active");
    },10);

    if(next === 5){
      generate();
    }

  }, 300);
}

function generate(){
  let base = aktivitas;

  if(kondisi == 1) base -= 1;
  if(kondisi == 2) base += 1;

  if(mood == 1) base -= 2;
  if(mood == 3) base += 1;

  if(base < 1) base = 1;
  if(base > 6) base = 6;

  document.getElementById("daily").innerText = 
    "Daily: " + diffName[base-1];

  let weekly = [];

  for(let i=0;i<4;i++){
    weekly.push(base);
  }

  for(let i=0;i<3;i++){
    let temp = base;

    if(mood == 1) temp -= 1;
    if(mood == 3) temp += 1;

    let rand = Math.floor(Math.random()*3)-1;
    temp += rand;

    if(temp < base-2) temp = base-2;
    if(temp > base+2) temp = base+2;

    if(temp < 1) temp = 1;
    if(temp > 6) temp = 6;

    weekly.push(temp);
  }

  let result = weekly.map(x => diffName[x-1]).join(", ");

  document.getElementById("weekly").innerText = "Weekly: " + result;
  document.getElementById("diffImage").src = diffImage[base];
}
