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

    // hasil akhir
    if(next === 5){
      document.getElementById("result").innerText = generateResult();
    }

  }, 300);
}

function generateResult(){
  let list = ["Peaceful", "Easy", "Normal", "Hard", "Insane"];
  return list[Math.floor(Math.random()*list.length)];
}
