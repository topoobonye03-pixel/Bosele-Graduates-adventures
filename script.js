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
