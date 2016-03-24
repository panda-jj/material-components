import Component from 'vue-class-component';

import mdNavbar from '../../../components/navbar';

@Component({
    template: require('./navbar.html'),
    components: {
        mdNavbar
    }
})
export default class NavbarBreadcrumbs {
}

