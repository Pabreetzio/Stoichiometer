var Molecule = function (args) {
    var self = this;
    self.molecularFormula = '';
    self.composition = {};
    if (typeof args == 'string') self.molecularFormula = args;
    else { throw 'not implemented yet'; }
    self.composition = Molecule.getComposition(self.molecularFormula);
}
Molecule.getComposition = function (formula) {
    var composition = {};
    var elementGroups = formula.match(/[A-Z][a-z]{0,2}\d*/g);
    _.each(elementGroups, function (elementGroup) {
        var element = elementGroup.match(/[A-Z][a-z]{0,2}/)[0];
        var quantity = elementGroup.match(/\d/)[0];
        typeof composition[element] === 'number' ?
            composition[element] += 5 :
            composition[element] = 5;
    });
    return composition;
}