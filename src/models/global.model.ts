import { action, observable } from 'mobx';

export class GlobalModel {
  @observable
  collapsed = true;

  @action
  toggle() {
    this.collapsed = !this.collapsed;
  }
}
