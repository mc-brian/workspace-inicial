document.addEventListener('DOMContentLoaded', function() {
    const userInfo = document.getElementById('user-info');
    const loggedInUser = localStorage.getItem('loggedInUser');
  
    if (loggedInUser) {
      userInfo.textContent = loggedInUser;
      userInfo.style.display = 'inline-block';
    } else {
      userInfo.style.display = 'none';
    }
  });
  