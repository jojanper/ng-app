define([
    '../common/model_list',
    'text!./controllers/templates/dropdown.html',
    'text!./controllers/templates/file_uploads.html',
    'text!./controllers/templates/forms.html',
    'text!./controllers/templates/tables.html'
], function (baseListTemplateFn, DropdownTemplate, FileUploadTemplate, FormsTemplate, TablesTemplate) {
    "use strict";

    return [
        {
            link: 'test',
            display: 'Test page',
            template: function() { return baseListTemplateFn(''); }
        },

        {
            link: 'dropdowns',
            parent: 'test',
            breadcrumb: 'Dropdowns and dialogs',
            template: DropdownTemplate
        },

        {
            link: 'file-upload',
            parent: 'test',
            breadcrumb: 'File upload',
            template: FileUploadTemplate
        },

        {
            link: 'forms',
            parent: 'test',
            breadcrumb: 'Forms',
            template: FormsTemplate
        },

        {
            link: 'datatables',
            parent: 'test',
            breadcrumb: 'Datatables',
            template: TablesTemplate
        },

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        {
            link: 'about',
            display: 'About',

            // we'll get to this in a bit
            views: {

                // the main template will be placed here (relatively named)
                '': { templateUrl: 'ng-templates/partial-about.html' },

                // the child views will be defined here (absolutely named)
                'columnOne@about': { template: 'Look I am a column!' },

                // for column two, we'll define a separate controller
                'columnTwo@about': {
                    templateUrl: 'ng-templates/table-data.html',
                    controller: ['$scope', function($scope) {
                        $scope.message = 'test';
                        $scope.scotches = [
                            {
                                name: 'Macallan 12',
                                price: 50
                            },
                            {
                                name: 'Chivas Regal Royal Salute',
                                price: 10000
                            },
                            {
                                name: 'Glenfiddich 1937',
                                price: 20000
                            }
                        ];
                    }]
                }
            }
        }
    ];
});
