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
    $base  = plugin_dir_url(__FILE__);
    $style = __DIR__ . '/assets/style.css';
    $script = __DIR__ . '/assets/script.js';

    wp_enqueue_style(
        'wpequran-style',
        $base . 'assets/style.css',
        array(),
        filemtime($style)
    );

    wp_enqueue_script(
        'wpequran-script',
        $base . 'assets/script.js',
        array(),
        filemtime($script),
        true
    );

    wp_localize_script(
        'wpequran-script',
        'wpEquran',
        array('pluginUrl' => untrailingslashit(plugins_url('', __FILE__)))
    );
}
add_action('wp_enqueue_scripts', 'wpequran_enqueue_assets');

function wpequran_shortcode() {
    ob_start();
    ?>
    <div id="wp-equran-app">
        <select id="wp-equran-surah"></select>
        <div id="wp-equran-content"></div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('equran', 'wpequran_shortcode');
?>
