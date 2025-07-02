<?php
/*
Plugin Name: WP eQuran
Plugin URI: https://equran.my.id
Description: Simple digital Quran plugin with built‑in dataset.
Author: Kresuber Digital
Version: 1.0.0
License: MIT
Text Domain: wp-equran
Domain Path: /languages
*/

function wpequran_load_textdomain() {
    load_plugin_textdomain('wp-equran', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'wpequran_load_textdomain');

function wpequran_preload_assets() {
    ?>
    <!-- Preconnect & Prefetch CDN Font & Icon -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn-uicons.flaticon.com">

    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link rel="dns-prefetch" href="https://cdn-uicons.flaticon.com">

    <!-- Preload Fonts (gabungan) -->
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Roboto+Mono:wght@500&family=Inter:wght@400;600&family=Amiri:wght@400;700&family=Noto+Sans+Arabic:wght@400;700&display=swap" onload="this.rel='stylesheet'">
    <noscript>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Roboto+Mono:wght@500&family=Inter:wght@400;600&family=Amiri:wght@400;700&family=Noto+Sans+Arabic:wght@400;700&display=swap">
    </noscript>

    <!-- Preload Critical Icon CSS -->
    <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"></noscript>
    <link rel="preload" as="style" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css" onload="this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-regular-rounded/css/uicons-regular-rounded.css"></noscript>

    <!-- Load other icon sets as usual -->
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-solid-rounded/css/uicons-solid-rounded.css">
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-bold-rounded/css/uicons-bold-rounded.css">
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-thin-rounded/css/uicons-thin-rounded.css">
    <link rel="stylesheet" href="https://cdn-uicons.flaticon.com/uicons-curved-rounded/css/uicons-curved-rounded.css">

    <!-- Font-face lokal & styling tetap sama -->
    <style>
    @font-face {
      font-family: 'LPMQ-IsepMisbah';
      src: url('https://equran.my.id/fonts/LPMQIsepMisbah.woff2') format('woff2'),
           url('https://equran.my.id/fonts/LPMQIsepMisbah.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
      unicode-range: U+0600-06FF, U+0750-077F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF;
    }
    .font-arabic,
    .arabic,
    .quran-arab,
    [lang="ar"] {
      font-family: 'LPMQ-IsepMisbah', 'Amiri', 'Traditional Arabic', serif !important;
      letter-spacing: 0;
      direction: rtl;
      font-feature-settings: "calt";
      font-size: 2rem;
      font-weight: normal;
      line-height: 1.85;
    }
    </style>
    <?php
}
add_action('wp_head', 'wpequran_preload_assets');

function wpequran_enqueue_assets() {
    $base = plugin_dir_url(__FILE__);
    wp_enqueue_style(
        'wpequran-style',
        $base . 'assets/style.css',
        array(),
        filemtime(__DIR__ . '/assets/style.css')
    );
    wp_enqueue_script(
        'wpequran-script',
        $base . 'assets/script.js',
        array(),
        filemtime(__DIR__ . '/assets/script.js'),
        true
    );
    wp_localize_script(
        'wpequran-script',
        'wpEquran',
        array(
            'pluginUrl' => rtrim($base, '/'),
            'play'      => __('Play', 'wp-equran'),
            'pause'     => __('Pause', 'wp-equran'),
            'tafsir'    => __('Tafsir', 'wp-equran'),
            'share'     => __('Share', 'wp-equran'),
            'surahBase' => home_url('/surat/'),
            'defaultSurah' => '',
            'defaultSurahSlug' => '',
        )
    );
}
add_action('wp_enqueue_scripts', 'wpequran_enqueue_assets');

function wpequran_shortcode() {
    $html  = '<div id="wp-equran-app">';
    $html .= '<select id="wp-equran-surah"></select>';
    $html .= '<div id="wp-equran-content"></div>';
    $html .= '</div>';
    return $html;
}
add_shortcode('equran','wpequran_shortcode');

function wpequran_husna_shortcode(){
    $file = plugin_dir_path(__FILE__) . 'husna/99.json';
    if (!file_exists($file)) return '';
    $data = json_decode(file_get_contents($file), true);
    if (!$data) return '';
    $html = '<ol class="wp-equran-husna">';
    foreach ($data as $item) {
        $arab  = esc_html($item['arab']);
        $latin = esc_html($item['latin']);
        $arti  = esc_html($item['arti']);
        $html .= '<li><strong>'. $arab .'</strong><em>'. $latin .'</em><span>'. $arti .'</span></li>';
    }
    $html .= '</ol>';
    return $html;
}
add_shortcode('equran_husna','wpequran_husna_shortcode');

function wpequran_doa_shortcode(){
    $file = plugin_dir_path(__FILE__) . 'doa/doa.json';
    if (!file_exists($file)) return '';
    $data = json_decode(file_get_contents($file), true);
    if (!$data) return '';
    $groups = array();
    foreach ($data as $item) {
        $groups[$item['grup']][] = $item;
    }
    $html = '<div class="wp-equran-doa">';
    foreach ($groups as $name => $items) {
        $html .= '<h3>'. esc_html($name) .'</h3><ol>';
        foreach ($items as $d) {
            $html .= '<li><strong>'. esc_html($d['nama']) .'</strong>';
            $html .= '<span class="arab">'. esc_html($d['ar']) .'</span>';
            $html .= '<em>'. esc_html($d['idn']) .'</em></li>';
        }
        $html .= '</ol>';
    }
    $html .= '</div>';
    return $html;
}
add_shortcode('equran_doa','wpequran_doa_shortcode');

function wpequran_get_surah_map(){
    static $map = null;
    if ($map !== null) return $map;
    $file = plugin_dir_path(__FILE__) . 'surah-list.json';
    if (!file_exists($file)) return array();
    $list = json_decode(file_get_contents($file), true);
    $map = array();
    foreach ($list as $row) {
        $slug = sanitize_title($row['namaLatin']);
        $map[$slug] = str_pad($row['nomor'], 3, '0', STR_PAD_LEFT);
    }
    return $map;
}

function wpequran_add_rewrite_rule(){
    add_rewrite_rule('^surat/([^/]+)/?$', 'index.php?equran_surah=$matches[1]', 'top');
}
add_action('init','wpequran_add_rewrite_rule');

function wpequran_add_query_var($vars){
    $vars[] = 'equran_surah';
    return $vars;
}
add_filter('query_vars','wpequran_add_query_var');

function wpequran_template_include($template){
    if(get_query_var('equran_surah')){
        $tpl = plugin_dir_path(__FILE__) . 'templates/surah.php';
        if(file_exists($tpl)) return $tpl;
    }
    return $template;
}
add_filter('template_include','wpequran_template_include');

function wpequran_activate(){
    wpequran_add_rewrite_rule();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__,'wpequran_activate');

function wpequran_deactivate(){
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__,'wpequran_deactivate');
?>
