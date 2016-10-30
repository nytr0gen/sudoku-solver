var _cell = [];
var _marks = (1<<10)-2;

var isNum = function(num) {
    num = parseInt(num);

    return num-0 == num;
};

var isPowerOfTwo = function(x) {
  return ((x != 0) && !(x & (x - 1)));
}

var powerOfTwo = function(x) {
    for (ret = -1; x; ++ret)
        x >>= 1;

    return ret;
}

var init = function() {
    for (var i = 0; i < 9; ++i)
        _cell[i] = $$('[class^=c' + i + ']');

    var cells = $$('[class^=c]');
    cells.set('contenteditable', 'true');

    cells.addEvent('click', function(event) {
        if (!isNum(this.get('html'))) {
            this.set('html', '');
        }
    });

    cells.addEvent('keyup', function(event) {
        switch (event.key) {
            case '1': case '2': case '3': case '4': case '5':
            case '6': case '7': case '8': case '9':
                solveAll(this);
                break;
        }
    });
};

var solveAll = function(element) {
    var block = element.getParent('table').get('class');
    solveBlock(block);

    var row   = element.get('class').substr(1, 1);
    solveRow(row);

    var col   = element.get('class').substr(2, 1);
    solveCol(col);

    //_singles($$('.' + block + ' td'));
    //_singles(_cell[row]);

     var container = [];
    _cell.each(function(item, index) {
        container[index] = item[col];
    });
    _singles(container);
};

var _singles = function(container) {
    var mark = 0;
    var marks = [];
    container.each(function(cell, i) {
        if (!isNum(cell.get('html'))) {
            marks[i] = cell.get('marks');
            mark    ^= marks[i];
        }
    });

    var sack = [];
    for (var aux = 2; aux <= _marks; aux <<= 1)
        if (mark & aux) {
            var count = 0;
            for (var j = 0; j < 9 && count < 2; j++)
                if (marks[j] & aux) {
                    count++;
                    index = j;
                }

            if (count == 1) sack.push([index, powerOfTwo(aux)]);
        }

    sack.each(function(item) {
        var index = item[0];
        var num   = item[1];

        console.log(container[index]);
        container[index].setStyle('background', 'red');
        placeNum(container[index], num);
        solveAll(container[index]);
    });
}

var placeNum = function(container, num) {
    container.set('text', num);
};

var _solve = function(container) {
    var set     = 0;
    var marks = _marks;
    var num;

    container.each(function(num, index) {
        num = num.get('html');
        if (isNum(num)) {
            num = 1<<num;
            if (marks | num) {
                marks ^= num;
            } else {
                // Error
            }

            set |= 1<<index;
        }
    });

    var aux;
    container.each(function(item, index) {
        if (!(set & (1<<index))) {
            aux = item.get('marks');
            if (aux) { aux&= marks; }
            else     { aux = marks; }

            if (isPowerOfTwo(aux)) {
                placeNum(item, powerOfTwo(aux));
                solveAll(item);
            } else {
                item.set('marks', aux)
                    .set('html',  marksToStr(aux));
            }

        }
    });
};

var solveCol = function(col) {
    var container = [];
    _cell.each(function(item, index) {
        container[index] = item[col];
    });

    _solve(container);
    //_singles(container);
};

var solveRow = function(row) {
    var container = _cell[row];

    _solve(container);
    // _singles(container);
}

var solveBlock = function(block) {
    var container = $$('.' + block + ' td');

    _solve(container);
   //_singles(container);
}

var marksToStr = function(marks) {
    var ret = '';
    var num = 2;
    var i;

    for (i = 1; i <= 9; ++i, num <<= 1) {
        ret += marks & num ? i : ' ';
        ret += i % 3 ? ' ' : '\n';
    }

    return '<pre>' + ret + '<pre>';
};

var demo = function() {
    var cell = [[3,4,0,0,0,9,0,0,0],
                [0,0,0,5,6,2,3,0,0],
                [0,0,0,4,3,0,0,0,8],
                [0,0,2,0,8,0,0,0,9],
                [0,0,6,9,0,5,1,0,0],
                [9,0,0,0,2,0,6,0,0],
                [7,0,0,0,4,8,0,0,0],
                [0,0,1,7,5,3,0,9,0],
                [0,0,0,2,0,0,0,5,7]];

    var demoStep = function() {
        ++j;

        if (j == 9) {j = 0; ++i;}
        if (i == 9) {clearInterval(step); return;}

        if (!cell[i][j]) demoStep();

        _cell[i][j].set('text', cell[i][j]);
        solveAll(_cell[i][j]);
    };

    var step = setInterval(function(){demoStep();}, 100);
    var i = 0;
    var j = -1;
};

init();