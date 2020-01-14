import markdown from 'markdown-it';
import hljs from 'highlight.js';

export default class Parser {
    constructor(options) {
        this.options = {
            preset: 'default',
            esModule: true,
            html: true,
            tagOpen: '```san',
            tagClose: '```',
            highlight(str, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(lang, str).value;
                    } catch (err) {}
                }

                try {
                    return hljs.highlightAuto(str).value;
                } catch (err) {}

                return '';
            },
            ...options
        };
    }

    parse(source) {
        const plugins = this.options.plugins || [];
        delete this.options.plugins;

        const {
            components,
            content,
            requires,
            sanBlock
        } = this.getSanComponent(source);

        const md = markdown(this.options.preset, this.options);
        plugins.forEach((plugin) => (Array.isArray(plugin) ? md.use(...plugin) : md.use(plugin)));

        const sanTemplate = `
            <template>
                <san-component class="${this.options.templateClass || ''}">${md.render(content)}</san-component>
            </template>
        `;

        const sanComponents = components
            .map((item, index) => item.replace('export default', `const sanComponent${index} =`))
            .join('');

        const childComponents = components
            .map((item, index) => `'san-component-${index}': sanComponent${index}`)
            .join(',');

        const rawChildren = sanBlock.map((item) => JSON.stringify(item)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029'));

        const importModules = this.getImportModules(requires);

        const exportMethod = this.options.esModule ? 'export default' : 'module.exports=';

        if (this.options.raw) {
            return `${exportMethod} {template:${JSON.stringify(sanTemplate)}}`;
        }

        return `
            ${importModules}
            ${sanComponents}
            ${exportMethod} san.defineComponent({
                template: ${JSON.stringify(sanTemplate)},
                rawChildren: [${rawChildren}],
                components: {
                    ${childComponents}
                }
            });
        `;
    }

    getSanComponent(source) {
        const reg = new RegExp(`${this.options.tagOpen}([\\s\\S]+?)${this.options.tagClose}`);
        let content = source;
        let matchResult = reg.exec(content);
        let componentId = 0;
        const sanBlock = [];

        while (matchResult) {
            sanBlock.push(matchResult[1] ? matchResult[1].trim() : '');
            const replacedStr = `<san-component-${componentId}  class="san-child-component componet${componentId}" />`;
            content = content.replace(reg, replacedStr);
            componentId++;
            matchResult = reg.exec(content);
        }

        const requires = {};
        const importReg = new RegExp("import([\\s\\S]+?)from '([\\s\\S]+?)'(;?)");

        const components = sanBlock.map((item) => {
            let matches = importReg.exec(item);
            let tmpStr = item;

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

        for (const key in requires) {
            if ({}.hasOwnProperty.call(requires, key)) {
                const tmpArray = Array.from(new Set(requires[key]));
                requires[key] = {single: '', multi: []};
                tmpArray.forEach((item) => {
                    const tmpMatches = item.match(/{([\s\S]+?)}/);
                    if (tmpMatches) {
                        const variables = tmpMatches[1].indexOf(',')
                            ? tmpMatches[1].trim().split(',')
                            : [tmpMatches[1].trim()];
                        requires[key].multi.push(...variables);
                    } else {
                        requires[key].single = item.trim();
                    }
                });
                requires[key].multi = requires[key].multi.map((item) => item.trim());
                requires[key].multi = Array.from(new Set(requires[key].multi));
            }
        }

        return {
            components,
            content,
            requires,
            sanBlock
        };
    }

    getImportModules(requires) {
        let importModules = '';

        if (!{}.hasOwnProperty.call(requires, 'san') || requires.san.single !== 'san') {
            importModules += this.options.esModule ? 'import san from "san";' : 'var san = require("san");';
        }

        for (const key in requires) {
            if ({}.hasOwnProperty.call(requires, key)) {
                if (requires[key].single) {
                    importModules += `
                        import ${requires[key].single} from '${key}';
                    `;
                }
                if (requires[key].multi) {
                    importModules += `
                        import {${requires[key].multi.join(',')}} from '${key}';
                    `;
                }
            }
        }
        return importModules;
    }
}
