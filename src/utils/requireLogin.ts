export function requireLogin() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log("[requireLogin] user =", user);

  if (!user) {
    setTimeout(() => {
      alert("Please create an account to make a payment.");
      window.location.href = "/login";
    }, 0); // Allow browser to render alert
    return null;
  }

  return user;
}
