define(['jquery',
        'jquery.ui',
        'readmore',
        'underscore',
        '../base/baseview',
        '../draal'],
       function($, jQueryUI, readmore, _, BaseView, DraalLib) {

    /**
     * Readmore.js wrapper.
     */
    return BaseView.extend({

        moreLink: '<a class="expander" title="Expand">&#x25BC; Show more</a>',
        lessLink: '<a class="expander" title="Close">&#x25B2; Show less</a>',

        /**
         * Use readmore feature for long blocks of text.
         */
        renderShowMore: function(selector) {
            var $selector = null;

            if (_.isFunction(selector)) {
                $selector = selector();
            }
            else if (_.isString(selector)) {
                $selector = $(selector);
            }

            $selector.readmore({
                maxHeight: 20,
                moreLink: this.moreLink,
                lessLink: this.lessLink,
                afterToggle: function(trigger, element, more) {
                    if (!more) {
                        DraalLib.Util.UiUtils.scrollTo(element);
                    }
                }
            });
        },

    }, {_id: 'ReadMore'});
});
