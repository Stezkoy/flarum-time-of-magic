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
        ->serializeToForum('stezkoyTimeOfMagicProgressBar', 'stezkoy-time-of-magic.progress_bar', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('stezkoyTimeOfMagicBackToTop', 'stezkoy-time-of-magic.back_to_top', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('stezkoyTimeOfMagicBackToTopRounded', 'stezkoy-time-of-magic.back_to_top_rounded', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('stezkoyTimeOfMagicBackToTopIcon', 'stezkoy-time-of-magic.back_to_top_icon')
        ->serializeToForum('stezkoyTimeOfMagicSnow', 'stezkoy-time-of-magic.snow', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('stezkoyTimeOfMagicSnowDensity', 'stezkoy-time-of-magic.snow_density')
        ->serializeToForum('stezkoyTimeOfMagicScrollbar', 'stezkoy-time-of-magic.scrollbar', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('stezkoyTimeOfMagicSwapLayout', 'stezkoy-time-of-magic.swap_layout', function ($value) {
            return (bool) $value;
        })
        ->serializeToForum('stezkoyTimeOfMagicBackground', 'stezkoy-time-of-magic.background')
        ->default('stezkoy-time-of-magic.progress_bar', false)
        ->default('stezkoy-time-of-magic.back_to_top', false)
        ->default('stezkoy-time-of-magic.back_to_top_rounded', false)
        ->default('stezkoy-time-of-magic.back_to_top_icon', 'fa-solid fa-arrow-up')
        ->default('stezkoy-time-of-magic.snow', false)
        ->default('stezkoy-time-of-magic.snow_density', 'medium')
        ->default('stezkoy-time-of-magic.scrollbar', false)
        ->default('stezkoy-time-of-magic.swap_layout', false)
        ->default('stezkoy-time-of-magic.background', ''),

    (new Extend\Locales(__DIR__.'/locale')),
];
