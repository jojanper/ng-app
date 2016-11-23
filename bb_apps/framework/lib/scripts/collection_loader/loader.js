define(['jquery', 'underscore'], function($, _) {

    /**
     * Manage (data) collections by retrieving or deleting items from the set.
     */
    CollectionManager = {

        // Collection set (cache)
        collections: {},

        /**
         * Get collection item. If the item is not locally cached,
         * fetch it from server.
         * @param {Object} Collection object
         * @param {String} Collection ID
         * @param {Function} Called when collection item is ready
         */
        getCollection: function(modelCollection, id, callback){
            var collection = this.collections[id];

            if (collection) {
                callback(collection);
            }
            else {
                var self = this;

                self.collections[id] = new modelCollection({url: id});
                self.collections[id].fetch({
                    success: function() {
                        callback(self.collections[id]);
                    },
                    error: function() {
                        delete self.collections[id];
                    }
                });
            }
        },

        /**
         * Delete specified collection item if cached locally. If no
         * identifier specified, all items are cleared from cache.
         * @param {String} Collection ID
         */
        deleteCollection: function(id) {
            if (id !== undefined) {
                delete this.collections[id];
            }
            else {
                this.collections = {};
            }
        }
    };

    return $.extend(CollectionManager, {_id: 'CollectionManager'});
});
