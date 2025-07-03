<?php
$slug = get_query_var('equran_surah');
$map  = wpequran_get_surah_map();
$id   = isset($map[$slug]) ? $map[$slug] : '';
if(!$id){
    status_header(404);
    nocache_headers();
    include get_query_template('404');
    return;
}
$data = array();
$response = wp_remote_get('https://equran.id/api/v2/surat/' . $id);
if(!is_wp_error($response)){
    $json = json_decode(wp_remote_retrieve_body($response), true);
    if($json && isset($json['data'])){
        $data = $json['data'];
    }
}
if(empty($data)){
    $plugin_dir = dirname(__DIR__);
    $file = $plugin_dir . '/surat/' . $id . '.json';
    if(file_exists($file)){
        $json = json_decode(file_get_contents($file), true);
        if($json && isset($json['data'])){
            $data = $json['data'];
        }
    }
}
get_header();
$audio = '';
if(!empty($data['audioFull']) && is_array($data['audioFull'])){
    $audio = reset($data['audioFull']);
}
?>
<div class="wp-equran-tabs">
  <button type="button" class="wp-equran-tab-link active" data-target="#tab-trans"><?php esc_html_e('Terjemahan','wp-equran'); ?></button>
  <button type="button" class="wp-equran-tab-link" data-target="#tab-mushaf"><?php esc_html_e('Mushaf','wp-equran'); ?></button>
</div>
<div id="tab-trans" class="wp-equran-tab-content active">
<div class="wp-equran-surah-header">
  <div>
    <h1><?php echo esc_html($data['namaLatin']); ?></h1>
    <p><?php echo esc_html($data['arti']); ?> - <?php echo esc_html($data['jumlahAyat']); ?> <?php esc_html_e('verses','wp-equran'); ?></p>
    <?php if($audio): ?>
    <button id="wp-equran-play" class="wp-equran-audio-btn">
      <i class="fa-solid fa-play"></i>
    </button>
    <audio id="wp-equran-audio" src="<?php echo esc_url($audio); ?>"></audio>
    <?php endif; ?>
  </div>
  <div class="arabic">
    <h2><?php echo esc_html($data['nama']); ?></h2>
  </div>
</div>
<div id="wp-equran-app">
  <select id="wp-equran-surah"></select>
  <div id="wp-equran-content"></div>
</div>
</div>
<div id="tab-mushaf" class="wp-equran-tab-content">
  <?php $musaf = get_post_meta(get_the_ID(),'musaf-surat',true); if($musaf){ ?>
    <img src="<?php echo esc_url($musaf); ?>" alt="<?php echo esc_attr($data['namaLatin']); ?>" style="width:100%;height:auto;" />
  <?php } else { ?>
    <p><?php esc_html_e('Belum tersedia','wp-equran'); ?></p>
  <?php } ?>
</div>
<?php
wp_add_inline_script('wpequran-script', 'wpEquran.defaultSurah="'.$id.'";wpEquran.defaultSurahSlug="'.$slug.'";', 'after');
wp_add_inline_script('wpequran-script', "document.addEventListener('DOMContentLoaded',function(){var btn=document.getElementById('wp-equran-play');if(btn){var ic=btn.querySelector('i');var audio=document.getElementById('wp-equran-audio');btn.addEventListener('click',function(){if(audio.paused){audio.play();ic.className='fa-solid fa-pause';}else{audio.pause();ic.className='fa-solid fa-play';}});audio.addEventListener('ended',function(){ic.className='fa-solid fa-play';});}document.querySelectorAll('.wp-equran-tab-link').forEach(function(b){b.addEventListener('click',function(){document.querySelectorAll('.wp-equran-tab-link').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.wp-equran-tab-content').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.querySelector(b.dataset.target).classList.add('active');});});});", 'after');
get_footer();
