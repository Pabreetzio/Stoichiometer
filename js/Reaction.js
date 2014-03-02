var Rbeaction = function(args){
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
                return _.keys(molecule);
            })
            .flatten()
            .union()
            .value();
    }
    
    var moleculeToString = function (molecule) {
        var moleculeString = ''
        if(molecule.coefficient&& molecule.coefficient > 1) moleculeString += molecule.coefficient;
        moleculeString += _(molecule).omit('coefficient').map(function(value, key){
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
}
