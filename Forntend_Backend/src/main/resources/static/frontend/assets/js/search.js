// ================== MODUL ==================
const input = document.querySelector(".search-box input");
const resultContainer = document.getElementById("search-result");
const resultCount = document.getElementById("result-count");

input?.addEventListener("keyup", async function (e) {
  const keyword = e.target.value.trim();
  if (keyword.length < 2) {
    if (resultContainer) resultContainer.innerHTML = "";
    if (resultCount) resultCount.textContent = "";
    return;
  }

  const rawToken = localStorage.getItem("token");
  const token = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  try {
    const response = await fetch(`http://localhost:8080/api/modules/search?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) throw new Error("Gagal mengambil data dari server");

    const modules = await response.json();
    if (resultContainer) {
      resultContainer.innerHTML = "";
      modules.forEach(modul => {
        resultContainer.innerHTML += `
          <a href="${modul.linkDrive}" target="_blank" class="list-group-item list-group-item-action">
            <h6 class="fw-bold mb-1 text-purple">${modul.judul}</h6>
            <small class="d-block text-muted">${modul.penulis} • ${modul.tanggal}</small>
            <small class="text-muted"><i class="bi bi-book"></i> ${modul.jumlahDibaca}x dibaca</small>
          </a>
        `;
      });
    }

    if (resultCount) resultCount.textContent = `${modules.length} Result`;

  } catch (err) {
    console.error("Fetch error:", err);
    if (resultContainer) resultContainer.innerHTML = `<div class="text-danger">Gagal mengambil data</div>`;
  }
});

// ================== FORM SEARCH (Redirect) ==================
document.getElementById("searchForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const keyword = document.getElementById("searchInput").value.trim();
  if (keyword.length > 0) {
    window.location.href = `search-result.html?keyword=${encodeURIComponent(keyword)}`;
  }
});

// ================== HALAMAN search-result ==================
const urlParams = new URLSearchParams(window.location.search);
const keyword = urlParams.get("keyword");

if (keyword) {
  const searchTitle = document.getElementById("search-title");
  if (searchTitle) searchTitle.textContent = `${keyword}`;
  fetchModules();
}

async function fetchModules() {
  const rawToken = localStorage.getItem("token");
  const token = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  try {
    const res = await fetch(`http://localhost:8080/api/modules/search?keyword=${encodeURIComponent(keyword)}`, {
      method: "GET",
      headers: {
        "Authorization": token,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) throw new Error("Gagal fetch dari server");

    const data = await res.json();
    const container = document.getElementById("search-result");
    const counter = document.getElementById("result-count");

    if (counter) counter.textContent = `${data.length} hasil ditemukan`;
    if (container) {
      container.innerHTML = "";
      data.forEach(modul => {
        container.innerHTML += `
          <a href="${modul.linkDrive}" target="_blank" class="list-group-item list-group-item-action">
            <h6 class="fw-bold mb-1 text-purple">${modul.judul}</h6>
            <small class="d-block text-muted">${modul.penulis} • ${modul.tanggal}</small>
            <small class="text-muted"><i class="bi bi-book"></i> ${modul.jumlahDibaca}x dibaca</small>
          </a>
        `;
      });
    }

  } catch (err) {
    console.error(err);
    const container = document.getElementById("search-result");
    if (container) container.innerHTML = `<div class="text-danger">Gagal memuat data</div>`;
  }
}
