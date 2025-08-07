export function requireLogin() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log("user in requireLogin:", user);
  if (!user) {
    alert("Please create an account to make a payment.");
    return null;
  }
  return user;
}
