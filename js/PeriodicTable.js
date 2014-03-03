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
    var mainBlock = { groups: _.range(1, 19), periods: _.range(1, 8) }
    var fBlock = { groups: _.range(-2, 0).concat(_.range(19, 34)), periods: _.range(6, 8) }
    
    function getPeriodicTableCell(period, group) {
        var tableCell = $(periodicTableCellTemplate);
        var element = _.find(elements, { "Period": period, "Group": group });
        if (element) {
            tableCell.find('.periodic-table-element-number').text(element.AtomicNumber);
            tableCell.find('.periodic-table-element-symbol').text(element.Symbol);
            tableCell.find('.periodic-table-element-name').text(element.Name);
            tableCell.find('.periodic-table-element-mass').text(element.AtomicMass);
        }
        else {
            tableCell.addClass('invisible');
        }
        return tableCell;
    }
    //exampleBlock = {groups: [1,2], periods: [1,2]}
    function getBlock(block) {
        var blockContainer = $('<div>');
        _.forEach(block.periods, function (period) {
            _.forEach(block.groups, function (group) {
                blockContainer.append(getPeriodicTableCell(period, group));
            });
            blockContainer.append($('<br>'));
        });
        return blockContainer;
    }

    $.when(gettingElements, gettingTemplate).done(function () {
        var blocks = $('<div>', { 'class': 'blocks' });
        blocks.append(getBlock(mainBlock));
        blocks.append(getBlock(fBlock));
        $('#periodic-table').html(blocks.html());
    });
}