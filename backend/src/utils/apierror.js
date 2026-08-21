class apiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong",
        errors = [],
        stack = ""

    ){
        super(message)
        this.statusCode = statusCode
        this.data = null // what is in this field
        this.message = message
        this.success = false;
        this.errors = errors

        if(stack){
            this.stack = this.stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {apiError}