import React from "react";
import moment from "moment";

import fr from "./messages.fr";

import { Pagination } from "antd";

const Translations = {
  fr: {
    default: fr,
  }
};

class LocaleFactory {
  constructor() {
    this.locale = this._getNavigatorLocale();
    this.callbacks = [];
    this.initMoment();
    this._initializeLocales();
  }

  _getNavigatorLocale() {
    const navLanguage = navigator.language || navigator.browserLanguage || "fr";
    return navLanguage.split("-")[0];
  }

  _initializeLocales() {
    const translations = Translations[this.locale] || Translations.fr;

    // Ant Design
    this.Table = translations.default.Table;
    this.Modal = translations.default.Modal;
    this.Popconfirm = translations.default.Popconfirm;
    this.Transfer = translations.default.Transfert;
    this.Select = translations.default.Select;
    this.Pagination = translations.default.Pagination;
    this.TimePicker = translations.default.TimePicker;
    this.DatePicker = {
      lang: translations.default.DatePicker.lang,
      timePickerLocale: this.TimePicker
    };
    this.Calendar = this.DatePicker;

    // This initialization allow us to globaly set the locale of AntD Tables.
    Pagination.prototype.getLocale = () => this.Pagination;

    const defaultTrans = this._compileTranslations(translations.default.Trans);

    this.Trans = Object.assign({}, defaultTrans);
    this.callbacks.forEach(callback => callback());
  }

  _compileTranslations(translations, prefix) {
    if (!translations) {
      return {};
    }
    const compiledTrans = [];

    prefix = prefix || "";
    for (const k in translations) {
      if (translations.hasOwnProperty(k)) {
        if (typeof translations[k] === "string" && k === "_") {
          compiledTrans[prefix.slice(0, -1)] = translations[k];
        } else if (typeof translations[k] === "string") {
          compiledTrans[prefix + k] = translations[k];
        } else {
          const children = this._compileTranslations(
            translations[k],
            `${prefix + k}.`
          );
          Object.assign(compiledTrans, children);
        }
      }
    }
    return compiledTrans;
  }

  trans = (key, params = {}) => {
    params = params || [];
    let msg = this.Trans[key] ? this.Trans[key] : key;

    for (const k in params) {
      if (params.hasOwnProperty(k)) {
        msg = msg.replace(`__${k}__`, params[k]);
      }
    }
    return msg;
  };

  getLocale = () => this.locale;

  setLocale = locale => {
    this.locale = locale;
    this._initializeLocales();
  };
  
  initMoment = () => {
    moment.locale(this.locale);
  };

  addEventReinit(callBack) {
    this.callbacks.push(callBack);
  }
  removeEventReinit(callBack) {
    const index = this.callbacks.indexOf(callBack);
    if (index === -1) {
      return;
    }
    this.callbacks.splice(index, 1);
  }
}

const localeFactory = new LocaleFactory();

const LocaleContext = React.createContext(localeFactory);

const Locale = ({ transKey }) => (
  <LocaleContext.Consumer>
    {value => localeFactory.trans(transKey)}
  </LocaleContext.Consumer>
);

class ConfigProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      current: 1
    };
  }

  componentDidMount() {
    localeFactory.addEventReinit(this.updateLocales);
  }

  updateLocales = () => {
    this.setState(({ current }) => ({ current: current + 1 }));
  };

  componentWillUnmount() {
    localeFactory.removeEventReinit(this.updateLocales);
  };

  render() {
    return (
      <LocaleContext.Provider value={this.state.current}>
        {this.props.children}
      </LocaleContext.Provider>
    );
  }
}

export { ConfigProvider, Locale };
export default localeFactory;