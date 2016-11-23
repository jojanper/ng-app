// Test responses for server requests
var AppTestResponses = {

    // Response for application models and associated actions
    metaApiResponse: [
        {
            "model": "upload",
            "actions": {},
            "app_label": "media"
        },
        {
            "model": "playlist",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/media/playlist/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "models"
        },
        {
            "model": "mediafolder",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/media/mediafolder/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "media"
        },
        {
            "model": "mediafolder2",
            "actions": {
                "create2": {
                    "url": "http://127.0.0.1:8000/api/generic/media/mediafolder/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "media"
        },
        {
            "model": "testmodel2",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/test_models/testmodel2/actions/create",
                    "display_name": "Create"
                },
                "create-new": {
                    "url": "http://127.0.0.1:8000/api/generic/test_models/testmodel2/actions/create-new",
                    "display_name": "Create"
                }
            },
            "app_label": "test_models"
        },
        {
            "model": "testmodel3",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/test_models/testmodel3/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "test_models"
        },
        {
            "model": "testmodel4",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/test_models/testmodel4/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "test_models"
        },
        {
            "model": "testmodel5",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/test_models/testmodel5/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "test_models"
        },
        {
            "model": "testmodel6",
            "actions": {
                "create": {
                    "url": "http://127.0.0.1:8000/api/generic/test_models/testmodel6/actions/create",
                    "display_name": "Create"
                }
            },
            "app_label": "test_models"
        }
    ],

    // Response for meta data request
    metaDataResponse: {
        simple: {
            "name": {
                "attributes": {
                    "min_length": null,
                    "max_length": 256
                },
                "required": true,
                "type": "text"
            }
        }
    },

    // Response for model item details
    modelDetailsResponse: {
        simple: {
            "id": 3,
            "last_modified": "2015-12-07 21:16:38.126397+00:00",
            "modified_by": "Juha Ojanper\u00e4",
            "name": "opio"
        }
    },

    // Response for model item change history
    modelItemHistoryResponse: {
        simple: {
            "recordsTotal": 1,
            "recordsFiltered": 1,
            "draw": "1",
            "aaData": [{
                "modified_by":
                "Juha Ojanper\u00e4",
                "last_modified": "2015-12-01T14:49:45.121Z",
                "events": [{
                    "status": ["Created value Active"],
                    "id": ["Created value 26"],
                    "name": ["Created value sfsddfd"]
                }]
            }]
        }
    },

    // Response for model listing
    modelListingsResponse: {
        mediafolder: {
            "recordsTotal": 40,
            "recordsFiltered": 40,
            "draw": "1",
            "aaData": [
                {
                    "id": 3,
                    "last_modified": "2015-12-11 17:29:08.142701+00:00",
                    "modified_by": "Juha Ojanper\u00e4",
                    "name": "opio23"
                },
                {
                    "id": 4,
                    "last_modified": "2015-11-10 20:09:57.508037+00:00",
                    "modified_by": "Juha Ojanper\u00e4",
                    "name": "toimiiko mit\u00e4 h\u00e4"
                },
                {
                    "id": 5,
                    "last_modified": "2015-12-05 15:32:29.211569+00:00",
                    "modified_by": "Juha Ojanper\u00e4",
                    "name": "toimiiko2234"
                },
                {
                    "id": 6,
                    "last_modified": "2015-11-16 19:42:17.492329+00:00",
                    "modified_by": "Juha Ojanper\u00e4",
                    "name": "\u00f6k\u00f6k"
                },
                {
                    "id": 7,
                    "last_modified": "2015-12-07 21:16:09.471404+00:00",
                    "modified_by": "Juha Ojanper\u00e4",
                    "name": "lauantai2"
                }
            ]
        },

        audioplayer: [
            {
                "name": "Bryan_Adams_-_Xmas_Time.mp3",
                "url": '/api/generic/media/upload/22/actions/download',
                "id": 22
            }
        ],

        mediaplayer: {
            "recordsTotal": 40,
            "recordsFiltered": 1,
            "draw": "1",
            "aaData": [
                {
                    "modified_by": "jojanper",
                    "name": "with_Pages_Kitaro_with_Pages_-_Caravan.flv",
                    "created": "2016-04-25T17:31:58.235717Z",
                    "url": "/apiv2/generic/media/upload/44/actions/download",
                    "actions": {
                        "download": {
                            "url": "http://127.0.0.1:8000/apiv2/generic/media/upload/44/actions/download",
                            "display_name": "Download",
                            "method": "GET"
                        },
                        "delete": {
                            "url": "http://127.0.0.1:8000/apiv2/generic/media/upload/44/actions/delete",
                            "display_name": "Delete",
                            "method": "POST"
                        }
                    },
                    "last_modified": "2016-04-25 17:31:58.872154+00:00",
                    "meta": {
                        "album": "",
                        "modified_by": "jojanper",
                        "artist": "",
                        "image": null,
                        "title": "",
                        "last_modified": "2016-04-25 17:31:58.865604+00:00",
                        "video": {
                            "modified_by": "jojanper",
                            "codec_format": "h264",
                            "height": 240,
                            "width": 320,
                            "last_modified": "2016-04-25 17:31:58.861732+00:00",
                            "frame_rate": 30,
                            "id": 3
                        },
                        "duration": 297.769999,
                        "audio": {
                            "modified_by": "jojanper",
                            "codec_format": "aac",
                            "channels": 2,
                            "last_modified": "2016-04-25 17:31:58.857473+00:00",
                            "sample_rate": 44100,
                            "id": 7
                        },
                        "id": 41
                    },
                    "id": 44
                }
            ]
        },

        videoplayer: [
            {
                "type": 'video/flash',
                "name": "with_Pages_Kitaro_with_Pages_-_Caravan.flv",
                "url": "/apiv2/generic/media/upload/44/actions/download",
                "id": 44
            },
            {
                "type": 'video/flash',
                "name": "with_Pages_Kitaro_with_Pages_-_Caravan.flv",
                "url": "/apiv2/generic/media/upload/46/actions/download",
                "id": 46
            },
            {
                "type": 'video/flash',
                "name": "with_Pages_Kitaro_with_Pages_-_Caravan.flv",
                "url": "/apiv2/generic/media/upload/49/actions/download",
                "id": 49
            }
        ]
    },

    uploadResponseWithActions: {
        "recordsTotal": 74,
        "recordsFiltered": 74,
        "draw": "1",
        "aaData": [
            {
                "id": 89,
                "name": "My audio playlist",
                "mode": 0,
                "last_modified": "2014-09-23T21:00:00Z",
                actions: {
                    approve: {
                        url: '/api/1/approve',
                        display_name: 'Approve'
                    }
                }
            },
            {
                "id": 90,
                "name": "image2",
                "mode": 2,
                "last_modified": "2014-09-23T21:00:00Z",
                actions: {
                    approve: {
                        url: '/api/1/approve',
                        display_name: 'Approve'
                    }
                }
            },
        ]
    }
};
