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
    modal.innerHTML='<div class="wp-equran-modal-content"><button type="button" id="wp-equran-modal-close"><img src="'+wpEquran.pluginUrl+'/icon/close.svg" alt="x"></button><div class="wp-equran-modal-body"></div></div>';
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
    return fetch(wpEquran.pluginUrl + '/tafsir/' + id.padStart(3,'0') + '.json')
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
    player.innerHTML='<button type="button" id="wp-equran-player-close">&times;</button>'+
      '<button type="button" id="wp-equran-player-toggle" class="wp-equran-audio-btn"><img src="'+wpEquran.pluginUrl+'/icon/pause.svg" alt="'+wpEquran.pause+'"></button>'+
      '<audio id="wp-equran-player-audio" controls></audio>';
    document.body.appendChild(player);
    playerAudio=player.querySelector('audio');
    playerBtn=player.querySelector('#wp-equran-player-toggle');
    playerClose=player.querySelector('#wp-equran-player-close');
    player.style.display='none';

    playerBtn.addEventListener('click',function(){
      if(playerAudio.paused){
        playerAudio.play();
        playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
        playerBtn.querySelector('img').alt=wpEquran.pause;
        if(currentBtn){
          if(currentBtn===fullBtn) currentBtn.textContent='Pause/Jeda Audio';
          else{currentBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';currentBtn.querySelector('img').alt=wpEquran.pause;}
        }
      }else{
        playerAudio.pause();
        playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
        playerBtn.querySelector('img').alt=wpEquran.play;
        if(currentBtn){
          if(currentBtn===fullBtn) currentBtn.textContent='Play Audio Full';
          else{currentBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';currentBtn.querySelector('img').alt=wpEquran.play;}
        }
      }
    });
    playerClose.addEventListener('click',function(){
      playerAudio.pause();
      player.style.display='none';
      if(currentBtn){
        if(currentBtn===fullBtn) currentBtn.textContent='Play Audio Full';
        else{currentBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';currentBtn.querySelector('img').alt=wpEquran.play;}
      }
      currentBtn=null;
    });
    playerAudio.addEventListener('ended',function(){
      playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
      playerBtn.querySelector('img').alt=wpEquran.play;
      if(currentBtn){
        if(currentBtn===fullBtn) currentBtn.textContent='Play Audio Full';
        else{currentBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';currentBtn.querySelector('img').alt=wpEquran.play;}
      }
      currentBtn=null;
    });
  }

  function showPlayer(){
    player.style.display='flex';
  }

  function loadSurahList(){
    fetch(wpEquran.pluginUrl + '/surah-list.json')
      .then(r => r.json())
      .then(list => {
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
    fullBtn.textContent='Play Audio Full';
    const select=document.getElementById('wp-equran-surah');
    select.parentNode.insertBefore(fullBtn,select.nextSibling);
    fullBtn.addEventListener('click',function(){
      const src=fullBtn.dataset.audio;
      if(!src) return;
      if(currentBtn===fullBtn){
        if(playerAudio.paused){
          playerAudio.play();
          playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
          playerBtn.querySelector('img').alt=wpEquran.pause;
          fullBtn.textContent='Pause/Jeda Audio';
        }else{
          playerAudio.pause();
          playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
          playerBtn.querySelector('img').alt=wpEquran.play;
          fullBtn.textContent='Play Audio Full';
        }
      }else{
        if(currentBtn){
          if(currentBtn!==fullBtn){
            currentBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
            currentBtn.querySelector('img').alt=wpEquran.play;
          }
        }
        currentBtn=fullBtn;
        playerAudio.src=src;
        showPlayer();
        playerAudio.play();
        playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
        playerBtn.querySelector('img').alt=wpEquran.pause;
        fullBtn.textContent='Pause/Jeda Audio';
      }
    });
  }

  function loadSurah(id){
    fetch(wpEquran.pluginUrl + '/json/' + id.padStart(3,'0') + '.json')
      .then(r=>r.json())
      .then(data=>{
        loadTafsir(id);
        createFullBtn();
        const full=data.data.audioFull?Object.values(data.data.audioFull)[0]:'';
        fullBtn.dataset.audio=full||'';
        fullBtn.textContent='Play Audio Full';

        const cont=document.getElementById('wp-equran-content');
        cont.innerHTML='';
        data.data.ayat.forEach(function(a){
          const p=document.createElement('p');
          const btn=document.createElement('button');
          btn.className='wp-equran-audio-btn';
          btn.innerHTML='<img src="'+wpEquran.pluginUrl+'/icon/play.svg" alt="'+wpEquran.play+'">';
          const tafsirBtn=document.createElement('button');
          tafsirBtn.className='wp-equran-icon-btn';
          tafsirBtn.innerHTML='<img src="'+wpEquran.pluginUrl+'/icon/info-alt.svg" alt="'+wpEquran.tafsir+'">';
          tafsirBtn.addEventListener('click',function(){showTafsir(a.nomorAyat);});
          const shareBtn=document.createElement('button');
          shareBtn.className='wp-equran-icon-btn';
          shareBtn.innerHTML='<img src="'+wpEquran.pluginUrl+'/icon/share-alt.svg" alt="'+wpEquran.share+'">';
          shareBtn.addEventListener('click',function(){shareAyah(a);});
          const src=a.audio?Object.values(a.audio)[0]:'';
          btn.dataset.audio=src;
          btn.addEventListener('click',function(){
            if(!src) return;
            if(currentBtn===btn){
              if(playerAudio.paused){
                playerAudio.play();
                btn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
                btn.querySelector('img').alt=wpEquran.pause;
                playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
                playerBtn.querySelector('img').alt=wpEquran.pause;
              }else{
                playerAudio.pause();
                btn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
                btn.querySelector('img').alt=wpEquran.play;
                playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
                playerBtn.querySelector('img').alt=wpEquran.play;
              }
            }else{
              if(currentBtn){
                if(currentBtn===fullBtn){
                  fullBtn.textContent='Play Audio Full';
                }else{
                  currentBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/play.svg';
                  currentBtn.querySelector('img').alt=wpEquran.play;
                }
              }
              currentBtn=btn;
              playerAudio.src=src;
              showPlayer();
              playerAudio.play();
              btn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
              btn.querySelector('img').alt=wpEquran.pause;
              playerBtn.querySelector('img').src=wpEquran.pluginUrl+'/icon/pause.svg';
              playerBtn.querySelector('img').alt=wpEquran.pause;
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
