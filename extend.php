<?php

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    (new Extend\Settings)
        ->serializeToForum('timeOfMagicProgressBar', 'stezkoy-time-of-magic.progress_bar', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicBackToTop', 'stezkoy-time-of-magic.back_to_top', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicBackToTopRounded', 'stezkoy-time-of-magic.back_to_top_rounded', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicBackToTopIcon', 'stezkoy-time-of-magic.back_to_top_icon')
        ->serializeToForum('timeOfMagicSnow', 'stezkoy-time-of-magic.snow', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicSnowDensity', 'stezkoy-time-of-magic.snow_density')
        ->serializeToForum('timeOfMagicScrollbar', 'stezkoy-time-of-magic.scrollbar', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicSwapLayout', 'stezkoy-time-of-magic.swap_layout', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicBackground', 'stezkoy-time-of-magic.background')
        ->serializeToForum('timeOfMagicProgressBarColor', 'stezkoy-time-of-magic.progress_bar_color')
        ->serializeToForum('timeOfMagicBackToTopColor', 'stezkoy-time-of-magic.back_to_top_color')
        ->serializeToForum('timeOfMagicScrollbarColor', 'stezkoy-time-of-magic.scrollbar_color')
        ->serializeToForum('timeOfMagicClickSpark', 'stezkoy-time-of-magic.click_spark', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicClickSparkColor', 'stezkoy-time-of-magic.click_spark_color')
        ->serializeToForum('timeOfMagicLeaves', 'stezkoy-time-of-magic.leaves', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicLeavesDensity', 'stezkoy-time-of-magic.leaves_density')
        ->serializeToForum('timeOfMagicRain', 'stezkoy-time-of-magic.rain', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('timeOfMagicRainDensity', 'stezkoy-time-of-magic.rain_density')
        ->default('stezkoy-time-of-magic.progress_bar', false)
        ->default('stezkoy-time-of-magic.progress_bar_color', '')
        ->default('stezkoy-time-of-magic.back_to_top', false)
        ->default('stezkoy-time-of-magic.back_to_top_rounded', false)
        ->default('stezkoy-time-of-magic.back_to_top_icon', 'fa-solid fa-arrow-up')
        ->default('stezkoy-time-of-magic.back_to_top_color', '')
        ->default('stezkoy-time-of-magic.snow', false)
        ->default('stezkoy-time-of-magic.snow_density', 'medium')
        ->default('stezkoy-time-of-magic.scrollbar', false)
        ->default('stezkoy-time-of-magic.scrollbar_color', '')
        ->default('stezkoy-time-of-magic.swap_layout', false)
        ->default('stezkoy-time-of-magic.background', '')
        ->default('stezkoy-time-of-magic.click_spark', false)
        ->default('stezkoy-time-of-magic.click_spark_color', '')
        ->default('stezkoy-time-of-magic.leaves', false)
        ->default('stezkoy-time-of-magic.leaves_density', 'medium')
        ->default('stezkoy-time-of-magic.rain', false)
        ->default('stezkoy-time-of-magic.rain_density', 'medium'),

    (new Extend\Locales(__DIR__.'/locale')),
];
