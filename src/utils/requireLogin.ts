export function requireLogin() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log("[requireLogin] user =", user);

  if (!user) {
    alert("Please create an account to make a payment.");
    window.location.href = "/login";  // Optional
    return null;
  }

  return user;
}
