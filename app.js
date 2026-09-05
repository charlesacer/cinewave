// 1. Initialize Supabase Client
const SUPABASE_URL = 'https://ciuwdfciavjlifeaeznk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_c4K6_TAOl4roRYbIzxBOsQ_pTT9iXPn';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Load Videos from Supabase on Page Load
document.addEventListener('DOMContentLoaded', () => {
  fetchVideos();
});

async function fetchVideos(categoryFilter = null) {
  const grid = document.getElementById('catalog-grid');
  grid.innerHTML = '<p style="color: var(--text-muted);">Loading content...</p>';

  let query = supabase.from('videos').select('*');

  if (categoryFilter) {
    query = query.eq('category', categoryFilter);
  }

  const { data: videos, error } = await query;

  if (error) {
    console.error('Error fetching videos:', error);
    grid.innerHTML = '<p>Error loading videos.</p>';
    return;
  }

  if (videos.length === 0) {
    grid.innerHTML = '<p style="color: var(--text-muted);">No videos found. Add some in your Supabase database!</p>';
    return;
  }

  // Clear loading text and populate grid cards
  grid.innerHTML = '';
  videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // Fallback thumbnail if none provided
    const poster = video.thumbnail_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

    card.innerHTML = `
      <img src="${poster}" alt="${video.title}">
      <div class="card-info">
        <div class="card-title">${video.title}</div>
        <div class="card-type">${video.category || 'Movie'}</div>
      </div>
    `;

    // Click card to open Watch Page
    const driveEmbedUrl = `https://drive.google.com/file/d/${video.drive_file_id}/preview`;
    card.onclick = () => loadWatchPage(driveEmbedUrl, video.title, video.id);

    grid.appendChild(card);
  });
}

// 3. Navigation & Page Switcher
function showPage(pageName) {
  document.getElementById('page-home').style.display = 'none';
  document.getElementById('page-watch').style.display = 'none';

  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => link.classList.remove('active'));

  if (pageName === 'home') {
    document.getElementById('page-home').style.display = 'block';
    fetchVideos();
  } else if (pageName === 'series') {
    document.getElementById('page-home').style.display = 'block';
    fetchVideos('Series');
  } else if (pageName === 'movies') {
    document.getElementById('page-home').style.display = 'block';
    fetchVideos('Movie');
  } else if (pageName === 'watch') {
    document.getElementById('page-watch').style.display = 'block';
  }
}

// 4. Load Watch Page & Embed Drive Video
function loadWatchPage(driveEmbedUrl, title, videoId) {
  document.getElementById('video-frame').src = driveEmbedUrl;
  document.getElementById('video-title').innerText = title;
  showPage('watch');
  
  // Setup Chat for this specific video
  loadChatMessages(videoId);
}

// 5. Basic Chat Fetching
async function loadChatMessages(videoId) {
  const chatContainer = document.getElementById('chat-messages');
  chatContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem;">Connecting to live chat...</p>';

  const { data: messages, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at', { ascending: true });

  if (error || !messages) {
    chatContainer.innerHTML = '<p>Chat unavailable.</p>';
    return;
  }

  chatContainer.innerHTML = '';
  messages.forEach(msg => {
    const p = document.createElement('p');
    p.style.marginBottom = '0.5rem';
    p.innerHTML = `<strong style="color: var(--accent-color);">User:</strong> ${msg.message}`;
    chatContainer.appendChild(p);
  });
}