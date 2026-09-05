import Modal from 'flarum/common/components/Modal';
import Switch from 'flarum/common/components/Switch';
import Checkbox from 'flarum/common/components/Checkbox';

const PREFIX = 'stezkoy-time-of-magic';

export default class ScheduleModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    const schedule = this.attrs.schedule;

    this.label = schedule ? schedule.label || '' : '';
    this.start = schedule ? schedule.start || '' : '';
    this.end = schedule ? schedule.end || '' : '';
    this.enabled = schedule ? !!schedule.enabled : true;
    this.selectedEffects = (schedule ? schedule.effects : [])
      .map((effect) =>
        typeof effect === 'string' ? { name: effect, density: 'medium' } : { name: effect.name, density: effect.density || 'medium' }
      );
  }

  className() {
    return 'TimeOfMagicModal';
  }

  title() {
    return app.translator.trans(PREFIX + '.admin.' + (this.attrs.schedule ? 'scheduler_modal_edit_title' : 'scheduler_modal_add_title'));
  }

  content() {
    return m('form', { onsubmit: (e) => this._save(e) }, [
      m('.Modal-body', [
        m('.Form-group', [
          m('label', app.translator.trans(PREFIX + '.admin.scheduler_title_label')),
          m('input.FormControl', {
            type: 'text',
            value: this.label,
            placeholder: app.translator.trans(PREFIX + '.admin.scheduler_title_placeholder'),
            oninput: (e) => {
              this.label = e.target.value;
              m.redraw();
            },
          }),
        ]),

        m('.TimeOfMagicModal-row', [
          m('.Form-group', [
            m('label', app.translator.trans(PREFIX + '.admin.scheduler_start_label')),
            m('input.FormControl', {
              type: 'datetime-local',
              value: this.start,
              oninput: (e) => {
                this.start = e.target.value;
                m.redraw();
              },
            }),
          ]),
          m('.Form-group', [
            m('label', app.translator.trans(PREFIX + '.admin.scheduler_end_label')),
            m('input.FormControl', {
              type: 'datetime-local',
              value: this.end,
              oninput: (e) => {
                this.end = e.target.value;
                m.redraw();
              },
            }),
          ]),
        ]),

        m('.Form-group', [
          m('label', app.translator.trans(PREFIX + '.admin.scheduler_effects_label')),
          m('.TimeOfMagicModal-effects', this.attrs.effects.map((effect) => this._effectRow(effect))),
        ]),

        m('.Form-group', [
          m(
            Switch,
            {
              state: this.enabled,
              onchange: (value) => {
                this.enabled = value;
                m.redraw();
              },
            },
            app.translator.trans(PREFIX + '.admin.scheduler_enabled_label')
          ),
        ]),
      ]),

      m('.Modal-footer.TimeOfMagicModal-footer', [
        m('button.Button', { type: 'button', onclick: () => this.hide() }, app.translator.trans(PREFIX + '.admin.scheduler_cancel_button')),
        m('button.Button.Button--primary', { type: 'submit' }, app.translator.trans(PREFIX + '.admin.scheduler_modal_save')),
      ]),
    ]);
  }

  _effectRow(effect) {
    const selected = this.selectedEffects.find((e) => e.name === effect.value);

    return m('.TimeOfMagicModal-effect', [
      m(
        Checkbox,
        {
          state: !!selected,
          onchange: (checked) => {
            if (checked) {
              this.selectedEffects.push({ name: effect.value, density: 'medium' });
            } else {
              this.selectedEffects = this.selectedEffects.filter((x) => x.name !== effect.value);
            }
            m.redraw();
          },
        },
        app.translator.trans(PREFIX + '.admin.' + effect.label)
      ),
      m('select.FormControl.TimeOfMagicModal-density' + (selected ? '' : '.is-disabled'), {
        disabled: !selected,
        value: selected ? selected.density || 'medium' : 'medium',
        onchange: (e) => {
          if (selected) {
            selected.density = e.target.value;
            m.redraw();
          }
        },
      }, this._densityOptions()),
    ]);
  }

  _densityOptions() {
    return [
      m('option', { value: 'light' }, app.translator.trans(PREFIX + '.admin.density_light')),
      m('option', { value: 'medium' }, app.translator.trans(PREFIX + '.admin.density_medium')),
      m('option', { value: 'heavy' }, app.translator.trans(PREFIX + '.admin.density_heavy')),
    ];
  }

  _save(e) {
    e.preventDefault();

    const existing = this.attrs.schedule;

    this.attrs.save({
      id: existing ? existing.id : Math.random().toString(36).slice(2, 10),
      label: this.label,
      start: this.start,
      end: this.end,
      enabled: this.enabled,
      effects: this.selectedEffects.map((effect) => ({ name: effect.name, density: effect.density || 'medium' })),
    });

    this.hide();
  }
}