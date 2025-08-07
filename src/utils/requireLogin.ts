export function requireLogin() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log("[requireLogin] user =", user);

if (!user) {
  setTimeout(() => {
    alert("Please create an account to make a payment.");
  }, 0);
  return null;
}

  return user;
}
