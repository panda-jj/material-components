import Component from 'vue-class-component';

@Component({
    props: {
        active: {
            type: Boolean,
            required: false,
            'default': false,
            twoWay: false
        }
    },
    template: require('./collection-list-item.html')
})
export default class CollectionListItem {
    private _slotContents: any;

    get secondaryContentSlot() {
        return 'secondary-content' in this._slotContents;
    }
}