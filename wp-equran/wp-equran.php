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
?>
