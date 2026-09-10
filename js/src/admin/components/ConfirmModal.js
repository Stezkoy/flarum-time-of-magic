import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import { PREFIX } from '../../common';

export default class ConfirmModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.text = this.attrs.text;
  }

  className() {
    return 'TimeOfMagicConfirmModal Modal--small';
  }

  title() {
    return app.translator.trans(PREFIX + '.admin.scheduler_confirm_title');
  }

  content() {
    return m('.Modal-body', [
      m('p', this.text),
      m('.Form-group.Form-controls', [
        m(Button, {
          className: 'Button Button--danger',
          onclick: () => {
            this.hide();
            this.attrs.onConfirm();
          },
        }, app.translator.trans(PREFIX + '.admin.scheduler_confirm_button')),
        m(Button, {
          className: 'Button',
          onclick: () => this.hide(),
        }, app.translator.trans(PREFIX + '.admin.scheduler_cancel_button')),
      ]),
    ]);
  }
}
