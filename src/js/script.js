function logout() {
    var isConfirmed = confirm("Are you sure you want to log out?");
    if (isConfirmed) {
        // Perform logout action here, for example, redirect to the logout page
        alert("Logging out...");
        window.location.href = "index.html"; // Change the URL to your actual logout page
    } else {
        // Cancel logout
        alert("Logout canceled.");
    }
}