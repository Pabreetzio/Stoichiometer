stoichiometerTests = !function () {
    var self = this;
    self.on = true;
    self.addReactionFromText = function (text) {
        var reactionSides = text.split("->")
        var reactants = reactionSides[0].split("+");
        var products = reactionSides[1].split("+");
        _.forEach(reactants, function (reactant) {
            stoichiometer.reactants.push(new koMolecule(reactant.trim()));
        });
        _.forEach(products, function (product) {
            stoichiometer.products.push(new koMolecule(product.trim()));
        });
    }
    self.reactions = testData.reactions;

    ko.applyBindings(self, document.getElementById("debugging"));
    return self;
}();
