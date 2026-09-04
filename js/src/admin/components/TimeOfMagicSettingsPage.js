import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Switch from 'flarum/common/components/Switch';

const PREFIX = 'stezkoy-time-of-magic';

export default class TimeOfMagicSettingsPage extends ExtensionPage {
  content() {
    return m(
      '.ExtensionPage-settings',
      m('.container', [
        m('.TimeOfMagicSettings', [
          this._toggle(PREFIX + '.progress_bar', 'admin.progress_bar_label', 'admin.progress_bar_description'),
          this.setting(PREFIX + '.progress_bar', '')() === '1'
            ? this._colorField(PREFIX + '.progress_bar_color', 'admin.progress_bar_color_label')
            : null,

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.back_to_top', 'admin.back_to_top_label', 'admin.back_to_top_description'),
          this.setting(PREFIX + '.back_to_top', '')() === '1'
            ? m('.TimeOfMagicSettings-indent', [
                this._toggle(PREFIX + '.back_to_top_rounded', 'admin.back_to_top_shape_label', 'admin.back_to_top_shape_description'),
                m('.Form-group', [
                  m('label', app.translator.trans(PREFIX + '.admin.back_to_top_icon_label')),
                  m('input.FormControl', {
                    type: 'text',
                    value: this.setting(PREFIX + '.back_to_top_icon', 'fa-solid fa-arrow-up')(),
                    oninput: (e) => this.setting(PREFIX + '.back_to_top_icon')(e.target.value),
                    placeholder: 'fa-solid fa-arrow-up',
                  }),
                ]),
                this._colorField(PREFIX + '.back_to_top_color', 'admin.back_to_top_color_label'),
              ])
            : null,

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.snow', 'admin.snow_label', 'admin.snow_description'),
          this.setting(PREFIX + '.snow', '')() === '1'
            ? m('.TimeOfMagicSettings-indent', [
                m('.Form-group', [
                  m('label', app.translator.trans(PREFIX + '.admin.snow_density_label')),
                  m('select.FormControl', {
                    value: this.setting(PREFIX + '.snow_density', 'medium')(),
                    onchange: (e) => this.setting(PREFIX + '.snow_density')(e.target.value),
                  }, [
                    m('option', { value: 'light' }, app.translator.trans(PREFIX + '.admin.snow_density_light')),
                    m('option', { value: 'medium' }, app.translator.trans(PREFIX + '.admin.snow_density_medium')),
                    m('option', { value: 'heavy' }, app.translator.trans(PREFIX + '.admin.snow_density_heavy')),
                  ]),
                  m('p.helpText', app.translator.trans(PREFIX + '.admin.snow_density_description')),
                ]),
              ])
            : null,

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.leaves', 'admin.leaves_label', 'admin.leaves_description'),
          this.setting(PREFIX + '.leaves', '')() === '1'
            ? m('.TimeOfMagicSettings-indent', [
                m('.Form-group', [
                  m('label', app.translator.trans(PREFIX + '.admin.leaves_density_label')),
                  m('select.FormControl', {
                    value: this.setting(PREFIX + '.leaves_density', 'medium')(),
                    onchange: (e) => this.setting(PREFIX + '.leaves_density')(e.target.value),
                  }, [
                    m('option', { value: 'light' }, app.translator.trans(PREFIX + '.admin.leaves_density_light')),
                    m('option', { value: 'medium' }, app.translator.trans(PREFIX + '.admin.leaves_density_medium')),
                    m('option', { value: 'heavy' }, app.translator.trans(PREFIX + '.admin.leaves_density_heavy')),
                  ]),
                  m('p.helpText', app.translator.trans(PREFIX + '.admin.leaves_density_description')),
                ]),
              ])
            : null,

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.rain', 'admin.rain_label', 'admin.rain_description'),
          this.setting(PREFIX + '.rain', '')() === '1'
            ? m('.TimeOfMagicSettings-indent', [
                m('.Form-group', [
                  m('label', app.translator.trans(PREFIX + '.admin.rain_density_label')),
                  m('select.FormControl', {
                    value: this.setting(PREFIX + '.rain_density', 'medium')(),
                    onchange: (e) => this.setting(PREFIX + '.rain_density')(e.target.value),
                  }, [
                    m('option', { value: 'light' }, app.translator.trans(PREFIX + '.admin.rain_density_light')),
                    m('option', { value: 'medium' }, app.translator.trans(PREFIX + '.admin.rain_density_medium')),
                    m('option', { value: 'heavy' }, app.translator.trans(PREFIX + '.admin.rain_density_heavy')),
                  ]),
                  m('p.helpText', app.translator.trans(PREFIX + '.admin.rain_density_description')),
                ]),
              ])
            : null,

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.scrollbar', 'admin.scrollbar_label', 'admin.scrollbar_description'),
          this.setting(PREFIX + '.scrollbar', '')() === '1'
            ? this._colorField(PREFIX + '.scrollbar_color', 'admin.scrollbar_color_label')
            : null,

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.swap_layout', 'admin.swap_layout_label', 'admin.swap_layout_description'),

          m('.TimeOfMagicSettings-divider'),
          this._toggle(PREFIX + '.click_spark', 'admin.click_spark_label', 'admin.click_spark_description'),
          this.setting(PREFIX + '.click_spark', '')() === '1'
            ? this._colorField(PREFIX + '.click_spark_color', 'admin.click_spark_color_label')
            : null,

          m('.TimeOfMagicSettings-divider'),
          m('.Form-group', [
            m('label', app.translator.trans(PREFIX + '.admin.background_label')),
            m('select.FormControl', {
              value: this.setting(PREFIX + '.background', '')(),
              onchange: (e) => this.setting(PREFIX + '.background')(e.target.value),
            }, [
              m('option', { value: '' }, app.translator.trans(PREFIX + '.admin.background_none')),
              m('option', { value: 'dots' }, app.translator.trans(PREFIX + '.admin.background_dots')),
              m('option', { value: 'grid' }, app.translator.trans(PREFIX + '.admin.background_grid')),
              m('option', { value: 'diagonal' }, app.translator.trans(PREFIX + '.admin.background_diagonal')),
              m('option', { value: 'waves' }, app.translator.trans(PREFIX + '.admin.background_waves')),
              m('option', { value: 'hexagon' }, app.translator.trans(PREFIX + '.admin.background_hexagon')),
            ]),
            m('p.helpText', app.translator.trans(PREFIX + '.admin.background_description')),
          ]),

          m('.Form-group.Form-controls', this.submitButton()),
        ]),
      ])
    );
  }

  _toggle(key, labelKey, descKey) {
    return m('.Form-group', [
      m(
        Switch,
        {
          state: this.setting(key, '')() === '1',
          onchange: (value) => {
            this.setting(key)(value ? '1' : '');
            m.redraw();
          },
        },
        app.translator.trans(PREFIX + '.' + labelKey)
      ),
      m('p.helpText', app.translator.trans(PREFIX + '.' + descKey)),
    ]);
  }

  _colorField(key, labelKey) {
    return this.buildSettingComponent({
      type: 'color-preview',
      setting: key,
      label: app.translator.trans(PREFIX + '.' + labelKey),
      help: app.translator.trans(PREFIX + '.admin.color_description'),
      placeholder: app.translator.trans(PREFIX + '.admin.color_placeholder'),
    });
  }
}
