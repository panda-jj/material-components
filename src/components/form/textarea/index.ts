import Component from 'vue-class-component';

import inputMixin from '../../../mixins/input';

@Component({
    props: {
        value: {
            type: String,
            required: false,
            'default': null
        },
        name: {
            type: String,
            required: false,
            'default': null,
            twoWay: false
        },
        disabled: {
            type: Boolean,
            required: false,
            'default': null,
            twoWay: false
        },
        readonly: {
            type: Boolean,
            required: false,
            'default': null,
            twoWay: false
        },
        autoresize: {
            type: Boolean,
            required: false,
            'default': true,
            twoWay: false
        },
        lazy: {
            type: Boolean,
            required: false,
            'default': false,
            twoWay: false
        },
        number: {
            type: Boolean,
            required: false,
            'default': false,
            twoWay: false
        },
        debounce: {
            "type": Number,
            "required": false,
            "default": 0,
            "twoWay": false
        }
    },
    mixins: [
        inputMixin
    ],
    template: require('./textarea.html')
})
export default class TextArea {
    private $els: any;
    private _slotContents: any;

    private chars: number;
    private value: string;
    private disabled: boolean;
    private active: boolean;

    data() {
        return {
            active: false
        }
    }

    ready() {
        this.chars = this.value ? this.value.length : 0;
    }
    
    get labelClasses() {
        return {
            active: this.active || this.value,
            disabled: this.disabled
        }
    }

    get lines() {
        return this.value ? this.value.split('\n').length : 0;
    }

    get field(): HTMLTextAreaElement {
        return this.$els.field;
    }

    hasSlot(name = 'default') {
        return name in this._slotContents;
    }

    resize(e) {
        var chars = e.target.value ? e.target.value.length : 0;
        var styles = window.getComputedStyle(this.field);
        var paddingVertical = parseInt(styles.getPropertyValue('padding-bottom')) + parseInt(styles.getPropertyValue('padding-top'));
        if (chars < this.chars) {
            this.field.style.height = 'auto';
        }
        this.field.style.height = (this.field.scrollHeight - paddingVertical) + 'px';
        // Velocity(this.field, {height: this.field.scrollHeight - paddingVertical}, {
        //     duration: 10
        // });
        this.chars = chars;
    }

    delayedResize(e) {
        window.setTimeout(() => {
            this.resize(e)
        }, 0);
    }

    activateField() {
        this.active = true;
    }

    deactivateField() {
        this.active = false;
    }
}