<?php
/*
Plugin Name: WP eQuran
Description: Quran digital plugin.
Version: 1.0.0
*/

function wpequran_enqueue(){
    wp_enqueue_style('wpequran-style', plugins_url('assets/style.css', __FILE__));
    wp_enqueue_script('wpequran-script', plugins_url('assets/script.js', __FILE__), array(), false, true);
    wp_localize_script('wpequran-script', 'wpEquran', array('pluginUrl'=>plugins_url('', __FILE__)));
}
add_action('wp_enqueue_scripts','wpequran_enqueue');

function wpequran_shortcode(){
    return '<div id="wp-equran-app"><select id="wp-equran-surah"></select><div id="wp-equran-content"></div></div>';
}
add_shortcode('equran','wpequran_shortcode');
?>
