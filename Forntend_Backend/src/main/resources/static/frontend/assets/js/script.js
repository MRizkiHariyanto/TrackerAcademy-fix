// ======= buat halaman utama =======//
document.addEventListener("DOMContentLoaded", function () {
  const dropdownMenu = document.getElementById("dropdownMenu");
  const token = localStorage.getItem("token");
  


  if (dropdownMenu) {
    if (token) {
      // Jika sudah login
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
      `;
    } else {
      // Jika belum login
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="Form.html">Login</a></li>
        <li><a class="dropdown-item" href="Form.html">Sign Up</a></li>
      `;
    }
  }

  // Handle Logout
  document.addEventListener("click", function (e) {
    if (e.target?.id === "logoutBtn") {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("Berhasil logout!");
      window.location.reload();
    }
  });
});



document.addEventListener("DOMContentLoaded", function () {
    // ================== LOGIN & SIGNUP ====================
    const signupForm = document.getElementById("signupForm");
    const signinForm = document.getElementById("signinForm");
  
    if (signupForm) {
      signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const payload = {
          username: formData.get("username"),
          email: formData.get("email"),
          password: formData.get("password"),
        };
  
        try {
          const res = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
  
          if (!res.ok) throw new Error("Gagal signup");
          alert("Signup sukses!");
          showSignIn?.(); 
        } catch (err) {
          alert("Signup error: " + err.message);
        }
      });
    }
  
    if (signinForm) {
      signinForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const formData = new FormData(signinForm);
        const payload = {
          username: formData.get("username"),
          password: formData.get("password"),
        };
    
        try {
          const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
    
          if (!res.ok) throw new Error("Login gagal");
          const result = await res.json();
    
          // Simpan token & username
          localStorage.setItem("token", result.token);
          localStorage.setItem("username", result.username);
    
          alert("Login sukses!");
          window.location.href = "index.html"; // redirect ke landing
        } catch (err) {
          alert("Login error: " + err.message);
        }
      });
    }
  
    // ================ SLIDER EFFECT / AUTH ================
    const signInButton = document.getElementById("signIn");
    const signUpButton = document.getElementById("signUp");
    const container = document.getElementById("container");
    const signInForm = document.querySelector(".sign-in-container");
    const signUpForm = document.querySelector(".sign-up-container");
  
    function showSignIn() {
      container?.classList.remove("right-panel-active");
      signInForm?.classList.add("active");
      signUpForm?.classList.remove("active");
    }
  
    function showSignUp() {
      container?.classList.add("right-panel-active");
      signUpForm?.classList.add("active");
      signInForm?.classList.remove("active");
    }
  
    signUpButton?.addEventListener("click", showSignUp);
    signInButton?.addEventListener("click", showSignIn);
  
    
  });
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
      ipk: ipk.toFixed(2),
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
      if (!res.ok) throw new Error("Gagal menyimpan data");
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
// modul //
const input = document.querySelector(".search-box input");
      const resultContainer = document.getElementById("search-result");
      const resultCount = document.getElementById("result-count");
    
      input.addEventListener("keyup", async function (e) {
        const keyword = e.target.value.trim();
        if (keyword.length < 2) {
          resultContainer.innerHTML = "";
          resultCount.textContent = "";
          return;
        }
    
        try {
          const response = await fetch(`http://localhost:8080/api/modules/search?keyword=${keyword}`);
          const modules = await response.json();
    
          resultContainer.innerHTML = "";
          resultCount.textContent = `${modules.length} Result`;
    
          modules.forEach(modul => {
            resultContainer.innerHTML += `
              <a href="#" class="list-group-item list-group-item-action">
                <h6 class="fw-bold mb-1 text-purple">${modul.judul}</h6>
                <small class="d-block text-muted">${modul.penulis} • ${modul.tanggal}</small>
                <small class="text-muted"><i class="bi bi-book"></i> ${modul.jumlahDibaca}x dibaca</small>
              </a>
            `;
          });
        } catch (err) {
          resultContainer.innerHTML = `<div class="text-danger">Gagal mengambil data</div>`;
          console.error("Fetch error:", err);
        }
      });

        async function loadStatistik() {
          try {
            const response = await fetch("http://localhost:8080/api/statistik");
            const data = await response.json();

            document.getElementById("modulCount").textContent = data.modul;
            document.getElementById("matkulCount").textContent = data.matkul;
            document.getElementById("dibacaCount").textContent = data.dibaca + "x";
          } catch (err) {
            console.error("Gagal memuat statistik", err);
          }
        }

        loadStatistik();


        document.getElementById("searchForm").addEventListener("submit", function (e) {
          e.preventDefault();
          const keyword = document.getElementById("searchInput").value.trim();
          if (keyword.length > 0) {
            window.location.href = `search-result.html?keyword=${encodeURIComponent(keyword)}`;
          }
        });

    // search result //
    const urlParams = new URLSearchParams(window.location.search);
    const keyword = urlParams.get("keyword");

    document.getElementById("search-title").textContent = `${keyword}`;

    async function fetchModules() {
      try {
        const res = await fetch(`http://localhost:8080/api/modules/search?keyword=${keyword}`);
        const data = await res.json();

        const container = document.getElementById("search-result");
        const counter = document.getElementById("result-count");
        counter.textContent = `${data.length} hasil ditemukan`;

        data.forEach(modul => {
          container.innerHTML += `
            <a href="#" class="list-group-item list-group-item-action">
              <h6 class="fw-bold mb-1 text-purple">${modul.judul}</h6>
              <small class="d-block text-muted">${modul.penulis} • ${modul.tanggal}</small>
              <small class="text-muted"><i class="bi bi-book"></i> ${modul.jumlahDibaca}x dibaca</small>
            </a>
          `;
        });
      } catch (err) {
        document.getElementById("search-result").innerHTML = `<div class="text-danger">Gagal memuat data</div>`;
        console.error(err);
      }
    }

    if (keyword) fetchModules();


  // history //
  async function loadHistory() {
    try {
      const res = await fetch("http://localhost:8080/api/tracker/history", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      const data = await res.json();

      const container = document.getElementById("card-container");
      container.innerHTML = "";

      let total = 0;

      data.forEach((item) => {
        total += item.ipk;

        container.innerHTML += `
          <div class="card shadow card-ipk text-center p-3">
            <div class="d-flex justify-content-between align-items-start">
              <h6>Semester ${item.semester}</h6>
              <button onclick="hapus(${item.id})" class="btn btn-sm btn-link text-danger p-0"><i class="bi bi-trash-fill"></i></button>
            </div>
            <div class="chart-wrapper mt-2">
              <canvas class="chart-donut" data-ipk="${item.ipk}"></canvas>
              <div class="chart-value">${item.ipk.toFixed(2)}</div>
            </div>
            <button onclick="lihatStatistik(${item.semester})" class="btn btn-sm mt-2" style="background-color: #ff5cb1; color: white;">Check</button>
          </div>
        `;
      });

      renderDonut(document.querySelectorAll(".chart-donut"));
      window._dataIPK = data;
      window._avgIPK = data.length ? (total / data.length).toFixed(2) : "0.00";
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  }

  async function hapus(id) {
    if (!confirm("Hapus data ini?")) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/tracker/hapus/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    loadHistory();
  }

  function handleReveal() {
    window.location.href = "akumulasi.html";
  }

  function lihatStatistik(semester) {
    window.location.href = `statistik.html?semester=${semester}`;
  }

  function renderDonut(canvasList) {
    canvasList.forEach(canvas => {
      const ipk = parseFloat(canvas.dataset.ipk);
      new Chart(canvas, {
        type: "doughnut",
        data: {
          datasets: [{
            data: [ipk, 4 - ipk],
            backgroundColor: ["#e91e63", "#f8bbd0"],
            borderWidth: 0
          }]
        },
        options: {
          cutout: "70%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    });
  }

  window.onload = loadHistory;
  
// akumulasi ipk //
const ipkData = JSON.parse(localStorage.getItem("ipkData") || "[]");
    const ipkRata = parseFloat(localStorage.getItem("ipkRata") || 0).toFixed(2);
    document.getElementById("ipk-rerata").textContent = ipkRata;

    const labels = ipkData.map(d => `S${d.semester}`);
    const values = ipkData.map(d => d.ipk);

    // Bar Chart
    new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: "#D732A8"
        }]
      },
      options: {
        scales: { y: { min: 0, max: 4 } },
        plugins: { legend: { display: false } }
      }
    });

    // Donut Chart
    new Chart(document.getElementById("donutChart"), {
      type: "doughnut",
      data: {
        datasets: [{
          data: [ipkRata, 4 - ipkRata],
          backgroundColor: ["#D732A8", "#f8bbd0"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "60%",
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });

    // statistik ip semester //
    const params = new URLSearchParams(window.location.search);
    const semester = params.get("semester");
    document.getElementById("semesterTitle").textContent = `Semester ${semester}`;

    async function fetchStatistik() {
      try {
        const res = await fetch(`http://localhost:8080/api/tracker/statistik?semester=${semester}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        const data = await res.json(); // { ipk: 3.80, matkul: [{ nama: "", nilai: "" }] }

        // Donut Chart IPK
        const ipk = parseFloat(data.ipk);
        new Chart(document.getElementById("donutChart"), {
          type: "doughnut",
          data: {
            datasets: [{
              data: [ipk, 4 - ipk],
              backgroundColor: ["#d63384", "#f8bbd0"],
              borderWidth: 0
            }]
          },
          options: {
            cutout: "75%",
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        });

        // Bar Chart Nilai per matkul
        const labels = data.matkul.map(m => m.nama);
        const nilai = data.matkul.map(m => m.nilai);

        new Chart(document.getElementById("barChart"), {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Nilai",
              data: nilai,
              backgroundColor: "#a855f7"
            }]
          },
          options: {
            scales: {
              y: {
                min: 0,
                max: 4,
                ticks: {
                  callback: function (value) {
                    if (value == 4) return "A";
                    if (value == 3.5) return "AB";
                    if (value == 3) return "B";
                    if (value == 2.5) return "BC";
                    if (value == 2) return "C";
                    if (value == 1) return "D";
                    return "E";
                  }
                }
              }
            }
          }
        });

      } catch (err) {
        alert("Gagal memuat data");
        console.error(err);
      }
    }

    fetchStatistik();