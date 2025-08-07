export function requireLogin() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    alert("Please create an account to make a payment.");
    return null;
  }
  return user;
}
