import jwt_decode from "jwt-decode";

export const isAuthenticated = () => {
  const auth_token = document.cookie.split(';')
    .find(cookie => cookie.trim().startsWith('auth_token='))
    ?.split('=')[1];
    
  if (auth_token) {
    const decodedToken = jwt_decode(auth_token);
    const current_time = Date.now() / 1000; // Lấy thời gian hiện tại
    if (current_time > decodedToken.exp) {
      // Token đã hết hạn
      return false;
    } else {
      // Token hợp lệ
      return true;
    }
  }
  return false;
}