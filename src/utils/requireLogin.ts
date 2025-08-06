// utils/requireLogin.ts
export const requireLogin = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || !user.token) {
    alert("Please create an account to make a payment.");
    window.location.href = "/signup";
    return null;
  }

  return user;
};
