const diffImage = {
  1: "peaceful.png", 2: "easy.png", 3: "normal.png",
  4: "hard.png", 5: "insane.png", 6: "crazy.png"
};

const diffName = ["Peaceful","Easy","Normal","Hard","Insane","Crazy"];

const reasonPool = {
  mood_low: ["Mood lu lagi ga stabil", "Energi mental lagi turun", "Hari ini bukan hari terbaik lu", "Kondisi mental lagi berat"],
  mood_high: ["Mood lu lagi bagus", "Lu lagi on fire", "Lu lagi siap nge-push", "Momentum lagi kebangun"],
  neutral: ["Kondisi lu lagi stabil", "Masih di titik balance", "Ga ada gangguan besar"],
  work: ["Lagi mode kerja", "Ada tanggung jawab yang harus jalan", "Lu lagi di fase produktif", "Waktu lu lagi kepake serius"],
  chill: ["Waktu lu lebih santai", "Ga ada tekanan besar hari ini", "Bisa ambil pace lebih slow", "Lu punya ruang buat nafas"],
  high_act: ["Beban aktivitas lagi tinggi", "Banyak hal harus diselesaikan", "Hari ini cukup padat", "Pressure lagi naik"],
  low_act: ["Aktivitas lagi ringan", "Ga banyak pressure hari ini", "Tugas ga terlalu banyak", "Hari ini relatif ringan"],
  closing: ["Pelan juga tetap progress", "Ga harus maksimal, yang penting jalan", "Konsisten lebih penting dari perfect", "Yang penting ga berhenti"]
};

function pickRandom(arr){
  return arr[Math.floor(Math.random() * arr.length)];
}

// State Form Data
let mode = 1;      // 1: Casual, 2: Rank
let mood = 2;      // 1: Awful, 2: Neutral, 3: Great
let fokus = 2;     // 1: Locked In, 2: Steady, 3: Scatter
let conditions = []; 
let aktivitas = 3; // 1-5 (Lowest-Highest)
let urgensi = 2;   // 1: Aman, 2: Normal, 3: Kritis
let scenarios = [];
let buffer = 2;    // 1: Terganggu, 2: Kondusif
let monthly = 3;   // Default Normal (1-6)

function setMode(x) { 
  mode = x; 
  // Sembunyikan Dead Drop jika user milih faksi Casual di awal
  document.getElementById("rankOnlyScenarios").style.display = (x === 1) ? "none" : "block";
}
function setMood(x){ mood = x; }
function setFokus(x){ fokus = x; }
function setAktivitas(x){ aktivitas = x; }
function setUrgensi(x){ urgensi = x; }
function setBuffer(x){ buffer = x; }
function setMonthly(x){ monthly = x; }

function processConditionPage() {
  conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(el => el.value);
  if(conditions.length === 0) {
    alert("Cok, minimal centang 1 opsi kondisi biar rentangnya keukur!");
    return;
  }
  nextStep(4, 5);
}

function processScenarioPage() {
  scenarios = Array.from(document.querySelectorAll('input[name="scenario"]:checked')).map(el => el.value);
  if(scenarios.length === 0) {
    alert("Pilih minimal 1 skenario di pool biar dadunya bisa dikompromi!");
    return;
  }
  nextStep(7, 8);
}

// Bypass Page 9 jika user memilih Casual Edition
function checkBranchPage8() {
  if (mode === 1) {
    // Jalur Casual langsung lompat bypass ke Page 10 (Sumpah Integritas)
    nextStep(8, 10);
  } else {
    // Jalur Rank wajib validasi modul Monthly dulu di Page 9
    nextStep(8, 9);
  }
}

function nextStep(current, next){
  let currentEL = document.getElementById("step"+current);
  let nextEL = document.getElementById("step"+next);

  if(currentEL) currentEL.classList.remove("active");
  
  setTimeout(() => {
    if(currentEL) currentEL.style.display = "none";
    if(nextEL) {
      nextEL.style.display = "block";
      setTimeout(() => { nextEL.classList.add("active"); }, 10);
    }
  }, 300);
}

function generateEngine() {
  // Sembunyikan Step 10
  document.getElementById("step10").classList.remove("active");
  document.getElementById("step10").style.display = "none";

  let base = aktivitas; // Start point dari faksi beban tugas
  let alertText = "";
  let reasons = [];

  // 1. DEEP CALCULATION: Hitung bobot Condition (Rentang Akurat)
  if (conditions.includes("work") && !conditions.includes("freetime")) base += 1;
  if (conditions.includes("freetime") && !conditions.includes("work")) base -= 1;
  
  // 2. MODIFIKASI INTERNAL: Pengaruh Mood & Radar Fokus (ADHD/Psikologis Buffer)
  if (mood === 1) base -= 1;
  if (mood === 3) base += 1;
  
  if (fokus === 1) base += 1; // Locked-in ngasih bonus daya tampung
  if (fokus === 3) {
    base -= 1; // Scatter memotong level biar gak Overwhelmed/Tekanan batin
    scenarios = scenarios.filter(s => s !== "deaddrop"); // Proteksi: Buang sanksi Dead Drop otomatis
  }

  // 3. EVALUASI KATUP URGENSI WAKTU
  if (urgensi === 3) base += 1; // Deadline kritis memaksa akselerasi tingkat kesulitan
  if (urgensi === 1) base -= 1;

  // Faktor Pendukung Lingkungan
  if (buffer === 1) base -= 1;

  // LOCKPOOL SKENARIO: Pilih acak skenario tersisa lewat kocok dadu kompromi
  if (scenarios.length === 0) scenarios.push("classic"); // Fail-safe
  const rolledScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  // Mutasi Skenario Berdasarkan Hasil Dadu
  if (rolledScenario === "deaddrop" && mode === 2) {
    base += 1;
    alertText = "💀 SCENARIO: DEAD DROP PROTOCOL";
  } else if (rolledScenario === "experimental") {
    alertText = "🌴 SCENARIO: EXPERIMENTAL PROTOCOL";
    // Kombo khusus Holiday Protocol (Freetime murni tanpa kerjaan)
    if (conditions.includes("freetime") && !conditions.includes("work") && urgensi === 1) {
      base = 1; // Kunci total di level Peaceful (Full Side-Quest Menyenangkan)
      alertText = "🌴 EXPERIMENTAL: HOLIDAY Protokol (Full Refreshing)";
    }
  } else if (rolledScenario === "advance") {
    alertText = "⚔️ SCENARIO: ADVANCE GRIND";
  } else {
    alertText = "🎒 SCENARIO: CLASSIC (URA FINALE)";
  }

  // Mengunci batas presisi array (1-6)
  if(base < 1) base = 1;
  if(base > 6) base = 6;

  // 4. VERIFIKASI SEKAT VERTIKAL (Casual Urgensi vs Rank Kaku)
  let monthlyText = "Monthly Status: Bebas Tanpa Beban Target Paralel";
  
  if (mode === 2) {
    monthlyText = "Target Monthly Berjalan: " + diffName[monthly-1];
    if (base > monthly) {
      alertText += " | 🚨 BURNOUT WARNING";
      reasons.push("Peringatan Sistem: Struktur bulanan lu terlalu sempit nahan beban harian. Ini namanya males nyesuaiin modul!");
    } else if (base < monthly && base === 1 && monthly === 6) {
      alertText += " | ⚠️ COMPLIANCE GOYAH";
      reasons.push("Tinggi harus ngotak dikit, bro! Ritme kerja siput tapi minta jatah day-off dewa bulanan itu namanya MALES 🥀.");
    } else if (base < monthly) {
      alertText += " | 🛡️ PLAN B ACTIVE";
      reasons.push("Sistem dialihkan ke Plan B. Gerak harian aman ditumpu wadah bulanan besar. Sisa hari dipotong paksa sistem.");
    } else {
      alertText += " | 💎 PURE STABLE (1:1)";
    }
  } else {
    // Skenario khusus Casual tapi Urgensi Tinggi
    if (urgensi === 3 && aktivitas >= 4) {
      alertText += " | ⚡ CASUAL URGENSI (Sederhana tapi On-Point)";
    } else {
      alertText += " | 🍃 CASUAL PLAY";
    }
  }

  // Masukkan narasi alasan jika belum terisi teks warning khusus
  if(reasons.length === 0) {
    if(mood === 1) reasons.push(pickRandom(reasonPool.mood_low));
    if(mood === 3) reasons.push(pickRandom(reasonPool.mood_high));
    if(mood === 2) reasons.push(pickRandom(reasonPool.neutral));

    if(conditions.includes("work")) { reasons.push(pickRandom(reasonPool.work)); } else { reasons.push(pickRandom(reasonPool.chill)); }
    if(aktivitas >= 4) { reasons.push(pickRandom(reasonPool.high_act)); } else { reasons.push(pickRandom(reasonPool.low_act)); }
    reasons.push(pickRandom(reasonPool.closing));
  }

  // 5. HITUNG DERETAN 7 HARI WEEKLY (Kalkulasi Akurat Andalan Lu)
  let weekly = [];
  for(let i=0; i<4; i++) { weekly.push(base); } // 4 Hari awal stabil mengikuti base
  for(let i=0; i<3; i++) {
    let temp = base;
    let rand = Math.floor(Math.random() * 3) - 1; // Variasi acak (-1, 0, 1)
    temp += rand;
    if(temp < 1) temp = 1;
    if(temp > 6) temp = 6;
    weekly.push(temp);
  }
  let weeklyString = weekly.map(x => diffName[x-1]).join(", ");

  // 6. RENDER DATA KE LAYOUT AKHIR
  document.getElementById("modeAlert").innerText = alertText;
  document.getElementById("dailyResult").innerText = "Daily: " + diffName[base-1];
  document.getElementById("monthlyStatus").innerText = monthlyText;
  document.getElementById("weeklyResult").innerText = "Weekly: " + weeklyString;
  document.getElementById("diffImage").src = diffImage[base];
  document.getElementById("reasonText").innerText = reasons.join(". ") + `. (Dadu murni memilih Skenario: ${rolledScenario.toUpperCase()})`;

  // Tampilkan Screen Hasil
  let resEL = document.getElementById("resultLayer");
  resEL.style.display = "block";
  setTimeout(() => { resEL.classList.add("active"); }, 10);
}

// Fitur Salas Clipboard RPG Quest Log
function copyQuestLog() {
  const modeText = (mode === 1) ? "Casual Edition" : "Rank Mode";
  const dailyText = document.getElementById("dailyResult").innerText;
  const alertText = document.getElementById("modeAlert").innerText;
  const weeklyText = document.getElementById("weeklyResult").innerText;

  const questLogText = 
`=== UNIVERSE8 - QUEST LOG ===
📅 Date       : ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🎒 Mode       : ${modeText} [${alertText}]
🎲 ${dailyText}
⚔️ ${weeklyText}
=============================
[ ] Main Quest 1 : 
[ ] Main Quest 2 : 
[ ] Side Quest 1 : 
=== PROGRESS TETAP JALAN, NO OVERPUSH! ===`;

  navigator.clipboard.writeText(questLogText).then(() => {
    alert("Quest Log sukses dicopy ke clipboard, Fal! Tinggal lu paste ke Notepad/Discord.");
  }).catch(err => {
    alert("Gagal copy log: ", err);
  });
}

function resetEngine() {
  // Uncheck form, reset global state
  mode = 1; mood = 2; fokus = 2; aktivitas = 3; urgensi = 2; buffer = 2; monthly = 3;
  
  // Sembunyikan semua layer, kembali ke step 1
  const layers = document.querySelectorAll('.layer');
  layers.forEach(layer => {
    layer.classList.remove('active');
    layer.style.display = 'none';
  });

  document.getElementById("step1").style.display = "block";
  setTimeout(() => { document.getElementById("step1").classList.add("active"); }, 10);
}
