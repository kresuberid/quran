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
$plugin_dir = dirname(__DIR__);
$file = $plugin_dir . '/json/' . $id . '.json';
$data = array();
if(file_exists($file)){
    $json = json_decode(file_get_contents($file), true);
    if($json && isset($json['data'])){
        $data = $json['data'];
    }
}
get_header();
$audio = '';
if(!empty($data['audioFull']) && is_array($data['audioFull'])){
    $audio = reset($data['audioFull']);
}
?>
<div class="wp-equran-surah-header">
  <div>
    <h1><?php echo esc_html($data['namaLatin']); ?></h1>
    <p><?php echo esc_html($data['arti']); ?> - <?php echo esc_html($data['jumlahAyat']); ?> <?php esc_html_e('verses','wp-equran'); ?></p>
    <?php if($audio): ?>
    <button id="wp-equran-play" class="wp-equran-audio-btn">
      <img src="<?php echo esc_url(plugins_url('icon/play.svg', dirname(__DIR__).'/wp-equran.php')); ?>" alt="<?php esc_attr_e('Play','wp-equran'); ?>">
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
<?php
wp_add_inline_script('wpequran-script', 'wpEquran.defaultSurah="'.$id.'";wpEquran.defaultSurahSlug="'.$slug.'";', 'after');
wp_add_inline_script('wpequran-script', "document.addEventListener('DOMContentLoaded',function(){var btn=document.getElementById('wp-equran-play');if(!btn)return;var img=btn.querySelector('img');var audio=document.getElementById('wp-equran-audio');btn.addEventListener('click',function(){if(audio.paused){audio.play();img.src=wpEquran.pluginUrl+'/icon/pause.svg';}else{audio.pause();img.src=wpEquran.pluginUrl+'/icon/play.svg';}});audio.addEventListener('ended',function(){img.src=wpEquran.pluginUrl+'/icon/play.svg';});});", 'after');
get_footer();
