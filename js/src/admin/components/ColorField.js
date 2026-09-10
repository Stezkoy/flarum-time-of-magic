import Component from 'flarum/common/Component';
import { PREFIX } from '../../common';

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export default class ColorField extends Component {
  view(vnode) {
    const { key, labelKey, placeholderKey, helpKey } = this.attrs;
    const value = this.settingValue(key);

    return m('.Form-group.TimeOfMagicSettings-colorField', [
      m('label', app.translator.trans(PREFIX + '.' + labelKey)),
      m('.TimeOfMagicSettings-colorRow', [
        m('input.FormControl', {
          type: 'text',
          value,
          placeholder: app.translator.trans(PREFIX + '.' + placeholderKey),
          oninput: (e) => this.setValue(key, e.target.value),
        }),
        m('input.TimeOfMagicSettings-colorSwatch', {
          type: 'color',
          value: HEX_RE.test(value) ? value : '#000000',
          oninput: (e) => this.setValue(key, e.target.value),
        }),
      ]),
      m('p.helpText', app.translator.trans(PREFIX + '.' + helpKey)),
    ]);
  }

  settingValue(key) {
    return this.attrs.page.setting(key, '')();
  }

  setValue(key, value) {
    this.attrs.page.setting(key)(value);
    m.redraw();
  }
}
