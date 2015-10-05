//requires molecule
var Reaction = function (args) {
    var self = this;
    self.reactants = [];
    self.products = [];

    if (args) !function parseArgs(){
        if (args.reactants) self.reactants = args.reactants;
        if (args.products) self.products = args.products;
    }();

    self.getMolecules = function() {
        return self.reactants.concat(self.products);
    }

    self.getElements = function () {
        return _(self.getMolecules())
            .map(function (molecule) {
                return _.keys(molecule.composition);
            })
            .flatten()
            .union()
            .value();
    }

    self.balance = function () {
        Reaction.prototype.balance(self);
    }
    
    var moleculeToString = function (molecule) {
        var moleculeString = ''
        if(molecule.coefficient&& molecule.coefficient > 1) moleculeString += molecule.coefficient;
        moleculeString += _(molecule.composition).map(function(value, key){
            var symbol = value > 0 ? key: '';
            var quantity = value > 1 ? value : '';
            return  symbol + quantity;
        }).value().join('');
        return moleculeString;
    }

    var equationSideToString = function (equationSide) {
        return _.map(equationSide, function(molecule){
            return moleculeToString(molecule);
        }).join(" + ");
    }

    self.toString = function () {
        return equationSideToString(self.reactants) + ' --> ' + equationSideToString(self.products);
    }
    return self;
}
/// <reference path="Reaction.js" />
Reaction.prototype.balance = function(reaction) {
    var reactionElements = reaction.getElements();
    var reactionMolecules = reaction.getMolecules();
    //Format: {composition: {C:6, H:12, O:6}, molecularFormula:'C6H12O6'}
    var compositionMatrix = _.map(reactionElements, function (element) {
        var matrixRow = [];
        _.each(reaction.reactants, function (molecule) {
            matrixRow.push(molecule.composition[element] || 0);
        });
        _.each(reaction.products, function (molecule) {
            matrixRow.push(- molecule.composition[element] || 0);
        });
        return matrixRow;
    });
    var kernal = compositionMatrix.nullspace();
    _(reactionMolecules).forEach(function (molecule, index) {
        molecule.setCoefficient(kernal[index]);
    });
}