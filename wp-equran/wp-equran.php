<?php
/*
Plugin Name: WP eQuran
Plugin URI: https://equran.my.id
Description: WP eQuran adalah plugin Al‑Qur'an digital Indonesia ... tafsir lengkap per ayat.
Author: Febri Suryanto
Author URI: https://equran.my.id
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

function wpequran_register_surah_post_type(){
    $labels = array(
        'name'               => __('Al-Qur\'an','wp-equran'),
        'singular_name'      => __('Surat','wp-equran'),
        'add_new'            => __('Add New','wp-equran'),
        'add_new_item'       => __('Add New Surat','wp-equran'),
        'edit_item'          => __('Edit Surat','wp-equran'),
        'new_item'           => __('New Surat','wp-equran'),
        'view_item'          => __('View Surat','wp-equran'),
        'search_items'       => __('Search Surat','wp-equran'),
        'not_found'          => __('No Surat found','wp-equran'),
        'not_found_in_trash' => __('No Surat found in Trash','wp-equran'),
        'all_items'          => __('All Surat','wp-equran'),
        'menu_name'          => __('Al-Qur\'an','wp-equran'),
    );
    $args = array(
        'labels'       => $labels,
        'public'       => true,
        'rewrite'      => array('slug' => 'surat', 'with_front' => false),
        'supports'     => array('title','custom-fields'),
        'show_in_rest' => true,
    );
    register_post_type('surat',$args);
}
add_action('init','wpequran_register_surah_post_type');

function wpequran_register_surah_meta(){
    $fields = array('nomor','nama','namaLatin','jumlahAyat','tempatTurun','arti','deskripsi','audioFull','quran-grid','musaf-surat');
    foreach($fields as $key){
        register_meta('post',$key,array(
            'object_subtype'  => 'surat',
            'type'            => 'string',
            'single'          => true,
            'show_in_rest'    => true,
            'sanitize_callback' => 'sanitize_text_field',
        ));
    }
}
add_action('init','wpequran_register_surah_meta');

function wpequran_surah_meta_box($post){
    wp_nonce_field('wpequran_surah_save','wpequran_surah_nonce');
    $fields = array(
        'nomor'       => __('Nomor','wp-equran'),
        'nama'        => __('Nama Arab','wp-equran'),
        'namaLatin'   => __('Nama Latin','wp-equran'),
        'jumlahAyat'  => __('Jumlah Ayat','wp-equran'),
        'tempatTurun' => __('Tempat Turun','wp-equran'),
        'arti'        => __('Arti','wp-equran'),
        'deskripsi'   => __('Deskripsi','wp-equran'),
        'audioFull'   => __('Audio Full URL','wp-equran'),
        'quran-grid'  => __('Grid ID','wp-equran'),
        'musaf-surat' => __('Musaf Surat','wp-equran'),
    );
    echo '<table class="form-table">';
    foreach($fields as $key => $label){
        $val = get_post_meta($post->ID,$key,true);
        echo '<tr><th><label for="'.$key.'">'.$label.'</label></th><td>';
        if($key==='deskripsi'){
            echo '<textarea name="'.$key.'" id="'.$key.'" rows="4" style="width:100%">'.esc_textarea($val).'</textarea>';
        }else{
            echo '<input type="text" class="widefat" name="'.$key.'" id="'.$key.'" value="'.esc_attr($val).'">';
        }
        echo '</td></tr>';
    }
    echo '</table>';
}

function wpequran_add_surah_meta_box(){
    add_meta_box('wpequran-surah-meta',__('Surat Details','wp-equran'),'wpequran_surah_meta_box','surat');
}
add_action('add_meta_boxes','wpequran_add_surah_meta_box');

function wpequran_save_surah_meta($post_id){
    if(!isset($_POST['wpequran_surah_nonce']) || !wp_verify_nonce($_POST['wpequran_surah_nonce'],'wpequran_surah_save')) return;
    if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if('surat' !== get_post_type($post_id)) return;
    $fields = array('nomor','nama','namaLatin','jumlahAyat','tempatTurun','arti','deskripsi','audioFull','quran-grid','musaf-surat');
    foreach($fields as $field){
        if(isset($_POST[$field])){
            update_post_meta($post_id,$field,sanitize_text_field($_POST[$field]));
        }else{
            delete_post_meta($post_id,$field);
        }
    }
}
add_action('save_post','wpequran_save_surah_meta');

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

function wpequran_import_page(){
    echo '<div class="wrap">';
    echo '<h1>' . esc_html__("Isi Otomatis 114 Surat", "wp-equran") . '</h1>';
    if (isset($_GET['imported'])) {
        $count = intval($_GET['imported']);
        echo '<div class="notice notice-success"><p>' . sprintf(esc_html__('%d surat berhasil diproses.', 'wp-equran'), $count) . '</p></div>';
    }
    echo '<form method="post" action="' . esc_url(admin_url('admin-post.php')) . '">';
    wp_nonce_field('wpequran_import_surah', 'wpequran_import_nonce');
    echo '<input type="hidden" name="action" value="wpequran_import_surah">';
    submit_button(esc_html__('Jalankan Import', 'wp-equran'));
    echo '</form>';
    echo '</div>';
}

function wpequran_register_admin_page(){
    add_submenu_page(
        'edit.php?post_type=surat',
        __("Isi Otomatis 114 Surat", "wp-equran"),
        __("Isi Otomatis 114 Surat", "wp-equran"),
        'manage_options',
        'wpequran-import',
        'wpequran_import_page'
    );
}
add_action('admin_menu', 'wpequran_register_admin_page');

function wpequran_handle_import(){
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have permission.', 'wp-equran'));
    }
    check_admin_referer('wpequran_import_surah', 'wpequran_import_nonce');

    $dir   = plugin_dir_path(__FILE__) . 'json/';
    $files = glob($dir . '[0-9][0-9][0-9].json');
    $count = 0;

    foreach ($files as $file) {
        $json = json_decode(file_get_contents($file), true);
        if (!$json || !isset($json['data'])) continue;
        $d    = $json['data'];
        $slug = sanitize_title($d['namaLatin']);
        $post = get_page_by_path($slug, OBJECT, 'surat');

        if ($post) {
            $post_id = $post->ID;
            wp_update_post(array(
                'ID'         => $post_id,
                'post_title' => $d['namaLatin'],
                'post_status'=> 'publish'
            ));
        } else {
            $post_id = wp_insert_post(array(
                'post_type'  => 'surat',
                'post_status'=> 'publish',
                'post_title' => $d['namaLatin'],
                'post_name'  => $slug
            ));
        }

        if ($post_id) {
            update_post_meta($post_id, 'nomor', $d['nomor']);
            update_post_meta($post_id, 'nama', $d['nama']);
            update_post_meta($post_id, 'namaLatin', $d['namaLatin']);
            update_post_meta($post_id, 'jumlahAyat', $d['jumlahAyat']);
            update_post_meta($post_id, 'tempatTurun', $d['tempatTurun']);
            update_post_meta($post_id, 'arti', $d['arti']);
            update_post_meta($post_id, 'deskripsi', $d['deskripsi']);
            $audio = '';
            if (!empty($d['audioFull']) && is_array($d['audioFull'])) {
                $audio = reset($d['audioFull']);
            }
            update_post_meta($post_id, 'audioFull', $audio);
            $count++;
        }
    }

    $redirect = add_query_arg('imported', $count, admin_url('edit.php?post_type=surat&page=wpequran-import'));
    wp_redirect($redirect);
    exit;
}
add_action('admin_post_wpequran_import_surah', 'wpequran_handle_import');

function wpequran_template_include($template){
    if(is_singular('surat')){
        $tpl = plugin_dir_path(__FILE__) . 'templates/surah.php';
        if(file_exists($tpl)) return $tpl;
    }
    return $template;
}
add_filter('template_include','wpequran_template_include');

function wpequran_activate(){
    wpequran_register_surah_post_type();
    flush_rewrite_rules();
}
register_activation_hook(__FILE__,'wpequran_activate');

function wpequran_deactivate(){
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__,'wpequran_deactivate');
?>
