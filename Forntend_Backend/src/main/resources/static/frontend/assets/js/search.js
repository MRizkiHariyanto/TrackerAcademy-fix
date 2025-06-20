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
          const response = await fetch(`http://localhost:8088/api/modules/search?keyword=${keyword}`);
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