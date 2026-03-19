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

  }, 300);
}
