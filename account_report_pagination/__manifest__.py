{
    "name": "Account Report Pagination",

    "version": "0.1",

    "summary": "Adds configurable to account partner reports in Odoo.",

    "description": """
        Account Report Partner Pagination
        ================================
        
        This module provides a configurable pagination feature for account partner reports in Odoo.
        It allows you to:
        - Set the number of rows per page via system parameters.
        - Navigate pages using a modern Bootstrap pagination interface.
        - Automatically hide pagination if total rows are less than page size.
        - Integrates seamlessly with the account_reports module.
    """,

    "author": "Karim Mohammed Aboelazm",

    "category": "Accounting",

    "depends": ["account_reports"],

    "data": [
        "views/res_config_settings.xml",
    ],

    "assets": {
        "web.assets_backend": [
            "account_report_pagination/static/src/component/js/report_pagination.js",
        ],
    },

    "installable": True,

    "application": False,

    "license": "LGPL-3",
}
