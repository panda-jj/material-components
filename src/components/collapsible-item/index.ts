import Component from 'vue-class-component';

import events from '../../mixins/events';

var Velocity = require('velocity-animate');

@Component({
    props: {
        name: {
            type: String,
            required: false,
            'default': false,
            twoWay: false
        },
        expanded: {
            type: Boolean,
            required: false,
            'default': false,
            twoWay: false
        }
    },
    mixins: [
        events
    ],
    events: {
        'collapsible::open': function (id, expendable) {
            this.open(id, expendable);
        },
        'collapsible::close': function (id) {
            this.close(id);
        }
    },
    template: require('./collapsible-item.html'),
    created() {
        this.$options.name = 'CollapsibleItem'
    }
})
export default class CollapsibleItem {
    private $els: any;
    private $dispatch: any;
    private $nextTick: any;

    private _uid: number;
    private name: string;
    private active: boolean;
    private expanded: boolean;

    data() {
        return {
            active: false
        }
    }

    compiled() {
        this.active = this.expanded;
    }

    get id(): any {
        if (this.name) {
            return this.name;
        }
        return this._uid;
    }

    get computedStyle() {
        if (this.active) {
            return {
                display: 'block'
            }
        }
        return null;
    }

    openThis(immediately = false) {
        if (!this.active) {
            this.active = true;
            if (immediately) {
                this.$els.body.style.height = '';
            }
            else {
                this.$nextTick(() => {
                    Velocity(this.$els.body, 'slideDown', this._slideConfig);
                });
            }
        }
    }

    get _slideConfig() {
        return {
            duration: 350,
            easing: "easeOutQuart",
            queue: false,
            complete: () => {
                this.$els.body.style.height = '';
            }
        }
    }

    open(id, expendable: boolean) {
        if (id === null || typeof id == "undefined") {
            this.openThis(true); // bulk open
        }
        else {
            if (id == this.id) {
                this.openThis();
            }
            else {
                if (!expendable) {
                    this.closeThis();
                }
            }
        }
    }

    closeThis(immediately = false) {
        if (this.active) {
            this.active = false;
            if (immediately) {
                this.$els.body.style.height = '';
            }
            else {
                this.$nextTick(() => {
                    this.$els.body.style.display = 'block';
                    Velocity(this.$els.body, 'slideUp', this._slideConfig);
                })
            }
        }
    }

    close(id) {
        if (id === null || typeof id == "undefined") {
            this.closeThis(true); // bulk close
        }
        else {
            if (id == this.id) {
                this.closeThis();
            }
        }
    }

    toggle() {
        if (this.active) {
            this.$dispatch('collapsible::close', this.id);
        }
        else {
            this.$dispatch('collapsible::open', this.id, true);
        }
    }
}