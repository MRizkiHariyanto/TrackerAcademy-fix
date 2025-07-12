# 🎓 Trackademy – IP Tracker for College Students

**Trackademy** adalah aplikasi berbasis web yang membantu mahasiswa mencatat, menghitung, dan memantau IPK (Indeks Prestasi Kumulatif) mereka selama kuliah. Proyek ini dibangun menggunakan **Java Spring Boot** sebagai backend dan dirancang dengan sistem autentikasi yang aman menggunakan **JWT Token**.

---

## 🚀 Fitur Utama

- ✍️ **Sign Up / Login**: Autentikasi user menggunakan email dan password terenkripsi.
- 🔐 **JWT Token**: Sistem login aman dengan proteksi endpoint berbasis token.
- 📥 **Input IPK**: User bisa mengisi data mata kuliah, nilai, dan SKS.
- 📊 **Lihat Riwayat IPK**: Menampilkan semua data IPK yang sudah disimpan oleh user.
- 👤 **Akses data pribadi**: Data IPK hanya bisa diakses oleh user yang login.

---

## ⚙️ Teknologi yang Digunakan

- **Backend**: Java Spring Boot
- **Keamanan**: Spring Security, JWT (JSON Web Token)
- **Database**: H2 (dev) / bisa disesuaikan ke PostgreSQL/MySQL
- **Lainnya**: Lombok, JPA, Maven

---

## 🧩 Struktur Folder

src/
├── config/
│ ├── JwtAuthenticationFilter.java
│ ├── SecurityConfig.java
│ └── WebConfig.java
├── controller/
│ ├── AuthController.java
│ ├── ModulController.java
│ └── TrackerController.java
├── entity/
│ └── MatkulItem.java
├── model/
│ ├── MataKuliah.java
│ ├── Modul.java
│ ├── TrackRecord.java
│ ├── TrackRequest.java
│ └── User.java
├── repository/
│ ├── MataKuliahRepository.java
│ ├── ModulRepository.java
│ ├── TrackRecordRepository.java
│ └── UserRepository.java
├── service/
│ ├── CustomUserDetailsService.java
│ ├── JwtService.java
│ ├── ModulService.java
│ ├── TrackerService.java
│ ├── UserService.java
│ └── UserServiceImpl.java
└── BackendApplication.java

---

## ▶️ Cara Menjalankan Proyek

1. **Clone repository dari GitHub**:
   ```bash
   git clone https://github.com/MRizkiHariyanto/TrackerAcademy-fix.git
   
2. **Masuk ke folder backend**:
   ``` 
   cd trackademy/Forntend_Backend/backend

3. **Jalankan proyek melalui file utama Spring Boot**:
   Melalui terminal:
     ```
     ./mvnw spring-boot:run

4. **Atau langsung dari IDE (IntelliJ/VS Code)**:
     Jalankan file BackendApplication.java
     → file ini adalah entry point dari aplikasi Spring Boot.

   Pastikan Java dan Maven sudah terinstall di perangkat kamu.

  ---
  
## 🔑 Endpoint Utama

| Method | Endpoint           | Deskripsi                  |
|--------|--------------------|----------------------------|
| POST   | `/auth/signup`     | Registrasi user baru       |
| POST   | `/auth/login`      | Login user dan dapat token |
| POST   | `/track`           | Input data IPK             |
| GET    | `/track/history`   | Lihat histori IPK user     |

Semua endpoint (kecuali auth) memerlukan Header:
Authorization: Bearer <token>

  ---
## 👤 Developer
1. Muhammad Rizki Hariyanto: Backend
2. Muhammad Rizcy: Backend
3. Muhammad Adha Darojat: Frontend
4. Rakha Zhafran Piandra Pratama: Frontend


  

