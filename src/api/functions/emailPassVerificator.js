 
const verifyEmail = (email) => {
     
    const re = /\S+@\S+\.\S+/ ;
    return re.test(email);
}
const verifyPhone=(phone)=>{
    
    return !!(`0${phone}`).match(/^\d{10}$/g) ;

}

const verifyPass = (p) => {
 
    if (p.length < 8) {
        // console.log("Your password must be at least 8 characters");
        return false;
    }
    if (p.length > 32) {
       // console.log("Your password must be at max 32 characters");
        return false;
    }
    /*
    if (p.search(/[a-z]/) < 0) {
        errors.push("Your password must contain at least one lower case letter."); 
    }
    if (p.search(/[A-Z]/) < 0) {
    //console.log("Your password must contain at least one upper case letter."); 
    }
    */

    if (p.search(/[0-9]/) < 0) {
        // console.log("Your password must contain at least one digit.");

        return false;
    }
    /*
   if (p.search(/[!@#\$%\^&\*_]/) < 0) {
        // console.log("Your password must contain at least special char from -[ ! @ # $ % ^ & * _ ]"); 
    } 
    */
    return true;

}


const verifyName = (p) => {
 
    if (p.length < 2) {
        // console.log("Your password must be at least 8 characters");
        return false;
    }
    if (p.length > 32) {
       // console.log("Your password must be at max 32 characters");
        return false;
    }
    return true
}

module.exports = { verifyEmail, verifyPass, verifyName,verifyPhone}