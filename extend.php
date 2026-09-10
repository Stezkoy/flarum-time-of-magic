<?php

use Flarum\Extend;

$prefix = 'stezkoy-time-of-magic';

$attributeName = function (string $key): string {
    return 'timeOfMagic' . str_replace(' ', '', ucwords(str_replace('_', ' ', $key)));
};

$boolKeys = [
    'allow_user_disable',
    'progress_bar',
    'back_to_top',
    'back_to_top_rounded',
    'snow',
    'scrollbar',
    'swap_layout',
    'click_spark',
];

$effectKeys = [
    'snow',
    'leaves',
    'rain',
    'petals',
    'confetti',
    'hearts',
    'clovers',
    'eggs',
    'lanterns',
    'fireflies',
];

$jsonKeys = ['schedules', 'custom_up', 'custom_down'];

$defaultMap = [
    'schedules' => '[]',
    'custom_up' => '[]',
    'custom_down' => '[]',
    'back_to_top_icon' => 'fa-solid fa-arrow-up',
    'allow_user_disable' => true,
];

$settings = (new Extend\Settings);

foreach (array_merge($boolKeys, $effectKeys) as $key) {
    $settings->serializeToForum($attributeName($key), "$prefix.$key", 'boolval');
}

foreach (['back_to_top_icon', 'background', 'progress_bar_color', 'back_to_top_color', 'back_to_top_icon_color', 'scrollbar_color', 'click_spark_color'] as $key) {
    $settings->serializeToForum($attributeName($key), "$prefix.$key");
}

foreach ($effectKeys as $effect) {
    $settings->serializeToForum($attributeName("{$effect}_density"), "$prefix.{$effect}_density");
}

foreach ($jsonKeys as $key) {
    $settings->serializeToForum($attributeName($key), "$prefix.$key", function ($value) {
        if (is_array($value)) {
            return $value;
        }

        $decoded = json_decode((string) $value, true);

        return is_array($decoded) ? $decoded : [];
    });
}

foreach (array_merge($boolKeys, $effectKeys, ['background', 'back_to_top_icon', 'progress_bar_color', 'back_to_top_color', 'back_to_top_icon_color', 'scrollbar_color', 'click_spark_color'], $jsonKeys) as $key) {
    $default = $defaultMap[$key] ?? false;

    if (in_array($key, $effectKeys, true)) {
        $settings->default("$prefix.{$key}", $default);
        $settings->default("$prefix.{$key}_density", 'medium');
    } else {
        $settings->default("$prefix.$key", $default);
    }
}

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    $settings,

    (new Extend\User)
        ->registerPreference('disableEffects', 'boolval', false),

    (new Extend\Locales(__DIR__.'/locale')),
];
