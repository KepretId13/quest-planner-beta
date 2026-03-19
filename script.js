const diffImage = {
  1: "peaceful.png",
  2: "easy.png",
  3: "normal.png",
  4: "hard.png",
  5: "insane.png",
  6: "crazy.png"
};

const reasonPool = {

  mood_low: [
    "Mood lu lagi ga stabil",
    "Energi mental lagi turun",
    "Hari ini bukan hari terbaik lu",
    "Fokus lagi gampang pecah",
    "Lu lagi butuh pace pelan",
    "Kondisi mental lagi berat"
  ],

  mood_high: [
    "Mood lu lagi bagus",
    "Lu lagi on fire",
    "Fokus lu lagi enak dipake",
    "Energi lu lagi naik",
    "Momentum lagi kebangun",
    "Lu lagi siap nge-push"
  ],

  work: [
    "Lagi mode kerja",
    "Ada tanggung jawab yang harus jalan",
    "Lu lagi di fase produktif",
    "Ada target yang harus dicapai",
    "Waktu lu lagi kepake serius",
    "Ini bukan waktu buat santai total"
  ],

  chill: [
    "Waktu lu lebih santai",
    "Ga ada tekanan besar hari ini",
    "Bisa ambil pace lebih slow",
    "Lu punya ruang buat nafas",
    "Hari ini ga terlalu padat",
    "Bisa fleksibel dikit"
  ],

  high_act: [
    "Beban aktivitas lagi tinggi",
    "Banyak hal harus diselesaikan",
    "Hari ini cukup padat",
    "Tugas lagi numpuk",
    "Pressure lagi naik",
    "Lu lagi di kondisi sibuk"
  ],

  low_act: [
    "Aktivitas lagi ringan",
    "Ga banyak pressure hari ini",
    "Bisa santai dikit",
    "Tugas ga terlalu banyak",
    "Hari ini relatif ringan",
    "Masih ada ruang kosong"
  ],

  neutral: [
    "Kondisi lu lagi stabil",
    "Ga terlalu tinggi, ga terlalu rendah",
    "Masih di titik balance",
    "Cukup aman buat lanjut",
    "Ga ada gangguan besar"
  ],

  closing: [
    "Pelan juga tetap progress",
    "Ga harus maksimal, yang penting jalan",
    "Konsisten lebih penting dari perfect",
    "Yang penting ga berhenti",
    "Sedikit tapi lanjut itu menang",
    "Jangan overpush diri sendiri"
  ]
};

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

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
  document.getElementById("reason").innerText =
  reasons.join(". ");
}
