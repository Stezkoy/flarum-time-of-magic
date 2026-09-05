import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Switch from 'flarum/common/components/Switch';

const PREFIX = 'stezkoy-time-of-magic';

const EFFECT_OPTIONS = [
  { value: 'snow', label: 'snow_label' },
  { value: 'leaves', label: 'leaves_label' },
  { value: 'rain', label: 'rain_label' },
  { value: 'petals', label: 'petals_label' },
  { value: 'confetti', label: 'confetti_label' },
  { value: 'hearts', label: 'hearts_label' },
  { value: 'clovers', label: 'clovers_label' },
  { value: 'eggs', label: 'eggs_label' },
  { value: 'lanterns', label: 'lanterns_label' },
];

export default class TimeOfMagicSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.schedules = this._parseSchedules(app.data.settings[PREFIX + '.schedules'] ?? '[]');
  }

  content() {
    return m('.ExtensionPage-settings', m('.container', [
      m('.TimeOfMagicSettings', [
        this._interfaceSection(),
        this._effectsSection(),
        this._schedulerSection(),
        m('.Form-group.Form-controls', this.submitButton()),
      ]),
    ]));
  }

  _interfaceSection() {
    return this._section('section_interface', [
      this._toggle(PREFIX + '.progress_bar', 'admin.progress_bar_label', 'admin.progress_bar_description'),
      this.setting(PREFIX + '.progress_bar', '')() === '1'
        ? this._colorField(PREFIX + '.progress_bar_color', 'admin.progress_bar_color_label')
        : null,

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

      this._toggle(PREFIX + '.scrollbar', 'admin.scrollbar_label', 'admin.scrollbar_description'),
      this.setting(PREFIX + '.scrollbar', '')() === '1'
        ? this._colorField(PREFIX + '.scrollbar_color', 'admin.scrollbar_color_label')
        : null,

      this._toggle(PREFIX + '.swap_layout', 'admin.swap_layout_label', 'admin.swap_layout_description'),

      this._toggle(PREFIX + '.click_spark', 'admin.click_spark_label', 'admin.click_spark_description'),
      this.setting(PREFIX + '.click_spark', '')() === '1'
        ? this._colorField(PREFIX + '.click_spark_color', 'admin.click_spark_color_label')
        : null,

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
    ]);
  }

  _effectsSection() {
    return this._section('section_effects', EFFECT_OPTIONS.map((effect) => [
      this._toggle(
        `${PREFIX}.${effect.value}`,
        `admin.${effect.label}`,
        `admin.${effect.value}_description`
      ),
      this.setting(`${PREFIX}.${effect.value}`, '')() === '1'
        ? m('.TimeOfMagicSettings-indent', this._densityField(effect.value))
        : null,
    ]));
  }

  _schedulerSection() {
    const empty = !this.schedules.length;

    return this._section('section_scheduler', [
      m('.TimeOfMagicSettings-schedulerHeader', [
        m('p.helpText', app.translator.trans(PREFIX + '.admin.scheduler_description')),
        m('button.Button.Button--primary', { onclick: () => this._addSchedule() }, app.translator.trans(PREFIX + '.admin.scheduler_add_button')),
      ]),
      m('.TimeOfMagicSettings-schedulerList', [
        empty
          ? m('.TimeOfMagicSettings-schedulerEmpty', app.translator.trans(PREFIX + '.admin.scheduler_empty'))
          : this.schedules.map((s) => this._scheduleCard(s)),
      ]),
    ]);
  }

  _scheduleCard(s) {
    const activeNow = this._isCurrentlyActive(s);

    return m('.TimeOfMagicSettings-scheduleCard', [
      m('.TimeOfMagicSettings-scheduleHeader', [
        m('input.FormControl.TimeOfMagicSettings-scheduleTitle', {
          type: 'text',
          placeholder: app.translator.trans(PREFIX + '.admin.scheduler_title_placeholder'),
          value: s.label,
          oninput: (e) => this._updateSchedule(s.id, { label: e.target.value }),
        }),
        m('button.Button.Button--danger.Button--icon', {
          title: app.translator.trans(PREFIX + '.admin.scheduler_delete_button'),
          onclick: () => this._deleteSchedule(s.id),
        }, m('i.fas.fa-trash-alt')),
      ]),

      m('.TimeOfMagicSettings-scheduleRow', [
        m('.TimeOfMagicSettings-scheduleField', [
          m('label', app.translator.trans(PREFIX + '.admin.scheduler_start_label')),
          m('input.FormControl', {
            type: 'datetime-local',
            value: s.start,
            oninput: (e) => this._updateSchedule(s.id, { start: e.target.value }),
          }),
        ]),
        m('.TimeOfMagicSettings-scheduleArrow', '—'),
        m('.TimeOfMagicSettings-scheduleField', [
          m('label', app.translator.trans(PREFIX + '.admin.scheduler_end_label')),
          m('input.FormControl', {
            type: 'datetime-local',
            value: s.end,
            oninput: (e) => this._updateSchedule(s.id, { end: e.target.value }),
          }),
        ]),
      ]),

      m('.TimeOfMagicSettings-scheduleEffects', [
        m('label', app.translator.trans(PREFIX + '.admin.scheduler_effects_label')),
        m('.TimeOfMagicSettings-schedulePills', EFFECT_OPTIONS.map((effect) => {
          const checked = s.effects.includes(effect.value);
          return m('button.TimeOfMagicSettings-schedulePill', {
            className: checked ? 'active' : '',
            onclick: () => this._toggleScheduleEffect(s.id, effect.value),
          }, app.translator.trans(PREFIX + '.admin.' + effect.label));
        })),
      ]),

      m('.TimeOfMagicSettings-scheduleFooter', [
        m(Switch, {
          state: !!s.enabled,
          onchange: (value) => this._updateSchedule(s.id, { enabled: value }),
        }, app.translator.trans(PREFIX + '.admin.scheduler_enabled_label')),
        m('.TimeOfMagicSettings-scheduleStatus' + (activeNow ? '.active' : '.inactive'),
          app.translator.trans(PREFIX + '.admin.' + (activeNow ? 'scheduler_status_active' : 'scheduler_status_inactive'))
        ),
      ]),
    ]);
  }

  _densityField(name) {
    return m('.Form-group', [
      m('label', app.translator.trans(`${PREFIX}.admin.${name}_density_label`)),
      m('select.FormControl', {
        value: this.setting(`${PREFIX}.${name}_density`, 'medium')(),
        onchange: (e) => this.setting(`${PREFIX}.${name}_density`)(e.target.value),
      }, [
        m('option', { value: 'light' }, app.translator.trans(PREFIX + '.admin.density_light')),
        m('option', { value: 'medium' }, app.translator.trans(PREFIX + '.admin.density_medium')),
        m('option', { value: 'heavy' }, app.translator.trans(PREFIX + '.admin.density_heavy')),
      ]),
      m('p.helpText', app.translator.trans(`${PREFIX}.admin.${name}_density_description`)),
    ]);
  }

  _section(titleKey, children) {
    return m('.TimeOfMagicSettings-section', [
      m('.TimeOfMagicSettings-sectionHeader', m('h3', app.translator.trans(PREFIX + '.admin.' + titleKey))),
      m('.TimeOfMagicSettings-card', children),
    ]);
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

  _parseSchedules(raw) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw) {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  _syncSchedules() {
    this.setting(PREFIX + '.schedules', '[]')(JSON.stringify(this.schedules));
  }

  _addSchedule() {
    this.schedules.push({
      id: Math.random().toString(36).slice(2, 10),
      label: '',
      start: '',
      end: '',
      effects: [],
      enabled: true,
    });
    this._syncSchedules();
    m.redraw();
  }

  _updateSchedule(id, patch) {
    const entry = this.schedules.find((s) => s.id === id);
    if (entry) {
      Object.assign(entry, patch);
      this._syncSchedules();
      m.redraw();
    }
  }

  _toggleScheduleEffect(id, effect) {
    const entry = this.schedules.find((s) => s.id === id);
    if (entry) {
      entry.effects = entry.effects.includes(effect)
        ? entry.effects.filter((e) => e !== effect)
        : [...entry.effects, effect];
      this._syncSchedules();
      m.redraw();
    }
  }

  _deleteSchedule(id) {
    const message = app.translator.trans(PREFIX + '.admin.scheduler_delete_confirm', {}, true);
    if (!window.confirm(message)) return;

    this.schedules = this.schedules.filter((s) => s.id !== id);
    this._syncSchedules();
    m.redraw();
  }

  _isCurrentlyActive(s) {
    const now = Date.now();
    const start = new Date(s.start).getTime();
    const end = new Date(s.end).getTime();

    return !!s.enabled && !Number.isNaN(start) && !Number.isNaN(end) && now >= start && now <= end;
  }
}