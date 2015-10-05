Array.prototype.nullspace = function () {
    var self = this;

    function Matrix(arrayArray) {
        var matrix = this;
        matrix.value = arrayArray.slice();
        matrix.rows = matrix.value.length;
        matrix.columns = matrix.value[0].length;
        matrix.freeColumnLength = 1;
        matrix.commonMultiple = 1;
        matrix.pivotColumns = matrix.columns - matrix.freeColumnLength;
        matrix.row = function (rowNumber) {
            var thisRow = {};
            thisRow.number = rowNumber;
            thisRow.value = matrix.value[rowNumber];

            thisRow.multiplyTimesScalar = function (scalar) {
                var modifiedRow = [];
                for (var columnNumber = 0; columnNumber < thisRow.value.length; columnNumber++)
                {
                    modifiedRow.push(thisRow.value[columnNumber] * scalar);
                }
                matrix.value[rowNumber] = modifiedRow;
            };

            thisRow.addScalarMultipleOfAnotherRow = function (otherRow, scalar) {
                var modifiedRow = [];
                for (var columnNumber = 0; columnNumber < thisRow.value.length; columnNumber++) {
                    var rowValue = thisRow.value[columnNumber];
                    var otherRowValue = otherRow.value[columnNumber];
                    modifiedRow.push(rowValue + (otherRowValue * scalar));
                }
                matrix.value[rowNumber] = modifiedRow;
            };

            return thisRow;
        }
        matrix.column = function (columnNumber) {
            var thisColumn = {};
            thisColumn.value = [];
            for (var rowNumber = 0; rowNumber < matrix.value.length; rowNumber ++) {
                thisColumn.value.push(matrix.value[rowNumber][columnNumber]);
            }
            return thisColumn;
        }

        matrix.isPivotPoint = function (rowNumber, columnNumber) {
            return rowNumber === columnNumber && columnNumber < matrix.pivotColumns;
        }

        matrix.makeZero = function (rowNumber, columnNumber) {
            matrix.row(rowNumber).addScalarMultipleOfAnotherRow(matrix.row(columnNumber), matrix.value[rowNumber][columnNumber] * -1);
        };

        function greatestCommonDenominator(a, b) {
            if (a < 0) a = -a;
            if (b < 0) b = -b;
            if (b > a) { var temp = a; a = b; b = temp; }
            while (true) {
                if (b == 0) return a;
                a %= b;
                if (a == 0) return b;
                b %= a;
            }
        }

        function updateLeastCommonMultiple(rowNumber, divisor){
            var row = matrix.row(rowNumber).value;
            for (var columnNumber = 0; columnNumber < matrix.columns; columnNumber++) {
                var commonMultiple = Math.round(row[columnNumber] * matrix.commonMultiple);
                if (commonMultiple % divisor !== 0) {
                    matrix.commonMultiple *= divisor / greatestCommonDenominator(commonMultiple, divisor);
                }
            }
        }

        matrix.swapRows = function(rowOne, rowTwo){
            var swapRowValue = rowOne.value.slice();
            matrix.value[rowOne.number] = rowTwo.value.slice();
            matrix.value[rowTwo.number] = swapRowValue;
        }


        function getNextSwappableRow(rowNumber, columnNumber){
            for (var swapRowNumber = rowNumber + 1; swapRowNumber < matrix.rows; swapRowNumber++) {
                if (matrix.value[swapRowNumber][columnNumber] !== 0)
                    return matrix.row(swapRowNumber);
            }
            throw Error("Unable to find null space.")
        }

        function makeSwaps(rowNumber, columnNumber) {
            if (matrix.value[rowNumber][columnNumber] === 0)
                matrix.swapRows(matrix.row(rowNumber), getNextSwappableRow(rowNumber, columnNumber));
        }

        matrix.makeOne = function (rowNumber, columnNumber) {
            //multiply row by its inverse.
            makeSwaps(rowNumber, columnNumber);
            var divisor = matrix.value[rowNumber][columnNumber];
            var scalar = 1 / matrix.value[rowNumber][columnNumber];
            updateLeastCommonMultiple(rowNumber, divisor)
            matrix.row(rowNumber).multiplyTimesScalar(scalar);
        };


        return matrix;
    }
    var matrix = new Matrix(self);

    !function makeMatrixAugmentedUpperUnitriangular(matrix) {
        for (var columnNumber = 0; columnNumber < matrix.pivotColumns; columnNumber++) {
            for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
                if (rowNumber === columnNumber) {
                    matrix.makeOne(rowNumber, columnNumber);
                }
                if (rowNumber > columnNumber) {
                    matrix.makeZero(rowNumber, columnNumber);
                }
            }
        }
    }(matrix);

    !function makeMatrixAugmentedIdentity(matrix) {
        for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
            for (var columnNumber = rowNumber + 1; columnNumber < matrix.pivotColumns; columnNumber++) {
                matrix.makeZero(rowNumber, columnNumber);
            }
        }
    }(matrix);

    //take free part and multiply by negative one.
    
    for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
        matrix.value[rowNumber][matrix.columns - 1] = matrix.value[rowNumber][matrix.columns - 1] * -1;
    }
    for (var rowNumber = matrix.pivotColumns; rowNumber < matrix.rows; rowNumber++)
    {
        //add identity matrix
        matrix.value[rowNumber][matrix.columns - 1] = 1;
    }

    var kernel = matrix.column(matrix.columns - 1).value;
    for (var index = 0; index < kernel.length; index++)
    {
        kernel[index] = Math.round(kernel[index] * matrix.commonMultiple);
    }

    return kernel;
}