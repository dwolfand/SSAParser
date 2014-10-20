"use strict";

var SYMBOLS = [
    "$",
    "USD"
];

function Currency(c) {
    if (c instanceof Currency) {
        return c;
    }

    // Enable constructor usage without new.
    if (!(this instanceof Currency)) {
        return new Currency(c);
    }

    var amount = c;
    if (typeof c == "number") {
        amount = c.toFixed(2);
    } else if (typeof c == "string") {
        amount = c.trim();
        SYMBOLS.forEach(function(symbol){
            amount = amount.replace(symbol,"");
        });
        amount = amount.trim();
    } else if (c instanceof BigNumber) {
        amount = c.toFixed(2);
    }

    BigNumber.call(this, amount);
    return this;
}

Currency.prototype = new BigNumber(0);

Currency.prototype.format = function(format, decPoints) {
    var fixedString = this.round(decPoints, BigNumber.ROUND_HALF_UP).toFixed(decPoints);
    return numeral(fixedString).format(format);
};

Currency.prototype.toRoundedStringNoSign = function(showCents) {
    return this.toRoundedString(showCents, false);
};

Currency.prototype.toRoundedString = function(showCents, showDollarSign) {
    var format = "(",
        decimalPoints = 0;

    if (showDollarSign){
        format += "$";
    }
    format += "0,0";
    if (showCents) {
        decimalPoints = 2;
        format += ".00";
    }
    format += ")";

    return this.format(format, decimalPoints);
};


Currency.prototype.toString = function(n) {
    if (n === undefined || n === 0) {
        return this.format("($0,0)", 0);
    } else {
        return this.format("($0,0.00)", n);
    }
    
};

Currency.prototype.toISOString = function() {
    return "USD " + this.format("-0.00", 2);
};

Currency.prototype.toJSON = Currency.prototype.toISOString;

// Each of these methods are expected to return a new Currency object
["plus", "minus", "times", "round", "floor", "ceil", "abs", "absoluteValue", "neg", "negated", "pow", "toPower"].forEach(function(method){
    Currency.prototype[method] = function(n) {
        return new Currency(BigNumber.prototype[method].call(this, n));
    };
});

Currency.prototype.div = function(n) {
    var bn = BigNumber.prototype.div.call(this, n);
    return new Currency(bn);
};

Currency.prototype.roundTo = function(n) {
    return this.div(n).round().times(n);
};


Currency.isISOString = function(value) {
    return (/^[A-Z]{3} -?[0-9]+\.[0-9]{2}$/).test(value);
};

Currency.fromISOString = function(value) {
    if (value) {
        return new Currency(value);
    } else {
        return value;
    }
};

Currency.zero = new Currency(0);
Currency.one = new Currency(1);

module.exports = Currency;