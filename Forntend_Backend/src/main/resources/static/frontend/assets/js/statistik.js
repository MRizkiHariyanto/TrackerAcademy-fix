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
