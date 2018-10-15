import { observable, computed, action } from "mobx";
import { getLanguage, setLanguage } from '../i18n';

export default class UIState {
  @observable language;
  //@observable windowSize
  // userid
  
  constructor() {
    this.language = getLanguage();
  }
  // ...
  @action 
  setLanguage(lang) {
    this.language = lang;
    setLanguage(lang);
  }
}
