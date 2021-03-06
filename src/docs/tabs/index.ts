import Component from 'vue-class-component';

import docSnippet from '../snippet';
import docDefaultTabs from './default';
import docScrollableTabs from './scrollable';

@Component({
    components: {
        docSnippet,
        docDefaultTabs,
        docScrollableTabs
    },
    template: require('./tabs.html')
})
export default class Tabs {
    data() {
        return {
            api: [
                {
                    name: 'Tabs',
                    api: require('../../components/tabs/tabs-api.json')
                },
                {
                    name: 'Tab',
                    api: require('../../components/tab/tab-api.json')
                }
            ],
            snippets: {
                defaultTabs: require('./default/default.snippet.html'),
                docScrollableTabs: require('./scrollable/scrollable.snippet.html')
            }
            ,
            src: [
                {
                    name: 'Tabs',
                    script: require('!!html!highlightjs?lang=ts!../../components/tabs/index.ts'),
                    template: require('!!html!highlightjs?lang=html!../../components/tabs/tabs.html')
                },
                {
                    name: 'Tab',
                    script: require('!!html!highlightjs?lang=ts!../../components/tab/index.ts'),
                    template: require('!!html!highlightjs?lang=html!../../components/tab/tab.html')
                }
            ]
        }
    }
}