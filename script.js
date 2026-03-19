<script>
function nextStep(current, next){
  let currentEl = document.getElementById("step"+current);
  let nextEl = document.getElementById("step"+next);

  currentEl.classList.remove("active");

  setTimeout(() => {
    currentEl.style.display = "none";
    nextEl.style.display = "block";

    setTimeout(()=>{
      nextEl.classList.add("active");
    },10);

  }, 300);
}
</script>