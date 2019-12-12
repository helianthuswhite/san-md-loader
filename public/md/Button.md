# Button 按钮

----

按钮用于传递用户触摸时会触发的操作

## 基础按钮

基础按钮分三种：`主按钮（实心）` 、 `次按钮（空心）` 、 `文字按钮`

```san
import { defineComponent, Component } from 'san';

import { Button } from 'san-xui';

const template = `<template>
<div>
    <div class="title">按钮</div>
    <div class="demo-desc">默认、disabled、width=100、height=50</div>
    <div class="demo-panel">
        <s-button on-click="onCreate">默认按钮</s-button>
        <s-button disabled="{{true}}">disabled按钮</s-button>
        <s-button width="100">默认按钮</s-button>
        <s-button width="100" height="50">默认按钮</s-button>
    </div>
</div>
<div>
    <div class="title">skin</div>
    <div class="demo-desc">默认、primary、dashed、danger、stringfy</div>
    <div class="demo-panel">
        <s-button>默认按钮</s-button>
        <s-button skin="primary">primary按钮</s-button>
        <s-button skin="dashed">dashed按钮</s-button>
        <s-button skin="danger">danger按钮</s-button>
        <s-button skin="stringfy">创建域名</s-button>
    </div>
</div>
<div>
    <div class="title">size</div>
    <div class="demo-panel">
    <s-button skin="primary" size="large">large按钮</s-button>
    <s-button skin="primary">primary按钮</s-button>
    <s-button skin="primary" size="small">small按钮</s-button>
    </div>
</div>
<div>
    <div class="title">图标按钮</div>
    <div class="demo-panel">
        <s-button icon="refresh"></s-button>
        <s-button icon="sdk" disabled="{{true}}"></s-button>
        <s-button icon="plus" skin="primary">创建实例</s-button>
        <s-button icon="plus" skin="stringfy" disabled="{{true}}">创建域名</s-button>
    </div>
</div>
<div>
    <div class="title">loading(暂未实现)</div>
    <div class="demo-panel">

    </div>
</div>
</template>`;

export default defineComponent({
    template,
    components: {
        's-button': Button
    },
    initData() {
        return {
            layerStyle: {
                width: '300px',
                height: 'auto'
            }
        };
    },
    onCreate() {
        alert('On Create');
    }
});
```

## 不可用状态按钮

添加属性 `disabled` 禁用按钮

## 带颜色倾向的按钮

带有色彩倾向的按钮能给用户带来操作提示

## 图标文字按钮

如需要在在按钮中添加图标，可设置 `icon` 属性，或者自行在 `Button` 中内联 `icon`。通过 `icon` 属性设置的图标，位置固定在文本的前面。

## 加载中按钮

可通过添加 `loading` 属性，使按钮处于加载中状态


## 组合按钮

可以将多个按钮放进 `AtButtonGroup` 中形成一个组合按钮

## Button 参数

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| type | 按钮的类型 | String | `default`, `primary`, `success`, `error`, `warning`, `info`, `text` | - |
| nativeType | 原生按钮的类型 | String | - | `button` |
| size | 按钮的大小 | String | `large`, `small`, `smaller` | - |
| hollow | 是否为空心按钮 | Boolean | - | false |
| icon | 按钮的图标类名，填入图标的 `classname` | String | 见文档 `Icon 图标` | - |
| loading | 设置按钮的载入状态 | Boolean | - | false |
| circle | 设置圆形图标按钮 | Boolean | - | false |

## Button Group 参数

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| size | 按钮的大小 | String | `large`, `small` | 正常大小 |
| gap | 按钮间隔 | Number | - | -1 |
