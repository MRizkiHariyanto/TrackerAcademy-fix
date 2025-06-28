document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  // Update dropdown menu berdasarkan login status
  const dropdownMenu = document.getElementById("dropdownMenu");
  if (dropdownMenu) {
    dropdownMenu.innerHTML = token
      ? `
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
      `
      : `
        <li><a class="dropdown-item" href="Form.html">Login</a></li>
        <li><a class="dropdown-item" href="Form.html">Sign Up</a></li>
      `;
  }

  // Logout handler
  document.addEventListener("click", (e) => {
    if (e.target?.id === "logoutBtn") {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("Berhasil logout!");
      window.location.reload();
    }
  });

  // Jalankan hanya di halaman history
  if (window.location.pathname.includes("history.html")) {
    const chart = document.getElementById("ipkChartSection");
    chart.style.display = "block";
    loadHistoryIPK();
  }
});

function handleReveal() {
  const chartSection = document.getElementById("ipkChartSection");
  chartSection.style.display = "block";
  chartSection.classList.add("fade-in");

  loadHistoryIPK();
}

function loadHistoryIPK() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  fetch("http://localhost:8080/api/tracker/history", {
    headers: {
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Gagal mengambil data. Cek server!");
      return res.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        alert("Belum ada data IPK tersimpan.");
        return;
      }
      data.sort((a, b) => a.semester - b.semester);
      tampilkanCardDonutIPK(data);
      tampilkanChartIPK(data);
    })
    .catch((err) => {
      console.error("Error fetching history:", err);
      alert("Terjadi kesalahan saat mengambil data.");
    });
}

function tampilkanCardDonutIPK(data) {
  const container = document.getElementById("card-container");
  if (!container) return;
  container.innerHTML = "";

  data.forEach((record, index) => {
    const card = document.createElement("div");
    card.className = "ipk-card text-center";
    card.id = `ipk-card-${record.id}`; // ID untuk nanti dihapus dari DOM

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="fw-bold mb-0">Semester ${record.semester}</h5>
        <button class="btn text-danger p-0 delete-btn" data-id="${record.id}"><i class="bi bi-trash-fill fs-5"></i></button>
      </div>
      <div class="donut-container">
        <canvas id="donutChart-${index}"></canvas>
        <div class="donut-label">${record.ipk.toFixed(2)}</div>
      </div>
      <a href="statistik.html?semester=${record.semester}"><button class="btn btn-pink fw-bold w-100 mt-3">Lihat Statistik</button></a>
    `;

    container.appendChild(card);

    // Render Chart
    const ctx = document.getElementById(`donutChart-${index}`).getContext("2d");
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["IPK", "Sisa"],
        datasets: [{
          data: [record.ipk, 4 - record.ipk],
          backgroundColor: ["#e238a1", "#f0f0f0"],
          borderWidth: 0
        }]
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
  });
  function hapusIPK(id) {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:8080/api/tracker/history/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal menghapus IPK.");
        document.getElementById(`ipk-card-${id}`)?.remove(); // Hapus dari DOM
      })
      .catch((err) => {
        console.error("Gagal hapus:", err);
        alert("Terjadi kesalahan saat menghapus IPK.");
      });
  }
  

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (confirm("Yakin ingin menghapus IPK ini?")) {
        hapusIPK(id);
      }
    });
  });
}


function tampilkanChartIPK(data) {
  const ctx = document.getElementById("ipkBarChart")?.getContext("2d");
  if (!ctx) return;

  const labels = data.map((r) => `Semester ${r.semester}`);
  const values = data.map((r) => r.ipk);

  
}
