var Molecule = function (args) {
    var self = this;
    self.coefficient = 1;
    self.molecularFormula = '';
    self.composition = {};
    if (typeof args == 'string') self.molecularFormula = args;
    else { throw 'not implemented yet'; }
    self.composition = Molecule.getComposition(self.molecularFormula);
    self.getFormattedMolecularFormula = function () {
        var coefficient2 = self.coefficient && self.coefficient !== 1 ? self.coefficient : '';
        return coefficient2 + self.molecularFormula.replace(/[0-9]+/g, '<sub>$&</sub>');
    }
    self.setCoefficient = function (coefficient) {
        self.coefficient = coefficient;
    }

}
Molecule.getComposition = function (formula) {
    var composition = {};
    var elementGroups = formula.match(/[A-Z][a-z]{0,2}\d*/g);
    _.each(elementGroups, function (elementGroup) {
        var element = elementGroup.match(/[A-Z][a-z]{0,2}/)[0];
        var elementQuantityStringMatches = elementGroup.match(/\d/);
        var quantity = elementQuantityStringMatches ? elementQuantityStringMatches[0] : 1;
        typeof composition[element] === 'number' ?
            composition[element] += quantity :
            composition[element] = quantity;
    });
    return composition;
}
//Molecule.prototype.getFormattedMolecularFormula = function (molecule) {
//    var coefficient = molecule.coefficient && molecule.coefficient !== 1 ? String(molecule.coefficient) : '';
//    return coefficient + molecule.molecularFormula.replace(/[1-9]/g, '<sub>$&</sub>');
//}