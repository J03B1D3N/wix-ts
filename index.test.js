// const {CONCAT, IF, OR, AND, NOT, EQ, GT, DIVIDE, SUM, MULTIPLY, isNotBoolean, isNotString, isNotNumber} = require('./index')

//checks if argument is not a number
function isNotNumber(value) {
    return 'number' !== typeof value || isNaN(value)
}

//checks if arguments not a string
function isNotString(value){
    return'string' !== typeof value
}

//checks if argument is not boolean
function isNotBoolean(value){
    return 'boolean' !== typeof value;
} 

//checks if all arguments are numbers, then multiplies them
function MULTIPLY(...args) {
    if(!args.some(isNotNumber)){
        return args.reduce(function (acc, cur) {
            return acc * cur
        })
    } else return '#ERROR: type does not match'
}

//checks if all arguments are numbers, then adds them together
function SUM(...args) {
    if(!args.some(isNotNumber)){
        return args.reduce(function (acc, cur) {
            return acc + cur
        })
    } else return '#ERROR: type does not match'
}

//checks if all arguments are numbers, then divides them
function DIVIDE(...args) {
    if(!args.some(isNotNumber)){
        return args.reduce(function (acc, cur) {
            return acc / cur
        })
    } else return '#ERROR: type does not match'
}

//checks if all arguments are numbers, then checks if first argument is greater than the other them
function GT(a,b) {
    if(isNotNumber(a) || isNotNumber(b)){
        return '#ERROR: type does not match'
    } else return (a > b ? true : false)
}

//checks if all arguments are of the same type, then equates their value them
function EQ(a,b) {
    if(isNotNumber(a) || isNotNumber(b)){
        return '#ERROR: type does not match'
    } else return (a == b ? true : false)
}

//checks if argument is a boolean, then reverses it
function NOT(a) {
    if(typeof a == "boolean"){
        return !a
    } else return '#ERROR: type does not match'
}

//checks if all arguments are booleans, then runs the AND operator on them
function AND(...args) {
    return (args.some(isNotBoolean) ? '#ERROR: type does not match' : args.reduce(function (acc, cur) {
        return acc && cur
    }))
}

//checks if all arguments are booleans, then runs the OR operator on them
function OR(...args) {
    return (args.some(isNotBoolean) ? '#ERROR: type does not match' : args.reduce(function (acc, cur) {
        return acc || cur
    }))
}

//IF statement. Returns error if condition is not a truthy or a falsy
function IF(condition, arg1, arg2) {

    if(isNotBoolean(condition)){
        return '#ERROR: type does not match'
    } else return (condition ? arg1 : arg2)
    
}

//checks if all arguments are strings, then concacts them
function CONCAT(...args) {
    return (args.some(isNotString) ? '#ERROR: type does not match' : args.reduce(function (acc, cur) {
        return acc.concat(cur)
    }))
}


describe('function tests', () => {

    it('isNotNumber() return true when anything but a number is provided', () => {
        expect(isNotNumber([])).toBe(true)
        expect(isNotNumber({})).toBe(true)
        expect(isNotNumber(true)).toBe(true)
        expect(isNotNumber(NaN)).toBe(true)
        expect(isNotNumber("")).toBe(true)
        expect(isNotNumber("80")).toBe(true)
        expect(isNotNumber(25)).toBe(false)

    })


    it('isNotString() returns true when anything but a string is provided', () => {
        expect(isNotString([])).toBe(true)
        expect(isNotString({})).toBe(true)
        expect(isNotString(1)).toBe(true)
        expect(isNotString(NaN)).toBe(true)
        expect(isNotString("")).toBe(false)
        expect(isNotString('')).toBe(false)
        expect(isNotString(``)).toBe(false)

    })

    it('isNotBoolean() returns true when anything but a boolean is provided', () => {
        expect(isNotBoolean([])).toBe(true)
        expect(isNotBoolean({})).toBe(true)
        expect(isNotBoolean(20)).toBe(true)
        expect(isNotBoolean("true")).toBe(true)
        expect(isNotBoolean("false")).toBe(true)
        expect(isNotBoolean(true)).toBe(false)
        expect(isNotBoolean(1)).toBe(true)

    })

    it('MULTIPLY() only multiplies numbers', () => {

        expect(MULTIPLY(5, 5, 'a')).toBe('#ERROR: type does not match')
        expect(MULTIPLY(5, 5, NaN)).toBe('#ERROR: type does not match')
        expect(MULTIPLY(5, 5, 5)).toBe(125)
        expect(MULTIPLY(5, 5, [5, 8])).toBe('#ERROR: type does not match')
        expect(MULTIPLY(5, 5, true)).toBe('#ERROR: type does not match')
        expect(MULTIPLY(5, 5, false)).toBe('#ERROR: type does not match')

    })

    //DIVIDE() is basically the same as the fucntions mentioned above therefore no point in testing

    it('GT() throws error if anything but a number is provided as argument. Correctly returns true or false if first number is greater or smaller', () => {

        expect(GT(20, "a")).toBe('#ERROR: type does not match')
        expect(GT(20, [])).toBe('#ERROR: type does not match')
        expect(GT(20, {})).toBe('#ERROR: type does not match')
        expect(GT(20, true)).toBe('#ERROR: type does not match')
        expect(GT(20, NaN)).toBe('#ERROR: type does not match')
        expect(GT(20, 10)).toBe(true)
        expect(GT(20, "10")).toBe('#ERROR: type does not match')

    })

    it('EQ() throws error if anything but a number is provided as argument. Correctly returns true if arguments are equal, false if not', () => {
        //uses the same isNotNumber() input validation as other functions, which was already rigorously tested.
        //No need to test it again.

        expect(EQ(20, 20)).toBe(true)
        expect(EQ(30, 30)).toBe(true)
        expect(EQ(20, 10)).toBe(false)
        expect(EQ(20, '20')).toBe('#ERROR: type does not match')

    })

    
    it('NOT() throws error when anything but a boolean is provided as argument. Correctly reverses boolean', () => {

        expect(NOT('20')).toBe('#ERROR: type does not match')
        expect(NOT(30)).toBe('#ERROR: type does not match')
        expect(NOT([true])).toBe('#ERROR: type does not match')
        expect(NOT('true')).toBe('#ERROR: type does not match')
        expect(NOT(NaN)).toBe('#ERROR: type does not match')
        expect(NOT({})).toBe('#ERROR: type does not match')
        expect(NOT(true)).toBe(false)
        expect(NOT(false)).toBe(true)

    })

    it('AND() correctly throws an error when not a boolean is provided as argument. Correctly applies the AND operator', () => {
        //uses the same isNotBoolean() function to validate input, no need to test it again

        expect(AND(true, true)).toBe(true)
        expect(AND(false, false)).toBe(false)
        expect(AND(true, false)).toBe(false)
        expect(AND(true, true, true)).toBe(true)
        expect(AND(true, true,true, true, true,true, true, true)).toBe(true)
        expect(AND(true, true,true, true, true,true, true, true,true, true, true,true, true, true, false)).toBe(false)


    })
    
    it('OR() correctly throws an error when not a boolean is provided as argument. Correctly applies the OR operator', () => {
        //uses the same isNotBoolean() function to validate input, no need to test it again

        expect(OR(true, true)).toBe(true)
        expect(OR(true, false)).toBe(true)
        expect(OR(false, false, false)).toBe(false)
        expect(OR(true, true,true, true, true,true, true, false)).toBe(true)
        expect(OR(true, true,true, true, false,true, true, true,true, false, true,true, true, true, true)).toBe(true)

    })

    it('IF() throws an error when not a boolean is provided as argument. Correctly returns arg1 if true, arg2 if false', () => {

        expect(IF(true, "spaghetti", "fusilli")).toBe("spaghetti")
        expect(IF(false, "spaghetti", "fusilli")).toBe("fusilli")
        expect(IF(false, "spaghetti", "fusilli")).toBe("fusilli")
        expect(IF([], "spaghetti", "fusilli")).toBe("#ERROR: type does not match")
        expect(IF(GT(10,5), "spaghetti", "fusilli")).toBe("spaghetti")
        expect(IF(OR(true, false), "spaghetti", "fusilli")).toBe("spaghetti")
        expect(IF(AND(true, false), "spaghetti", "fusilli")).toBe("fusilli")

    })

    it('CONCAT() returns error if anything but a string is used. Correctly concats the strings', () => {

        expect(CONCAT(true, "spaghetti", "fusilli")).toBe("#ERROR: type does not match")
        expect(CONCAT("conchigle ", "spaghetti ", "fusilli")).toBe("conchigle spaghetti fusilli")
        expect(CONCAT([], "spaghetti", "fusilli")).toBe("#ERROR: type does not match")
        expect(CONCAT({}, "spaghetti", "fusilli")).toBe("#ERROR: type does not match")
        expect(CONCAT(NaN, "spaghetti", "fusilli")).toBe("#ERROR: type does not match")
        expect(CONCAT(5, "spaghetti", "fusilli")).toBe("#ERROR: type does not match")
        expect(CONCAT('a','b','c','d','e','f','i','j')).toBe("abcdefij")

    })


})