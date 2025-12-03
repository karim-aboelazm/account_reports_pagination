from odoo import models, fields, api


class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    account_report_page_size = fields.Integer(
        string="Account Report Page Size",
        config_parameter='account_report_pagination.page_size',
        help="Number of rows to display per page in account reports."
    )
