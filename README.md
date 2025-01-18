# Jovencio DataTable Vue📝  

# EN

A library that integrates with the [DataTable Vue 3](https://github.com/DataTables/Vue) library, making it reactive to your project. The official library lacks native support for reactive Vue components, and this library was developed to make an already excellent library even better.

---

## Features  
- [SearchBuilder.Criteria](https://datatables.net/extensions/searchbuilder)  
  up to 3 levels.  
- Column sorting via datatable AJAX.  
- Column search via datatable AJAX.  
- I18n (pt-BR and en).  
- [Maska](https://github.com/beholdr/maska) support for [SearchBuilder.Criteria](https://datatables.net/extensions/searchbuilder) fields.  

---

## Installation

```sh
npm i jovencio-datatable-vue
```

## Usage/Examples
- [Preview](https://github.com/lucasjovencio/jovencio-datatable/blob/main/tests/Unit/DataTableQueryFactoryBuildTest.php)

```js

<template>
    <div class="p-4">
    <button class="button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-green-600 hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-400 border-green-600 hover:border-green-900 dark:border-green-600 dark:hover:border-green-400 border-1 border mr-2 px-1 py-1 text-sm" @click="setLanguage('en')">EN</button>
    <button class="button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-green-600 hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-400 border-green-600 hover:border-green-900 dark:border-green-600 dark:hover:border-green-400 border-1 border mr-2 px-1 py-1 text-sm" @click="setLanguage('pt-BR')">pt-BR</button>

    <JovencioDatatable
        v-if="showDataTable"
        :locale="locale"
        :columns="tableColumns"
        :update="updateAjax"
        :options="optionsDataTable"
        @trigger="listenTrigger"
        @listen="listenTrigger2"
    />
    
    </div>

</template>
<script lang="ts">
    import {
        JovencioDatatable,
        JovencioDatatableCommon,
    } from "jovencio-datatable-vue";
    import type {
        JovencioDataTableColumn,
        JovencioButtonGenerate,
        JovencioDataTableMeta,
        JovencioButtonProvider,
        JovencioClousure,
        JovencioTrigger,
        JovencioDataTableOption,
        MaskaDatatable
    } from "jovencio-datatable-vue";
    import "jovencio-datatable-vue/dist/style.css";

    export default {
    data() {
        return {
        tableColumns: [] as JovencioDataTableColumn[],
        showDataTable: false,
        optionsDataTable: {
            url: "https://jsonplaceholder.typicode.com/posts",
            /**
            *  dataSrc was used to create a test environment during development. 
            *  Please return a dataset in the format expected by the datatable
            *  https://datatables.net/examples/server_side/return_search.html, 
            *  and there's no need for that closure to format the data.
            */
            dataSrc: function (json:any) {
                return json.map((post:any) => ({
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    created_at: new Date(),
                    actions: '',
                    views: Math.floor(Math.random() * (9999 - 10 + 1)),
                    monetization: Math.floor(Math.random() * (9999 - 10 + 1)) + 10,
                }));
            },
            
            searchBuilder: {
                enable: true,
                columns: [0, 1, 2, 3, 4, 5],
                // example on documentation https://datatables.net/extensions/searchbuilder/examples/customisation/plugin.html
                conditions: {
                    "example-select-title": {
                        '=': {
                            isInputValid: function (el:any) {
                                return window.jQuery(el[0]).find('option:selected').length > 0;
                            },
                            conditionName: function(dt:any) {
                                return dt.settings()[0].oLanguage.searchBuilder.conditions.string.equals;
                            },
                            inputValue: function (el:any) {
                                return window.jQuery(el[0]).find('option:selected').map(function() {
                                    return window.jQuery(this).val();
                                }).get();
                            },
                            init: function (that:any, fn:any, preDefined = null) {
                                let column = window.jQuery(that.dom.data).children('option:selected').val();
                                let indexArray = that.s.dt.rows().indexes().toArray();
                                let added = [];

                                let el = window.jQuery('<select class="dtsb-value dtsb-dropDown dtsb-select" style="width: 300px"></select>');
                                window.jQuery(el).append('<option value="">Selecione um valor</option>');

                                for (let index of indexArray) {
                                    let cell = that.s.dt.cell(index, column);
                                    let value = {
                                        filter: cell.render(that.c.orthogonal.search),
                                        index,
                                        text: cell.render('display')
                                    };

                                    if (added.indexOf(value.filter) === -1) {
                                        let opt = window.jQuery('<option>', {
                                            text: value.text,
                                            value: value.filter
                                        });

                                        window.jQuery(el).append(opt);
                                        added.push(value.filter);

                                        if (preDefined !== null && opt.val() === preDefined[0]) {
                                            opt.prop('selected', true);
                                        }
                                    }
                                }

                                el.on('change', function () {
                                    fn(that, el);
                                });

                                return el;
                            },
                            search: function (value:any, comparison:any) {
                                return value === comparison[0];
                            }
                        }
                    }
                }
            },
            
            classTable: "min-w-full leading-normal"
        } as JovencioDataTableOption,
        updateAjax: "",
        locale: "en"
        };
    },
    components: {
        JovencioDatatable,
    },
    created() {
        const self = this;
        self.tableColumns = [
            {
                id: "id",
                name: ('Account'),
                orderable: true,
                searchable: true,
                type: 'string',
                class: "bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-gray-100",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    return `
                        <div class="flex items-center">
                            <div class="h-10 w-10 flex-shrink-0">
                                <img class="h-full w-full rounded-full" src="https://www.gravatar.com/avatar/4087be697d7928a6dbfe15661246a135.jpg?s=200&d=mp" alt="${data}" />
                            </div>
                            <div class="ml-3">
                                <p class="whitespace-nowrap text-xs">
                                    ${data}
                                </p>
                            </div>
                        </div>
                    `;
                }
            },
            {
                id: "title",
                type: 'example-select-title',
                orderable: false,
                searchable: false,
                name: ("Title"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
            },
            {
                id: "body",
                type: 'string',
                name: ("Description"),
                orderable: true,
                searchable: false,
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    const provider = {
                        'object': row,
                        'meta': meta,
                        'key': 'clousure-body',
                        'buttons': [
                            {
                                key: "lock",
                                enable: true,
                                name: "Block/Unblock",
                                show_name: false,
                                class: `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600 mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-gray-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-class-dark="bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-hover-class-dark="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600`,
                                order: 0,
                                svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                                svg_secondary:
                                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            } as JovencioButtonGenerate,
                            {
                                key: 'listen',
                                enable: true,
                                custom_element: 'button',
                                class_id: 'load-listen-datatable',
                                name: ("Description Listen"),
                                show_name: true,
                                class:`button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600 mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-green-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600" btn-class-dark="bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600" btn-hover-class-dark="hover:bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600`,
                                order: 1,
                                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>`
                            },
                        ]
                    };
                    return ((data) ? data : '')+' '+JovencioDatatableCommon.providerButtonDT(provider);
                }
            },
            {
                id: "views",
                type: 'num',
                mask: {
                    i18n: {
                        'pt-BR': {
                            mask: (value:string) => {
                                let raw = value.replace(/[^0-9]/g, '');
                                if (raw) {
                                    const intValue = parseInt(raw);
                                    return new Intl.NumberFormat("pt-BR", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(intValue);
                                }
                                return "";
                            },
                            tokens: null,
                            number: null,
                            preProcess:null,
                            postProcess:null
                        },
                        'en': {
                            mask: (value:string) => {
                                let raw = value.replace(/[^0-9]/g, '');
                                if (raw) {
                                    const intValue = parseInt(raw);
                                    return new Intl.NumberFormat("en-US", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(intValue);
                                }
                                return "";
                            },
                            tokens: null,
                            number: null,
                            preProcess: null,
                            postProcess: null
                        }
                    }
                } as MaskaDatatable,
                orderable: false,
                searchable: false,
                name: ("Viewes"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    const intValue = parseInt(data);
                    return new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(intValue);
                },
            },
            {
                id: "monetization",
                type: 'num',
                mask: {
                    i18n: {
                        'pt-BR': {
                            mask: (value:string) => {
                                let raw = value.replace(/[^0-9,-]/g, '');
                                if (raw) {
                                    raw = raw.replace(",", ".");
                                    let sub = 3 - (raw.includes(".") ? raw.length - raw.indexOf(".") : 0);
                                    if ( sub < 0) {
                                        sub = 0  
                                    }
                                    const floatValue = parseFloat(raw);
                                    return new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })
                                    .format(floatValue || 0)
                                    .slice(0, sub ? -sub : undefined);
                                }
                                return "R$ ";
                            },
                            tokens: null,
                            number: null,
                            preProcess:null,
                            postProcess:null
                        },
                        'en': {
                            mask: null,
                            tokens: null,
                            number: null,
                            preProcess: (val:string) => val.replace(/[$,]/g, ""),
                            postProcess: (val:string) => {
                                if (!val) return "";

                                let sub = 3 - (val.includes(".") ? val.length - val.indexOf(".") : 0);
                                if (sub < 0) {
                                    sub = 0;
                                }
                                const floatValue = parseFloat(val);
                                return Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })
                                .format(floatValue)
                                .slice(0, sub ? -sub : undefined);
                            }
                        }
                    }
                } as MaskaDatatable,
                orderable: false,
                searchable: false,
                name: () => {
                    try {
                        const i18n = {
                            'pt-BR': "Monetização",
                            'en': "Monetization"
                        } as any;
                        return i18n[self.locale];
                    } catch (e) {
                        return "Monetization";
                    }
                },
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    try {
                        const floatValue = parseFloat(data);
                        const i18n = {
                            'pt-BR': new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(floatValue || 0),
                            'en': new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(floatValue || 0)
                        } as any;
                        return i18n[self.locale];
                    } catch (e) {
                        return data;
                    }
                },
            },
            {
                id: "created_at",
                type: 'moment',
                orderable: true,
                searchable: false,
                name: ("Created At"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
            },
            {
                id: "actions",
                name: ("Actions"),
                orderable: false,
                searchable: false,
                class: "whitespace-nowrap border-b border-gray-300 px-5 py-5 text-sm dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    const provider = {
                        'object': row,
                        'meta': meta,
                        'key': 'clousure-actions',
                        'buttons': [
                            {
                            key: "lock",
                            enable: true,
                            name: "Block/Unblock",
                            show_name: false,
                            class: `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600 mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-gray-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-class-dark="bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-hover-class-dark="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600`,
                            order: 1,
                            svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            svg_secondary:
                                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            } as JovencioButtonGenerate,
                            {
                            key: "edit",
                            enable: true,
                            name: "Edit",
                            order: 2,
                            } as JovencioButtonGenerate,
                            {
                            key: "delete",
                            enable: true,
                            name: "Remove",
                            order: 4,
                            } as JovencioButtonGenerate,
                            {
                            key: "duplicate",
                            enable: true,
                            class_id: "load-duplicates-datatable",
                            name: "Duplicate",
                            class: "button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-blue-600 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-400 border-blue-600 hover:border-blue-900 dark:border-blue-600 dark:hover:border-blue-400 border-1 border mr-2 px-1 py-1 text-sm",
                            order: 3,
                            svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>`,
                            } as JovencioButtonGenerate,
                        ]
                    } as JovencioButtonProvider;
                    return JovencioDatatableCommon.providerButtonDT(provider);
                },
                triggers: function (addClousure: JovencioClousure) {
                    addClousure({
                        'selector': '.load-locks-datatable-clousure-actions',
                        'enable': true,
                        'type': 'lock',
                    });

                    addClousure({
                        'selector': '.load-edits-datatable-clousure-actions',
                        'triggerSignature': 'triggerShow',
                        'lock': 'lock-edit',
                        'enable': false,
                    });

                    addClousure({
                        'selector': '.load-deletes-datatable-clousure-actions',
                        'triggerSignature': 'triggerDelete',
                        'lock': 'lock-delete',
                        'enable': false,
                    });

                    addClousure({
                        'selector': '.load-duplicates-datatable-clousure-actions',
                        'triggerSignature': 'triggerDuplicate',
                        'enable': false,
                    });

                    

                    addClousure({
                        'selector': '.load-listen-datatable-clousure-body',
                        'trigger': 'listen',
                        'triggerSignature': 'triggerListen',
                        'lock': 'lock-listen',
                        'enable': true,
                    });

                    addClousure({
                        'selector': '.load-locks-datatable-clousure-body',
                        'enable': true,
                        'type': 'lock',
                    });
                }
            },
        ] as JovencioDataTableColumn[];
    },
    mounted() {
        this.showDataTable = true;
    },
    methods: {
        listenTrigger(trigger: JovencioTrigger) {
            alert("Event: "+trigger.type+" Object: "+JSON.stringify(trigger.data))
            console.log(trigger);
        },
        listenTrigger2(trigger: JovencioTrigger) {
            alert("Event: "+trigger.type+" Object: "+JSON.stringify(trigger.data))
            console.log(trigger);
        },
        setLanguage(locale:string) {
            this.locale = locale
            }
        },
    };
</script>
```


# Lib Config

``` js
:columns="arr as JovencioDataTableColumn[]"

interface JovencioClousure {
    (provider: JovencioProviderClousure): void;
}

interface JovencioDataTableMeta {
    row: number|string,
    col: number|string,
    settings?: object
}

interface MaskNumber {
    locale?: string
    fraction?: number
    unsigned?: boolean
}

interface MaskToken {
    pattern: RegExp
    multiple?: boolean
    optional?: boolean
    repeated?: boolean
    transform?: (char: string) => string
}

interface MaskGroup {
    mask?: {
        mask?: MaskType
        tokens?: MaskToken,
        tokensReplace?: boolean
        eager?: boolean
        reversed?: boolean
        number?: MaskNumber
    },
    tokens?: MaskToken,
    number?: string | string[] | MaskNumber | null,
    preProcess?: string | ((input: string) => string),
    postProcess?: string | ((input: string) => string),
}

interface MaskaDatatableI18n {
    i18n?: {
        'pt-BR': MaskGroup;
        'en': MaskGroup;
    };
}

type MaskType = string | string[] | ((input: string) => string) | null
type MaskaDatatable = MaskaDatatableI18n | MaskGroup;
type Types = 'string' | 'num' | 'moment';
interface JovencioDataTableColumn {
    id: string,
    name: string | (() => string),
    orderable: boolean,
    searchable: boolean,
    mask: MaskaDatatable,
    type?: Types,
    class?: string,
    colspan?: Number,
    rowspan?: Number,
    render?(data: any, type: string, row: any, meta: JovencioDataTableMeta): void,
    triggers?(addClousure:JovencioClousure): void
}
```


## Properties of JovencioDataTableColumn:

- **id**: `string`  
  - The JSON property identifier.  

- **name**: `string | (() => string)`  
  - The visible name of the column in the table. It can also be an anonymous function that returns the column name based on the selected language.  

- **orderable**: `boolean`  
  - Allows the datatable to sort the table based on the property.  

- **searchable**: `boolean`  
  - Enables datatable global search functionality for the column.  

- **mask**: `MaskaDatatable`  
  - Implements the [Maska](https://github.com/beholdr/maska) interface. You can also define an `i18n` object with specific masks for `en` and `pt-BR`.  

- **type**: `Types`  
  - The primary column types compatible with Criteria.  

- **class**: `string`  
  - Property to add a CSS class to the cell.  

- **colspan**: `Number`  
  - The number of columns a cell should span.  

- **rowspan**: `Number`  
  - The number of rows a cell should span.  

- **render**: `(data: any, type: string, row: any, meta: JovencioDataTableMeta): void`  
  - Defines custom rendering for the cell in the datatable. You can modify the information visible in the table cell here.  
    - Reactive button generation is implemented within the `render` function (explained here).  

- **triggers**: `(addClousure: JovencioClousure): void`  
  - Method to register events for reactive buttons defined in the `render` property.  



## Creating a Reactive Button in the Table
```js
render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
    const provider = {
        'object': row,
        'meta': meta,
        'key': 'clousure-body',
        'buttons': [
            {
                key: 'listen',
                enable: true,
                custom_element: 'button',
                name: ("Description Listen"),
                show_name: false,
                class:"button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm",
                order: 0,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>`,
                class_id: 'load-listen-datatable'
            } as JovencioButtonGenerate,
        ] as JovencioButtonProvider
    };
    return ((data) ? data : '')+' '+JovencioDatatableCommon.providerButtonDT(provider);
}
```

- **object**: `any`  
  - The complete object of the row.

- **meta**: `JovencioDataTableMeta`  
  - Properties of the cell.

- **key**: `string`  
  - Grouping key for reactive buttons in the cell.  
    - This grouping is essential for button reactivity.

- **buttons**: `JovencioButtonGenerate[]`  
  - **key**: `string`  
    - Identifier for buttons. For predefined types like [block, edit, delete], configurations are already provided using Tailwind CSS. For custom buttons, specify a unique name.

  - **enable**: `boolean`  
    - Configuration to restrict the button based on the connected user's authorization.

  - **custom_element**: `string`  
    - Default is `button`. This property allows you to define the tag to be used.

  - **class_id**: `string`  
    - Prefix for button grouping. This `class_id` is important for button reactivity but not required for [block, edit, delete].  
    - Mandatory for custom buttons that are not [block, edit, delete].

  - **name**: `string`  
    - Name of the button to display.

  - **show_name**: `boolean`  
    - Defines whether the display name of the button will be shown. Defaults to `false`.

  - **class**: `string`  
    - Property to redefine the button's CSS class.

  - **order**: `number`  
    - Property to define the button order.

  - **svg**: `string`  
    - Property to set the SVG icon for the button. Requires the complete SVG tag.

  - **html_icon**: `string`  
    - Property to define an HTML icon tag. If set, it replaces the `svg` property.

  - **svg_secondary**: `string`  
    - Property to define a secondary SVG icon. This tag works only for the `block` button type.



## Making a Button Reactive
``` js
triggers: function (addClousure: JovencioClousure) {
    addClousure({
        'selector': '.load-listen-datatable-clousure-body',
        'trigger': 'listen',
        'triggerSignature': 'triggerListen',
        'enable': true,
    });

    addClousure({
        'selector': '.load-locks-datatable-clousure-actions',
        'enable': true,
        'type': 'lock',
    });

    addClousure({
        'selector': '.load-edits-datatable-clousure-actions',
        'triggerSignature': 'triggerShow',
        'lock': 'lock-edit',
        'enable': false,
    });

    addClousure({
        'selector': '.load-deletes-datatable-clousure-actions',
        'triggerSignature': 'triggerDelete',
        'lock': 'lock-delete',
        'enable': false,
    });

    addClousure({
        'selector': '.load-duplicates-datatable-clousure-actions',
        'triggerSignature': 'triggerDuplicate',
        'lock': 'lock-duplicate',
        'enable': false,
    });
}
```

- **selector**  
  - Property to identify buttons, consisting of two attributes: `class_id` from `JovencioButtonGenerate` and `key` from `JovencioButtonProvider`, in the sequence `class_id + key`.  
  - The `class_id` from `JovencioButtonGenerate` for [block, edit, delete] is immutable, while the `key` from `JovencioButtonProvider` varies according to the closure of the button set.

- **trigger**  
  - Property to emit events. The default trigger is `trigger`. This declared property can be used as `@trigger` or `@customTrigger` in the datatable component to call a function within your component.

- **triggerSignature**  
  - Property to define an identification signature for the trigger. Useful when all events fire to the same trigger.

- **enable**  
  - Property to define the button's availability. Useful for rules related to the logged-in user.

- **lock**  
  - Property to specify if the button will be locked by a `lock` button. This property must be set in the format `lock-exibe_modal`, where `lock` defines the type of action (in this case, lock) and `exibe_modal` is a `key` from `JovencioButtonGenerate`.


# BR

Uma biblioteca que integra biblioteca [DataTable Vue 3](https://github.com/DataTables/Vue) tornando ela reativa ao seu projeto, a lib oficial não tem suporte nativo a component's reativos do vue, e essa biblioteca foi desenvolvida para torna essa biblioteca perfeita ainda mais perfeita.
     
## Features  
  - [SearchBuilder.Criteria](https://datatables.net/extensions/searchbuilder) 
    em até 3 níveis.
  - Ordenação de colunas por ajax do datatable
  - Pesquisa em colunas por ajax do datatable
  - I18n (pt-BR e en)
  - [Maska](https://github.com/beholdr/maska) em campos de [SearchBuilder.Criteria](https://datatables.net/extensions/searchbuilder)

## Install

```sh
npm i jovencio-datatable-vue
```

## Usage/Examples
- [Preview](https://github.com/lucasjovencio/jovencio-datatable/blob/main/tests/Unit/DataTableQueryFactoryBuildTest.php)


```js

<template>
    <div class="p-4">
    <button class="button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-green-600 hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-400 border-green-600 hover:border-green-900 dark:border-green-600 dark:hover:border-green-400 border-1 border mr-2 px-1 py-1 text-sm" @click="setLanguage('en')">EN</button>
    <button class="button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-green-600 hover:bg-green-900 dark:bg-green-600 dark:hover:bg-green-400 border-green-600 hover:border-green-900 dark:border-green-600 dark:hover:border-green-400 border-1 border mr-2 px-1 py-1 text-sm" @click="setLanguage('pt-BR')">pt-BR</button>

    <JovencioDatatable
        v-if="showDataTable"
        :locale="locale"
        :columns="tableColumns"
        :update="updateAjax"
        :options="optionsDataTable"
        @trigger="listenTrigger"
        @listen="listenTrigger2"
    />
    
    </div>

</template>
<script lang="ts">
    import {
        JovencioDatatable,
        JovencioDatatableCommon,
    } from "jovencio-datatable-vue";
    import type {
        JovencioDataTableColumn,
        JovencioButtonGenerate,
        JovencioDataTableMeta,
        JovencioButtonProvider,
        JovencioClousure,
        JovencioTrigger,
        JovencioDataTableOption,
        MaskaDatatable
    } from "jovencio-datatable-vue";
    import "jovencio-datatable-vue/dist/style.css";

    export default {
    data() {
        return {
        tableColumns: [] as JovencioDataTableColumn[],
        showDataTable: false,
        optionsDataTable: {
            url: "https://jsonplaceholder.typicode.com/posts",
            /**
            *  dataSrc was used to create a test environment during development. 
            *  Please return a dataset in the format expected by the datatable
            *  https://datatables.net/examples/server_side/return_search.html, 
            *  and there's no need for that closure to format the data.
            */
            dataSrc: function (json:any) {
                return json.map((post:any) => ({
                    id: post.id,
                    title: post.title,
                    body: post.body,
                    created_at: new Date(),
                    actions: '',
                    views: Math.floor(Math.random() * (9999 - 10 + 1)),
                    monetization: Math.floor(Math.random() * (9999 - 10 + 1)) + 10,
                }));
            },
            
            searchBuilder: {
                enable: true,
                columns: [0, 1, 2, 3, 4, 5],
                // example on documentation https://datatables.net/extensions/searchbuilder/examples/customisation/plugin.html
                conditions: {
                    "example-select-title": {
                        '=': {
                            isInputValid: function (el:any) {
                                return window.jQuery(el[0]).find('option:selected').length > 0;
                            },
                            conditionName: function(dt:any) {
                                return dt.settings()[0].oLanguage.searchBuilder.conditions.string.equals;
                            },
                            inputValue: function (el:any) {
                                return window.jQuery(el[0]).find('option:selected').map(function() {
                                    return window.jQuery(this).val();
                                }).get();
                            },
                            init: function (that:any, fn:any, preDefined = null) {
                                let column = window.jQuery(that.dom.data).children('option:selected').val();
                                let indexArray = that.s.dt.rows().indexes().toArray();
                                let added = [];

                                let el = window.jQuery('<select class="dtsb-value dtsb-dropDown dtsb-select" style="width: 300px"></select>');
                                window.jQuery(el).append('<option value="">Selecione um valor</option>');

                                for (let index of indexArray) {
                                    let cell = that.s.dt.cell(index, column);
                                    let value = {
                                        filter: cell.render(that.c.orthogonal.search),
                                        index,
                                        text: cell.render('display')
                                    };

                                    if (added.indexOf(value.filter) === -1) {
                                        let opt = window.jQuery('<option>', {
                                            text: value.text,
                                            value: value.filter
                                        });

                                        window.jQuery(el).append(opt);
                                        added.push(value.filter);

                                        if (preDefined !== null && opt.val() === preDefined[0]) {
                                            opt.prop('selected', true);
                                        }
                                    }
                                }

                                el.on('change', function () {
                                    fn(that, el);
                                });

                                return el;
                            },
                            search: function (value:any, comparison:any) {
                                return value === comparison[0];
                            }
                        }
                    }
                }
            },
            
            classTable: "min-w-full leading-normal"
        } as JovencioDataTableOption,
        updateAjax: "",
        locale: "en"
        };
    },
    components: {
        JovencioDatatable,
    },
    created() {
        const self = this;
        self.tableColumns = [
            {
                id: "id",
                name: ('Account'),
                orderable: true,
                searchable: true,
                type: 'string',
                class: "bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-gray-100",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    return `
                        <div class="flex items-center">
                            <div class="h-10 w-10 flex-shrink-0">
                                <img class="h-full w-full rounded-full" src="https://www.gravatar.com/avatar/4087be697d7928a6dbfe15661246a135.jpg?s=200&d=mp" alt="${data}" />
                            </div>
                            <div class="ml-3">
                                <p class="whitespace-nowrap text-xs">
                                    ${data}
                                </p>
                            </div>
                        </div>
                    `;
                }
            },
            {
                id: "title",
                type: 'example-select-title',
                orderable: false,
                searchable: false,
                name: ("Title"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
            },
            {
                id: "body",
                type: 'string',
                name: ("Description"),
                orderable: true,
                searchable: false,
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    const provider = {
                        'object': row,
                        'meta': meta,
                        'key': 'clousure-body',
                        'buttons': [
                            {
                                key: "lock",
                                enable: true,
                                name: "Block/Unblock",
                                show_name: false,
                                class: `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600 mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-gray-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-class-dark="bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-hover-class-dark="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600`,
                                order: 0,
                                svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                                svg_secondary:
                                    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            } as JovencioButtonGenerate,
                            {
                                key: 'listen',
                                enable: true,
                                custom_element: 'button',
                                class_id: 'load-listen-datatable',
                                name: ("Description Listen"),
                                show_name: true,
                                class:`button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600 mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-green-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600" btn-class-dark="bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600" btn-hover-class-dark="hover:bg-green-600 focus:bg-green-600 active:bg-green-600 dark:focus:bg-green-600 dark:active:bg-green-600 dark:hover:bg-green-600`,
                                order: 1,
                                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>`
                            },
                        ]
                    };
                    return ((data) ? data : '')+' '+JovencioDatatableCommon.providerButtonDT(provider);
                }
            },
            {
                id: "views",
                type: 'num',
                mask: {
                    i18n: {
                        'pt-BR': {
                            mask: (value:string) => {
                                let raw = value.replace(/[^0-9]/g, '');
                                if (raw) {
                                    const intValue = parseInt(raw);
                                    return new Intl.NumberFormat("pt-BR", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(intValue);
                                }
                                return "";
                            },
                            tokens: null,
                            number: null,
                            preProcess:null,
                            postProcess:null
                        },
                        'en': {
                            mask: (value:string) => {
                                let raw = value.replace(/[^0-9]/g, '');
                                if (raw) {
                                    const intValue = parseInt(raw);
                                    return new Intl.NumberFormat("en-US", {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(intValue);
                                }
                                return "";
                            },
                            tokens: null,
                            number: null,
                            preProcess: null,
                            postProcess: null
                        }
                    }
                } as MaskaDatatable,
                orderable: false,
                searchable: false,
                name: ("Viewes"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    const intValue = parseInt(data);
                    return new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                    }).format(intValue);
                },
            },
            {
                id: "monetization",
                type: 'num',
                mask: {
                    i18n: {
                        'pt-BR': {
                            mask: (value:string) => {
                                let raw = value.replace(/[^0-9,-]/g, '');
                                if (raw) {
                                    raw = raw.replace(",", ".");
                                    let sub = 3 - (raw.includes(".") ? raw.length - raw.indexOf(".") : 0);
                                    if ( sub < 0) {
                                        sub = 0  
                                    }
                                    const floatValue = parseFloat(raw);
                                    return new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })
                                    .format(floatValue || 0)
                                    .slice(0, sub ? -sub : undefined);
                                }
                                return "R$ ";
                            },
                            tokens: null,
                            number: null,
                            preProcess:null,
                            postProcess:null
                        },
                        'en': {
                            mask: null,
                            tokens: null,
                            number: null,
                            preProcess: (val:string) => val.replace(/[$,]/g, ""),
                            postProcess: (val:string) => {
                                if (!val) return "";

                                let sub = 3 - (val.includes(".") ? val.length - val.indexOf(".") : 0);
                                if (sub < 0) {
                                    sub = 0;
                                }
                                const floatValue = parseFloat(val);
                                return Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD"
                                })
                                .format(floatValue)
                                .slice(0, sub ? -sub : undefined);
                            }
                        }
                    }
                } as MaskaDatatable,
                orderable: false,
                searchable: false,
                name: () => {
                    try {
                        const i18n = {
                            'pt-BR': "Monetização",
                            'en': "Monetization"
                        } as any;
                        return i18n[self.locale];
                    } catch (e) {
                        return "Monetization";
                    }
                },
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    try {
                        const floatValue = parseFloat(data);
                        const i18n = {
                            'pt-BR': new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }).format(floatValue || 0),
                            'en': new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }).format(floatValue || 0)
                        } as any;
                        return i18n[self.locale];
                    } catch (e) {
                        return data;
                    }
                },
            },
            {
                id: "created_at",
                type: 'moment',
                orderable: true,
                searchable: false,
                name: ("Created At"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
            },
            {
                id: "actions",
                name: ("Actions"),
                orderable: false,
                searchable: false,
                class: "whitespace-nowrap border-b border-gray-300 px-5 py-5 text-sm dark:border-gray-500",
                render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
                    const provider = {
                        'object': row,
                        'meta': meta,
                        'key': 'clousure-actions',
                        'buttons': [
                            {
                            key: "lock",
                            enable: true,
                            name: "Block/Unblock",
                            show_name: false,
                            class: `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600 mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-gray-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-class-dark="bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600" btn-hover-class-dark="hover:bg-gray-600 focus:bg-gray-600 active:bg-gray-600 dark:focus:bg-gray-600 dark:active:bg-gray-600 dark:hover:bg-gray-600`,
                            order: 1,
                            svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            svg_secondary:
                                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            } as JovencioButtonGenerate,
                            {
                            key: "edit",
                            enable: true,
                            name: "Edit",
                            order: 2,
                            } as JovencioButtonGenerate,
                            {
                            key: "delete",
                            enable: true,
                            name: "Remove",
                            order: 4,
                            } as JovencioButtonGenerate,
                            {
                            key: "duplicate",
                            enable: true,
                            class_id: "load-duplicates-datatable",
                            name: "Duplicate",
                            class: "button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-blue-600 hover:bg-blue-900 dark:bg-blue-600 dark:hover:bg-blue-400 border-blue-600 hover:border-blue-900 dark:border-blue-600 dark:hover:border-blue-400 border-1 border mr-2 px-1 py-1 text-sm",
                            order: 3,
                            svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>`,
                            } as JovencioButtonGenerate,
                        ]
                    } as JovencioButtonProvider;
                    return JovencioDatatableCommon.providerButtonDT(provider);
                },
                triggers: function (addClousure: JovencioClousure) {
                    addClousure({
                        'selector': '.load-locks-datatable-clousure-actions',
                        'enable': true,
                        'type': 'lock',
                    });

                    addClousure({
                        'selector': '.load-edits-datatable-clousure-actions',
                        'triggerSignature': 'triggerShow',
                        'lock': 'lock-edit',
                        'enable': false,
                    });

                    addClousure({
                        'selector': '.load-deletes-datatable-clousure-actions',
                        'triggerSignature': 'triggerDelete',
                        'lock': 'lock-delete',
                        'enable': false,
                    });

                    addClousure({
                        'selector': '.load-duplicates-datatable-clousure-actions',
                        'triggerSignature': 'triggerDuplicate',
                        'enable': false,
                    });

                    

                    addClousure({
                        'selector': '.load-listen-datatable-clousure-body',
                        'trigger': 'listen',
                        'triggerSignature': 'triggerListen',
                        'lock': 'lock-listen',
                        'enable': true,
                    });

                    addClousure({
                        'selector': '.load-locks-datatable-clousure-body',
                        'enable': true,
                        'type': 'lock',
                    });
                }
            },
        ] as JovencioDataTableColumn[];
    },
    mounted() {
        this.showDataTable = true;
    },
    methods: {
        listenTrigger(trigger: JovencioTrigger) {
            alert("Event: "+trigger.type+" Object: "+JSON.stringify(trigger.data))
            console.log(trigger);
        },
        listenTrigger2(trigger: JovencioTrigger) {
            alert("Event: "+trigger.type+" Object: "+JSON.stringify(trigger.data))
            console.log(trigger);
        },
        setLanguage(locale:string) {
            this.locale = locale
            }
        },
    };
</script>
```

# Configurações da lib

``` js
:columns="arr as JovencioDataTableColumn[]"

interface JovencioClousure {
    (provider: JovencioProviderClousure): void;
}

interface JovencioDataTableMeta {
    row: number|string,
    col: number|string,
    settings?: object
}

interface MaskNumber {
    locale?: string
    fraction?: number
    unsigned?: boolean
}

interface MaskToken {
    pattern: RegExp
    multiple?: boolean
    optional?: boolean
    repeated?: boolean
    transform?: (char: string) => string
}

interface MaskGroup {
    mask?: {
        mask?: MaskType
        tokens?: MaskToken,
        tokensReplace?: boolean
        eager?: boolean
        reversed?: boolean
        number?: MaskNumber
    },
    tokens?: MaskToken,
    number?: string | string[] | MaskNumber | null,
    preProcess?: string | ((input: string) => string),
    postProcess?: string | ((input: string) => string),
}

interface MaskaDatatableI18n {
    i18n?: {
        'pt-BR': MaskGroup;
        'en': MaskGroup;
    };
}

type MaskType = string | string[] | ((input: string) => string) | null
type MaskaDatatable = MaskaDatatableI18n | MaskGroup;
type Types = 'string' | 'num' | 'moment';
interface JovencioDataTableColumn {
    id: string,
    name: string | (() => string),
    orderable: boolean,
    searchable: boolean,
    mask: MaskaDatatable,
    type?: Types,
    class?: string,
    colspan?: Number,
    rowspan?: Number,
    render?(data: any, type: string, row: any, meta: JovencioDataTableMeta): void,
    triggers?(addClousure:JovencioClousure): void
}
```

## Propriedades de JovencioDataTableColumn:

- **id**: `string`  
    - Propriedade que representa o identificador único da coluna no JSON.

- **name**: `string | (() => string)`  
    - Nome visível da coluna na tabela. Pode ser uma função anônima que retorna o nome da coluna de acordo com o idioma selecionado.

- **orderable**: `boolean`  
    - Define se a coluna pode ser ordenada no DataTable.

- **searchable**: `boolean`  
    - Permite que a coluna seja pesquisável pelo método de pesquisa global do DataTable.

- **mask**: `MaskaDatatable`  
    - Implementa a interface do [Maska](https://github.com/beholdr/maska). É possível também utilizar um objeto i18n, permitindo diferentes formatações para os idiomas En (Inglês) e Pt-BR (Português-Brasil).

- **type**: `Types`  
    - Define os tipos primários de colunas que funcionam com Criteria. Esses tipos determinam como a coluna será tratada na lógica de pesquisa e ordenação.

- **class**: `string`  
    - Classe CSS que pode ser aplicada à célula da tabela para customizar seu estilo visual.

- **colspan**: `number`  
    - Define o número de colunas que uma célula irá ocupar.

- **rowspan**: `number`  
    - Define o número de linhas que uma célula irá ocupar.

- **render**: `(data: any, type: string, row: any, meta: JovencioDataTableMeta): void`  
    - Função de renderização da célula. Aqui, você pode modificar o conteúdo da célula, permitindo customizações no que é exibido.
        - A geração de botões reativos é feita dentro dessa função `render`, o que permite controle dinâmico de como os dados serão exibidos e interagidos.

- **triggers**: `(addClousure: JovencioClousure): void`  
    - Método utilizado para registrar eventos para os botões reativos definidos na propriedade `render`. Isso permite adicionar interatividade à tabela.


## Criando um botão reativo na tabela
```js
render: function (data: any, type: string, row: any, meta: JovencioDataTableMeta) {
    const provider = {
        'object': row,
        'meta': meta,
        'key': 'clousure-body',
        'buttons': [
            {
                key: 'listen',
                enable: true,
                custom_element: 'button',
                name: ("Description Listen"),
                show_name: false,
                class:"button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm",
                order: 0,
                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>`,
                class_id: 'load-listen-datatable'
            } as JovencioButtonGenerate,
        ] as JovencioButtonProvider
    };
    return ((data) ? data : '')+' '+JovencioDatatableCommon.providerButtonDT(provider);
}
```

## Propriedades de uma geração de botão:

- **object**: `any`  
  - O objeto completo da linha.

- **meta**: `JovencioDataTableMeta`  
  - Propriedades relacionadas à célula da tabela.

- **key**: `string`  
  - Identificador para o agrupamento dos botões reativos de uma célula.  
  - Esse agrupador é essencial para a reatividade dos botões.

- **buttons**: `JovencioButtonGenerate[]`  
  - Lista de botões associados à célula.

  - **key**: `string`  
    - Identificador do botão. Para botões como [block, edit, delete], já existem botões configurados. Basta utilizar o identificador do botão, que ele será configurado automaticamente com o estilo do Tailwind CSS.

  - **enable**: `boolean`  
    - Define se o botão será habilitado ou desabilitado, podendo ser utilizado para aplicar regras de autorização com base no usuário conectado.

  - **custom_element**: `string`  
    - Por padrão, o valor é `'button'`. Essa propriedade pode ser usada para definir a tag HTML que será gerada.

  - **class_id**: `string`  
    - Prefixo do agrupador de botões. Esse `class_id` é importante para a reatividade do botão, mas não é necessário para os botões [block, edit, delete].  
    - É obrigatório quando o botão não for um dos pré-configurados como [block, edit, delete].

  - **name**: `string`  
    - Nome do botão que será exibido.

  - **show_name**: `boolean`  
    - Propriedade que define se o nome do botão será exibido. O valor padrão é `false`.

  - **class**: `string`  
    - Permite redefinir a classe CSS do botão.

  - **order**: `number`  
    - Define a ordem de exibição dos botões.

  - **svg**: `string`  
    - Define o SVG a ser exibido no botão. A propriedade deve ser preenchida com a tag SVG completa.

  - **html_icon**: `string`  
    - Permite definir um ícone HTML. Quando configurado, ele substitui o SVG.

  - **svg_secondary**: `string`  
    - Define uma segunda opção de SVG, aplicável apenas para o botão 'block'.

## Deixando um botão reativo
``` js
triggers: function (addClousure: JovencioClousure) {
    addClousure({
        'selector': '.load-listen-datatable-clousure-body',
        'trigger': 'listen',
        'triggerSignature': 'triggerListen',
        'enable': true,
    });

    addClousure({
        'selector': '.load-locks-datatable-clousure-actions',
        'enable': true,
        'type': 'lock',
    });

    addClousure({
        'selector': '.load-edits-datatable-clousure-actions',
        'triggerSignature': 'triggerShow',
        'lock': 'lock-edit',
        'enable': false,
    });

    addClousure({
        'selector': '.load-deletes-datatable-clousure-actions',
        'triggerSignature': 'triggerDelete',
        'lock': 'lock-delete',
        'enable': false,
    });

    addClousure({
        'selector': '.load-duplicates-datatable-clousure-actions',
        'triggerSignature': 'triggerDuplicate',
        'lock': 'lock-duplicate',
        'enable': false,
    });
}
```

## Propriedades da clousure addClousure

- **selector**  
  - Propriedade utilizada para identificar os botões, composta pela combinação de dois atributos: `class_id` de `JovencioButtonGenerate` e `key` de `JovencioButtonProvider`, seguindo o formato `class_id + key`.  
  - O `class_id` de `JovencioButtonGenerate` para botões pré-definidos como [block, edit, delete] é imutável, enquanto o `key` de `JovencioButtonProvider` varia de acordo com a configuração do conjunto de botões.

- **trigger**  
  - Propriedade que define o evento a ser emitido. O trigger padrão é `trigger`, mas essa propriedade pode ser personalizada e utilizada como `@trigger` ou `@customTrigger` no componente do datatable para invocar uma função dentro do seu componente.

- **triggerSignature**  
  - Define uma assinatura única para o trigger, sendo útil quando diversos eventos precisam ser vinculados ao mesmo trigger.

- **enable**  
  - Propriedade que determina se o botão estará habilitado ou desabilitado, geralmente utilizada para aplicar regras de autorização baseadas no usuário logado.

- **lock**  
  - Propriedade que especifica se o botão será travado por outro botão do tipo `lock`. Deve ser configurada como `lock-exibe_modal`, onde `lock` representa o tipo de ação (neste caso, bloqueio) e `exibe_modal` é um `key` de `JovencioButtonGenerate`.


## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.