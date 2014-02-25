/// <reference path="Reaction.js" />
function balanceReaction(reaction) {
    reactionElements = reaction.getElements();
    reactionMolecules = reaction.getMolecules();
    var A = _.map(reactionElements, function (element) {
        var matrixRow = [];
        _.each(reaction.reactants, function (reactant) {
            matrixRow.push(reactant[element]|| 0);
        });
        _(reaction.products).first(reaction.products.length - 1).forEach(function (product) {
            matrixRow.push(-product[element]|| 0);
        });
        return matrixRow;
    });
    var lastMolecule = reactionMolecules[reactionMolecules.length - 1];
    var B = _.map(reactionElements, function(element) {
        return [lastMolecule[element] || 0];
    });
    var C = $M(A).inverse().multiply($M(B)).multiply($M(A).determinant());
    lastMolecule.coefficient = $M(A).determinant();
    _(reactionMolecules).first(reactionMolecules.length - 1).forEach(function (molecule, index) {
        molecule.coefficient = Math.round(C.elements[index][0]);
    });
}
