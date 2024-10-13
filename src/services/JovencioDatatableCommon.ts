import JovencioButtonProvider from '../types/JovencioButtonProvider';
import JovencioActionClousure from '../types/JovencioActionClousure';
import JovencioTrigger from '../types/JovencioTrigger';
import JovencioProviderClousure from '../types/JovencioProviderClousure';

class JovencioDatatableCommon {
    static  providerButtonDT(provider:JovencioButtonProvider) {
		const dRow = JSON.stringify(provider.object);
		const dMeta = JSON.stringify({
			col: provider.meta.col,
			row: provider.meta.row
		});
	
		const keyClass = provider.key ? '-'+provider.key+'-action-fulltable' : '-action-fulltable';
		const buttons = provider.buttons.sort((a:any, b:any) => parseFloat(a.order) - parseFloat(b.order));

		let text = '';
		const lock = buttons.filter((button:any) => button.key == 'lock').shift();
		const opacity = (lock && lock.enable) ? 'opacity-50' : '';
		const disabled = (lock && lock.enable) ? 'disabled=""' : '';
	
		for (let button of buttons.filter((row:any) => row.enable)) {
			const name = (button.show_name) ? button.name : '';
			let svg = '';

			let classButton = '';

			if (button.key === 'lock' && button.enable) {
				svg = (button.svg) ? button.svg : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>';
				const svgSecondary = (button.svg_secondary) ? button.svg_secondary : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"></path></svg>';
				classButton = (button.class) ? button.class : `button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent mr-2 inline-block rounded px-1 py-1 text-sm font-medium leading-snug leading-snug text-gray-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:text-white" btn-hover-class="hover:bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent" btn-class-dark="bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent" btn-hover-class-dark="hover:bg-transparent focus:bg-transparent active:bg-transparent dark:focus:bg-transparent dark:active:bg-transparent dark:hover:bg-transparent`;
				const idClass = `load-locks-datatable${keyClass}`;
				text += `
				<button data-tippy="${(button.name)}" data-meta='${dMeta}'
					class=" ${idClass} tippys-load ${classButton}"
				>
					<span id="${provider.meta.row}-${provider.meta.col}-lock-${idClass}"> ${svg} ${name}</span>
					<span hidden id="${provider.meta.row}-${provider.meta.col}-unlock-${idClass}">${svgSecondary} ${name}</span>
				</button>`;
			} else if(button.key === 'edit' && button.enable) {
				classButton = (button.class) ? button.class : 'button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-yellow-600 hover:bg-yellow-900 dark:bg-yellow-600 dark:hover:bg-yellow-400 border-yellow-600 hover:border-yellow-900 dark:border-yellow-600 dark:hover:border-yellow-400 border-1 border mr-2 px-1 py-1 text-sm';
				svg = (button.svg) ? button.svg : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path></svg>';
				const idClass = `load-edits-datatable${keyClass}`;
				text += `<button data-tippy="${(button.name)}" data-meta='${dMeta}' data-object='${dRow}' id="${provider.meta.row}-${provider.meta.col}-lock-edit-${idClass}"
						class="${idClass}  ${opacity} tippys-load ${classButton}" 
						${disabled}>
						${svg} ${name}
				</button>`;
			} else if(button.key === 'delete' && button.enable) {
				classButton = (button.class) ? button.class : 'button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm';
				svg = (button.svg) ? button.svg : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path></svg>';
				const idClass = `load-deletes-datatable${keyClass}`;
				text += `<button data-tippy="${(button.name)}" data-meta='${dMeta}' data-object='${dRow}'  
						id="${provider.meta.row}-${provider.meta.col}-lock-delete-${idClass}"
						class=" ${idClass} tippys-load ${opacity} ${classButton}" 
						${disabled}>
						${svg} ${name}
					</button>
				`;
			} else if (!["delete", "edit", "lock"].includes(button.key) && button.enable) {
				const custom_element = button.custom_element ? button.custom_element : 'button';
				classButton = (button.class) ? button.class : 'button inline-flex items-center justify-center px-4 py-3 mb-1 whitespace-nowrap rounded text-base font-medium leading-none shadow-sm transition duration-150 ease-in-out text-white dark:text-white bg-red-600 hover:bg-red-900 dark:bg-red-600 dark:hover:bg-red-400 border-red-600 hover:border-red-900 dark:border-red-600 dark:hover:border-red-400 border-1 border mr-2 px-1 py-1 text-sm';
				svg = (button.svg) ? button.svg : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" class="ml-2 mr-2 mt-0 h-4 w-4"><path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path></svg>';
				let selectorId = `${button.class_id}${keyClass}`;
				if (selectorId.startsWith(".")) {
					selectorId = selectorId.slice(1); // Remove o ponto no início
				}
				text += `<${custom_element} data-tippy="${(button.name)}" data-meta='${dMeta}' data-object='${dRow}'  
						id="${provider.meta.row}-${provider.meta.col}-lock-${button.key}-${selectorId}"
						class=" ${selectorId} tippys-load ${opacity} ${classButton}" 
						${disabled}>
						${svg} ${name}
					</${custom_element}>
				`;
			}
		}
	
		return `${text}`;
	}

    static providerClousureDT(provider:JovencioProviderClousure) : JovencioActionClousure[] {
		const selector = provider.selector;
		const trigger = provider.trigger ?? 'trigger';
		const triggerSignature = provider.triggerSignature ?? null;
		const lock = provider.lock ?? null;
		const enable = provider.enable ?? false;
		const type = provider.type ?? 'action';

		if (type == 'action') {
			const actionClousure = function (keyClass:string) {
				return { 
					'selector': selector+"-"+keyClass,
					'clousure': (self:any) => {
						let selectors = document.querySelectorAll(selector+"-"+keyClass) ;
						// @ts-ignore
						selectors = Array.from(selectors);
						selectors.forEach((elemento) => {
							const clone = elemento.cloneNode(true);
							// @ts-ignore
							elemento.parentNode.replaceChild(clone, elemento);
						})
						// @ts-ignore
						selectors = Array.from(selectors).filter(row => !row.hasAttribute('disabled'));

						selectors.forEach( function(el) {
							const action = document.getElementById(el.id)
							// @ts-ignore
							action.addEventListener('click', event => {
								// @ts-ignore
								const object = JSON.parse(event.currentTarget.dataset.object);
								self.$emit(trigger, {
									'type': triggerSignature,
									'data': object
								} as JovencioTrigger);
							})
						});
					},
					'lock': lock,
					'timeout': null,
					'enable': enable
				} as JovencioActionClousure;
			}
			return [
				actionClousure('action-fulltable'),
				actionClousure('action-responsive-table'),
			];
		} else if (type == 'lock') {
			const lockClousure = function(keyClass:any) {
				return { 
					'selector': selector+"-"+keyClass,
					'clousure': (self:any) => {
						const selectors = document.querySelectorAll(selector+"-"+keyClass);
						selectors.forEach(el => el.addEventListener('click', event => {
							// @ts-ignore
							const meta = JSON.parse(event.currentTarget.dataset.meta);
							let selectorId = selector;
							if (selectorId.startsWith(".")) {
								selectorId = selectorId.slice(1); // Remove o ponto no início
							}
							selectorId = selectorId+"-"+keyClass

							const unlock = document.getElementById(`${meta.row}-${meta.col}-unlock`+"-"+selectorId)
							const lock = document.getElementById(`${meta.row}-${meta.col}-lock`+"-"+selectorId)
		
							let lockRow = true
							// @ts-ignore
							if (unlock.hasAttribute('hidden')) {// @ts-ignore
								unlock.removeAttribute('hidden')// @ts-ignore
								lock.setAttribute('hidden', true)
								lockRow = false;
							} else {// @ts-ignore
								lock.removeAttribute('hidden')// @ts-ignore
								unlock.setAttribute('hidden', true)
	
							}
							
							for (let key in self.clousures) {
								const clousure = self.clousures[key];
								if (clousure.lock !== null) {

									let selectorClousureId = clousure.selector;
									if (selectorClousureId.startsWith(".")) {
										selectorClousureId = selectorClousureId.slice(1); // Remove o ponto no início
									}

									const action = document.getElementById(`${meta.row}-${meta.col}-${clousure.lock}`+"-"+selectorClousureId)
									
									if (!lockRow && action) {
										action.classList.remove('opacity-50');
										action.removeAttribute('disabled')
		
										if (clousure.timeout) {
											clearTimeout(clousure.timeout)
										}
		
										self.clousures[key].enable = true;
										const time = setTimeout(() => {
											self.clousures[key].clousure(self);
										}, 100);
						
										self.clousures[key].timeout = time;
									} else if (lockRow && action) {
		
										action.classList.add('opacity-50');// @ts-ignore
										action.setAttribute('disabled', true)
										self.clousures[key].enable = false;
										if (clousure.timeout) {
											clearTimeout(clousure.timeout)
											self.clousures[key].timeout = null;
										}
									}
								}
							}

							try {
								self.setTips();
							} catch (e) {
								// continue
							}
						}));
					},
					'lock': lock,
					'timeout': null,
					'enable': enable
				} as JovencioActionClousure;
			}

			return [
				lockClousure('action-fulltable'),
				lockClousure('action-responsive-table')
			]
		}
		
		return [];
	}

	static providerUpdateDT(provider:any) {

		const random = `${Math.random()}${performance.now()}`;
		if (provider && provider.remove) {
			return `${random}-remove`;
		}
	
		return `${random}`;
	}
}

export default JovencioDatatableCommon;

