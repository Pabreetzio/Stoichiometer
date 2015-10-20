Array.prototype.nullspace = function () {
    var self = this;
    var debug = true;
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
                log("Row " + thisRow.number + " multiplied times " + scalar + ".");
            };

            thisRow.addScalarMultipleOfAnotherRow = function (otherRow, scalar) {
                var modifiedRow = [];
                for (var columnNumber = 0; columnNumber < thisRow.value.length; columnNumber++) {
                    var rowValue = thisRow.value[columnNumber];
                    var otherRowValue = otherRow.value[columnNumber];
                    modifiedRow.push(rowValue + (otherRowValue * scalar));
                }
                matrix.value[rowNumber] = modifiedRow;

                log("Row " + otherRow.number + " added to row " + thisRow.number +
                    " times " + scalar + ".");
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

        function getPivotRow(columnNumber) {
            //What if there is no pivot row for the column? cant make five zero if matrix is [[1,5,2],[0,0,1],[0,0,0]].
            if (matrix.value[columnNumber][columnNumber] === 0)
                log("Unable to find pivot row for column " + columnNumber)
            return matrix.row(columnNumber);
        }

        matrix.makeZero = function (rowNumber, columnNumber) {
            var pivotRow = getPivotRow(columnNumber);
            var rowBeingModified = matrix.row(rowNumber);
            if (pivotRow.value[columnNumber] % rowBeingModified.value[columnNumber] !== 0){
                pivotRow.multiplyTimesScalar(greatestCommonDenominator(pivotRow.value[columnNumber], rowBeingModified.value[columnNumber]));
                pivotRow = getPivotRow(columnNumber);
            }
            rowBeingModified.addScalarMultipleOfAnotherRow(pivotRow, pivotRow.value[columnNumber] / matrix.value[rowNumber][columnNumber] * -1);
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

        matrix.swapRows = function (rowOne, rowTwo) {
            if (rowOne.rowNumber === rowTwo.rowNumber)
                return;
            var swapRowValue = rowOne.value.slice();
            matrix.value[rowOne.number] = rowTwo.value.slice();
            matrix.value[rowTwo.number] = swapRowValue;
            log("Row " + rowOne.number + " swapped with row " + rowTwo.number + ".");
        }


        function getNextSwappableRow(rowNumber, columnNumber){
            for (var swapRowNumber = rowNumber + 1; swapRowNumber < matrix.rows; swapRowNumber++) {
                if (matrix.value[swapRowNumber][columnNumber] !== 0)
                    return matrix.row(swapRowNumber);
            }
            return matrix.row(rowNumber);
        }

        function makeSwaps(rowNumber, columnNumber) {
            if (matrix.value[rowNumber][columnNumber] === 0)
                matrix.swapRows(matrix.row(rowNumber), getNextSwappableRow(rowNumber, columnNumber));
        }

        matrix.reduce = function (rowNumber, columnNumber) {
            //multiply row by its inverse.
            makeSwaps(rowNumber, columnNumber);
            var divisor = matrix.value[rowNumber][columnNumber] || matrix.commonMultiple;
            var scalar = matrix.commonMultiple / matrix.value[rowNumber][columnNumber];
            updateLeastCommonMultiple(rowNumber, divisor)
            matrix.row(rowNumber).multiplyTimesScalar(scalar);
        };


        return matrix;
    }
    var matrix = new Matrix(self);

    function getFirstNonZeroElementColumnNumber(rowNumber) {
        if (rowNumber < 0)
            return -1;
        for (var columnNumber = 0; columnNumber < matrix.columns; columnNumber++) {
            if (matrix.value[rowNumber][columnNumber] !== 0)
                return columnNumber;
        }
        return matrix.columns;
    }

    function log(message) {
        if (debug)
            console.log(message+ "\n Result:" + JSON.stringify(matrix.value) );
    }
    !function makeMatrixAugmentedUpperUnitriangular(matrix) {
        for (var columnNumber = 0; columnNumber < matrix.pivotColumns; columnNumber++) {
            for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
                //if (columnNumber === getFirstNonZeroElementColumnNumber(rowNumber)) {
                //    matrix.reduce(rowNumber, columnNumber);
                //}
                if (columnNumber <= getFirstNonZeroElementColumnNumber(rowNumber - 1)) {
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

    !function reduceMatrix(matrix) {
        for (var columnNumber = 0; columnNumber < matrix.pivotColumns; columnNumber++) {
            for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
                if (columnNumber === getFirstNonZeroElementColumnNumber(rowNumber)) {
                    matrix.reduce(rowNumber, columnNumber);
                }
            }
        }
    }(matrix);

    //take free part and multiply by negative one.
    

    log("Free part taken from reduced row echelon form.");

    for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
        matrix.value[rowNumber][matrix.columns - 1] = matrix.value[rowNumber][matrix.columns - 1] * -1;
    }
    log("Matrix multiplied by -1.");

    for (var rowNumber = matrix.pivotColumns; rowNumber < matrix.rows; rowNumber++)
    {
        //add identity matrix
        matrix.value[rowNumber][matrix.columns - 1] = 1;
    }
    log("Identity matrix added to rows corresponding to free columns.");

    var kernel = matrix.column(matrix.columns - 1).value;
    log("Null space calculated to be " + kernel + ".");

    for (var index = 0; index < kernel.length; index++)
    {
        kernel[index] = Math.round(kernel[index] * matrix.commonMultiple);
    }
    

    return kernel;
}