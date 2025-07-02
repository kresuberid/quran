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
?>
<div class="wp-equran-surah-header">
  <div>
    <h1><?php echo esc_html($data['namaLatin']); ?></h1>
    <p><?php echo esc_html($data['arti']); ?> - <?php echo esc_html($data['jumlahAyat']); ?> <?php esc_html_e('verses','wp-equran'); ?></p>
  </div>
  <div class="arabic">
    <h2><?php echo esc_html($data['nama']); ?></h2>
  </div>
</div>
<div id="audio-full" data-surat="<?php echo esc_attr(intval($data['nomor'])); ?>"></div>
<div id="quran-grid" data-surat="<?php echo esc_attr(intval($data['nomor'])); ?>" data-namalatin="<?php echo esc_attr($data['namaLatin']); ?>" data-namaarab="<?php echo esc_attr($data['nama']); ?>"></div>
<?php
get_footer();
