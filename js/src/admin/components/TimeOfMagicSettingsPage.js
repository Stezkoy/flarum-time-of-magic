import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Switch from 'flarum/common/components/Switch';
import ScheduleModal from './ScheduleModal';

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
  { value: 'fireflies', label: 'fireflies_label' },
];

const DENSITY_LABEL_MAP = {
  light: 'density_light',
  medium: 'density_medium',
  heavy: 'density_heavy',
};

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
      this._interfaceRow(
        PREFIX + '.progress_bar',
        'admin.progress_bar_label',
        'admin.progress_bar_description',
        this.setting(PREFIX + '.progress_bar', '')() === '1' ? this._colorField(PREFIX + '.progress_bar_color', 'admin.progress_bar_color_label') : null
      ),

      this._interfaceRow(
        PREFIX + '.back_to_top',
        'admin.back_to_top_label',
        'admin.back_to_top_description',
        this.setting(PREFIX + '.back_to_top', '')() === '1'
          ? m('.TimeOfMagicSettings-indent', [
              this._toggle(PREFIX + '.back_to_top_rounded', 'admin.back_to_top_shape_label', 'admin.back_to_top_shape_description'),
              this._iconField(),
              this._colorField(PREFIX + '.back_to_top_color', 'admin.back_to_top_color_label'),
            ])
          : null
      ),

      this._interfaceRow(
        PREFIX + '.scrollbar',
        'admin.scrollbar_label',
        'admin.scrollbar_description',
        this.setting(PREFIX + '.scrollbar', '')() === '1' ? this._colorField(PREFIX + '.scrollbar_color', 'admin.scrollbar_color_label') : null
      ),

      this._interfaceRow(PREFIX + '.swap_layout', 'admin.swap_layout_label', 'admin.swap_layout_description'),

      this._interfaceRow(
        PREFIX + '.click_spark',
        'admin.click_spark_label',
        'admin.click_spark_description',
        this.setting(PREFIX + '.click_spark', '')() === '1' ? this._colorField(PREFIX + '.click_spark_color', 'admin.click_spark_color_label') : null
      ),

      this._backgroundField(),
    ]);
  }

  _interfaceRow(key, labelKey, descKey, extra) {
    return m('.TimeOfMagicSettings-interfaceRow', [
      this._toggle(key, labelKey, descKey),
      extra || null,
    ]);
  }

  _backgroundField() {
    return m('.Form-group.TimeOfMagicSettings-interfaceRow', [
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
    ]);
  }

  _effectsSection() {
    return this._section('section_effects',
      m('.TimeOfMagicSettings-grid', EFFECT_OPTIONS.map((effect) => this._effectRow(effect)))
    );
  }

  _schedulerSection() {
    const empty = !this.schedules.length;

    return this._section('section_scheduler', [
      m('.TimeOfMagicSettings-schedulerHeader', [
        m('p.helpText', app.translator.trans(PREFIX + '.admin.scheduler_description')),
        m('button.Button.Button--primary', { onclick: () => this._openModal(null) }, app.translator.trans(PREFIX + '.admin.scheduler_add_button')),
      ]),
      m('.TimeOfMagicSettings-CardList', [
        empty
          ? m('.TimeOfMagicSettings-schedulerEmpty', app.translator.trans(PREFIX + '.admin.scheduler_empty'))
          : this.schedules.map((schedule) => this._scheduleCard(schedule)),
      ]),
    ]);
  }

  _scheduleCard(schedule) {
    const activeNow = this._isCurrentlyActive(schedule);
    const effects = (schedule.effects || []).map((effect) =>
      typeof effect === 'string' ? { name: effect, density: null } : effect
    );

    return m('.TimeOfMagicSettings-scheduleCard' + (activeNow ? '' : '.is-inactive'), [
      m('.TimeOfMagicSettings-scheduleInfo', [
        m('.TimeOfMagicSettings-scheduleHeader', [
          m('.TimeOfMagicSettings-scheduleTitle',
            schedule.label || app.translator.trans(PREFIX + '.admin.scheduler_untitled')
          ),
        ]),
        m('.TimeOfMagicSettings-scheduleDates', [
          m('span.TimeOfMagicSettings-scheduleDate', this._formatDate(schedule.start)),
          m('span.TimeOfMagicSettings-scheduleDate', this._formatDate(schedule.end)),
        ]),
      ]),

      effects.length
        ? m('.TimeOfMagicSettings-schedulePills', effects.map((effect) => this._schedulePill(effect)))
        : m('.TimeOfMagicSettings-schedulePills',
            m('span.TimeOfMagicSettings-schedulePill.TimeOfMagicSettings-schedulePill--none',
              app.translator.trans(PREFIX + '.admin.scheduler_no_effects')
            )),

      m('.TimeOfMagicSettings-scheduleActions', [
        m('span.TimeOfMagicSettings-scheduleStatus' + (activeNow ? '.active' : '.inactive'),
          app.translator.trans(PREFIX + '.admin.' + (activeNow ? 'scheduler_status_active' : 'scheduler_status_inactive'))
        ),
        m(Switch, {
          state: !!schedule.enabled,
          onchange: (value) => this._updateSchedule(schedule.id, { enabled: value }),
        }),
        m('button.Button.Button--icon', {
          title: app.translator.trans(PREFIX + '.admin.scheduler_edit_button'),
          onclick: () => this._openModal(schedule),
        }, m('i.fas.fa-pencil-alt')),
        m('button.Button.Button--icon.Button--danger', {
          title: app.translator.trans(PREFIX + '.admin.scheduler_delete_button'),
          onclick: () => this._deleteSchedule(schedule.id),
        }, m('i.fas.fa-trash-alt')),
      ]),
    ]);
  }

  _effectRow(effect) {
    const key = `${PREFIX}.${effect.value}`;
    const enabled = this.setting(key, '')() === '1';

    return m('.TimeOfMagicSettings-effectRow', [
      m(Switch, {
        state: enabled,
        onchange: (value) => {
          this.setting(key)(value ? '1' : '');
          m.redraw();
        },
      }, app.translator.trans(PREFIX + '.admin.' + effect.label)),
      enabled
        ? m('select.FormControl.TimeOfMagicSettings-densitySelect', {
            value: this.setting(`${PREFIX}.${effect.value}_density`, 'medium')(),
            onchange: (e) => this.setting(`${PREFIX}.${effect.value}_density`)(e.target.value),
          }, this._densityOptions())
        : null,
    ]);
  }

  _iconField() {
    return m('.Form-group', [
      m('label', app.translator.trans(PREFIX + '.admin.back_to_top_icon_label')),
      m('input.FormControl', {
        type: 'text',
        value: this.setting(PREFIX + '.back_to_top_icon', 'fa-solid fa-arrow-up')(),
        oninput: (e) => this.setting(PREFIX + '.back_to_top_icon')(e.target.value),
        placeholder: 'fa-solid fa-arrow-up',
      }),
    ]);
  }

  _densityOptions() {
    return [
      m('option', { value: 'light' }, app.translator.trans(PREFIX + '.admin.density_light')),
      m('option', { value: 'medium' }, app.translator.trans(PREFIX + '.admin.density_medium')),
      m('option', { value: 'heavy' }, app.translator.trans(PREFIX + '.admin.density_heavy')),
    ];
  }

  _schedulePill(effect) {
    const option = EFFECT_OPTIONS.find((o) => o.value === effect.name);
    const label = option ? app.translator.trans(PREFIX + '.admin.' + option.label) : effect.name;

    return m('span.TimeOfMagicSettings-schedulePill', [
      label,
      m('span.TimeOfMagicSettings-schedulePill-density', this._densityLabel(effect.density || 'medium')),
    ]);
  }

  _densityLabel(density) {
    return DENSITY_LABEL_MAP[density] ? app.translator.trans(PREFIX + '.admin.' + DENSITY_LABEL_MAP[density]) : density;
  }

  _section(titleKey, children) {
    return m('.TimeOfMagicSettings-section', [
      m('.TimeOfMagicSettings-sectionHeader', m('h3', app.translator.trans(PREFIX + '.admin.' + titleKey))),
      m('.TimeOfMagicSettings-sectionBody', children),
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

  _openModal(schedule) {
    app.modal.show(ScheduleModal, {
      schedule,
      effects: EFFECT_OPTIONS,
      save: (data) => {
        if (schedule) {
          this._replaceSchedule(schedule.id, data);
        } else {
          this._appendSchedule(data);
        }
      },
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

  _appendSchedule(data) {
    this.schedules.push(data);
    this._syncSchedules();
    m.redraw();
  }

  _replaceSchedule(id, data) {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.schedules[index] = data;
      this._syncSchedules();
      m.redraw();
    }
  }

  _updateSchedule(id, patch) {
    const entry = this.schedules.find((s) => s.id === id);
    if (entry) {
      Object.assign(entry, patch);
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

  _isCurrentlyActive(schedule) {
    const now = Date.now();
    const start = new Date(schedule.start).getTime();
    const end = new Date(schedule.end).getTime();

    return !!schedule.enabled && !Number.isNaN(start) && !Number.isNaN(end) && now >= start && now <= end;
  }

  _formatDate(dt) {
    if (!dt) return '—';
    const date = new Date(dt);
    if (Number.isNaN(date.getTime())) return dt;
    return date.toLocaleString([], { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}