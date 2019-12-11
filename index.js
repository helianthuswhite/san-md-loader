import loaderUtils from 'loader-utils';
import Parser from './src/parser';

export default function (source) {
    const options = loaderUtils.getOptions(this) || {};
    const parser = new Parser(options);
    return parser.parse(source);
}
