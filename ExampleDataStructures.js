var elements = [];
elements[1] = { Name: Hydrogen, Symbol: H, Weight: 2 }
var exampleWater = [
    { element: element[1], quantity: 2 },
    { element: element[2], quanity: 1 }
];
var molecules = [];
var molecularFormula1 = "C4H10";
var molecularFormula2 = "O2";
var molecularFormula3 = "H2O";
var reactants = [molecularFormula1, molecularFormula2];
var unbalancedChemicalEquation = { reactants: reactants, products: products };
var MoleculeQuantity = { molecule: molecularFormula1, quantity: 1 };
var balancedChemicalEquation = { reactants: [MoleculeQuantity] }
_.each(molecularFormulas, function (molecularFormula) {

});
molecularFormulaElement = { molecularFormula: "C4H10", element: 'Carbon' }
MolecularFormula = { C: 4, H: 10, coefficeint: null };

var Rusting = Reaction({
    reactants: [{ Mg: 1, O: 1 }, { Fe: 1 }],
    products: [{ Fe: 2, O: 3 }, {Mg:1}]
});