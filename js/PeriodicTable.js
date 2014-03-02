var PeriodicTable = function (args) {
    var self = this;
    var defaultTemplateLocation = "../template/periodicTableCell.html";
    var defaultDataLocation = "../data/TableOfElements.js";
    var periodicTable = $('<div>', { });
    var periodicTableCellTemplate;
    var gettingTemplate = $.get(defaultTemplateLocation, function (templateText) {
        periodicTableCellTemplate = templateText;
    });
    var elements;
    var gettingElements = $.get(defaultDataLocation, function(tableOfElements){
        elements = $.parseJSON(tableOfElements);
    });
    var groups = _.range(1, 19);
    var periods = _.range(1, 8);
    $.when(gettingElements, gettingTemplate).done(function () {
        _.forEach(periods, function (period) {
            _.forEach(groups, function (group) {
                var tableCell = $(periodicTableCellTemplate);
                var element = _.find(elements, { "Period": period, "Group": group });
                if (element) {
                    tableCell.find('.periodic-table-element-number').text(element.AtomicNumber);
                    tableCell.find('.periodic-table-element-symbol').text(element.Symbol);
                    tableCell.find('.periodic-table-element-name').text(element.Name);
                    tableCell.find('.periodic-table-element-mass').text(element.AtomicMass);
                }
                periodicTable.append(tableCell);
            });
            periodicTable.append($('<br>'));
        });
    });
    $('#periodic-table').html(periodicTable);
}