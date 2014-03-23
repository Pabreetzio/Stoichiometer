//dependencies = [underscore, jquery, TableOfElements]
//args = {cellTemplateText: '', tableOfElements: [{}], templatePath: '', class: ''}
var PeriodicTable = function (args) {
    args = args || {};
    var self = this;
    var periodicTable = $('<div>', { 'class': 'periodic-table ' + (args.class || '')});
    var defaultTemplateSelector = '#periodic-table-cell-template';
    var defaultTableOfElementsVariable = 'tableOfElements';
    var defaultTemplatePath = '../template/ButtonPeriodicTableCell.html';
    //block = {groups: [], periods: [], class: ''}
    var mainBlock = { groups: _.range(1, 19), periods: _.range(1, 8), 'class': 'main-block-collection' };
    var fBlock = { groups: _.range(-2, 0).concat(_.range(19, 34)), periods: _.range(6, 8), 'class': 'f-block-collection' };
    var blocks = [mainBlock, fBlock];
    var periodicTableCellTemplate = args.cellTemplateText ||
        $.ajax({
            url: args.templatePath || defaultTemplatePath,
            async: false
        }).responseText;
    var elements = args.tableOfElements || window[defaultTableOfElementsVariable];
    _.forEach(blocks, function (block) {
        var blockContainer = self.getBlock(block, elements, periodicTableCellTemplate);
        periodicTable.append(blockContainer)
    });
    return periodicTable;
}

//block = {groups: [], periods: [], class:''}
//elements = [{}];
//template = '';
PeriodicTable.prototype.getBlock = function(block, elements, template) {
    var blockContainer = $('<div>', { 'class': block.class });
    _.forEach(block.periods, function (period) {
        _.forEach(block.groups, function (group) {
            var element = PeriodicTable.prototype.getElement(period, group, elements);
            var cell = PeriodicTable.prototype.getTableCell(template, element);
            blockContainer.append(cell);
        });
        blockContainer.append($('<br>'));
    });
    return blockContainer;
}

//var period = Number(), group = Number, elements = [{}];
PeriodicTable.prototype.getElement = function (period, group, elements) {
    return _.find(elements, { "Period": period, "Group": group });
}

//var tableCellTemplate = '', element = {Group: Number(), Period: Number(), AtomicNumber: Number(), Symbol: '', Name: '', AtomicMass: Number(), Block: ''};
PeriodicTable.prototype.getTableCell = function (tableCellTemplate, element) {
    var tableCell = $(tableCellTemplate);
    if (element) {
        tableCell.addClass('group-' + element.Group).addClass('period-'+element.Period);
        tableCell.addClass(element.Block + '-block');
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