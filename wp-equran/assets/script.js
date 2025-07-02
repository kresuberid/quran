(function(){
let __QURAN_AUDIO = null,
    __AUDIO_PLAYER_POPUP = null,
    __AUDIO_PLAYER_BTN = null,
    __AUDIO_PLAYER_STATUS = "pause",
    __SURAT_LIST = [],
    __SURAT_INDEX = 0,
    __AUDIO_META = {},
    __AUDIO_MODE = "full", // "full" | "ayat"
    __AYAT_LIST = [],
    __AYAT_INDEX = 0;

function pad3(x){return String(x).padStart(3,"0")}
function toTime(s){let m=Math.floor(s/60),n=Math.floor(s%60);return`${m.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}

function injectAudioFullBtn(){
  const t=document.getElementById("audio-full");
  if(!t||t.dataset.injected==="1")return;
  t.dataset.injected="1";
  let e=t.dataset.surat;
  if(__SURAT_LIST.length<1){
    __SURAT_LIST=Array.from({length:114},(_,i)=>pad3(i+1));
    __SURAT_INDEX=__SURAT_LIST.indexOf(pad3(e));
  }
  t.innerHTML=`<button class="audioFullBtn" id="btnAudioFull" type="button">
    <span class="audio-btn-playpause"><i class="fa-solid fa-play"></i></span>
    <span class="label-audio">Putar Audio Full</span>
  </button>`;
  __AUDIO_PLAYER_BTN=document.getElementById("btnAudioFull");
  __AUDIO_PLAYER_BTN.onclick=handleAudioFullClick;
}

async function handleAudioFullClick(){
  __AUDIO_MODE="full";
  __AYAT_INDEX=0;__AYAT_LIST=[];
  await loadAudioMetaByIndex(__SURAT_INDEX);
  playFullSurat();
}

async function loadAudioMetaByIndex(idx){
  let e=__SURAT_LIST[idx],
      url=wpEquran.pluginUrl + '/json/' + e + '.json',
      o=await fetch(url).then(r=>r.json()).catch(()=>null);
  if(!o||!o.data||!o.data.audioFull)return alert("Audio Full tidak tersedia!");
  __AUDIO_META={
    surat:e,
    namaLatin:o.data.namaLatin||"",
    nama:o.data.nama||"",
    audioFull:o.data.audioFull["05"]||"",
    jumlahAyat:o.data.jumlahAyat||0
  };
  __SURAT_INDEX=idx;
}

async function playFullSurat(){
  if(!__AUDIO_META.surat)await loadAudioMetaByIndex(__SURAT_INDEX);
  if(!__QURAN_AUDIO){
    __QURAN_AUDIO=new Audio();
    __QURAN_AUDIO.onended=handleAudioEnded;
    __QURAN_AUDIO.ontimeupdate=updateAudioProgress;
  }
  __QURAN_AUDIO.src=__AUDIO_META.audioFull;
  __QURAN_AUDIO.currentTime=0;
  __QURAN_AUDIO.play();
  setAudioBtnState("play");
  openAudioPlayerPopup({mode:"full"});
  updateGridPlayIcons();
}

function setAudioBtnState(state){
  __AUDIO_PLAYER_STATUS=state;
  if(__AUDIO_PLAYER_BTN){
    __AUDIO_PLAYER_BTN.querySelector(".audio-btn-playpause").innerHTML=state==="play"
      ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    __AUDIO_PLAYER_BTN.querySelector(".label-audio").textContent=state==="play"?"Sedang Diputar":"Putar Audio Full";
  }
  updatePopupPlayPauseIcon();
  updatePopupStatus();
}

function playAyat(idx){
  if(!window.__AYAT_LIST||!window.__AYAT_LIST[idx])return;
  __AUDIO_MODE="ayat";
  __AYAT_LIST=window.__AYAT_LIST;
  __AYAT_INDEX=idx;
  let ayat=__AYAT_LIST[idx];

  let grid=document.getElementById('quran-grid');
  __AUDIO_META={
    ...__AUDIO_META,
    surat:grid?.dataset.surat||__AUDIO_META.surat||"",
    namaLatin:grid?.dataset.namalatin||__AUDIO_META.namaLatin||"",
    nama:grid?.dataset.namaarab||__AUDIO_META.nama||""
  };

  if(!__QURAN_AUDIO){
    __QURAN_AUDIO=new Audio();
    __QURAN_AUDIO.onended=handleAudioEnded;
    __QURAN_AUDIO.ontimeupdate=updateAudioProgress;
  }
  __QURAN_AUDIO.src=ayat.audioUrl;
  __QURAN_AUDIO.currentTime=0;
  __QURAN_AUDIO.play();
  setAudioBtnState("play");
  openAudioPlayerPopup({mode:"ayat",nomorAyat:idx+1,idx,totalAyat:__AYAT_LIST,audioUrl:ayat.audioUrl});

  updateGridPlayIcons();
  if(typeof window.handleAyatChange==="function")window.handleAyatChange(idx);
}

function updateGridPlayIcons(){
  let grid=document.getElementById('quran-grid');
  if(!grid)return;
  let btns=grid.querySelectorAll('.quran-grid-btn-play');
  btns.forEach((btn,i)=>{
    if(__AUDIO_MODE==="ayat"&&i===__AYAT_INDEX&&__QURAN_AUDIO&&!__QURAN_AUDIO.paused){
      btn.innerHTML=QuranSVG('pause');
      btn.classList.add('is-playing');
    }else{
      btn.innerHTML=QuranSVG('play');
      btn.classList.remove('is-playing');
    }
  });
}

function openAudioPlayerPopup(ctx={}){
  if(__AUDIO_PLAYER_POPUP){
    updateAudioPopupMode(ctx);
    updatePopupContent(ctx);
    return;
  }
  if(!__QURAN_AUDIO){
    __QURAN_AUDIO=new Audio();
    __QURAN_AUDIO.onended=handleAudioEnded;
    __QURAN_AUDIO.ontimeupdate=updateAudioProgress;
  }
  updateAudioPopupMode(ctx);

  __AUDIO_PLAYER_POPUP=document.createElement("div");
  __AUDIO_PLAYER_POPUP.className="popupAudio fade-in-up";
  buildAudioPopupHtml(ctx);
  document.body.appendChild(__AUDIO_PLAYER_POPUP);

  __AUDIO_PLAYER_POPUP.querySelector(".audio-btn-playpause").onclick=function(){
    if(__QURAN_AUDIO.paused){
      __QURAN_AUDIO.play();
      setAudioBtnState("play");
    }else{
      __QURAN_AUDIO.pause();
      setAudioBtnState("pause");
    }
    updateGridPlayIcons();
  };
  __AUDIO_PLAYER_POPUP.querySelector(".audio-btn-prev").onclick=async function(){
    if(__AUDIO_MODE==="full"){
      if(__SURAT_INDEX>0){
        await loadAudioMetaByIndex(__SURAT_INDEX-1);
        playFullSurat();
      }
    }else if(__AYAT_INDEX>0){
      playAyat(__AYAT_INDEX-1);
    }
  };
  __AUDIO_PLAYER_POPUP.querySelector(".audio-btn-next").onclick=async function(){
    if(__AUDIO_MODE==="full"){
      if(__SURAT_INDEX<__SURAT_LIST.length-1){
        await loadAudioMetaByIndex(__SURAT_INDEX+1);
        playFullSurat();
      }
    }else if(__AYAT_INDEX<(__AYAT_LIST.length-1)){
      playAyat(__AYAT_INDEX+1);
    }
  };
  __AUDIO_PLAYER_POPUP.querySelector(".audio-btn-close").onclick=function(){
    __AUDIO_PLAYER_POPUP.classList.remove("fade-in-up");
    __AUDIO_PLAYER_POPUP.classList.add("fade-out-bottom");
    setTimeout(()=>{ closeAudioPlayerPopup(); },430);
  };
  __AUDIO_PLAYER_POPUP.querySelector(".audio-progress-bar").oninput=function(e){
    let seek=parseFloat(e.target.value);
    if(__QURAN_AUDIO.duration)__QURAN_AUDIO.currentTime=seek/100*__QURAN_AUDIO.duration;
  };
}
function updateAudioPopupMode(ctx){
  if(ctx&&ctx.mode==="ayat"){
    __AUDIO_MODE="ayat";
    __AYAT_INDEX=ctx.idx ?? (ctx.nomorAyat?ctx.nomorAyat-1:0);
    __AYAT_LIST=ctx.totalAyat ?? __AYAT_LIST;
    if(ctx.audioUrl){
      __QURAN_AUDIO.src=ctx.audioUrl;
      __QURAN_AUDIO.play();
      setAudioBtnState("play");
    }
  }else{
    __AUDIO_MODE="full";
    if(__AUDIO_META.audioFull){
      __QURAN_AUDIO.src=__AUDIO_META.audioFull;
      __QURAN_AUDIO.play();
      setAudioBtnState("play");
    }
  }
}
function buildAudioPopupHtml(ctx){
  let namaSurat=__AUDIO_META.namaLatin||"",
      namaArab=__AUDIO_META.nama||"",
      nomor=(__AUDIO_MODE==="full"?(__AUDIO_META.surat?Number(__AUDIO_META.surat):""):(ctx&&ctx.nomorAyat?ctx.nomorAyat:(__AYAT_INDEX+1)));
  let status="Sedang diputar"+(__AUDIO_MODE==="ayat"&&nomor?`: Ayat ${nomor}`:"");
  __AUDIO_PLAYER_POPUP.innerHTML=`
    <div class="audioPlayerCard">
      <div class="audio-col1">
        <button class="audio-btn-playpause" title="Putar/Jeda"><i class="fa-solid fa-${__QURAN_AUDIO&&!__QURAN_AUDIO.paused?"pause":"play"}"></i></button>
      </div>
      <div class="audio-col2">
        <div class="audio-title">QS ${namaSurat}<span class="audio-arabic">(${namaArab})</span><span style="font-weight:500;font-size:.93em;margin-left:2px">${nomor?": "+nomor:""}</span></div>
        <div class="audio-status">${status}</div>
        <div class="audio-progress-group">
          <span class="audio-time audio-time-current">00:00</span>
          <input type="range" class="audio-progress-bar" min="0" max="100" value="0" step="0.01" />
          <span class="audio-time audio-time-total">00:00</span>
        </div>
      </div>
      <div class="audio-col3">
        <div class="audio-controls">
          <button class="audio-btn-prev" title="Sebelumnya"><i class="fa-solid fa-backward-step"></i></button>
          <button class="audio-btn-next" title="Berikutnya"><i class="fa-solid fa-forward-step"></i></button>
          <button class="audio-btn-close" title="Tutup"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
    </div>
  `;
}
function updatePopupPlayPauseIcon(){
  if(__AUDIO_PLAYER_POPUP){
    let ic=__QURAN_AUDIO&&!__QURAN_AUDIO.paused?'pause':'play';
    __AUDIO_PLAYER_POPUP.querySelector(".audio-btn-playpause").innerHTML=`<i class="fa-solid fa-${ic}"></i>`;
  }
}
function updatePopupStatus(){
  if(__AUDIO_PLAYER_POPUP){
    let modeTxt=__AUDIO_MODE==="full"?"":`: Ayat ${__AYAT_INDEX+1}`;
    __AUDIO_PLAYER_POPUP.querySelector(".audio-status").textContent="Sedang diputar"+modeTxt;
  }
}
function updatePopupContent(ctx){
  let namaSurat=__AUDIO_META.namaLatin||"",namaArab=__AUDIO_META.nama||"",
      nomor=(__AUDIO_MODE==="full"?(__AUDIO_META.surat?Number(__AUDIO_META.surat):""):(ctx&&ctx.nomorAyat?ctx.nomorAyat:(__AYAT_INDEX+1)));
  __AUDIO_PLAYER_POPUP.querySelector(".audio-title").innerHTML=
    `QS ${namaSurat} <span class="audio-arabic">(${namaArab})</span><span style="font-weight:500;font-size:.93em;margin-left:2px">${nomor?": "+nomor:""}</span>`;
  updatePopupPlayPauseIcon();
  updatePopupStatus();
}
function setAudioPlayerStatus(t){
  if(__AUDIO_PLAYER_POPUP)__AUDIO_PLAYER_POPUP.querySelector(".audio-status").textContent=t;
}
function closeAudioPlayerPopup(){
  if(__AUDIO_PLAYER_POPUP){
    document.body.removeChild(__AUDIO_PLAYER_POPUP);
    __AUDIO_PLAYER_POPUP=null;
    setAudioBtnState("pause");
    if(__QURAN_AUDIO)__QURAN_AUDIO.pause();
    __AUDIO_MODE="full";__AYAT_LIST=[];__AYAT_INDEX=0;
    updateGridPlayIcons();
  }
}
function handleAudioEnded(){
  if(__AUDIO_MODE==="ayat"){
    if(__AYAT_INDEX<__AYAT_LIST.length-1){
      playAyat(__AYAT_INDEX+1);
      return;
    }
  }
  setAudioBtnState("pause");
  if(__AUDIO_PLAYER_POPUP){
    updatePopupPlayPauseIcon();
    setAudioPlayerStatus("Audio Selesai");
  }
  updateGridPlayIcons();
}
function updateAudioProgress(){
  if(__AUDIO_PLAYER_POPUP){
    let t=__QURAN_AUDIO.currentTime||0,e=__QURAN_AUDIO.duration||0,a=toTime(t),o=toTime(e);
    __AUDIO_PLAYER_POPUP.querySelector(".audio-time-current").textContent=a;
    __AUDIO_PLAYER_POPUP.querySelector(".audio-time-total").textContent=o;
    if(e>0)__AUDIO_PLAYER_POPUP.querySelector(".audio-progress-bar").value=(t/e*100).toFixed(2);
    updatePopupPlayPauseIcon();
  }
}

window.playAyat=playAyat;

function QuranSVG(icon){
  const svg={
    play:`<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    pause:`<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/></svg>`,
    bookopen:`<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M16 12h2"/><path d="M16 8h2"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/><path d="M6 12h2"/><path d="M6 8h2"/></svg>`,
    share:`<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51 15.42 17.49"/><path d="M15.41 6.51 8.59 10.49"/></svg>`,
    close:`<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
  };
  return svg[icon]||"";
}
let __QG_TAFSIR_MAP={};
async function getTafsirPerAyat(nomorSurat){
  if(__QG_TAFSIR_MAP[nomorSurat])return __QG_TAFSIR_MAP[nomorSurat];
  let url=wpEquran.pluginUrl + '/tafsir/' + pad3(nomorSurat) + '.json';
  try{
    let res=await fetch(url);
    let json=await res.json();
    let map={};
    (json.data?.tafsir||json.tafsir||[]).forEach(i=>map[i.ayat]=i.teks||i.tafsir);
    __QG_TAFSIR_MAP[nomorSurat]=map;
    return map;
  }catch{__QG_TAFSIR_MAP[nomorSurat]={};return{};}
}
function scrollToAyat(grid,idx){
  let box=grid.querySelector(`.quran-grid-card[data-idx="${idx}"]`);
  if(box)box.scrollIntoView({behavior:'smooth',block:'center'});
}
function clearGridActiveAyat(container){
  container.querySelectorAll('.quran-grid-card').forEach(card=>{
    card.classList.remove('aktifAyat');
  });
}
function renderQuranGrid(container,nomorSurat,namaLatin,namaArab,ayatList,tafsirMap){
  container.setAttribute('data-surat',nomorSurat);
  container.setAttribute('data-namalatin',namaLatin);
  container.setAttribute('data-namaarab',namaArab);

  let audioAyatList=ayatList.map((a,idx)=>({
    id:a.nomorAyat||a.nomor||(idx+1),
    audioUrl:a.audio?.['05']||a.audio?.[5]||"",
    teksArab:a.teksArab||a.ar||"",
    idx
  }));
  window.__AYAT_LIST=audioAyatList;

  container.innerHTML=ayatList.map((a,idx)=>`
    <div class="quran-grid-card" data-idx="${idx}">
      <span class="quran-grid-nomorAyat">${nomorSurat} : ${a.nomorAyat||a.nomor}</span>
      <div class="quran-grid-aksiAyat">
        <button class="quran-grid-btn-play" data-idx="${idx}">${QuranSVG('play')}</button>
        <button class="quran-grid-btn-tafsir" data-idx="${idx}">${QuranSVG('bookopen')}</button>
        <button class="quran-grid-btn-share" data-idx="${idx}">${QuranSVG('share')}</button>
      </div>
      <div class="quran-grid-kontenAyat">
        <span class="font-arabic quran-grid-teksArab" id="quran-grid-arabic-ayat-${idx}" dir="rtl">
          ${a.teksArab||a.ar||''}
          <span class="quran-grid-arab-marker">
            <span class="quran-grid-arab-num">${String(a.nomorAyat||a.nomor).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])}</span>
          </span>
        </span>
        <div class="quran-grid-teksLatinAyat">${a.teksLatin||a.tr||''}</div>
        <div class="quran-grid-teksIndonesia">${a.teksIndonesia||a.idn||''}</div>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.quran-grid-btn-play').forEach((btn,idx)=>{
    btn.onclick=function(){
      if(!window.__AYAT_LIST||!window.__AYAT_LIST[idx]||!window.__AYAT_LIST[idx].audioUrl){
        alert("Audio ayat tidak tersedia");
        return;
      }
      if(typeof window.playAyat==="function"){
        window.playAyat(idx);
      }else{
        alert("Audio Player tidak siap.");
      }
    };
  });
  container.querySelectorAll('.quran-grid-btn-share').forEach((btn,idx)=>{
    btn.onclick=()=>{
      let ayat=ayatList[idx];
      let shareText=`QS ${namaLatin} (${namaArab}) : ${ayat.nomorAyat||ayat.nomor}\n${ayat.teksArab||''}\n${ayat.teksIndonesia||''}\n${location.href}`;
      if(navigator.share)navigator.share({title:`QS ${namaLatin}`,text:shareText});
      else{navigator.clipboard.writeText(shareText);alert("Teks ayat sudah disalin.");}
    };
  });
  container.querySelectorAll('.quran-grid-btn-tafsir').forEach((btn,idx)=>{
    btn.onclick=()=>{
      let ayatNum=(ayatList[idx].nomorAyat||ayatList[idx].nomor||(idx+1));
      let tafsirText=tafsirMap&&tafsirMap[ayatNum]?tafsirMap[ayatNum]:'Tafsir ayat ini belum tersedia.';
      openQGTafsirPopup(tafsirText);
    };
  });
}
function openQGTafsirPopup(tafsir){
  let popupBg=document.createElement('div');
  popupBg.className='qg-tafsir-popup';
  popupBg.innerHTML=`<div class="qg-tafsir"><button class="qg-close-tafsir" title="Tutup">${QuranSVG('close')}</button><div class="qg-isi-tafsir">${tafsir}</div></div>`;
  document.body.appendChild(popupBg);
  popupBg.querySelector('.qg-close-tafsir').onclick=()=>document.body.removeChild(popupBg);
  popupBg.onclick=e=>{if(e.target===popupBg)document.body.removeChild(popupBg);};
}
window.handleAyatChange=function(idx){
  let grid=document.getElementById('quran-grid');
  if(!grid)return;
  clearGridActiveAyat(grid);
  let card=grid.querySelector(`.quran-grid-card[data-idx="${idx}"]`);
  if(card){
    card.classList.add('aktifAyat');
    scrollToAyat(grid,idx);
  }
};
document.addEventListener('DOMContentLoaded',async function(){
  injectAudioFullBtn();
  let grid=document.getElementById('quran-grid');
  if(!grid)return;
  let nomorSurat=parseInt(grid.dataset.surat||"1",10);
  try{
    let url=wpEquran.pluginUrl + '/json/' + pad3(nomorSurat) + '.json';
    let r=await fetch(url); let res=await r.json();
    let ayatList=res.data?.ayat||[];
    let namaLatin=res.data?.namaLatin||'';
    let namaArab=res.data?.nama||'';
    if(!Array.isArray(ayatList)||!ayatList.length)throw"Data ayat kosong";
    let tafsirMap=await getTafsirPerAyat(nomorSurat);
    renderQuranGrid(grid,nomorSurat,namaLatin,namaArab,ayatList,tafsirMap);
  }catch{grid.innerHTML='<div>Gagal memuat data ayat.</div>';}
});
})();
