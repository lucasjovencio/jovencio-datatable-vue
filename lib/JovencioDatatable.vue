<template>
	<div>
		<div v-if="dataReady">
			<div v-show="enableAfterInit">
				<DataTable ref="datatablevue" :key="refreshKey" :options="optionsDataTable" :columns="columnsDataTable"
					:class="classTable" />
			</div>
			<div class="text-gray-700 dark:text-gray-100" v-if="!enableAfterInit">
				<div class="pt-10 pb-10 text-center">
					<span class="fa fa-circle-notch fa-spin fa-5x" ></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { DateTime } from 'datatables.net-datetime';
import 'moment';
import DataTable from "datatables.net-vue3"
import 'datatables.net';
import DataTablesCore from "datatables.net"// @ts-ignore
import type JovencioDataTableColumn from "../src/types/JovencioDataTableColumn"
import 'datatables.net-searchbuilder-dt';
import { ref } from 'vue';
import 'datatables.net-responsive-dt'
import useTippy from 'tippy.js';
import { createI18n } from 'vue-i18n';
import br from "../src/locales/pt-br.json";
import en from "../src/locales/en.json";
import JovencioActionClousure from '../src/types/JovencioActionClousure';
import { JovencioDataTableOption } from './main';
import { JovencioDatatableCommon } from './main';
import JovencioProviderClousure from '../src/types/JovencioProviderClousure';

const i18n = createI18n({
	locale: "en",
	fallbackLocale: "en",
	messages: { br: br, en: en, 'pt-BR': br },
});
DataTable.use(DataTablesCore)

export default {
	name: 'JovencioDatatable',
	components: {
		DataTable
	},
	props: {
		columns: {
			type: Array,
			required: false,
		},
		update: {
			type: String,
			required: false,
			default: '',
		},
		options: {
			type: Object as () => JovencioDataTableOption,
			required: false,
		},
		updateLanguage: {
			type: Number,
			required: false,
			default: 0
		},
		disableComponentSyncManually: {
			type: Number,
			required: false,
			default: 0
		},
		locale: {
			type: String,
			required: false
		},
	},
	data() {
		return {
			count: 0,
			dataReady: false,
			clousures: [] as JovencioActionClousure[],
			callbackHeader: null,
			optionsDataTable: {},
			url: '',
			refreshKey: 1,
			enableAfterInit: true,
			loading: true
		};
	},
	computed: {
		nameTable() : String {
			// @ts-ignore
			if (this.options && this.options.name) {
				// @ts-ignore
				return this.options.name
			}
			return ""
		},
		classTable() : String {
			// @ts-ignore
			if (this.options && this.options.classTable) {
				// @ts-ignore
				return this.options.classTable
			}
			return "min-w-full leading-normal"
		},
		classTableTh() : String {
			// @ts-ignore
			if (this.options && this.options.classTableTh) {
				// @ts-ignore
				return this.options.classTableTh
			}
			return "border-b-2 border-gray-300 bg-gray-200 text-gray-600 dark:border-gray-500 dark:bg-slate-900 dark:text-gray-200"
		},
		// @ts-ignore
		columnsDataTable() : Array {
			const self = this;
			// @ts-ignore
			self.unListen();
			// @ts-ignore
			self.clousures = [] as JovencioActionClousure[];// @ts-ignore

			const addClousure = function(provider:JovencioProviderClousure) {
				// @ts-ignore
				const data = JovencioDatatableCommon.providerClousureDT(provider) as JovencioActionClousure[]
				self.clousures.push(...data)
			}
			// @ts-ignore
			return self.columns.map((row: JovencioDataTableColumn) => {
				try {
					// @ts-ignore
					row.triggers(addClousure);
				} catch (e) {
					// continue
				}

				let render = null;
				try {
					// @ts-ignore
					render = row.render;
				} catch (e) {
					// continue
				}
				return {
					'data': row.id,
					// @ts-ignore
					'title': row.name,
					'className': row.class,
					'render': render,
					'type': row.type ?? 'string',
					'sType': row.type ?? 'string',
					"searchBuilderType": row.type ?? 'string',
					'orderable': row.orderable,
					'searchable': row.searchable
				}
			})
		},
	},
	watch: {
		// @ts-ignore
		update(newVal:any, oldVal:any) {
			const self = this;
			newVal = String(newVal);
			let reload = false;
			// @ts-ignore
			if (this.callbackHeader && newVal != "" && newVal !== oldVal) {
				// @ts-ignore
				if (newVal.includes('remove')) {// @ts-ignore
					reload = (self.callbackHeader.aoData.length <= 1) ? true : false;
				}// @ts-ignore
				let page = self.$refs.datatablevue.dt.page();

				if (reload && page > 1) {
					// @ts-ignore
					page--;
					// @ts-ignore
					self.updateDataTable(`${Date.now()}.${Math.random()}`, page);
				} else {
					// @ts-ignore
					self.$refs.datatablevue.dt.ajax.reload(null, reload)
				}

			}
		},
		// @ts-ignore
		updateLanguage(newVal:any, oldVal:any) {
			const self = this;
			// @ts-ignore
			if (this.dataReady && newVal && newVal !== oldVal) {
				// @ts-ignore
				const page = self.$refs.datatablevue.dt.page();
				// @ts-ignore
				self.updateDataTable(newVal, page);
			}
		},
		// @ts-ignore
		disableComponentSyncManually(newVal:any, oldVal:any) {
			// @ts-ignore
			if (this.dataReady && newVal && newVal !== oldVal) {
				// @ts-ignore
				this.dataReady = false;
			}
		},
		locale(newVal:any, oldVal:any) {
			// @ts-ignore
			if (newVal && newVal !== oldVal) {
				// @ts-ignore
				setTimeout(() => {
					try {
						// @ts-ignore
						this.changeLocale(newVal);
					} catch (e) {
						// continue
					}
				}, 500);
			}
		},
		
	},
	created() {
		try {
			// @ts-ignore
			this.changeLocale(this.locale ?? "en");
		} catch (e) {
			// continue
		}
	},
	mounted() {
		// @ts-ignore
		this.url = this.options.url;
		// @ts-ignore
		this.createOptions();
		setTimeout(() => {
			// @ts-ignore
			this.dataReady = true;
		}, 200);
	},
	onUnmounted() {
		// @ts-ignore
		this.dataReady = false;
	},
	onDeactivated() {
		// @ts-ignore
		this.dataReady = false;
	},// @ts-ignore
	beforeRouteLeave(to:any, from:any, next:any) {
		next();
	},
	destroyed() {
		// @ts-ignore
		this.dataReady = false;
		// @ts-ignore
		this.callbackHeader = null;
		// @ts-ignore
		this.optionsDataTable = {};
	},
	updated() { },
	methods: {
		createOptions() {
			const self = this;

			let options = {
				// @ts-ignore
				ajax: {
					// @ts-ignore
					url: self.url
				},
				suppressWarnings: true,
				responsive: {
					details: {
						// @ts-ignore
						renderer: function (api, rowIdx, columns) {
							let data = '';
							for (const key in columns) {
								const column = columns[key]
								data += `<div class="mb-2 flex flex-row items-center"> <span class="mr-1">${column.title}:</span> ${column.data} </div>`;
							}
							const expressaoRegular = new RegExp("\\action-fulltable\\b", "gi");
							data = data.replace(expressaoRegular, 'action-responsive-table');

							setTimeout(async () => {
								try {
									await self.unListen()
								} catch (e) {
									//
								}

								try {
									self.listen();
								} catch (e) {
									//
								}

								try {// @ts-ignore
									self.options.handlerFooterCallback();
								} catch (e) {
									// continue
								}
							}, 500)
							return data;
						}
					}
				},
				processing: true,
				serverSide: true,
				pageLength: 10,
				language: this.setLanguageDataTable(),// @ts-ignore
				footerCallback: async function (row, data, start, end, display) {
					try {
						await self.unListen()
					} catch (e) {
						//
					}

					try {
						self.listen();
					} catch (e) {
						//
					}

					try {
						self.setTips();
					} catch (e) {
						// continue
					}

					try {// @ts-ignore
						self.options.handlerFooterCallback();
					} catch (e) {
						// continue
					}
				},// @ts-ignore
				"fnInfoCallback": function (oSettings, iStart, iEnd, iMax, iTotal, sPre) {
					// @ts-ignore
					self.callbackHeader = oSettings;
				}
			};
			// @ts-ignore
			if (self.options.dataSrc) {
				options = {// @ts-ignore
					...options, ajax: {
						// @ts-ignore
						url: self.url, // @ts-ignore
						dataSrc: self.options.dataSrc,
					}
				};
			}

			// @ts-ignore
			if (self.options.searchBuilder && self.options.searchBuilder.enable) {
				options = {// @ts-ignore
					...options, dom: 'Qlfrtip', searchBuilder: {
						depthLimit: 3, // @ts-ignore
						columns: self.options.searchBuilder.columns,
					}
				};
			}
			// @ts-ignore
			self.optionsDataTable = ref(options);
		},
		// @ts-ignore
		setLanguageDataTable() {
			// @ts-ignore
			return {
				// @ts-ignore
				"emptyTable": i18n.global.t("datatable.emptyTable"),// @ts-ignore
				"info": i18n.global.t("datatable.info"),// @ts-ignore
				"infoFiltered": i18n.global.t("datatable.infoFiltered"),// @ts-ignore
				"infoThousands": i18n.global.t("datatable.infoThousands"),// @ts-ignore
				"loadingRecords": i18n.global.t("datatable.loadingRecords"),// @ts-ignore
				"zeroRecords": i18n.global.t("datatable.zeroRecords"),// @ts-ignore
				"search": i18n.global.t("datatable.search"),// @ts-ignore
				"paginate": {
					// @ts-ignore
					"next": i18n.global.t("datatable.paginate.next"),// @ts-ignore
					"previous": i18n.global.t("datatable.paginate.previous"),// @ts-ignore
					"first": i18n.global.t("datatable.paginate.first"),// @ts-ignore
					"last": i18n.global.t("datatable.paginate.last")// @ts-ignore
				},
				"aria": {
					// @ts-ignore
					"sortAscending": i18n.global.t("datatable.aria.sortAscending"),// @ts-ignore
					"sortDescending": i18n.global.t("datatable.aria.sortDescending")// @ts-ignore
				},
				"select": {
					"rows": {
						// @ts-ignore
						"_": i18n.global.t("datatable.select.rows.1"),// @ts-ignore
						"1": i18n.global.t("datatable.select.rows._")// @ts-ignore
					},
					"cells": {
						// @ts-ignore
						"1": i18n.global.t("datatable.select.cells.1"),// @ts-ignore
						"_": i18n.global.t("datatable.select.cells._")// @ts-ignore
					},
					"columns": {
						// @ts-ignore
						"1": i18n.global.t("datatable.select.columns.1"),// @ts-ignore
						"_": i18n.global.t("datatable.select.columns._")// @ts-ignore
					}
				},
				"buttons": {
					"copySuccess": {
						// @ts-ignore
						"1": i18n.global.t("datatable.buttons.copySuccess.1"),// @ts-ignore
						"_": i18n.global.t("datatable.buttons.copySuccess._")// @ts-ignore
					},
					// @ts-ignore
					"collection": i18n.global.t("datatable.buttons.collection"),// @ts-ignore
					"colvis": i18n.global.t("datatable.buttons.colvis"),// @ts-ignore
					"colvisRestore": i18n.global.t("datatable.buttons.colvisRestore"),// @ts-ignore
					"copy": i18n.global.t("datatable.buttons.copy"),// @ts-ignore
					"copyKeys": i18n.global.t("datatable.buttons.copyKeys"),// @ts-ignore
					"copyTitle": i18n.global.t("datatable.buttons.copyTitle"),// @ts-ignore
					"csv": i18n.global.t("datatable.buttons.csv"),// @ts-ignore
					"excel": i18n.global.t("datatable.buttons.excel"),// @ts-ignore
					"pageLength": {
						// @ts-ignore
						"-1": i18n.global.t("datatable.buttons.pageLength.-1"),// @ts-ignore
						"_": i18n.global.t("datatable.buttons.pageLength._")// @ts-ignore
					},
					// @ts-ignore
					"pdf": i18n.global.t("datatable.buttons.pdf"),// @ts-ignore
					"print": i18n.global.t("datatable.buttons.print"),// @ts-ignore
					"createState": i18n.global.t("datatable.buttons.createState"),// @ts-ignore
					"removeAllStates": i18n.global.t("datatable.buttons.removeAllStates"),// @ts-ignore
					"removeState": i18n.global.t("datatable.buttons.removeState"),// @ts-ignore
					"renameState": i18n.global.t("datatable.buttons.renameState"),// @ts-ignore
					"savedStates": i18n.global.t("datatable.buttons.savedStates"),// @ts-ignore
					"stateRestore": i18n.global.t("datatable.buttons.stateRestore"),// @ts-ignore
					"updateState": i18n.global.t("datatable.buttons.updateState")// @ts-ignore
				},
				"autoFill": {
					// @ts-ignore
					"cancel": i18n.global.t("datatable.autoFill.cancel"),// @ts-ignore
					"fill": i18n.global.t("datatable.autoFill.fill"),// @ts-ignore
					"fillHorizontal": i18n.global.t("datatable.autoFill.fillHorizontal"),// @ts-ignore
					"fillVertical": i18n.global.t("datatable.autoFill.fillVertical")// @ts-ignore
				},
				// @ts-ignore
				"lengthMenu": i18n.global.t("datatable.lengthMenu"),// @ts-ignore
				"searchBuilder": {
					// @ts-ignore
					"add": i18n.global.t("datatable.searchBuilder.add"),// @ts-ignore
					// @ts-ignore
					"button": {
						// @ts-ignore
						"0": i18n.global.t("datatable.searchBuilder.button.0"),// @ts-ignore
						"_": i18n.global.t("datatable.searchBuilder.button._")// @ts-ignore
					},
					// @ts-ignore
					"clearAll": i18n.global.t("datatable.searchBuilder.clearAll"),// @ts-ignore
					"condition": i18n.global.t("datatable.searchBuilder.condition"),// @ts-ignore
					"conditions": {
						"date": {
							// @ts-ignore
							"after": i18n.global.t("datatable.searchBuilder.conditions.date.after"),// @ts-ignore
							"before": i18n.global.t("datatable.searchBuilder.conditions.date.before"),// @ts-ignore
							"between": i18n.global.t("datatable.searchBuilder.conditions.date.between"),// @ts-ignore
							"empty": i18n.global.t("datatable.searchBuilder.conditions.date.empty"),// @ts-ignore
							"equals": i18n.global.t("datatable.searchBuilder.conditions.date.equals"),// @ts-ignore
							"not": i18n.global.t("datatable.searchBuilder.conditions.date.not"),// @ts-ignore
							"notBetween": i18n.global.t("datatable.searchBuilder.conditions.date.notBetween"),// @ts-ignore
							"notEmpty": i18n.global.t("datatable.searchBuilder.conditions.date.notEmpty")// @ts-ignore
						},
						"number": {
							// @ts-ignore
							"between": i18n.global.t("datatable.searchBuilder.conditions.number.between"),// @ts-ignore
							"empty": i18n.global.t("datatable.searchBuilder.conditions.number.empty"),// @ts-ignore
							"equals": i18n.global.t("datatable.searchBuilder.conditions.number.equals"),// @ts-ignore
							"gt": i18n.global.t("datatable.searchBuilder.conditions.number.gt"),// @ts-ignore
							"gte": i18n.global.t("datatable.searchBuilder.conditions.number.gte"),// @ts-ignore
							"lt": i18n.global.t("datatable.searchBuilder.conditions.number.lt"),// @ts-ignore
							"lte": i18n.global.t("datatable.searchBuilder.conditions.number.lte"),// @ts-ignore
							"not": i18n.global.t("datatable.searchBuilder.conditions.number.not"),// @ts-ignore
							"notBetween": i18n.global.t("datatable.searchBuilder.conditions.number.notBetween"),// @ts-ignore
							"notEmpty": i18n.global.t("datatable.searchBuilder.conditions.number.notEmpty")// @ts-ignore
						},
						"string": {
							// @ts-ignore
							"contains": i18n.global.t("datatable.searchBuilder.conditions.string.contains"),// @ts-ignore
							"empty": i18n.global.t("datatable.searchBuilder.conditions.string.empty"),// @ts-ignore
							"endsWith": i18n.global.t("datatable.searchBuilder.conditions.string.endsWith"),// @ts-ignore
							"equals": i18n.global.t("datatable.searchBuilder.conditions.string.equals"),// @ts-ignore
							"not": i18n.global.t("datatable.searchBuilder.conditions.string.not"),// @ts-ignore
							"notEmpty": i18n.global.t("datatable.searchBuilder.conditions.string.notEmpty"),// @ts-ignore
							"startsWith": i18n.global.t("datatable.searchBuilder.conditions.string.startsWith"),// @ts-ignore
							"notContains": i18n.global.t("datatable.searchBuilder.conditions.string.notContains"),// @ts-ignore
							"notStartsWith": i18n.global.t("datatable.searchBuilder.conditions.string.notStartsWith"),// @ts-ignore
							"notEndsWith": i18n.global.t("datatable.searchBuilder.conditions.string.notEndsWith")// @ts-ignore
						},
						"array": {
							// @ts-ignore
							"contains": i18n.global.t("datatable.searchBuilder.conditions.array.contains"),// @ts-ignore
							"empty": i18n.global.t("datatable.searchBuilder.conditions.array.empty"),// @ts-ignore
							"equals": i18n.global.t("datatable.searchBuilder.conditions.array.equals"),// @ts-ignore
							"not": i18n.global.t("datatable.searchBuilder.conditions.array.not"),// @ts-ignore
							"notEmpty": i18n.global.t("datatable.searchBuilder.conditions.array.notEmpty"),// @ts-ignore
							"without": i18n.global.t("datatable.searchBuilder.conditions.array.without")// @ts-ignore
						}
					},
					// @ts-ignore
					"data": i18n.global.t("datatable.searchBuilder.data"),// @ts-ignore
					"deleteTitle": i18n.global.t("datatable.searchBuilder.deleteTitle"),// @ts-ignore
					"logicAnd": i18n.global.t("datatable.searchBuilder.logicAnd"),// @ts-ignore
					"logicOr": i18n.global.t("datatable.searchBuilder.logicOr"),// @ts-ignore
					"title": {
						// @ts-ignore
						"0": i18n.global.t("datatable.searchBuilder.title.0"),// @ts-ignore
						"_": i18n.global.t("datatable.searchBuilder.title._")// @ts-ignore
					},
					// @ts-ignore
					"value": i18n.global.t("datatable.searchBuilder.value"),// @ts-ignore
					"leftTitle": i18n.global.t("datatable.searchBuilder.leftTitle"),// @ts-ignore
					"rightTitle": i18n.global.t("datatable.searchBuilder.rightTitle")// @ts-ignore
				},
				"searchPanes": {
					// @ts-ignore
					"clearMessage": i18n.global.t("datatable.searchPanes.clearMessage"),// @ts-ignore
					"collapse": {
						// @ts-ignore
						"0": i18n.global.t("datatable.searchPanes.collapse.0"),// @ts-ignore
						"_": i18n.global.t("datatable.searchPanes.collapse._")// @ts-ignore
					},
					// @ts-ignore
					"count": i18n.global.t("datatable.searchPanes.count"),// @ts-ignore
					"countFiltered": i18n.global.t("datatable.searchPanes.countFiltered"),// @ts-ignore
					"emptyPanes": i18n.global.t("datatable.searchPanes.emptyPanes"),// @ts-ignore
					"loadMessage": i18n.global.t("datatable.searchPanes.loadMessage"),// @ts-ignore
					"title": i18n.global.t("datatable.searchPanes.title"),// @ts-ignore
					"showMessage": i18n.global.t("datatable.searchPanes.showMessage"),// @ts-ignore
					"collapseMessage": i18n.global.t("datatable.searchPanes.collapseMessage")// @ts-ignore
				},
				// @ts-ignore
				"thousands": i18n.global.t("datatable.thousands"),// @ts-ignore
				"datetime": {
					// @ts-ignore
					"previous": i18n.global.t("datatable.datetime.previous"),// @ts-ignore
					"next": i18n.global.t("datatable.datetime.next"),// @ts-ignore
					"hours": i18n.global.t("datatable.datetime.hours"),// @ts-ignore
					"minutes": i18n.global.t("datatable.datetime.minutes"),// @ts-ignore
					"seconds": i18n.global.t("datatable.datetime.seconds"),// @ts-ignore
					"amPm": [i18n.global.t("datatable.datetime.amPm[0]"), i18n.global.t("datatable.datetime.amPm[1]")],// @ts-ignore
					"unknown": i18n.global.t("datatable.datetime.unknown"),// @ts-ignore
					"months": [
						// @ts-ignore
						i18n.global.t("datatable.datetime.months[0]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[1]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[2]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[3]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[4]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[5]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[6]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[7]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[8]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[9]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[10]"),// @ts-ignore
						i18n.global.t("datatable.datetime.months[11]")// @ts-ignore
					],
					"weekdays": [
						// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[0]"),// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[1]"),// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[2]"),// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[3]"),// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[4]"),// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[5]"),// @ts-ignore
						i18n.global.t("datatable.datetime.weekdays[6]"),// @ts-ignore
					]
				},
				"editor": {
					// @ts-ignore
					"close": i18n.global.t("datatable.editor.close"),// @ts-ignore
					"create": {
						// @ts-ignore
						"button": i18n.global.t("datatable.editor.create.button"),// @ts-ignore
						"submit": i18n.global.t("datatable.editor.create.submit"),// @ts-ignore
						"title": i18n.global.t("datatable.editor.create.title")// @ts-ignore
					},
					"edit": {
						// @ts-ignore
						"button": i18n.global.t("datatable.editor.edit.button"),// @ts-ignore
						"submit": i18n.global.t("datatable.editor.edit.submit"),// @ts-ignore
						"title": i18n.global.t("datatable.editor.edit.title")// @ts-ignore
					},
					"error": {
						// @ts-ignore
						"system": i18n.global.t("datatable.editor.error.system")// @ts-ignore
					},
					"multi": {
						// @ts-ignore
						"noMulti": i18n.global.t("datatable.editor.multi.noMulti"),// @ts-ignore
						"restore": i18n.global.t("datatable.editor.multi.restore"),// @ts-ignore
						"title": i18n.global.t("datatable.editor.multi.title"),// @ts-ignore
						"info": i18n.global.t("datatable.editor.multi.info")// @ts-ignore
					},
					"remove": {
						// @ts-ignore
						"button": i18n.global.t("datatable.editor.remove.button"),// @ts-ignore
						"confirm": {
							// @ts-ignore
							"_": i18n.global.t("datatable.editor.remove.confirm._"),// @ts-ignore
							"1": i18n.global.t("datatable.editor.remove.confirm.1")// @ts-ignore
						},
						// @ts-ignore
						"submit": i18n.global.t("datatable.editor.remove.submit"),// @ts-ignore
						"title": i18n.global.t("datatable.editor.remove.title")// @ts-ignore
					}
				},
				// @ts-ignore
				"decimal": i18n.global.t("datatable.decimal"),// @ts-ignore
				"stateRestore": {// @ts-ignore
					"creationModal": {
						// @ts-ignore
						"button": i18n.global.t("datatable.stateRestore.creationModal.button"),// @ts-ignore
						"columns": {
							// @ts-ignore
							"search": i18n.global.t("datatable.stateRestore.creationModal.columns.search"), 
							// @ts-ignore
							"visible": i18n.global.t("datatable.stateRestore.creationModal.columns.visible")
						},
						// @ts-ignore
						"name": i18n.global.t("datatable.stateRestore.creationModal.name"), // @ts-ignore
						"order": i18n.global.t("datatable.stateRestore.creationModal.order"),// @ts-ignore
						"paging": i18n.global.t("datatable.stateRestore.creationModal.paging"),// @ts-ignore
						"scroller": i18n.global.t("datatable.stateRestore.creationModal.scroller"),// @ts-ignore
						"search": i18n.global.t("datatable.stateRestore.creationModal.search"),// @ts-ignore
						"searchBuilder": i18n.global.t("datatable.stateRestore.creationModal.searchBuilder"),// @ts-ignore
						"select": i18n.global.t("datatable.stateRestore.creationModal.select"),// @ts-ignore
						"title": i18n.global.t("datatable.stateRestore.creationModal.title"),// @ts-ignore
						"toggleLabel": i18n.global.t("datatable.stateRestore.creationModal.toggleLabel")// @ts-ignore
					},// @ts-ignore
					"emptyStates": i18n.global.t("datatable.stateRestore.emptyStates"),// @ts-ignore
					"removeConfirm": i18n.global.t("datatable.stateRestore.removeConfirm"),// @ts-ignore
					"removeJoiner": i18n.global.t("datatable.stateRestore.removeJoiner"),// @ts-ignore
					"removeSubmit": i18n.global.t("datatable.stateRestore.removeSubmit"),// @ts-ignore
					"removeTitle": i18n.global.t("datatable.stateRestore.removeTitle"),// @ts-ignore
					"renameButton": i18n.global.t("datatable.stateRestore.renameButton"),// @ts-ignore
					"renameLabel": i18n.global.t("datatable.stateRestore.renameLabel"),// @ts-ignore
					"renameTitle": i18n.global.t("datatable.stateRestore.renameTitle"),// @ts-ignore
					"duplicateError": i18n.global.t("datatable.stateRestore.duplicateError"),// @ts-ignore
					"emptyError": i18n.global.t("datatable.stateRestore.emptyError"),// @ts-ignore
					"removeError": i18n.global.t("datatable.stateRestore.removeError")// @ts-ignore
				},// @ts-ignore
				"infoEmpty": i18n.global.t("datatable.infoEmpty"),// @ts-ignore
				"processing": i18n.global.t("datatable.processing"),// @ts-ignore
				"searchPlaceholder": i18n.global.t("datatable.searchPlaceholder")// @ts-ignore
			};
		},
		// @ts-ignore
		updateDataTable(key:any, page:any) {
			const self = this;
			// @ts-ignore
			if (self.$refs && self.$refs.datatablevue && self.$refs.datatablevue.dt) {
				const state = {
					// @ts-ignore
					search: self.$refs.datatablevue.dt.search(),
					// @ts-ignore
					searchBuilder: self.$refs.datatablevue.dt.state().searchBuilder
				};

				this.createOptions();
				// @ts-ignore
				let options = self.optionsDataTable;

				if (Object.keys(state.searchBuilder).length) {
					// @ts-ignore
					options.searchBuilder = {
						// @ts-ignore
						...options.searchBuilder, preDefined: {
							...state.searchBuilder
						}
					};
				}

				if (state.search) {
					// @ts-ignore
					options.search = {};
					// @ts-ignore
					options.search = {
						// @ts-ignore
						...options.search,
						search: state.search
					};
				}

				// @ts-ignore
				options.initComplete = function (settings, json) {
					if (page) {
						// @ts-ignore
						self.enableAfterInit = false;
						setTimeout(() => {
							// @ts-ignore
							self.enableAfterInit = true;
						}, 500);
						// @ts-ignore
						settings.oInstance.api().page(page).draw(false);
					}
				};
				// @ts-ignore
				this.optionsDataTable = options;
				// @ts-ignore
				this.refreshKey = key
			}
		},
		async loadComponents() {
			await this.unListen();
			this.listen();
		},
		async unListen() {
			const self = this;// @ts-ignore

			for (let key in self.clousures) {// @ts-ignore
				const clousure = self.clousures[key];// @ts-ignore

				const locks = document.querySelectorAll(clousure.selector);
				locks.forEach((elemento:any) => {
					const clone = elemento.cloneNode(true);
					elemento.parentNode.replaceChild(clone, elemento);
				});
				// @ts-ignore
				if (clousure.timeout) {// @ts-ignore
					clearTimeout(clousure.timeout)// @ts-ignore
					self.clousures[key].timeout = null;
				}

			}
		},
		async listen() {
			const self = this;// @ts-ignore
			for (let key in self.clousures) {// @ts-ignore
				const clousure = self.clousures[key];// @ts-ignore
				if (clousure.timeout) {// @ts-ignore
					clearTimeout(clousure.timeout)
				}
				// @ts-ignore
				if (clousure.enable) {
					const time = setTimeout(() => {// @ts-ignore
						self.clousures[key].clousure(self);
					}, 100);
					// @ts-ignore
					self.clousures[key].timeout = time;
				}
			}
		},
		changeLocale(locale:string) {
			try {
				// @ts-ignore
				i18n.locale = locale;
				// @ts-ignore
				i18n.global.locale = locale
				// @ts-ignore
				const page = this.$refs.datatablevue.dt.page();
				this.updateDataTable(Math.random(), page);
			} catch (e) {
				// continue
			}
		},
		setTips() {
			try {// @ts-ignore
				setTimeout(() => {
					// @ts-ignore
					useTippy('.tippys-load', {
						content: reference => reference.getAttribute('data-tippy')
					});
				}, 100);
			} catch (e) {
				// continue
			}
		}
	},
};
</script>

<style>
@import "datatables.net-dt";
@import url('https://cdn.datatables.net/searchbuilder/1.7.1/css/searchBuilder.dataTables.css');
@import url('https://cdn.datatables.net/datetime/1.5.2/css/dataTables.dateTime.min.css');
@import url('tippy.js/dist/tippy.css');

.dataTables_wrapper .dataTables_length select {
	padding-right: 2rem !important;
}

div.dt-container select.dt-input {
	padding-right: 2rem !important;
}

div.dt-container .dt-search {
	text-align: right;
}

.dt-container .dt-input select {
	padding-right: 2rem !important;
}

div.dt-container .dt-paging {
	text-align: center !important;
}

.dtsb-button div {
	background: #9000;
	transform: rotate(270deg);
}
</style>