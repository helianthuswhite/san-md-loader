# 按钮（Button）
响应用户操作，触发相应页面交互和功能，按钮包括如下几种：

- 普通按钮
- 强调按钮
- 大按钮
- 图标按钮

## 普通按钮
普通按钮颜色风格较弱，不会打扰用户，可在一个页面或对话框内放置多个普通按钮。（按钮文案均默认居中对齐）

```san
import {defineComponent} from 'san';
import {Button} from 'san-xui';

export default defineComponent({
    template: `
    <template>
        <s-button>默认按钮</s-button>
        <s-button disabled="{{true}}">disabled按钮</s-button>
        <s-button width="100">默认按钮</s-button>
        <s-button width="100" height="50">默认按钮</s-button>
    </template>
    `,

    components: {
        's-button': Button
    }
});
```

## 强调按钮
一个页面内强调按钮使用数量建议1-2个。目前强调按钮主要用于新建/购买入口、弹框的“确定”操作。

```san
import {defineComponent} from 'san';
import {Button} from 'san-xui';

export default defineComponent({
    template: `
    <template>
        <s-button>默认按钮</s-button>
        <s-button skin="primary">primary按钮</s-button>
        <s-button skin="dashed">dashed按钮</s-button>
        <s-button skin="danger">danger按钮</s-button>
        <s-button skin="stringfy">创建域名</s-button>
    </template>
    `,

    components: {
        's-button': Button
    }
});
```

## 大按钮
主要用于购买时的“下一步”和“支付”或者创建页面中底部“确定/保存”“取消”按钮。

```san
import {defineComponent} from 'san';
import {Button} from 'san-xui';

export default defineComponent({
    template: `
    <template>
        <s-button skin="primary" size="large">large按钮</s-button>
        <s-button skin="primary">primary按钮</s-button>
        <s-button skin="primary" size="small">small按钮</s-button>
    </template>
    `,

    components: {
        's-button': Button
    }
});
```

## 图标按钮
为了界面的排版及突出功能，考虑使用图标按钮而非图标来设计；图标按钮表述功能应简单易懂，同时配合鼠标悬浮提示使用，对于表意有可能不清晰的功能应该使用文字按钮而不是图标按钮。

```san
import {defineComponent} from 'san';
import {Button} from 'san-xui';

export default defineComponent({
    template: `
    <template>
        <s-button icon="refresh"></s-button>
        <s-button icon="sdk" disabled="{{true}}"></s-button>
        <s-button icon="plus" skin="primary">创建实例</s-button>
        <s-button icon="plus" skin="stringfy" disabled="{{true}}">创建域名</s-button>
    </template>
    `,

    components: {
        's-button': Button
    }
});
```
<div id="dwada"></div>
