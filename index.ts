async function spreadsheetProcessor() {

    const sheetBundle = await fetchSheets()
    console.log(sheetBundle)
    
    //initialise alphabet
    var alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    var returnUrl
    //initialise queue
    let queue:Array<string[]> = []
    // console.log(sheetBundle)

    // time comlexity O(2n^3 ) || O(n^3)
    // space complexity O(n) || O(3n)

    //iterate through the sheets
    for(let sheet = 0;sheet < sheetBundle.length; sheet++) {

        //clean the queue with each iteration 
        queue = []
        
        //loop through numbers backwards(54321...)
        for(let data = sheetBundle[sheet].data.length - 1; data > -1; data--){
    
            //loop through the letters backwards (ZYXWV...)
            for(let element = sheetBundle[sheet].data[data].length - 1; element > -1; element--){

                const variable = alphabet[element] + (data + 1)
                console.log(variable)

                 //create a variable with corresponding A1 notation and solve it immediatelly if possible.
                eval("var " + variable + '= ' + 'scrapeTheArguments(sheetBundle[sheet].data[data][element])' + ";")
                console.log(eval(variable))
            }
        }
  

        //loop through numbers (123456...)
        for(let data = 0; data < sheetBundle[sheet].data.length; data++){

            queue[data] = []

            //loop through letters (ABCDFG...)
            for(let element = 0; element < sheetBundle[sheet].data[data].length; element++) {

                const variable = alphabet[element] + (data + 1)
                //create a variable with corresponding A1 notation and solve it immediatelly if possible.
                eval('var ' + variable + '= ' + 'scrapeTheArguments(sheetBundle[sheet].data[data][element])' + ";")
                
                console.log(variable)
                //push the value of solved/unsolved variable unto a queue
                queue[data].push(eval(variable))
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


   

    // end of app logic



    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////



    //below are the functions used in the app logic:



    //the API call that gets us the sheets
    async function fetchSheets() {
        
        const apiCall = await fetch('https://www.wix.com/_serverless/hiring-task-spreadsheet-evaluator/sheets')
        
        let processedData = await apiCall.json()

        
        returnUrl = processedData.submissionUrl
        let information  = processedData.sheets

        return information
    }

    //scrapes the arguments, solves them if it can, skips solving functions
    function scrapeTheArguments(argument:string) {

        try{
    
            let processedArgument = argument
    
            
    
                if(argument.includes('=')){
                    if(argument.includes("MULTIPLY") || argument.includes("SUM") || argument.includes("DIVIDE") || argument.includes("GT") || argument.includes("EQ") || argument.includes("NOT") || argument.includes("AND") || argument.includes("OR") || argument.includes("IF") || argument.includes("CONCAT")) {
                        return processedArgument // changed from argument to processedArgument
                    } else {

                        processedArgument = argument.replace('=', '')
    
                        processedArgument = eval(processedArgument)

                    }
                } 

            
        return processedArgument

        }

        catch {
            return argument 
        }
    }
    

    //itterates the processing function over the queue elements
    function handleProcessing(queue:Array<Array<string>>) {

        for(let queueCount = 0; queueCount < queue.length; queueCount++) {

            queue[queueCount] = queue[queueCount].map(element => {
                    return processTheArguments(element)
            })
        }

        return queue

    }   

    //processes all the arguments if it can
    function processTheArguments(argument:string) {

        try{
    
            let processedArgument = argument
    
       
            if(typeof argument == 'string') {
    
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
    function returnArguments(sheetBundle:{data:Array<Array<string | number>>}, queue:Array<Array<string>>) {


       
        for( let data = 0; data < queue.length; data++ ) {

            for( let element = 0; element < queue[data].length; element++) {
                sheetBundle.data[data][element] = queue[data][element]
            }
        }
    }

    let submission  = {
        "email": "justas.lapinas.98@gmail.com",
        "results": sheetBundle
    }
    return {submission, returnUrl}
}


    //the POST request that sends the processed data to the API and logs the response
    async function returnProcessedInfoToTheApi() {

        const {submission, returnUrl} = await spreadsheetProcessor()

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

    returnProcessedInfoToTheApi();

    // //checks if argument is not number
    // function isNotNumber(value) {
    //     return 'number' !== typeof value || isNaN(value)
    // }
    
    // //checks if arguments is not string
    // function isNotString(value){
    //     return'string' !== typeof value
    // }
    
    // //checks if argument is not boolean
    // function isNotBoolean(value){
    //     return 'boolean' !== typeof value;
    // } 
    
    //checks if all arguments are numbers, then multiplies them
    function MULTIPLY(...args:number[]) {
        try {
            return args.reduce(function (acc, cur) {
                return acc * cur
            })
        }
        catch {
            return '#ERROR: type does not match'
        }
    }
    
    
    //checks if all arguments are numbers, then adds them together
    function SUM(...args:number[]) {
        try {
            return args.reduce(function (acc, cur) {
                return acc + cur
            })
        }
        catch {
            return '#ERROR: type does not match'
        }
        
    }
    
    //checks if all arguments are numbers, then divides them
    function DIVIDE(...args:number[]) {
        try {
            return args.reduce(function (acc, cur) {
                return acc / cur
            })
        }
        catch {
            return '#ERROR: type does not match'
        }
    }
    
    //checks if all arguments are numbers, then checks if first argument is greater than the other them
    function GT(a:number,b:number) {
        try {
            return (a > b ? true : false)
        }
        catch {
            return '#ERROR: type does not match'
        }
    }
    
    //checks if all arguments are of the same type, then equates their value them
    function EQ(a:number,b:number) {
        try {
            return (a === b ? true : false)
        }
        catch {
            return '#ERROR: type does not match'
        }
    }
    
    //checks if argument is a boolean, then reverses it
    function NOT(a:boolean) {
        try {
            return !a
        }
        catch {
            return '#ERROR: type does not match'
        }
    }
    
    //checks if all arguments are booleans, then runs the AND operator on them
    function AND(...args:boolean[]) {
        try {
           return  args.reduce(function (acc, cur) {
                return acc && cur
            })
        }
        catch {
            return '#ERROR: type does not match'
        }
    }
    
    //checks if all arguments are booleans, then runs the OR operator on them
    function OR(...args:boolean[]) {
        try {
            return  args.reduce(function (acc, cur) {
                 return acc || cur
             })
         }
         catch {
             return '#ERROR: type does not match'
         }
    }
    
    //IF statement. Returns error if condition is not a truthy or a falsy
    function IF(condition:boolean, arg1:any, arg2:any) {
    
        try {
            return (condition ? arg1 : arg2)
         }
         catch {
             return '#ERROR: type does not match'
         }
        
    }
    
    //checks if all arguments are strings, then concacts them
    function CONCAT(...args:string[]) {
        try {
            return args.reduce(function (acc, cur) {
                return acc.concat(cur)
            })
         }
         catch {
             return '#ERROR: type does not match'
         }
        
    }

    function LT(a:number,b:number) {
        try {
            return (a < b ? true : false)
        }
        catch {
            return '#ERROR: type does not match'
        }
    }


    // module.exports = {spreadsheetProcessor, LT, CONCAT, IF, OR, AND, NOT, EQ, GT, DIVIDE, SUM, MULTIPLY, isNotBoolean, isNotString, isNotNumber}