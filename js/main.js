(function(){
  var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};

  // mobile menu
  var menu=$('.menu');
  $('.burger').addEventListener('click',function(){menu.classList.toggle('open')});
  $$('.menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open')})});

  // hero slider
  var slides=[
    ['Best CCTV & Security Solution For You','Professional CCTV, access control and IT services for businesses and homes in Tanzania.'],
    ['Smart Security Solution For All Business','From call centers to hotels, we design and install systems that protect what matters.'],
    ['Innovative Solution For Security System','Modern technology, expert engineers and 24/7 support.']
  ],i=0,h=$('.hero h1'),p=$('.hero p'),dots=$('.dots');
  slides.forEach(function(_,n){var d=document.createElement('span');d.onclick=function(){show(n);reset()};dots.appendChild(d)});
  function show(n){i=n;h.style.opacity=0;setTimeout(function(){h.textContent=slides[n][0];p.textContent=slides[n][1];h.style.opacity=1},300);
    $$('span',dots).forEach(function(d,k){d.className=k===n?'on':''})}
  var t;function reset(){clearInterval(t);t=setInterval(function(){show((i+1)%slides.length)},5500)}
  show(0);reset();

  // project filters
  $$('.filters button').forEach(function(b){b.addEventListener('click',function(){
    $$('.filters button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
    var f=b.dataset.f;$$('.proj').forEach(function(c){c.classList.toggle('hide',f!=='all'&&!c.classList.contains(f))})})});

  // scroll reveal + back to top
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
  $$('.reveal').forEach(function(el){io.observe(el)});
  var top=$('.top');window.addEventListener('scroll',function(){top.style.display=window.scrollY>400?'flex':'none'});

  // email forms -> send-mail.php
  $$('.mail-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=$('button[type=submit]',f),msg=$('.form-msg',f),old=btn.textContent;
      btn.disabled=true;btn.textContent='Sending...';
      fetch('send-mail.php',{method:'POST',body:new FormData(f)})
        .then(function(r){return r.json()})
        .then(function(d){msg.className='form-msg '+(d.ok?'ok':'err');msg.textContent=d.message;if(d.ok)f.reset()})
        .catch(function(){msg.className='form-msg err';msg.textContent='Network error. Please call +255 718 273 723.'})
        .finally(function(){btn.disabled=false;btn.textContent=old});
    });
  });
})();
