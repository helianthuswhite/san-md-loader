'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var loaderUtils = _interopDefault(require('loader-utils'));
var markdown = _interopDefault(require('markdown-it'));
var hljs = _interopDefault(require('highlight.js'));

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var Parser =
/*#__PURE__*/
function () {
  function Parser(options) {
    _classCallCheck(this, Parser);

    this.options = _objectSpread2({
      preset: 'default',
      highlight: function highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}

        return '';
      }
    }, options);
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(source) {
      var plugins = this.options.plugins || [];
      delete this.options.plugins;
      var md = markdown(this.options.preset, this.options);
      plugins.forEach(function (plugin) {
        return Array.isArray(plugin) ? md.use.apply(md, _toConsumableArray(plugin)) : md.use(plugin);
      });
      var sanTemplate = "\n            <template>\n                <san-component class=\"".concat(this.options.templateClass || '', "\">").concat(md.render(source), "</san-component>\n            </template>\n        ");
      var exportMethod = this.options.esModule ? 'export default' : 'module.exports=';

      if (this.options.raw) {
        return "".concat(exportMethod, " {template:").concat(JSON.stringify(sanTemplate), "}");
      }

      var sanImport = this.options.esModule ? 'import san from "san";' : 'var san = require("san");';
      return "\n            ".concat(sanImport, "\n            ").concat(exportMethod, " san.defineComponent({template:").concat(JSON.stringify(sanTemplate), "});\n        ");
    }
  }]);

  return Parser;
}();

function index (source) {
  var options = loaderUtils.getOptions(this) || {};
  var parser = new Parser(options);
  return parser.parse(source);
}

module.exports = index;
