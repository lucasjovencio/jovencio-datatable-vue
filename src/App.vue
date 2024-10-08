<template>
    <div id="app">
        <JovencioDatatable :columns="tableColumns" :update="updateAjax" :options="optionsDataTable" @trigger="listenTrigger" />
    </div>
</template>

<script lang="ts">
import JovencioDatatable from './JovencioDatatable.vue';
import ColumnDataTableMeta from './types/ColumnDataTableMeta';
import JovencioDatatableCommon from './services/JovencioDatatableCommon';

export default {
    data() {
        return {
            tableColumns: [],
            optionsDataTable: {
                url: "https://jsonplaceholder.typicode.com/posts",
                /**
                 *  dataSrc was used to create a test environment during development. 
                 *  Please return a dataset in the format expected by the datatable, 
                 *  and there's no need for that closure to format the data.
                 */
                dataSrc: function (json) {
                    return json.map(post => ({
                        id: post.id,
                        title: post.title,
                        body: post.body,
                        actions: '',
                    }));
                },
                searchBuilder: {
                    enable: false,
                    columns: [0, 1, 2]
                }
            },
            updateAjax: ''
        }
    },
    components: {
        JovencioDatatable
    },
    created() {
        const self = this;
        this.tableColumns = [
            {
                id: "id",
                name: ('Account'),
                orderable: true,
                searchable: true,
                type: 'string',
                class: "bg-gray-100 text-gray-900 dark:bg-slate-700 dark:text-gray-100",
                render: function (data: any, type: string, row: object, meta: ColumnDataTableMeta) {
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
                type: 'string',
                orderable: false,
                searchable: false,
                name: ("Title"),
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
            },
            {
                id: "body",
                type: 'date',
                name: ("Description"),
                orderable: true,
                searchable: false,
                class: "border-b border-gray-300 px-5 py-5 text-xs dark:border-gray-500",
                render: function (data: any, type: string, row: object, meta: ColumnDataTableMeta) {
                    const provider = {
                        'object': row,
                        'meta': meta,
                        'key': 'clousure-body',
                        'buttons': [
                            {
                                key: 'listen',
                                enable: true,
                                custom_element: 'button',
                                class_id: 'load-listen-datatable',
                                name: ("Description Listen"),
                                show_name: true,
                                class:"button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm",
                                order: 0,
                                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z" /></svg>`
                            },
                        ]
                    };
                    return ((data) ? data : '')+JovencioDatatableCommon.providerButtonDT(provider, self);
                }
            },
            {
                id: "actions",
                name: ("Actions"),
                orderable: false,
                searchable: false,
                class: "whitespace-nowrap border-b border-gray-300 px-5 py-5 text-sm dark:border-gray-500",
                render: function (data: any, type: string, row: object, meta: ColumnDataTableMeta) {
                    const provider = {
                        'object': row,
                        'meta': meta,
                        'key': 'clousure-actions',
                        'buttons': [
                            {
                                key: 'lock',
                                enable: true,
                                name: ("Block/Unblock"),
                                show_name: true,
                                class: `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-gray-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent" btn-class-dark="bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent" btn-hover-class-dark="hover:bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent`,
                                order: 1,
                                svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                                svg_secondary: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>',
                            },
                            {
                                key: 'edit',
                                enable: true,
                                name: ("Edit"),
                                show_name: true,
                                class: `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-yellow-600 hover:bg-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-400 border-yellow-600 hover:border-yellow-900 dark:border-yellow-600 dark:hover:border-yellow-400 border-1 border mr-2 px-1 py-1 text-sm`,
                                order: 2,
                                svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path></svg>'
                            },
                            {
                                key: 'delete',
                                enable: true,
                                name: ("Remove"),
                                show_name: true,
                                class:"button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm",
                                order: 4,
                                svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path></svg>'
                            },
                            {
                                key: 'duplicate',
                                enable: true,
                                class_id: 'load-duplicates-datatable',
                                name: ("Duplicate"),
                                show_name: true,
                                class:"button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm",
                                order: 3,
                                svg: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg>`
                            },
                        ]
                    };
                    return JovencioDatatableCommon.providerButtonDT(provider, self);
                },
                triggers: function (self: any) {
                    self.clousures.push(...JovencioDatatableCommon.providerClousureDT('.load-locks-datatable-clousure-actions', null, null, null, true, 'lock'));
                    self.clousures.push(...JovencioDatatableCommon.providerClousureDT('.load-edits-datatable-clousure-actions', 'trigger', 'triggerShow', 'lock-edit', false));
                    self.clousures.push(...JovencioDatatableCommon.providerClousureDT('.load-deletes-datatable-clousure-actions', 'trigger', 'triggerDelete', 'lock-delete', false));
                    self.clousures.push(...JovencioDatatableCommon.providerClousureDT('.load-duplicates-datatable-clousure-actions', 'trigger', 'triggerDuplicate', 'lock-duplicate', false));
                    self.clousures.push(...JovencioDatatableCommon.providerClousureDT('.load-listen-datatable-clousure-body', 'trigger', 'triggerListen'));
                }
            },
        ];
    },
    methods: {
        listenTrigger(trigger) {
            console.log(trigger)
        }
    }
};
</script>