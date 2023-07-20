type sheetBundle = {id: string, data:Array<Array<string | number>>}[]
type queue = Array<Array<string | number>>
type argument = string | number
type sheet = {data:Array<Array<string | number>>}


//the API call that gets us the sheets
async function fetchSheets() {

    
    const apiCall = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/sheets')
    
    let processedData = await apiCall.json()
    
    
    let returnUrl = processedData.submissionUrl
    let sheetBundle  = processedData.sheets

return {returnUrl, sheetBundle}
}    


//the main logic that processed the data and returns solved data
function spreadsheetProcessor(sheetBundle:sheetBundle) {
    
    //initialise alphabet
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    //initialise queue
    let queue:queue = []
    // console.log(sheetBundle)

    // time comlexity O(2n^3 ) || O(n^3)??
    // space complexity O(n) || O(3n)??

    //iterate through the sheets
    for(let sheet = 0;sheet < sheetBundle.length; sheet++) {

        //clean the queue with each iteration 
        queue = []
        
        //loop through numbers backwards(54321...)
        for(let data = sheetBundle[sheet].data.length - 1; data > -1; data--){
            queue[data] = []
    
            //loop through the letters backwards (ZYXWV...)
            for(let element = sheetBundle[sheet].data[data].length - 1; element > -1; element--){

                const variable = alphabet[element] + (data + 1)

                 //create a variable with corresponding A1 notation and solve it immediatelly if possible.
                eval(variable + '= ' + 'scrapeArguments(sheetBundle[sheet].data[data][element])' + ";")
            }
        }
  

        //loop through numbers (123456...)
        for(let data = 0; data < sheetBundle[sheet].data.length; data++){

            //loop through letters (ABCDFG...)
            for(let element = 0; element < sheetBundle[sheet].data[data].length; element++) {
  
                //create a variable with corresponding A1 notation and solve it immediatelly if possible.
                eval('var ' + alphabet[element] + (data + 1) + '= ' + 'scrapeArguments(sheetBundle[sheet].data[data][element])' + ";")
  
                // //push the value of solved/unsolved variable unto a queue
                queue[data].push(eval(alphabet[element] + (data + 1)))
            }
        }


        //process(solve) the variables
        queue = handleProcessing(queue)


        //return solved arguments into their place
        returnArguments(sheetBundle[sheet], queue)

        //reset the variables to null in order to avoid errors
        for(let sheet = 0;sheet < sheetBundle.length; sheet++) {
    
            for(let data = 0; data < sheetBundle[sheet].data.length; data++){
    
                for(let element = 0; element < sheetBundle[sheet].data[data].length; element++) {
    
                    eval('var ' + alphabet[element] + (data + 1) + '= ' + 'null' +";")
    
                }
            }
        }
    }

     //getting the submition ready for return
     let submission  = {
        "email": "justas.lapinas.98@gmail.com",
        "results": sheetBundle
    }

    //scrapes the arguments, solves them if it can, skips solving functions
    function scrapeArguments(argument:argument) {

        try{

            let processedArgument = argument

            if(typeof argument === 'string') {

                if(argument.includes('=')){
                    if(argument.includes("MULTIPLY") || argument.includes("SUM") || argument.includes("DIVIDE") || argument.includes("GT") || argument.includes("EQ") || argument.includes("NOT") || argument.includes("AND") || argument.includes("OR") || argument.includes("IF") || argument.includes("CONCAT")) {
                        return argument
                    } else {

                        processedArgument = argument.replace('=', '')

                        processedArgument = eval(processedArgument)

                    }
                } 
            }
            
        return processedArgument

        }

        catch {
            return argument 
        }
    }


    //itterates the processing function over the queue elements
    function handleProcessing(queue:queue) {

        for(let queueCount = 0; queueCount < queue.length; queueCount++) {

            queue[queueCount] = queue[queueCount].map(element => {
                    return processTheArguments(element)
            })
        }

        return queue

    }   

    //processes all the arguments if it can
    function processTheArguments(argument:argument) {

        try{

            let processedArgument = argument

            if( typeof argument === "string") {

                if(argument.includes('=')){

                    processedArgument = argument.replace('=', '')

                    processedArgument = eval(processedArgument)

                } 

            }
            
                
        return processedArgument

        }

        catch (error) {

            return `${error}`

        }
    }

    //returns all the results to their corresponding places.
    function returnArguments(sheet:sheet, queue:queue) {

        for( let data = 0; data < queue.length; data++ ) {

            for( let element = 0; element < queue[data].length; element++) {
                sheet.data[data][element] = queue[data][element]
            }
        }
    }


   
    return submission
}


//the POST request that calls the main function and returns the processed data to the API and logs the response
async function returnProcessedInfoToTheApi(submission:{email: string, results:sheetBundle}, returnUrl:string) {


    if(returnUrl) {
        const response = await fetch(returnUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(submission),
            });

        const result = await response.json()
        console.log(result)
    }
   
}

async function initApp() {

    const {returnUrl, sheetBundle} = await fetchSheets()

    const submission = spreadsheetProcessor(sheetBundle)

    returnProcessedInfoToTheApi(submission, returnUrl)

}




initApp();





//utility functions

//checks if argument is not number
function isNotNumber(value) {
    return 'number' !== typeof value || isNaN(value)
}

//checks if arguments is not string
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

module.exports = {CONCAT, IF, OR, AND, NOT, EQ, GT, DIVIDE, SUM, MULTIPLY, isNotBoolean, isNotString, isNotNumber, returnProcessedInfoToTheApi, fetchSheets, spreadsheetProcessor}



