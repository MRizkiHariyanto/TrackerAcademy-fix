 // assets/js/guard.js
 (function () {
   const token = localStorage.getItem("token");

   // Jika token hilang ⇒ lempar ke form login
   if (!token) {
     window.location.href = "/frontend/form.html";
     return;
   }

   /* (Opsional) cek token masih valid ke backend
      – butuh endpoint validate atau cukup request ringan apa saja yg akan
        menghasilkan 401 bila token kadaluarsa.  */
   fetch("http://localhost:8080/api/auth/validate", {
     headers: { Authorization: "Bearer " + token }
   }).then(r => {
     if (r.status === 401) throw new Error();
   }).catch(() => {
     localStorage.removeItem("token");
     localStorage.removeItem("username");
     window.location.href = "/frontend/form.html";
   });
 })();
