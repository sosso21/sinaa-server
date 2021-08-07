const EmailValidator = require('email-deep-validator');
const passwordValidator = require('password-validator');


const verifyEmail =async(email) => {
    console.log('email:', email)
    const emailValidator = new EmailValidator();
    const { wellFormed, validDomain, validMailbox } =  await emailValidator.verify(email);
    // wellFormed: true
    // validDomain: true
    // validMailbox: true
 
    if (wellFormed && validDomain && validMailbox) {
        return true;
    } else {
        return false;
    }
}

const verifyPass = (pass) => {

    // Create a schema
    const schema = new passwordValidator();

    // Add properties to it
    schema
        .is().min(8) // Minimum length 8
        .is().max(100) // Maximum length 100
        // .has().uppercase() // Must have uppercase letters
        .has().lowercase() // Must have lowercase letters
        .has().digits(1) // Must have at least 2 digits
        .has().not().spaces() // Should not have spaces 

    return schema.validate(pass)

}


const verifyName = (name) => {

    // Create a schema
    const schema = new passwordValidator();

    // Add properties to it
    schema
        .is().min(2) // Minimum length 2
        .is().max(30) // Maximum length 30 

    return schema.validate(name)

}

module.exports = { verifyEmail, verifyPass, verifyName }