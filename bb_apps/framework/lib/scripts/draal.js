define(['underscore', 'jquery', 'jquery.cookie'], function(_, $) {
    /**
     * @fileOverview Custom namespace : Draal.
     * @author <a href="mailto:juha.ojanpera@gmail.com">Juha Ojanpera</a>
     * @version 0.1
     */

    /**
     * Custom namespace Draal
     * @namespace
     */
    var Draal = {
        name: 'Draal',
    };


    /**
     * Utility functions.
     * @memberOf Draal
     * @namespace
     */
    Draal.Util = {
        name: 'Draal.Util',

        /**
         * Multiply given variables.
         * @function
         * @memberOf Draal.Util
         */
        multiply: function(x,y) {
            return (x * y);
        },

        parseErrorMessage: function(errors) {
            var message;

            message = '';
            for (var i = 0; i < errors.length; i++) {
                message += errors[i] + '<br>';
            }

            return message;
        },

        resizeElement: function(elId) {
            var hr = null;

            $(elId).mousedown(function(e) {
                hr = {
                    y : e.pageY,
                    p : $(this).prev(),
                    n : $(this).next(),
                    ph: $(this).prev().height(),
                    nh: $(this).next().height()
                };
                e.preventDefault();
            });

            $(document).mousemove(function(e) {
                if(hr) {
                    hr.p.height(hr.ph + (e.pageY - hr.y));
                    hr.n.height(hr.nh - (e.pageY - hr.y));
                }
                e.preventDefault();
            }).mouseup(function(e) {
                hr = null;
                e.preventDefault();
            });

            return hr;
        },

        serializeForm: function(idForm) {
            var dict = {};
            var data = $(idForm).serializeArray();
            for (var i = 0; i < data.length; i++) {
                var key = data[i].name;
                var value = data[i].value;
                dict[key] = value;
            }
            return dict;
        },

        splitData: function(data, nPages, nItemsPerPage, nTotalItems) {
            var iIdx = -1;
            var tableData = [];
            for (var i = 0; i < nPages; i++) {
                var done = false;
                var data2 = [];

                for (var j = 0; j < nItemsPerPage; j++) {
                    iIdx += 1;
                    if (iIdx >= nTotalItems) {
                        done = true;
                        break;
                    }

                    data2.push(data[iIdx]);
                }

                tableData.push(data2);
                if (done) {
                    break;
                }
            }

            return tableData;
        },

        capitaliseFirstLetter: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
    };

    Draal.Util.Spinner = {
        name: 'Draal.Util.Spinner',

        hide: function() {
            $('.spinner').hide();
        }
    };

    Draal.Util.Icon = {

        name: 'Draal.Util.Icon',

        createMinimizeIcon: function(id, onclick_args, elHeight) {
            img = $('<img/>', {
                'src': 'static/jquery/images/sort_asc.png',
                'css': {
                },
                'title': 'Hide',
                'onclick': onclick_args,
            });

            div = $('<div/>', {
                'id': id,
                'html': img,
                'css': {
                    'position': 'relative',
                    'float': 'right',
                    'bottom': (elHeight - 20) + 'px',
                    'padding-top': '0px',
                    'padding-right': '7px'
                }
            });

            return div;
        },

        createMaximizeIcon: function(id, onclick_args, elHeight) {
            img = $('<img/>', {
                'src': 'static/jquery/images/sort_desc.png',
                'css': {
                },
                'title': 'Show',
                'onclick': onclick_args,
            });

            div = $('<div/>', {
                'id': id,
                'html': img,
                'css': {
                    'position': 'relative',
                    'float': 'right',
                    'bottom': elHeight + 'px',
                    'padding-top': '0px',
                    'padding-right': '7px'
                }
            });

            return div;
        },

        // Create hide icon to specified container
        createHideIcon: function(iconElId, parentElId, parentElIdHeight, onclick_func) {
            $('#' + iconElId).remove();
            onclick_args = $.sprintf('%s("%s")', onclick_func, parentElId);
            div = Draal.Util.Icon.createMinimizeIcon(iconElId, onclick_args, parentElIdHeight);
            div.appendTo($(parentElId));
        },

        // Create show icon for restoring the original size of the container
        createShowIcon: function(iconElId, parentElId, parentElIdHeight, onclick_func) {
            $('#' + iconElId).remove();
            onclick_args = $.sprintf('%s("%s")', onclick_func, parentElId);
            div = Draal.Util.Icon.createMaximizeIcon(iconElId, onclick_args, parentElIdHeight);
            div.appendTo($(parentElId));
        },

        /**
         * Show loading indicator + text string (optional).
         * @param {string} text Text for the indicator.
         * @example
         * <pre class=prettyprint>
         * Draal.Util.Icon.loadSpinner('I am busy at the moment');
         * "Important tasks"
         * Draal.Util.Icon.unloadSpinner();
         * </pre>
         */
        loadSpinner: function(text) {
            //var buffer = $.sprintf('<img src="/static/img/loading.gif" /> <strong>%s</strong>', text);
            var buffer = $.sprintf('<img src="/static/img/busy.gif" /> <strong>%s</strong>', text);
            $.blockUI({
                message: buffer,
                css: {
                    width: 'auto',
                    padding: '10px',
                }
            });
        },

        /**
         * Hide loading indicator.
         */
        unloadSpinner: function() {
            $.unblockUI();
        },
    };

    Draal.Util.DataTables = {
        name: 'Draal.Util.DataTables',

        getTableID: function(dataTable) {
            return $(dataTable[0]).attr('id');
        },

        prepareTableAsHTML: function(id) {
            var div = $('<div />', {
                'id': id + '_div',
                'class': 'draal_datatable'
            });

            var table = $('<table />', {
                'id': id,
                'border': '0',
                'cellpadding': '0',
                'cellspacing': '0',
                'class': 'display',
            });
            table.appendTo(div);

            return div
        },
    };

    Draal.Util.DataTables.Formatting = {
        name: 'Draal.Util.DataTables.Formatting',

        // Formating function for row details
        mediaFormatDetails: function(oTable, nTr, rowIndex, fnSuccess) {
            var aData, buttons, buffer, sOut, html;

            buttons = []
            html = '<a title="%s" id="%s" class="changeMetadata draal_button small rosy_color">%s</a>'
            buttons.push($.sprintf(html, 'Change artist, title, album, and sharing settings',
                                   rowIndex, 'Change metadata'));

            html = '<a title="%s" id="%s" class="youtubeSearch draal_button small rosy_color">%s</a>';
            buttons.push($.sprintf(html, 'Query YouTube videos for current media',
                                   rowIndex, 'YouTube search'));

            aData = oTable.fnGetData(rowIndex);
            html = '<a title="%s" href="%s" id="%s" class="downloadClip draal_button small rosy_color">%s</a>';
            buttons.push($.sprintf(html, 'Save media to your local folder',
                                   '/media/download/' + aData.id, rowIndex, 'Download clip'));

            html = '<a title="%s" id="%s" class="linkData draal_button small rosy_color">%s</a>';
            buttons.push($.sprintf(html, 'View and edit contextual rendering data',
                                   rowIndex, 'Context data'));

            sOut = '<p><label for="media_name">Name</label><span name="media_name">&nbsp' + aData.name + '</span></p>';
	    sOut += '<p><label for="artist">Artist</label><span name="artist">&nbsp' + aData.artist + '</span></p>';
            sOut += '<p><label for="title">Title</label><span name="title">&nbsp' + aData.title + '</span></p>';
            sOut += '<p><label for="album">Album</label><span name="album">&nbsp' + aData.album + '</span></p>';
            sOut += '<p><label for="codec">Codec</label><span name="codec">&nbsp' + aData.format + '</span></p>';

            var shared = (aData.shared == true) ? 'Yes' : 'No';
            sOut += '<p><label for="shared">Shared</label><span name="shared">&nbsp' + shared + '</span></p>';

            var actions = '';
            for(var i = 0; i < buttons.length; i++) {
                actions += ' ' + buttons[i];
            }
            sOut += '<p><label for="actions">Actions</label><span name="actions">&nbsp' + actions + '</span></p>';

            fnSuccess(sOut);

	    return sOut;
        },

        highlightRow: function(dataTable, rowIndex, removeClass, className) {
            var tr = dataTable.fnGetNodes(rowIndex);
            $(tr).children().each(function() {
                if (removeClass == true) {
	            $(this).removeClass(className);
                }
                else {
                    $(this).addClass(className);
                }
	    });
        },
    };

    Draal.Util.UiUtils = {
        name: 'Draal.Util.UiUtils',

        /**
         * Scroll to desired element in the page
         */
        scrollTo: function(el) {
            var element;
            if(_.isObject(el)) {
                element = el;
            }
            else {
                element = $(el);
            }

            if(element.length > 0) {
                $('html, body').animate({
                    scrollTop: element.offset().top - 20
                }, 200);
            }
        },
    };

    Draal.Image = {
        name: 'Draal.Image',

        scaleImage: function(image, scale) {
            var width = Math.round(scale * parseInt($(image).css('width').replace('px', '')));
            var height = Math.round(scale * parseInt($(image).css('height').replace('px', '')));
            $(image).css({'width': width, 'height': height});
        },

        crossfade: function(settings) {
            var $active, $next, fadeSettings;

            fadeSettings = $.extend({
                'duration': 1000,
                'current_image': null,
                'next_image': null,
                'xfade_class': 'media-active',
            }, settings);

            $active = fadeSettings['current_image'];
            $next = fadeSettings['next_image'];

            // Fade out the top image
            $active.fadeOut(fadeSettings['duration'], function() {
                // Reset the z-index and unhide the image
                $active.css('z-index',1).show().removeClass(fadeSettings['xfade_class']);

                // Make the next image the top one
                $next.css('z-index',3).addClass(fadeSettings['xfade_class']);
            });
        },

        resize: function(image, width, height) {
            // Rescale the image
            $(image).css('width', width + 'px');
            $(image).css('height', height + 'px');
        },

        centerImage: function(image, $parent, width) {
            // Determine offset to center the image
            var cWidth = parseInt($parent.width());
            var leftOffset = Math.round((cWidth - width) * 0.5);

            // Center the image
            $(image).css('left', leftOffset);

            return leftOffset;
        },

        loadImage: function(image, options) {
            var opts = $.extend({
                success: function() {},
                error: function() {},
            }, options);

            return $('<img />')
                .attr('src', image)
                .load(function() {
                    opts['success'](this);
                })
                .error(function() {
                    opts['error']();
                });
        },
    };

    Draal.Playlist = {
        name: 'Draal.Playlist',

        loadPlaylists: function(options, fn, fnComplete) {
            var _options = $.extend({
                'full_fn': false,
                'url': null
            }, options);

            if (fnComplete === undefined)
                fnComplete = function() {};

            // Load playlist entries
            Draal.Ajax.ajax({url: _options['url']}, {
                'success': function(data) {
                    if (!_options['full_fn']) {
                        for(var i = 0; i < data.playlists.length; i++) {
                            fn(data.playlists[i], (i == data.playlists.length - 1));
                        }
                    }
                    else {
                        fn(data.playlists);
                    }
                },
                'complete': fnComplete()
            });
        }
    };

    Draal.Ajax = {
        name: 'Draal.Ajax',

        // Error handler for AJAX calls
        ajaxError: function (xhr, status, error) {
            // Show the possible error messages
            try {
                var response = $.parseJSON(xhr.responseText);
                var message = Draal.Util.parseErrorMessage(response.errors);
                var dialog = new MediaDialog('body',
                                             {title: 'Error',
                                              message:message
                                             }).launch();
            } catch (error) {
            }
        },

        // Handler when AJAX call has been completed
        ajaxComplete: function(data, callbacks) {
            try {
                if (callbacks.hasOwnProperty('complete')) {
                    try {
                        // Call only if we have some data from server
                        if (data.length > 0) {
                            callbacks['complete'](data);
                        }
                        else {
                            if (callbacks.hasOwnProperty('error')) {
                                callbacks['error'](true);
                            }
                        }
                    }
                    catch(error) {
                        if (callbacks.hasOwnProperty('error')) {
                            callbacks['error'](true);
                        }
                    }
                }
            }
            catch(error) {
            }
        },

        // Ajax call
        callAjax: function(inSettings, callbacks) {
            if (!inSettings.hasOwnProperty('dataType')) {
                inSettings['dataType'] = 'json';
            }

            if (!inSettings.hasOwnProperty('type')) {
                inSettings['type'] = 'GET';
            }

            if (!inSettings.hasOwnProperty('success')) {
                inSettings['success'] = function(result) {
                    this.data = result.data;
                    if (callbacks.hasOwnProperty('success')) {
                        try {
                            callbacks['success'](this.data);
                        } catch(error) {
                        }
                    }
                };
            }

            if (!inSettings.hasOwnProperty('error')) {
                inSettings['error'] = Draal.Ajax.ajaxError;
            }

            if (!inSettings.hasOwnProperty('complete')) {
                inSettings['complete'] = function() {
                    Draal.Ajax.ajaxComplete(this.data, callbacks);
                }
            }

            return $.ajax(inSettings);
        },

        // Handler for retrieving server data for datatables
        getServerDataTables: function(sSource, aoData, fnCallback) {
            var ajaxSettings = {
                "type": "GET",
                "url": sSource,
                "data": aoData,
                "success": fnCallback,
            };
            Draal.Ajax.callAjax(ajaxSettings);
        },

        // Handler for reading data from server
        getServerData: function(getUrl, callbacks) {
            var ajaxSettings = {
                "type": "GET",
                "url": getUrl,
            };
            Draal.Ajax.callAjax(ajaxSettings, callbacks);
        },

        // Handler for posting data to server
        postServerData: function(postUrl, postData, callbacks) {
            var ajaxSettings = {
                "type": "POST",
                "url": postUrl,
                "data": postData,
            };
            Draal.Ajax.callAjax(ajaxSettings, callbacks);
        },

        // Handler for updating data to server
        putServerData: function(putUrl, putData, callbacks) {
            var ajaxSettings = {
                "type": "PUT",
                "url": putUrl,
                "data": putData,
            };
            Draal.Ajax.callAjax(ajaxSettings, callbacks);
        },

        // Interface for AJAX calls
        ajax: function(urlSettings, callbacks) {
            var ajaxSettings = $.extend({
                'dataType': 'json',
                "type": "GET",
                "url": '',
                "data": '',
            }, urlSettings, callbacks);

            Draal.Ajax.callAjax(ajaxSettings);
        },

        /**
         * Test if CSRF protection is needed for HTTP method.
         */
        csrfSafeMethod: function(method) {
            // These HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        },

        /**
         * Set the header on your AJAX request, while protecting the CSRF token
         * from being sent to other domains.
         */
        csrfTokenSetup: function() {
            var csrftoken = $.cookie('csrftoken');

            $.ajaxSetup({
                crossDomain: false, // obviates need for sameOrigin test
                beforeSend: function(xhr, settings) {
                    if (!Draal.Ajax.csrfSafeMethod(settings.type)) {
                        xhr.setRequestHeader("X-CSRFToken", csrftoken);
                    }
                }
            });
        },

        /**
         * Return CSRF token header.
         */
        csrfToken: function() {
            return {'X-CSRFToken': $.cookie('csrftoken')};
        }
    };

    Draal.HTML = {
        name: 'Draal.HTML',

        populateDropdown: function(element, data) {
            var $element = $(element);

            var output = [];
            $.each(data, function() {
                output.push('<option value="' + this.id + '">' +
                            this.name +'</option>');
            });

            $element.empty();
            $element.append(output.join(''));
        }
    };

    return $.extend(Draal, {_id: 'DraalLib'});
});
