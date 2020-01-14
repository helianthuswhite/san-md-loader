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
      esModule: true,
      html: true,
      tagOpen: '```san',
      tagClose: '```',
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

      var _this$getSanComponent = this.getSanComponent(source),
          components = _this$getSanComponent.components,
          content = _this$getSanComponent.content,
          requires = _this$getSanComponent.requires,
          sanBlock = _this$getSanComponent.sanBlock;

      var md = markdown(this.options.preset, this.options);
      plugins.forEach(function (plugin) {
        return Array.isArray(plugin) ? md.use.apply(md, _toConsumableArray(plugin)) : md.use(plugin);
      });
      var sanTemplate = "\n            <template>\n                <san-component class=\"".concat(this.options.templateClass || '', "\">").concat(md.render(content), "</san-component>\n            </template>\n        ");
      var sanComponents = components.map(function (item, index) {
        return item.replace('export default', "const sanComponent".concat(index, " ="));
      }).join('');
      var childComponents = components.map(function (item, index) {
        return "'san-component-".concat(index, "': sanComponent").concat(index);
      }).join(',');
      var rawChildren = sanBlock.map(function (item) {
        return JSON.stringify(item).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
      });
      var importModules = this.getImportModules(requires);
      var exportMethod = this.options.esModule ? 'export default' : 'module.exports=';

      if (this.options.raw) {
        return "".concat(exportMethod, " {template:").concat(JSON.stringify(sanTemplate), "}");
      }

      return "\n            ".concat(importModules, "\n            ").concat(sanComponents, "\n            ").concat(exportMethod, " san.defineComponent({\n                template: ").concat(JSON.stringify(sanTemplate), ",\n                rawChildren: [").concat(rawChildren, "],\n                components: {\n                    ").concat(childComponents, "\n                }\n            });\n        ");
    }
  }, {
    key: "getSanComponent",
    value: function getSanComponent(source) {
      var reg = new RegExp("".concat(this.options.tagOpen, "([\\s\\S]+?)").concat(this.options.tagClose));
      var content = source;
      var matchResult = reg.exec(content);
      var componentId = 0;
      var sanBlock = [];

      while (matchResult) {
        sanBlock.push(matchResult[1] ? matchResult[1].trim() : '');
        var replacedStr = "<san-component-".concat(componentId, "  class=\"san-child-component componet").concat(componentId, "\" />");
        content = content.replace(reg, replacedStr);
        componentId++;
        matchResult = reg.exec(content);
      }

      var requires = {};
      var importReg = new RegExp("import([\\s\\S]+?)from '([\\s\\S]+?)'(;?)");
      var components = sanBlock.map(function (item) {
        var matches = importReg.exec(item);
        var tmpStr = item;

        while (matches) {
          if (requires[matches[2]]) {
            requires[matches[2]].push(matches[1].trim());
          } else {
            requires[matches[2]] = [matches[1].trim()];
          }

          tmpStr = tmpStr.replace(importReg, '');
          matches = importReg.exec(tmpStr);
        }

        return tmpStr;
      });

      var _loop = function _loop(key) {
        if ({}.hasOwnProperty.call(requires, key)) {
          var tmpArray = Array.from(new Set(requires[key]));
          requires[key] = {
            single: '',
            multi: []
          };
          tmpArray.forEach(function (item) {
            var tmpMatches = item.match(/{([\s\S]+?)}/);

            if (tmpMatches) {
              var _requires$key$multi;

              var variables = tmpMatches[1].indexOf(',') ? tmpMatches[1].trim().split(',') : [tmpMatches[1].trim()];

              (_requires$key$multi = requires[key].multi).push.apply(_requires$key$multi, _toConsumableArray(variables));
            } else {
              requires[key].single = item.trim();
            }
          });
          requires[key].multi = requires[key].multi.map(function (item) {
            return item.trim();
          });
          requires[key].multi = Array.from(new Set(requires[key].multi));
        }
      };

      for (var key in requires) {
        _loop(key);
      }

      return {
        components: components,
        content: content,
        requires: requires,
        sanBlock: sanBlock
      };
    }
  }, {
    key: "getImportModules",
    value: function getImportModules(requires) {
      var importModules = '';

      if (!{}.hasOwnProperty.call(requires, 'san') || requires.san.single !== 'san') {
        importModules += this.options.esModule ? 'import san from "san";' : 'var san = require("san");';
      }

      for (var key in requires) {
        if ({}.hasOwnProperty.call(requires, key)) {
          if (requires[key].single) {
            importModules += "\n                        import ".concat(requires[key].single, " from '").concat(key, "';\n                    ");
          }

          if (requires[key].multi) {
            importModules += "\n                        import {".concat(requires[key].multi.join(','), "} from '").concat(key, "';\n                    ");
          }
        }
      }

      return importModules;
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
