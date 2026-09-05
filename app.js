// Simple Page Navigation Handler
function showPage(pageName) {
  // Hide all main pages
  document.getElementById('page-home').style.display = 'none';
  document.getElementById('page-watch').style.display = 'none';

  // Remove active styling from all nav links
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => link.classList.remove('active'));

  if (pageName === 'home') {
    document.getElementById('page-home').style.display = 'block';
  } else if (pageName === 'watch') {
    document.getElementById('page-watch').style.display = 'block';
  } else {
    alert("This page (" + pageName + ") will load filtered content from Supabase!");
    document.getElementById('page-home').style.display = 'block';
  }
}

// Function to play video when user clicks a card
function loadWatchPage(driveEmbedUrl, title) {
  document.getElementById('video-frame').src = driveEmbedUrl;
  document.getElementById('video-title').innerText = title;
  showPage('watch');
}