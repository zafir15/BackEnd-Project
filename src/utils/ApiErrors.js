class APiError extends Error {
    constructor(
        statusCode ,
         message = "Something Went Wrong",
         errors = [] ,
          statck = ""
    )
    {
        super(message)
        statusCode = this.statusCode , 
        message = this.message,
        this.errors= errors , 
        this.data = null ,
        this.success = false
        if(statck){
            this.stack = statck
        }else{
            Error.captureStackTrace(this , this.constructor)
        }     

    }
}