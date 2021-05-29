const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js("resources/js/jquery.js", "public/js")
    .js("resources/js/autotimize.js", "public/js")
    .js("resources/js/common.js", "public/js")

.postCss("resources/css/app.css", "public/css")
    .postCss("resources/css/common.css", "public/css")
    .postCss("resources/css/autotimize.css", "public/css")
    .postCss("resources/css/air.css", "public/css")


mix.copy("resources/css/bootstrap.min.css", "public/css");
mix.copy("resources/css/owl.carousel.min.css", "public/css");
mix.copy("resources/css/swiper.min.css", "public/css");
mix.copy("resources/js/jquery-migrate.min.js", "public/js");
mix.copy("resources/js/owl.carousel.min.js", "public/js");
mix.copy("resources/js/swiper.min.js", "public/js");
mix.copy("resources/js/jquery.marquee.min.js", "public/js");


if (mix.inProduction()) {
    mix.version();
}