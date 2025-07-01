<?php
/*
Plugin Name: WP eQuran
Plugin URI: https://equran.my.id
Description: Simple digital Quran plugin with built‑in dataset.
Author: Kresuber Digital
Version: 1.0.0
License: MIT
*/

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
        array('pluginUrl' => rtrim($base, '/'))
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
?>
