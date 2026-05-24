// ==========================================================================
// 🏛️ UNIVERSE8 - QUEST PLANNER ENGINE CORE SCRIPT
// ==========================================================================

// 📦 Aset Visual Tingkat Kesulitan
const diffImage = {
  1: "peaceful.png", 
  2: "easy.png", 
  3: "normal.png",
  4: "hard.png", 
  5: "insane.png", 
  6: "crazy.png"
};

const diffName = ["Peaceful", "Easy", "Normal", "Hard", "Insane", "Crazy"];

// 🧠 Kumpulan Frasa Evaluasi Psikologis & Realita
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

// ⚙️ STATE FORM DATA INTERNAL (Default Faksi Awal)
let mode = 1;        // 1: Casual, 2: Rank
let mood = 2;        // 1: Awful, 2: Neutral, 3: Great
let fokus = 2;       // 1: Locked In, 2: Steady, 3: Scatter
let conditions = []; // Menyimpan array plot waktu
let aktivitas = 3;   // 1-5 (Lowest - Highest)
let urgensi = 2;     // 1: Aman, 2: Normal, 3: Kritis
let scenarios = [];  // Menyimpan array filter dadu
let buffer = 2;      // 1: Terganggu, 2: Kondusif
let monthly = 3;     // Default Modul Bulanan: Normal (1-6)

// ==========================================================================
// 🛠️ FUNGSI ALUR & SISTEM NAVIGASI 10 GERBANG
// ==========================================================================

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setMode(x) { 
  mode = x; 
  // Amankan faksi: Sembunyikan Dead Drop jika user milih Casual di awal
  document.getElementById("rankOnlyScenarios").style.display = (x === 1) ? "none" : "block";
}
function setMood(x) { mood = x; }
function setFokus(x) { fokus = x; }
function setAktivitas(x) { aktivitas = x; }
function setUrgensi(x) { urgensi = x; }
function setBuffer(x) { buffer = x; }
function setMonthly(x) { monthly = x; }

// Transisi Layer Animasi Mulut (01 - 10)
function nextStep(current, next) {
  let currentEL = document.getElementById("step" + current);
  let nextEL = document.getElementById("step" + next);

  if (currentEL) currentEL.classList.remove("active");
  
  setTimeout(() => {
    if (currentEL) currentEL.style.display = "none";
    if (nextEL) {
      nextEL.style.display = "block";
      setTimeout(() => { nextEL.classList.add("active"); }, 10);
    }
  }, 300);
}

// Validasi Halaman 4 (Plot Waktu)
function processConditionPage() {
  conditions = Array.from(document.querySelectorAll('input[name="condition"]:checked')).map(el => el.value);
  if (conditions.length === 0) {
    alert("Cok, minimal centang 1 opsi kondisi biar rentangnya keukur!");
    return;
  }
  nextStep(4, 5);
}

// Validasi Halaman 7 (Filter Skenario - FIXED ANTI-BOCOK)
function processScenarioPage() {
  scenarios = Array.from(document.querySelectorAll('input[name="scenario"]:checked')).map(el => el.value);
  if (scenarios.length === 0) {
    alert("Cok, minimal centang 1 tipe skenario biar dadunya ada bahan buat dikompromi!");
    return; // Dikurung paksa di Page 7, gak bisa tembus langkah selanjutnya
  }
  nextStep(7, 8);
}

// Validasi Halaman 8 ke 9 (FIXED ALUR URUT 10 PAGE ADAPTIF)
function checkBranchPage8() {
  const monthlyTitle = document.querySelector("#step9 h2");
  const monthlyDesc = document.querySelector("#step9 .page-desc");
  const monthlyBtnGroup = document.querySelector("#step9 .btn-group-vertical");

  if (mode === 1) {
    // 🎒 Jalur Casual: Ubah isi Page 9 jadi ramah tanpa tombol kaku
    monthlyTitle.innerText = "Modul Rekapitulasi Casual";
    monthlyDesc.innerText = "Casual Edition bebas dari rantai Monthly kaku. Tekan tombol di bawah untuk menyegel berkas.";
    monthlyBtnGroup.innerHTML = `
      <button onclick="setMonthly(3); nextStep(9,10)">🟢 Amankan Slot Rekap Sederhana</button>
    `;
  } else {
    // ⚔️ Jalur Rank: Kembalikan ke setelan modul bawaan asli
    monthlyTitle.innerText = "Varian Modul Monthly di Tangan";
    monthlyDesc.innerText = "(Faksi Rank) Pilih tingkat kesulitan lembar bulanan yang lu pegang saat ini.";
    monthlyBtnGroup.innerHTML = `
      <button onclick="setMonthly(1); nextStep(9,10)">Peaceful</button>
      <button onclick="setMonthly(2); nextStep(9,10)">Easy</button>
      <button onclick="setMonthly(3); nextStep(9,10)">Normal</button>
      <button onclick="setMonthly(4); nextStep(9,10)">Hard</button>
      <button onclick="setMonthly(5); nextStep(9,10)">Insane</button>
      <button onclick="setMonthly(6); nextStep(9,10)">Crazy</button>
    `;
  }
  // Melangkah kaku berurutan ke Page 9 (Badge tetap urut 09 / 10)
  nextStep(8, 9);
}

// ==========================================================================
// 🎲 KALKULASI DEEP CALCULATOR ENGINE
// ==========================================================================

function generateEngine() {
  // 1. Sembunyikan Step 10
  document.getElementById("step10").classList.remove("active");
  document.getElementById("step10").style.display = "none";

  let base = aktivitas; 
  let durability = 0; // Baseline awal Durability Tubuh
  let alertText = "";
  let reasons = [];

  // ==========================================================================
  // 📊 AREA HITUNGAN POIN DURABILITY (DEEP SENSUS)
  // ==========================================================================
  // Page 2: Mood
  if (mood === 1) durability -= 15;
  if (mood === 3) durability += 15;

  // Page 3: Radar Fokus
  if (fokus === 1) durability += 10;
  if (fokus === 3) durability -= 20;

  // Page 4: Plot Waktu Esok Hari
  if (conditions.includes("freetime")) durability += 15;
  if (conditions.includes("work")) durability -= 20;

  // Page 5: Volume Beban Aktivitas
  if (aktivitas == 1) durability += 15;
  if (aktivitas == 2) durability += 5;
  if (aktivitas == 4) durability -= 10;
  if (aktivitas == 5) durability -= 25;

  // Page 6: Katup Urgensi Deadline
  if (urgensi === 1) durability += 10;
  if (urgensi === 3) durability -= 25;

  // Page 8: Buffer Lingkungan
  if (buffer === 1) durability -= 10;
  if (buffer === 2) durability += 5;

  // 🚨 AMANKAN RENDER VISUAL DURABILITY DI AWAL (BIAR GAK CRASH)
  const durabilityElement = document.getElementById("durabilityValue");
  if (durabilityElement) {
    if (durability >= 0) {
      durabilityElement.innerText = `+${durability}% (Energi Surplus/Aman 🔋)`;
      durabilityElement.style.color = "#00ff66"; // Hijau faksi aman
    } else {
      durabilityElement.innerText = `${durability}% (Baterai Tubuh Terkuras ⚠️)`;
      durabilityElement.style.color = "#ff3333"; // Merah faksi kritis
    }
  }
  
  // Kunci data attribute buat clipboard nanti
  document.getElementById("resultLayer").setAttribute("data-durability", (durability >= 0 ? "+" : "") + durability + "%");

  // ==========================================================================
  // 🎲 JALANKAN LOGIKA PERHITUNGAN BASE DIFFICULTY
  // ==========================================================================
  if (conditions.includes("work") && !conditions.includes("freetime")) base += 1;
  if (conditions.includes("freetime") && !conditions.includes("work")) base -= 1;
  
  if (mood === 1) base -= 1;
  if (mood === 3) base += 1;
  
  if (fokus === 1) base += 1; 
  if (fokus === 3) {
    base -= 1; 
    // Proteksi: Buat sanksi Dead Drop otomatis gugur dari sirkuit jika scatter
    scenarios = scenarios.filter(s => s !== "deaddrop"); 
  }

  if (urgensi === 3) base += 1; 
  if (urgensi === 1) base -= 1;
  if (buffer === 1) base -= 1;

  // Dadu Kompromi Pool Skenario
  if (scenarios.length === 0) scenarios.push("classic");
  const rolledScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

  if (rolledScenario === "deaddrop" && mode === 2) {
    base += 1;
    alertText = "💀 SCENARIO: DEAD DROP PROTOCOL";
  } else if (rolledScenario === "experimental") {
    alertText = "🌴 SCENARIO: EXPERIMENTAL PROTOCOL";
    if (conditions.includes("freetime") && !conditions.includes("work") && urgensi === 1) {
      base = 1; 
      alertText = "🌴 EXPERIMENTAL: HOLIDAY PROTOCOL (Full Refreshing)";
    }
  } else if (rolledScenario === "advance") {
    alertText = "⚔️ SCENARIO: ADVANCE GRIND";
  } else {
    alertText = "🎒 SCENARIO: CLASSIC (URA FINALE)";
  }

  if (base < 1) base = 1;
  if (base > 6) base = 6;

  // Verifikasi Lapisan Sekat Vertikal
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
    if (urgensi === 3 && aktivitas >= 4) {
      alertText += " | ⚡ CASUAL URGENSI";
    } else {
      alertText += " | 🍃 CASUAL PLAY";
    }
  }

  // Isi narasi default jika tidak memicu warning
  if (reasons.length === 0) {
    if (mood === 1) reasons.push(pickRandom(reasonPool.mood_low));
    if (mood === 3) reasons.push(pickRandom(reasonPool.mood_high));
    if (mood === 2) reasons.push(pickRandom(reasonPool.neutral));
    if (conditions.includes("work")) { reasons.push(pickRandom(reasonPool.work)); } else { reasons.push(pickRandom(reasonPool.chill)); }
    if (aktivitas >= 4) { reasons.push(pickRandom(reasonPool.high_act)); } else { reasons.push(pickRandom(reasonPool.low_act)); }
    reasons.push(pickRandom(reasonPool.closing));
  }

  // Rekap 7 Hari Weekly Sequence
  let weekly = [];
  for (let i = 0; i < 4; i++) { weekly.push(base); } 
  for (let i = 0; i < 3; i++) {
    let temp = base;
    let rand = Math.floor(Math.random() * 3) - 1; 
    temp += rand;
    if (temp < 1) temp = 1;
    if (temp > 6) temp = 6;
    weekly.push(temp);
  }
  let weeklyString = weekly.map(x => diffName[x-1]).join(", ");

  // Render Data Akhir Ke Browser Screen
  document.getElementById("modeAlert").innerText = alertText;
  document.getElementById("dailyResult").innerText = "Daily: " + diffName[base-1];
  document.getElementById("monthlyStatus").innerText = monthlyText;
  document.getElementById("weeklyResult").innerText = "Weekly: " + weeklyString;
  document.getElementById("diffImage").src = diffImage[base];
  document.getElementById("reasonText").innerText = reasons.join(". ") + `. (Dadu murni memilih Skenario: ${rolledScenario.toUpperCase()})`;

  let resEL = document.getElementById("resultLayer");
  resEL.style.display = "block";
  setTimeout(() => { resEL.classList.add("active"); }, 10);
}

// ==========================================================================
// 📋 OUTPUT INTEGRASI (Clipboard & Reset System)
// ==========================================================================

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
    alert("Quest Log sukses dicopy ke clipboard, Fal! Tinggal lu paste.");
  }).catch(err => {
    alert("Gagal copy log: ", err);
  });
}

function resetEngine() {
  // Bersihkan state global data ke awal
  mode = 1; mood = 2; fokus = 2; aktivitas = 3; urgensi = 2; buffer = 2; monthly = 3;
  conditions = []; scenarios = [];
  
  // Amankan elemen input checkbox agar tercentang default kembali rapi
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    if (cb.value === "work" || cb.value === "deaddrop") {
      cb.checked = false;
    } else {
      cb.checked = true;
    }
  });

  // Bersihkan semua layer dari layar
  const layers = document.querySelectorAll('.layer');
  layers.forEach(layer => {
    layer.classList.remove('active');
    layer.style.display = 'none';
  });

  // Kembalikan kaku ke gerbang pertama
  document.getElementById("step1").style.display = "block";
  setTimeout(() => { document.getElementById("step1").classList.add("active"); }, 10);
    }

