export const requireLogin = (): false | { token: string } => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    alert("Please create an account to make a payment.");
    window.location.href = "/signup";
    return false;
  }

  return user;
};
