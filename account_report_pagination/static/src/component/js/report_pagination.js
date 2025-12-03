odoo.define('account_report_pagination.report_pagination_patch', function(require) {
    'use strict';

    var accountReports = require('account_reports.account_report');
    var accountReportsWidget = accountReports.accountReportsWidget;
    var rpc = require('web.rpc');
    var core = require('web.core');
    var _t = core._t;
    var _qweb = core.qweb;

    const TABLE_SELECTOR = '.o_account_reports_table.table-hover.table-bold-unfold';
    const REPORT_ROW_SELECTOR = '.o_account_searchable_line';
    const TOTAL_ROW_SELECTOR = '.o_account_searchable_line.total';

    accountReportsWidget.include({
        /**
         * @override
         */
        init: function(parent, action) {
            this._super(parent, action);
            this._page = 1;
            this._page_size = 0;

            var self = this;
            rpc.query({
                model: 'ir.config_parameter',
                method: 'get_param',
                args: ['account_report_pagination.page_size', '10'],
            }).then(function(value){
                self._page_size = parseInt(value) || 10;
                self.reload();
            }).catch(function(error) {
                console.error("Error fetching pagination page size:", error);
                self._page_size = 10;
            });
        },

        events: _.extend({}, accountReportsWidget.prototype.events, {
            'click .o_page_prev': '_onPagePrev',
            'click .o_page_next': '_onPageNext',
            'click .o_page_number': '_onPageNumberClick',
        }),

        _onPagePrev: function(e) {
            try {
                e.preventDefault();
                if (this._page > 1) {
                    this._page -= 1;
                    this.reload();
                }
            } catch (error) {
                console.error("Error in _onPagePrev:", error);
            }
        },

        _onPageNext: function(e) {
            try {
                e.preventDefault();
                const $rows = this.$(TABLE_SELECTOR).find(REPORT_ROW_SELECTOR).not('.total');
                const lastPage = Math.ceil($rows.length / this._page_size);

                if (this._page < lastPage) {
                    this._page += 1;
                    this.reload();
                }
            } catch (error) {
                console.error("Error in _onPageNext:", error);
            }
        },

        _onPageNumberClick: function(e) {
            try {
                e.preventDefault();
                const page = parseInt($(e.currentTarget).data('page'));
                if (!isNaN(page) && page !== this._page) {
                    this._page = page;
                    this.reload();
                }
            } catch (error) {
                console.error("Error in _onPageNumberClick:", error);
            }
        },


        /**
         * @override
         */
        render: function() {
            try {
                this._super.apply(this, arguments);

                if (this.$(TABLE_SELECTOR).length) {
                    this.render_table_pagination();
                    this.render_pagination();
                }
            } catch (error) {
                 console.error("Error during custom rendering (pagination part):", error);
            }
        },

        render_table_pagination: function() {
            try {
                const $table = this.$(TABLE_SELECTOR);
                if (!$table.length) return;

                const $rows = $table.find(REPORT_ROW_SELECTOR).not(TOTAL_ROW_SELECTOR);
                const $totalRow = $table.find(TOTAL_ROW_SELECTOR);

                $rows.hide();
                $totalRow.hide();

                const start = (this._page - 1) * this._page_size;
                const end = start + this._page_size;
                const $pageRows = $rows.slice(start, end);

                $pageRows.show();

                if ($pageRows.length) {
                    $totalRow.insertAfter($pageRows.last()).show();
                } else {
                    $totalRow.show();
                }
            } catch (error) {
                console.error("Error in render_table_pagination:", error);
            }
        },

        render_pagination: function() {
            try {
                const $table = this.$(TABLE_SELECTOR);
                if (!$table.length) return;

                const $rows = $table.find(REPORT_ROW_SELECTOR).not(TOTAL_ROW_SELECTOR);
                const total = $rows.length;

                this.$('.o_account_report_pagination').remove();

                if (total <= this._page_size) {
                    return;
                }

                const maxPage = Math.max(Math.ceil(total / this._page_size), 1);

                let pageLinks = '';
                for (let i = 1; i <= maxPage; i++) {
                    pageLinks += `<li class="page-item ${i===this._page?'active':''}">
                        <a class="page-link o_page_number" href="#" data-page="${i}">${i}</a>
                    </li>`;
                }

                const $pager = $(`
                    <div class="row justify-content-center my-3 ${total <= this._page_size ? 'd-none' : ''}">
                        <div class="col-auto">
                            <nav aria-label="Report Page navigation" class="o_account_report_pagination">
                                <ul class="pagination justify-content-center mb-0">
                                    <li class="page-item ${this._page===1 ? 'd-none' : ''}">
                                        <a class="page-link o_page_prev" href="#" aria-label="${_t('Previous')}">Previous</a>
                                    </li>
                                    ${pageLinks}
                                    <li class="page-item ${this._page===maxPage ? 'd-none' : ''}">
                                        <a class="page-link o_page_next" href="#" aria-label="${_t('Next')}">Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                `);

                $table.after($pager);
            } catch (error) {
                console.error("Error in render_pagination:", error);
            }
        },
    });
});