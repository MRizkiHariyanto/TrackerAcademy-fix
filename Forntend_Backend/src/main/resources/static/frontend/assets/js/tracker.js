// ================== TRACKER PAGE ====================
const mataKuliahPerSemester = {
  1: ["Pengantar Teknologi Informasi", "Logika Matematika", "Bahasa Inggris", "Pendidikan Agama", "Pengantar Bisnis"],
  2: ["Matematika Diskrit", "Pemrograman Dasar", "Statistik Dasar", "Sistem Informasi Manajemen", "Kewarganegaraan"],
  3: ["Struktur Data", "Basis Data", "Pemrograman Web", "Analisis dan Perancangan Sistem", "Ekonomi Bisnis"],
  4: ["Pemrograman Berorientasi Objek", "Sistem Operasi", "Jaringan Komputer", "Perancangan Basis Data", "Manajemen Proyek SI"],
  5: ["Keamanan Informasi", "Enterprise Architecture", "Interaksi Manusia dan Komputer", "Manajemen Rantai Pasok", "Sistem Informasi Akuntansi"],
  6: ["Data Warehouse", "Data Mining", "Etika Profesi TI", "Pengembangan Aplikasi Mobile", "E-Commerce"],
  7: ["Perencanaan Sumber Daya Perusahaan (ERP)", "Audit Sistem Informasi", "Manajemen Pengetahuan", "Manajemen Layanan TI", "Kapita Selekta Sistem Informasi"],
  8: ["Magang", "Tugas Akhir / Skripsi"]
};

const tableBody = document.getElementById("tableBody");
const addBtn = document.getElementById("addBtn");
const matkulInput = document.getElementById("matkul");
const sksInput = document.getElementById("sks");
const nilaiInput = document.getElementById("nilai");
const semesterInput = document.getElementById("semester");

semesterInput.addEventListener("change", function () {
  const semester = semesterInput.value;
  const daftarMatkul = mataKuliahPerSemester[semester] || [];
  matkulInput.innerHTML = `<option value="" disabled selected hidden>Pilih Mata Kuliah</option>`;
  daftarMatkul.forEach((mk) => {
    matkulInput.innerHTML += `<option value="${mk}">${mk}</option>`;
  });
});

let dataMatkul = [];
addBtn.addEventListener("click", function () {
  const matkul = matkulInput.value;
  const sks = parseFloat(sksInput.value);
  const nilai = parseFloat(nilaiInput.value);
  const nilaiLabel = nilaiInput.options[nilaiInput.selectedIndex].text;
  if (matkul && sks && nilai >= 0) {
    dataMatkul.push({ matkul, sks, nilai, nilaiLabel });
    updateTable();
    updateChart();
  }
});

function updateTable() {
  tableBody.innerHTML = "";
  dataMatkul.forEach((item, index) => {
    const row = `<tr>
      <td>${item.matkul}</td>
      <td>${item.sks}</td>
      <td>${item.nilaiLabel}</td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteRow(${index})">Hapus</button></td>
    </tr>`;
    tableBody.innerHTML += row;
  });
}

window.deleteRow = function(index) {
  dataMatkul.splice(index, 1);
  updateTable();
  updateChart();
};

Chart.register({
  id: 'centerText',
  beforeDraw(chart) {
    const { width, height, ctx } = chart;
    const ipk = chart.data.datasets[0].data[0];
    ctx.save();
    ctx.font = `${(height / 5).toFixed(2)}px sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FFFFFF";
    const text = typeof ipk === "number" ? ipk.toFixed(2) : "0.00";
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;
    ctx.fillText(text, textX, textY);
    ctx.restore();
  }
});

const ctx = document.getElementById("ipkChart").getContext("2d");
const ipkChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["IPK", "Remaining"],
    datasets: [{ data: [0, 4], backgroundColor: ["#D732A8", "#cccccc"], borderWidth: 0 }]
  },
  options: {
    cutout: "75%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false }
    }
  }
});

function updateChart() {
  let totalBobot = 0;
  let totalSks = 0;
  dataMatkul.forEach(item => {
    totalBobot += item.sks * item.nilai;
    totalSks += item.sks;
  });
  const ipk = totalSks ? (totalBobot / totalSks) : 0;
  ipkChart.data.datasets[0].data[0] = ipk;
  ipkChart.data.datasets[0].data[1] = 4 - ipk;
  ipkChart.update();
}

const simpanBtn = document.getElementById("simpanBtn");
simpanBtn.addEventListener("click", async function () {
  const semester = semesterInput.value;
  if (!semester) {
    alert("Pilih semester terlebih dahulu!");
    return;
  }
  if (dataMatkul.length === 0) {
    alert("Belum ada data yang dimasukkan!");
    return;
  }

  let totalBobot = 0;
  let totalSks = 0;
  dataMatkul.forEach(item => {
    totalBobot += item.sks * item.nilai;
    totalSks += item.sks;
  });

  const ipk = totalSks ? (totalBobot / totalSks) : 0;
  const payload = {
    semester: parseInt(semester),
    ipk: parseFloat(ipk.toFixed(2)),
    matkul: dataMatkul
  };

  try {
    const res = await fetch("http://localhost:8080/api/tracker/simpan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error detail dari backend:", text);
      throw new Error(text);
    }

    const result = await res.json();
    alert("Berhasil menyimpan track akademik!");
    console.log(result);
    dataMatkul = [];
    updateTable();
    updateChart();
    semesterInput.selectedIndex = 0;
    matkulInput.innerHTML = `<option value="" disabled selected hidden>Pilih Mata Kuliah</option>`;
  } catch (err) {
    alert("Terjadi kesalahan: " + err.message);
  }
});