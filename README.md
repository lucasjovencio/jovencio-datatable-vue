# Jovencio DataTable Vue📝  
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

- id: string
    - Propriedade do json.
- name: string | (() => string)
    - Nome da coluna visivel na tabela, pode ser tambem ua função anonima que retorna o nome da coluna de acordo com o idioma
- orderable: boolean
    - Permite que o datatable faça a ordenação da tabela pela propriedade.
- searchable: boolean
    - Permite que o datatable faça pesquisa na coluna pelo metodo de pesquisa global do datatable.
- mask: MaskaDatatable
    - Implementa a interface de [Maska](https://github.com/beholdr/maska), tambem é possivel implementar um objeto i18n onde pode ter retorno para En e Pt-BR.
- type: Types
    - Os tipos primarios de colunas que funcionam com Criteria.
- class: string
    - Propriedade para adicionar css class na celula.
- colspan: Number
    - Quantidade de colunas que uma celula vai ocupar.
- rowspan: Number
    - Quantidade de linhas que uma celula vai ocupar.
- render: (data: any, type: string, row: any, meta: JovencioDataTableMeta): void
    - Renderzação de celula para o datatable, pode modificar aqui a informação que será visivel na celula da tabela.
        - A geração de botões reativos é feito dentro da função render > explicando aqui <.
- triggers: (addClousure:JovencioClousure): void
    - Metodo para registrar eventos de botões reativos registrados na propriedade render.


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

- object: any
    - Objeto completo da linha.
- meta: JovencioDataTableMeta
    - Propriedades da celula.
- key: string
    - Agrupador de botões reativos daquela celula
        - Esse agrupador é importante para reatividade do botão.
- buttons: JovencioButtonGenerate[]
    - key: string
        - identificador de botões, para [block, edit, delete] já existem botões configurados, colocando apenas o nome do identificador ele já estará configurado usando tailwind css.
    - enable: boolean
        - Configuração que pode ser usada para restringir o botão de acordo com a autorização do usuario conectado.
    - custom_element: string
        - Por padrão é 'button', essa propriedade pode ser usada para definir a tag a ser construida.
    - class_id: string
        - prefixo de agrupador de botões, essa class_id é importante para a reatividade do botão, não necessario para [block, edit, delete].
        - Obrigatório quando é um botão que não [block, edit, delete]
    - name: string
        - Nome do botão a ser exibido.
    - show_name: boolean
        - Propriedade que define se o nome de exibição será exibido, por padrão é não.
    - class: string
        - Propriedade para redefinir a class do botão.
    - order: number
        - Propriedade para definir a ordem dos botões.
    - svg: string
        - Propriedade para definir o svg de exibição do botão, necessario ser a tag svg completa.
    - html_icon: string
        - Propriedade para definir uma tag icone, quando definida substitui o svg.
    - svg_secondary: string
        - Propriedade para definir uma segunda opção de svg, essa tag funciona apenas para o botão 'block'.

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

- selector
    - Propriedade para identificar os botões, consiste da composição de dois atributos, sendo eles 'class_id' de JovencioButtonGenerate e 'key' de JovencioButtonProvider, na sequencia class_id + key
    - 'class_id' de JovencioButtonGenerate para [block, edit, delete] são imutaveis, 'key' de JovencioButtonProvider varia de acordo com a clousure do conjunto de botões. 
- trigger
    - Propriedade para emitir evento, o trigger padrão é 'trigger', essa propriedade declarada pode ser usada como @trigger ou @customTrigger no component do datatable para chamar uma função de dentro do seu component
- triggerSignature
    - Propriedade para definir uma assinatura de identificação da trigger, util quando todos os eventos disparam para a mesma trigger. 
- enable
    - Propriedade para definir a disponiblidade do botão, serve para regra de usuario logado.
- lock
    - Propriedade para definir se o botão será travado por um botão de 'lock', essa propriedade deve ser preenchida como 'lock-exibe_modal', onde 'lock' é uma propriedade que define que define um tipo de ação, nesse caso bloqueio e 'exibe_modal' deve ser um 'key' de JovencioButtonGenerate
