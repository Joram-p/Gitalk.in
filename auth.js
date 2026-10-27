import { createClient } from
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// STEP 3 में अपने Supabase Project URL और Publishable Key डालें.
const SUPABASE_URL = "https://mhnfutbpvyvhdmqqquyi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iqgShS9BnBtwnL0RwBTeMg_U9leFFf9";

let supabase = null;

if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("authMessage");

function showMessage(text, type = "") {
  if (!message) return;

  message.textContent = text;
  message.className = "message";

  if (type) {
    message.classList.add(type);
  }
}

function setLoading(button, loading, label) {
  button.disabled = loading;
  button.textContent = loading ? "Please wait..." : label;
}

function friendlyError(error) {
  const msg = error?.message || "Something went wrong.";

  if (/invalid login credentials/i.test(msg)) {
    return "Email or password is incorrect.";
  }

  if (/already registered/i.test(msg)) {
    return "This email is already registered. Please log in.";
  }

  if (/password should be at least/i.test(msg)) {
    return "Please use a stronger password.";
  }

  return msg;
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = document.getElementById("loginButton");
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!supabase) {
      showMessage(
        "Supabase is not configured yet. Complete Step 3 first.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Login");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage("Login successful! Opening your dashboard...", "success");

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);

    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setLoading(button, false, "Login");
    }
  });
}

// REGISTRATION
if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = document.getElementById("registerButton");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (name.length < 2) {
      showMessage("Please enter your full name.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Passwords do not match.", "error");
      return;
    }

    if (!document.getElementById("terms").checked) {
      showMessage("Please accept the Terms and Privacy Policy.", "error");
      return;
    }

    if (!supabase) {
      showMessage(
        "Supabase is not configured yet. Complete Step 3 first.",
        "error"
      );
      return;
    }

    setLoading(button, true, "Create Account");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: window.location.origin + "/login.html"
        }
      });

      if (error) throw error;

      if (data.session) {
        showMessage(
          "Account created successfully! Opening your dashboard...",
          "success"
        );

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        showMessage(
          "Account request received. Check your email to verify your account before logging in.",
          "success"
        );
      }

    } catch (error) {
      showMessage(friendlyError(error), "error");
    } finally {
      setLoading(button, false, "Create Account");
    }
  });
}

// PASSWORD RESET
const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword) {
  forgotPassword.addEventListener("click", async (event) => {
    event.preventDefault();

    if (!supabase) {
      showMessage(
        "Supabase is not configured yet. Complete Step 3 first.",
        "error"
      );
      return;
    }

    const email = document.getElementById("email").value.trim();

    if (!email) {
      showMessage(
        "Enter your email address first, then select Forgot password.",
        "error"
      );
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/login.html"
      });

      if (error) throw error;

      showMessage(
        "If an account exists for this email, password-reset instructions will be sent.",
        "success"
      );
    } catch (error) {
      showMessage(friendlyError(error), "error");
    }
  });
}
