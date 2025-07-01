(function(){
  function loadSurahList(){
    fetch(wpEquran.pluginUrl + '/surah-list.json')
      .then(r => r.json())
      .then(list => {
        const select = document.getElementById('wp-equran-surah');
        list.forEach(function(s){
          const opt = document.createElement('option');
          opt.value = s.nomor;
          opt.text = s.nomor + '. ' + s.namaLatin;
          select.appendChild(opt);
        });
        if(select.options.length) loadSurah(select.value);
        select.addEventListener('change', () => loadSurah(select.value));
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
          p.innerHTML =
            '<strong>'+a.nomorAyat+'</strong> '+
            a.teksArab +
            '<br><em>'+a.teksLatin+'</em><br>'+a.teksIndonesia;
          cont.appendChild(p);
        });
      });
  }
  document.addEventListener('DOMContentLoaded',loadSurahList);
})();
