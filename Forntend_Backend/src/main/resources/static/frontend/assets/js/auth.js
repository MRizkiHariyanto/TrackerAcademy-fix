document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");
  const signinForm = document.getElementById("signinForm");

  // =================== SIGNUP =====================
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

        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
          const result = await res.json();
          if (result.status === "success") {
            alert("Signup sukses!");
            showSignIn?.();
          } else {
            alert(result.message || "Signup gagal.");
          }
        } else {
          alert("Gagal signup. Server tidak mengembalikan data valid.");
        }
      } catch (err) {
        alert("Signup error: " + err.message);
      }
    });
  }

  // =================== SIGNIN =====================
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

        if (res.ok && res.headers.get("content-type")?.includes("application/json")) {
          const result = await res.json();
          console.log("Login result:", result); // DEBUG: lihat tokennya

          if (result.token) {
            // ✅ Simpan token ke localStorage untuk akses backend
            localStorage.setItem("token", result.token);
            localStorage.setItem("username", result.username || payload.username);
            alert("Login sukses!");
            window.location.href = "index.html";
          } else {
            alert(result.message || "Login gagal. Token tidak ditemukan.");
          }
        } else {
          alert("Login gagal. Server tidak merespons dengan benar.");
        }
      } catch (err) {
        alert("Login error: " + err.message);
      }
    });
  }

  // ================ SLIDER EFFECT / AUTH ================
  const signInButton = document.getElementById("signIn");
  const signUpButton = document.getElementById("signUp");
  const container = document.getElementById("container");
  const signInFormDiv = document.querySelector(".sign-in-container");
  const signUpFormDiv = document.querySelector(".sign-up-container");

  function showSignIn() {
    container?.classList.remove("right-panel-active");
    signInFormDiv?.classList.add("active");
    signUpFormDiv?.classList.remove("active");
  }

  function showSignUp() {
    container?.classList.add("right-panel-active");
    signUpFormDiv?.classList.add("active");
    signInFormDiv?.classList.remove("active");
  }

  signUpButton?.addEventListener("click", showSignUp);
  signInButton?.addEventListener("click", showSignIn);
});
