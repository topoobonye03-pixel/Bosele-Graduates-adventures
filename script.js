document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  // Mobile navigation
  const toggle=document.querySelector('.nav-toggle');
  const menu=document.getElementById('site-menu');
  if(toggle && menu){
    let backdrop=document.querySelector('.menu-backdrop');
    if(!backdrop){backdrop=document.createElement('div');backdrop.className='menu-backdrop';document.body.appendChild(backdrop)}
    const closeMenu=()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');document.body.classList.remove('menu-open')};
    const openMenu=()=>{menu.classList.add('open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Close navigation');document.body.classList.add('menu-open')};
    toggle.addEventListener('click',()=>menu.classList.contains('open')?closeMenu():openMenu());
    backdrop.addEventListener('click',closeMenu);
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
    window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu()});
  }

  // Mail enquiry helper
  document.querySelectorAll('form[data-mail]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();const d=new FormData(form);
    const s=encodeURIComponent('Bosele Website Enquiry - '+(d.get('interest')||'General'));
    const b=encodeURIComponent(`Name: ${d.get('name')}\nPhone/Email: ${d.get('contact')}\nInterest: ${d.get('interest')}\n\n${d.get('message')||''}`);
    window.location.href=`mailto:gboseleadventures@gmail.com?subject=${s}&body=${b}`;
  }));

  // Lightweight image slideshow
  document.querySelectorAll('[data-showcase]').forEach(showcase=>{
    const slides=[...showcase.querySelectorAll('.showcase-slide')];
    const dots=[...showcase.querySelectorAll('.showcase-dot')];
    if(slides.length<2) return;
    let i=0;
    const showSlide=n=>{slides[i].classList.remove('active');if(dots[i])dots[i].classList.remove('active');i=n;slides[i].classList.add('active');if(dots[i])dots[i].classList.add('active')};
    dots.forEach((dot,n)=>dot.addEventListener('click',()=>showSlide(n)));
    setInterval(()=>showSlide((i+1)%slides.length),4300);
  });
});
// Bosele AI Safari Planner
const boseleAI = document.createElement('div');

boseleAI.innerHTML = `
  <button id="bosele-ai-button" aria-label="Open Bosele AI Safari Planner">
    ✨ Plan with Bosele AI
  </button>

  <div id="bosele-ai-chat">
    <div class="bosele-ai-header">
      <div>
        <strong>Bosele AI Travel Consultant ✨</strong>
        <small>Learn. Explore. Grow.</small>
      </div>
      <button id="bosele-ai-close" aria-label="Close Bosele AI">×</button>
    </div>

    <div class="bosele-ai-body">
      <div class="bosele-ai-welcome">
        Hi! 👋 Tell me about the Botswana adventure you're planning.
      </div>

      <div id="bosele-ai-messages"></div>

      <textarea
        id="bosele-ai-input"
        maxlength="2000"
        placeholder="Ask about Khwai, Chobe, Moremi, Gold Safari..."
      ></textarea>

      <button id="bosele-ai-send">Ask Bosele AI</button>

      <small class="bosele-ai-note">
        AI planning assistance. Confirm prices, dates and availability with Bosele.
      </small>
    </div>
  </div>
`;

document.body.appendChild(boseleAI);

const aiButton = document.getElementById('bosele-ai-button');
const aiChat = document.getElementById('bosele-ai-chat');
const aiClose = document.getElementById('bosele-ai-close');
const aiSend = document.getElementById('bosele-ai-send');
const aiInput = document.getElementById('bosele-ai-input');
const aiMessages = document.getElementById('bosele-ai-messages');

aiButton.addEventListener('click', () => {
  aiChat.classList.toggle('open');
});

aiClose.addEventListener('click', () => {
  aiChat.classList.remove('open');
});

async function askBoseleAI() {
  const message = aiInput.value.trim();

  if (!message) return;

  const userMessage = document.createElement('div');
  userMessage.className = 'bosele-ai-user-message';
  userMessage.textContent = message;
  aiMessages.appendChild(userMessage);

  aiInput.value = '';
  aiSend.disabled = true;
  aiSend.textContent = 'Planning...';

  const reply = document.createElement('div');
  reply.className = 'bosele-ai-reply';
  reply.textContent = 'Bosele AI is thinking...';
  aiMessages.appendChild(reply);

  aiMessages.scrollTop = aiMessages.scrollHeight;

  try {
    const response = await fetch(
      'https://bosele-ai-safari-planner.gboseleadventures.workers.dev/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    reply.textContent =
      data.reply || 'Please contact Bosele Graduates Adventures for assistance.';
  } catch (error) {
    reply.textContent =
      'Sorry, Bosele AI is temporarily unavailable. Please try again.';
  } finally {
    aiSend.disabled = false;
    aiSend.textContent = 'Ask Bosele AI';
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }
}

aiSend.addEventListener('click', askBoseleAI);
