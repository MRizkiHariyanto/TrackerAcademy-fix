// Ambil semester dari URL
const params = new URLSearchParams(window.location.search);
const semester = params.get("semester");

// Update judul semester di halaman
const semesterTitle = document.getElementById("semesterTitle");
if (semesterTitle) {
  semesterTitle.textContent = `Semester ${semester}`;
}

// Fetch statistik dari backend
async function fetchStatistik() {
  try {
    const res = await fetch(`http://localhost:8080/api/tracker/statistik?semester=${semester}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json(); // { ipk: ..., matkul: [{ nama: "", nilai: ... }] }

    // 🟣 Donut Chart untuk IPK
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
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });

    // Tampilkan IPK di tengah lingkaran
    const ipkValue = document.getElementById("ipk-value");
    if (ipkValue) {
      ipkValue.textContent = ipk.toFixed(2);
    }

    // 📊 Bar Chart untuk Nilai per Mata Kuliah
    const labels = data.matkul.map(m => m.nama);
    const nilai = data.matkul.map(m => m.nilai);

    console.log("Labels:", labels);
    console.log("Nilai:", nilai);

    new Chart(document.getElementById("barChartMatkul"), {
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
              stepSize: 0.5,
              callback: function (value) {
                if (value == 4) return "A";
                if (value == 3.5) return "AB";
                if (value == 3) return "B";
                if (value == 2.5) return "BC";
                if (value == 2) return "C";
                if (value == 1) return "D";
                if (value == 0) return "E";
                return "";
              }
            }
          }
        },
        plugins: {
          legend: { display: true }
        }
      }
    });

  } catch (err) {
    alert("Gagal memuat data");
    console.error("Error fetching statistik:", err);
  }
}

// Jalankan saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", fetchStatistik);
