import markdown from 'markdown-it';
import hljs from 'highlight.js';

export default class Parser {
    constructor(options) {
        this.options = {
            preset: 'default',
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

        const md = markdown(this.options.preset, this.options);
        plugins.forEach((plugin) => (Array.isArray(plugin) ? md.use(...plugin) : md.use(plugin)));
        const sanTemplate = `
            <template>
                <san-component class="${this.options.templateClass || ''}">${md.render(source)}</san-component>
            </template>
        `;

        const exportMethod = this.options.esModule ? 'export default' : 'module.exports=';

        if (this.options.raw) {
            return `${exportMethod} {template:${JSON.stringify(sanTemplate)}}`;
        }

        const sanImport = this.options.esModule ? 'import san from "san";' : 'var san = require("san");';
        return `
            ${sanImport}
            ${exportMethod} san.defineComponent({template:${JSON.stringify(sanTemplate)}});
        `;
    }
}
