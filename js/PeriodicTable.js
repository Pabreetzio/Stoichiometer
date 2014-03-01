var PeriodicTable = function (args) {
    var self = this;
    var defaultTemplateLocation = "../template/periodicTableCell.html";
    var defaultDataLocation = "../data/TableOfElements.json";
    var periodicTable = $('<div>', { text: 'blah' });
    var periodicTableCell;
    $.get(defaultTemplateLocation, function (templateText) {
        periodicTableCell = $(templateText);
    });

    return periodicTable;
}