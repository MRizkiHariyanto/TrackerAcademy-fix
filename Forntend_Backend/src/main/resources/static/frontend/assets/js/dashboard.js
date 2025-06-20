document.addEventListener("DOMContentLoaded", function () {
  const dropdownMenu = document.getElementById("dropdownMenu");
  const token = localStorage.getItem("token");

  if (dropdownMenu) {
    if (token) {
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="#">Profile</a></li>
        <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
      `;
    } else {
      dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="Form.html">Login</a></li>
        <li><a class="dropdown-item" href="Form.html">Sign Up</a></li>
      `;
    }
  }

  document.addEventListener("click", function (e) {
    if (e.target?.id === "logoutBtn") {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      alert("Berhasil logout!");
      window.location.reload();
    }
  });

  // Panggil setelah semua siap
  loadHistory();

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
    await fetch(`http://localhost:8080/api/tracker/hapus/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    loadHistory();
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
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
          }
        }
      });
    });
  }
});
