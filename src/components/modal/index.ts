import Component from 'vue-class-component';

import mdLeanOverlay from '../lean-overlay';

const ESC = 27;

@Component({
    props: {
        id: {
            type: String,
            required: false,
            'default': null
        },
        result: {
            type: String,
            required: false,
            'default': null
        },
        'class': {
            type: String,
            required: false,
            'default': '',
            twoWay: false
        },
        bottom: {
            type: Boolean,
            required: false,
            'default': false,
            twoWay: false
        },
        closeOnOverlayClick: {
            type: Boolean,
            required: false,
            'default': true,
            twoWay: false
        }
    },
    components: {
        mdLeanOverlay
    },
    events: {
        'modal::open': function (id) {
            if (this.id === null || typeof this.id === "undefined") {
                this.open();
            }
            else if (this.id == id) {
                this.open();
            }
        },
        'modal::close': function (result, id) {
            if ((this.id === null || typeof this.id === "undefined") 
                || (this.id == id)) {
                this.close();
                this.result = result;
                return true;
            }
        }
    },
    watch: {
        active: function (active) {
            if (active) {
                window.document.body.style.overflow = 'hidden';
            }
            else {
                window.document.body.style.overflow = 'visible';
            }
        }
    },
    template: require('./modal.html')
})
export default class Modal {
    private active: boolean;
    private bottom: boolean;
    private closeOnOverlayClick: boolean;
    private class: string;
    private result: string;

    data() {
        return {
            active: false
        }
    }

    ready() {
        window.document.addEventListener('keydown', (evt: any) => {
            evt = evt || window.event;
            if (evt.keyCode == ESC) {
                this.close();
            }
        });
    }

    get computedStyle() {
        if (this.active) {
            return this.bottom ? {
                'z-index': 1003,
                'display': 'block',
                'opacity': 1,
                'bottom': '0px'
            } : {
                'z-index': 1003,
                'display': 'block',
                'top': '10%'
            }
        }
        return null;
    }

    get computedClasses() {
        var classes = '';
        if (this.class) {
            classes += this.class;
        }
        if (this.bottom) {
            classes += ' ';
            classes += 'bottom-sheet';
        }
        return classes;
    }

    get transition() {
        return this.bottom ? 'modal-bottom' : 'modal';
    }

    open() {
        if (!this.active) {
            this.active = true;
        }
    }

    close() {
        if (this.active) {
            this.active = false;
            this.result = null;
        }
    }

    closeOverlay() {
        if(this.closeOnOverlayClick) {
            this.close();
        }
    }
}