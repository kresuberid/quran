(function(){
  const map = {};
  function slugify(str){
    return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
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
  function loadSurah(id){
    fetch(wpEquran.pluginUrl + '/json/' + id.padStart(3,'0') + '.json')
      .then(r=>r.json())
      .then(data=>{
        const cont=document.getElementById('wp-equran-content');
        cont.innerHTML='';
        data.data.ayat.forEach(function(a){
          const p = document.createElement('p');

          const btn = document.createElement('button');
          btn.className = 'wp-equran-audio-btn';
          btn.innerHTML = '<img src="'+wpEquran.pluginUrl+'/icon/play.svg" alt="'+wpEquran.play+'">';

          const audio = document.createElement('audio');
          const first = a.audio ? Object.values(a.audio)[0] : '';
          if(first) audio.src = first;

          btn.addEventListener('click',function(){
            if(audio.paused){
              audio.play();
              btn.querySelector('img').src = wpEquran.pluginUrl+'/icon/pause.svg';
              btn.querySelector('img').alt = wpEquran.pause;
            } else {
              audio.pause();
              btn.querySelector('img').src = wpEquran.pluginUrl+'/icon/play.svg';
              btn.querySelector('img').alt = wpEquran.play;
            }
          });
          audio.addEventListener('ended',function(){
            btn.querySelector('img').src = wpEquran.pluginUrl+'/icon/play.svg';
            btn.querySelector('img').alt = wpEquran.play;
          });

          p.appendChild(btn);
          const span = document.createElement('span');
          span.innerHTML = '<strong>'+a.nomorAyat+'</strong> '+a.teksArab+
            '<br><em>'+a.teksLatin+'</em><br>'+a.teksIndonesia;
          p.appendChild(span);
          p.appendChild(audio);
          cont.appendChild(p);
        });
      });
  }
  document.addEventListener('DOMContentLoaded',loadSurahList);
})();
