const sheetBundle = [
    {"id":"sheet-1","data":[[2,4,8,16]]}
    ]
        
        //initialise alphabet
        var alphabet = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase().split('');
    
        //iterate through the sheets
        for(let sheet = 0;sheet < sheetBundle.length; sheet++) {
    
            //loop through numbers (123456...)
            for(let data = 0; data < sheetBundle[sheet].data.length; data++){
    
                //loop through letters (ABCDFG...)
                for(let element = 0; element < sheetBundle[sheet].data[data].length; element++) {
      
                    //create a variable with corresponding A1 notation and solve it immediatelly if possible.
                    eval('var ' + alphabet[element] + (data + 1) + '= ' + 'scrapeTheArguments(sheetBundle[sheet].data[data][element])' + ";")
      
                    console.log(alphabet[element] + (data + 1) + " = " + eval(alphabet[element] + (data + 1)))
                }
            }
        }

    function scrapeTheArguments(argument) {
    
            try{
        
                let processedArgument = argument
        
                if(typeof argument == 'string') {
        
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