export const defaults = {
  replacer: null,
  space: 2
};

export class JsonDataFormatter {
  constructor(options) {
    this.options = { ...defaults, ...options };
  }

  formatData(data) {
    return JSON.stringify(data, this.options.replacer, this.options.space);
  }
}
