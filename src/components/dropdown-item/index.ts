import Component from 'vue-class-component';

@Component({
    props: {
        closing: {
            type: Boolean,
            required: false,
            'default': true,
            twoWay: false
        },
        name: {
            type: String,
            required: false,
            'default': null,
            twoWay: false
        },
    },
    template: require('./dropdown-item.html')
})
export default class DropdownItem {
    private $dispatch: any;
    private closing: boolean;
    private name: string;
    private _uid: string;

    select() {
        // if (this.closing) {
        this.$dispatch('dropdown-list::close');
        // }
        this.$dispatch('dropdown-item::selected', this.id);
    }

    get id() {
        if (this.name) {
            return this.name;
        }
        return this._uid;
    }
}