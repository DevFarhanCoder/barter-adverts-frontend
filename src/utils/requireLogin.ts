// utils/requireLogin.ts
export const requireLogin = () => {
  if (typeof window === 'undefined') return null; // Avoid SSR issues

  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user?.token) {
    alert("Please create an account to make a payment.");
    window.location.href = "/signup";
    return null;
  }
  return user;
};
