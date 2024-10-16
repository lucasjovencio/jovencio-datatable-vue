import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { plugin as VueTippy } from 'vue-tippy';
const app = createApp(App);
app.use(VueTippy, {
    directive: 'tippy', // => v-tippy
    component: 'tippy', // => <tippy/>
    componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
    defaultProps: {
        arrow: true,
        theme: 'material',
        animation: 'perspective',
        placement: 'auto-end',
        allowHTML: true,
    },
})
app.mount('#app');
