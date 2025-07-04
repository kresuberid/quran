(function(){
  const map = {};
  let player,playerAudio,playerBtn,playerClose,currentBtn=null,fullBtn=null;
  let modal,modalBody;
  let tafsir={};

  function slugify(str){
    return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }

  function createModal(){
    modal=document.createElement('div');
    modal.id='wp-equran-modal';
    modal.innerHTML='<div class="wp-equran-modal-content"><button type="button" id="wp-equran-modal-close"><i class="fa-solid fa-xmark"></i></button><div class="wp-equran-modal-body"></div></div>';
    document.body.appendChild(modal);
    modalBody=modal.querySelector('.wp-equran-modal-body');
    modal.querySelector('#wp-equran-modal-close').addEventListener('click',function(){modal.style.display='none';});
    modal.style.display='none';
  }

  function showModal(html){
    if(!modal) createModal();
    modalBody.innerHTML=html;
    modal.style.display='flex';
  }

  function loadTafsir(id){
    tafsir={};
    return fetch('https://equran.id/api/v2/tafsir/' + id)
      .then(r=>r.json())
      .then(t=>{
        if(t.data && t.data.tafsir){
          t.data.tafsir.forEach(function(row){
            tafsir[row.ayat]=row.teks;
          });
        }
      });
  }

  function showTafsir(num){
    if(tafsir[num]){
      showModal(tafsir[num]);
    }
  }

  function shareAyah(a){
    const text=a.teksArab+'\n'+a.teksIndonesia+'\n'+location.href;
    if(navigator.share){
      navigator.share({text:a.teksIndonesia,url:location.href}).catch(()=>{});
    }else if(navigator.clipboard){
      navigator.clipboard.writeText(text).then(()=>{alert(wpEquran.copied);});
    }
  }

  function createPlayer(){
    player=document.createElement('div');
    player.id='wp-equran-player';
    player.innerHTML='<button type="button" id="wp-equran-player-close"><i class="fa-solid fa-xmark"></i></button>'+
      '<button type="button" id="wp-equran-player-toggle" class="wp-equran-audio-btn"><i class="fa-solid fa-pause"></i></button>'+
      '<audio id="wp-equran-player-audio" controls></audio>'; 
    document.body.appendChild(player);
    playerAudio=player.querySelector('audio');
    playerBtn=player.querySelector('#wp-equran-player-toggle');
    playerClose=player.querySelector('#wp-equran-player-close');
    player.style.display='none';

    playerBtn.addEventListener('click',function(){
      if(playerAudio.paused){
        playerAudio.play();
        playerBtn.querySelector('i').className='fa-solid fa-pause';
        if(currentBtn){
          if(currentBtn===fullBtn) currentBtn.textContent=wpEquran.pauseAudio;
          else{currentBtn.querySelector('i').className='fa-solid fa-pause';}
        }
      }else{
        playerAudio.pause();
        playerBtn.querySelector('i').className='fa-solid fa-play';
        if(currentBtn){
          if(currentBtn===fullBtn) currentBtn.textContent=wpEquran.playFull;
          else{currentBtn.querySelector('i').className='fa-solid fa-play';}
        }
      }
    });
    playerClose.addEventListener('click',function(){
      playerAudio.pause();
      player.style.display='none';
      if(currentBtn){
        if(currentBtn===fullBtn) currentBtn.textContent=wpEquran.playFull;
        else{currentBtn.querySelector('i').className='fa-solid fa-play';}
      }
      currentBtn=null;
    });
    playerAudio.addEventListener('ended',function(){
      playerBtn.querySelector('i').className='fa-solid fa-play';
      if(currentBtn){
        if(currentBtn===fullBtn) currentBtn.textContent=wpEquran.playFull;
        else{currentBtn.querySelector('i').className='fa-solid fa-play';}
      }
      currentBtn=null;
    });
  }

  function showPlayer(){
    player.style.display='flex';
  }

  function loadSurahList(){
    fetch('https://equran.id/api/v2/surat')
      .then(r => r.json())
      .then(res => {
        const list = res.data || [];
        const select = document.getElementById('wp-equran-surah');
        list.forEach(function(s){
          const slug = slugify(s.namaLatin);
          map[slug] = s.nomor.toString().padStart(3,'0');
          const opt = document.createElement('option');
          opt.value = slug;
          opt.text = s.nomor + '. ' + s.namaLatin;
          if(wpEquran.defaultSurahSlug === slug) opt.selected = true;
          select.appendChild(opt);
        });
        let slug = select.value;
        if(wpEquran.defaultSurah){
          slug = wpEquran.defaultSurahSlug;
        }
        if(map[slug]) loadSurah(map[slug]);
        select.addEventListener('change', () => {
          location.href = wpEquran.surahBase + select.value;
        });
      });
  }
  function createFullBtn(){
    if(fullBtn) return;
    fullBtn=document.createElement('button');
    fullBtn.id='wp-equran-play-full';
    fullBtn.textContent=wpEquran.playFull;
    const select=document.getElementById('wp-equran-surah');
    select.parentNode.insertBefore(fullBtn,select.nextSibling);
    fullBtn.addEventListener('click',function(){
      const src=fullBtn.dataset.audio;
      if(!src) return;
      if(currentBtn===fullBtn){
        if(playerAudio.paused){
          playerAudio.play();
          playerBtn.querySelector('i').className='fa-solid fa-pause';
          fullBtn.textContent=wpEquran.pauseAudio;
        }else{
          playerAudio.pause();
          playerBtn.querySelector('i').className='fa-solid fa-play';
          fullBtn.textContent=wpEquran.playFull;
        }
      }else{
        if(currentBtn){
          if(currentBtn!==fullBtn){
            currentBtn.querySelector('i').className='fa-solid fa-play';
          }
        }
        currentBtn=fullBtn;
        playerAudio.src=src;
        showPlayer();
        playerAudio.play();
        playerBtn.querySelector('i').className='fa-solid fa-pause';
        fullBtn.textContent=wpEquran.pauseAudio;
      }
    });
  }

  function loadSurah(id){
    fetch('https://equran.id/api/v2/surat/' + id)
      .then(r=>r.json())
      .then(data=>{
        loadTafsir(id);
        createFullBtn();
        const full=data.data.audioFull?Object.values(data.data.audioFull)[0]:'';
        fullBtn.dataset.audio=full||'';
        fullBtn.textContent=wpEquran.playFull;

        const cont=document.getElementById('wp-equran-content');
        cont.innerHTML='';
        data.data.ayat.forEach(function(a){
          const p=document.createElement('p');
          const btn=document.createElement('button');
          btn.className='wp-equran-audio-btn';
          btn.innerHTML='<i class="fa-solid fa-play"></i>';
          const tafsirBtn=document.createElement('button');
          tafsirBtn.className='wp-equran-icon-btn';
          tafsirBtn.innerHTML='<i class="fa-solid fa-book-open"></i>';
          tafsirBtn.addEventListener('click',function(){showTafsir(a.nomorAyat);});
          const shareBtn=document.createElement('button');
          shareBtn.className='wp-equran-icon-btn';
          shareBtn.innerHTML='<i class="fa-solid fa-share"></i>';
          shareBtn.addEventListener('click',function(){shareAyah(a);});
          const src=a.audio?Object.values(a.audio)[0]:'';
          btn.dataset.audio=src;
          btn.addEventListener('click',function(){
            if(!src) return;
            if(currentBtn===btn){
              if(playerAudio.paused){
                playerAudio.play();
                btn.querySelector('i').className='fa-solid fa-pause';
                playerBtn.querySelector('i').className='fa-solid fa-pause';
              }else{
                playerAudio.pause();
                btn.querySelector('i').className='fa-solid fa-play';
                playerBtn.querySelector('i').className='fa-solid fa-play';
              }
            }else{
              if(currentBtn){
                if(currentBtn===fullBtn){
                  fullBtn.textContent=wpEquran.playFull;
                }else{
                  currentBtn.querySelector('i').className='fa-solid fa-play';
                }
              }
              currentBtn=btn;
              playerAudio.src=src;
              showPlayer();
              playerAudio.play();
              btn.querySelector('i').className='fa-solid fa-pause';
              playerBtn.querySelector('i').className='fa-solid fa-pause';
            }
          });

          const span=document.createElement('span');
          span.innerHTML='<strong>'+a.nomorAyat+'</strong> '+a.teksArab+'<br><em>'+a.teksLatin+'</em><br>'+a.teksIndonesia;
          p.appendChild(btn);
          p.appendChild(tafsirBtn);
          p.appendChild(shareBtn);
          p.appendChild(span);
          cont.appendChild(p);
        });
      });
  }

  document.addEventListener('DOMContentLoaded',function(){
    createPlayer();
    createModal();
    loadSurahList();
  });
})();
