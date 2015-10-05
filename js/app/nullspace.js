Array.prototype.nullspace = function () {
    var self = this;

    function Matrix(arrayArray) {
        var matrix = this;
        matrix.value = arrayArray;
        matrix.rows = matrix.value.length;
        matrix.columns = matrix.value[0].length;
        matrix.freeColumnLength = 1;
        matrix.specialModifier = 1;
        matrix.pivotColumns = matrix.columns - matrix.freeColumnLength;
        matrix.row = function (rowNumber) {
            var thisRow = {};
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

        matrix.switchRows = function () {
            //not sure if this is necessary to implement yet.
        }
        matrix.isFreeColumn = function (columnNumber) {
            return columnNumber = matrix.value[0].length - matrix.freeColumnLength;
        }
        matrix.isPivotColumn = function(columnNumber){
            return !matrix.isFreeColumn(columnNumber);
        }
        matrix.isPivotPoint = function (rowNumber, columnNumber) {
            return rowNumber === columnNumber && columnNumber < matrix.pivotColumns;
        }

        matrix.makeZero = function (rowNumber, columnNumber) {
            matrix.row(rowNumber).addScalarMultipleOfAnotherRow(matrix.row(columnNumber), matrix.value[rowNumber][columnNumber] * -1);
        };

        matrix.makeOne = function (rowNumber, columnNumber) {
            //multiply row by its inverse.
            matrix.row(rowNumber).multiplyTimesScalar(1 / matrix.value[rowNumber][columnNumber]);
            //TODO: set special multiplier to account for this action...
        };
        return matrix;
    }
    var matrix = new Matrix(self);

    for (var columnNumber = 0; columnNumber < matrix.pivotColumns; columnNumber++) {
        for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
            if (rowNumber === columnNumber) {
                matrix.makeOne(rowNumber, columnNumber);
            }
            if(rowNumber > columnNumber) {
                matrix.makeZero(rowNumber, columnNumber);
            }
        }
    }
    for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
        for (var columnNumber = rowNumber + 1; columnNumber < matrix.pivotColumns; columnNumber++) {
            matrix.makeZero(rowNumber, columnNumber);
        }
    }
    //take free part and multiply by negative one.
    for (var rowNumber = 0; rowNumber < matrix.rows; rowNumber++) {
        matrix.value[rowNumber][matrix.columns - 1] = matrix.value[rowNumber][matrix.columns - 1] * -1;
    }
    for (var rowNumber = matrix.pivotColumns; rowNumber < matrix.rows; rowNumber++)
    {
        //add identity matrix
        matrix.value[rowNumber][matrix.columns - 1] = 1;
    }
    //multiply times special multiplier.
    return matrix.column(matrix.columns-1);
}