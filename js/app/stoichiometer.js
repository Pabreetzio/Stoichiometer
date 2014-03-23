$('#periodic-table').html(new PeriodicTable({ "class": "symbol-only" }));

$(document).on('click', '.periodic-table-cell', function (e) {
    var symbol = $(e.currentTarget).find('.periodic-table-element-symbol').text();
    var newVal = $('#reactants').val() + symbol;
    $('#reactants').val(newVal);
});

$('.periodic-table-cell')
    .tooltip({
        html: true,
        title: function () {
            return $(this).find('.periodic-table-cell-tooltip').html();
        }
    });

koMolecule = function (molecularFormula) {
    var self = this;
    $.extend(self, new Molecule(molecularFormula));
    self.coefficient = ko.observable(self.coefficient);
    self.setCoefficient = function (coefficient) {
        self.coefficient(coefficient);
    }
    self.moleculeText = ko.computed(function () {
        var coefficient = self.coefficient() && self.coefficient() !== 1 ? self.coefficient() : '';
        return coefficient + self.molecularFormula.replace(/[1-9]/g, '<sub>$&</sub>');
    });
    return self;
}

Stoichiometer = function () {
    var self = this;
    self.isReactantEntryMode = ko.observable(true);
    self.enterReactantsEntryMode = function () { self.isReactantEntryMode(true); }
    self.enterProductsEntryMode = function () { self.isReactantEntryMode(false); }
    self.reactants = ko.observableArray([new koMolecule('H2'), new koMolecule('O2')]);
    self.products = ko.observableArray([new koMolecule('H2O')]);
    self.balance = function () {
        var reaction = new Reaction({ reactants: self.reactants(), products: self.products() });
        reaction.balance();
    }
    ko.applyBindings(self);
};

window.stoichiometer = new Stoichiometer();