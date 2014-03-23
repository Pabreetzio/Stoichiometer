$('#periodic-table').html(new PeriodicTable({ "class": "symbol-only" }));


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
        return coefficient + self.molecularFormula.replace(/[0-9]+/g, '<sub>$&</sub>');
    });
    return self;
}

Stoichiometer = function () {
    var self = this;
    self.isReactantEntryMode = ko.observable(true);
    self.enterReactantsEntryMode = function () { self.isReactantEntryMode(true); }
    self.enterProductsEntryMode = function () { self.isReactantEntryMode(false); }
    self.reactants = ko.observableArray([]);
    self.products = ko.observableArray([]);
    self.addProduct = function () {
        self.products.push(self.activeMolecule());
        self.clearEntry();
    };
    self.addReactant = function () {
        self.reactants.push(self.activeMolecule());
        self.clearEntry();
    };
    self.removeMolecule = function (koMolecule, event) {
        var reactionSide = $(event.currentTarget).parents('[data-reaction-side]').data('reactionSide');
        self[reactionSide].remove(function (molecule) {
            return molecule.molecularFormula === koMolecule.molecularFormula;
        });
    }
    self.balance = function () {
        var reaction = new Reaction({ reactants: self.reactants(), products: self.products() });
        reaction.balance();
    }
    self.activeMolecule = ko.observable(new koMolecule(''));
    self.clear = function () {
        self.reactants.removeAll();
        self.products.removeAll();
        self.clearEntry();
    }
    self.clearEntry = function () {
        self.activeMolecule(new koMolecule(''));
    };
    ko.applyBindings(self);

    function addSymbolToActiveElement(symbol) {
        var newVal = (self.activeMolecule().molecularFormula || '') + symbol;
        self.activeMolecule(new koMolecule(newVal));
    }
    $(document).on('click', '.periodic-table-cell', function (e) {
        var symbol = $(e.currentTarget).find('.periodic-table-element-symbol').text();
        addSymbolToActiveElement(symbol);
    });
    $(document).on('click', '.number', function (e) {
        var symbol = $(e.currentTarget).text();
        addSymbolToActiveElement(symbol);
    });
};

window.stoichiometer = new Stoichiometer();