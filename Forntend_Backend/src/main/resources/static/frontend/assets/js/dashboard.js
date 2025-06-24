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
    const cards = document.getElementById("card-container");
    chart.style.display = "none";
    cards.style.display = "none";
  }
});

function handleReveal() {
  const cardSection = document.getElementById("card-container");
  const chartSection = document.getElementById("ipkChartSection");

  cardSection.style.display = "flex";
  chartSection.style.display = "block";

  cardSection.classList.add("fade-in");
  chartSection.classList.add("fade-in");

  loadHistoryIPK(); // Fetch data after reveal
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
      tampilkanKartuHistory(data);
      tampilkanChartIPK(data);
    })
    .catch((err) => {
      console.error("Error fetching history:", err);
      alert("Terjadi kesalahan saat mengambil data.");
    });
}

function tampilkanKartuHistory(data) {
  const container = document.getElementById("card-container");
  if (!container) return;

  container.innerHTML = "";
  data.forEach((record) => {
    const card = document.createElement("div");
    card.className = "card card-ipk text-white bg-purple p-3 text-center m-2 fade-in";
    card.innerHTML = `
      <h5 class="fw-bold">Semester ${record.semester}</h5>
      <p class="fs-5">IPK: ${record.ipk}</p>
    `;
    container.appendChild(card);
  });
}

function tampilkanChartIPK(data) {
  const ctx = document.getElementById("ipkChart")?.getContext("2d");
  if (!ctx) return;

  const labels = data.map((r) => `Semester ${r.semester}`);
  const values = data.map((r) => r.ipk);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "IPK per Semester",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 4,
          ticks: {
            stepSize: 0.5
          }
        }
      }
    }
  });
}
