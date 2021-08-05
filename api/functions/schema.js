
const jwt_utils = require("./jwt.utils.js");

const {
  verifyEmail,
  verifyPass,
  verifyName,
} = require("./emailPassVerificator.js");

const wilaya = require("./wilaya.js")

module.exports = {
  changeUserInfo:async(obj) => {
   
    
    if(jwt_utils.getUserInfo(obj.token) === -1 || !obj.token ){
      return {error:"disconnect"}
    } 
    if (( obj.username || obj.lastname || obj.firstname) &&  (!verifyName(obj.ame) || !verifyName(obj.lastname) || !verifyName(obj.username) || obj.username.includes(" "))) {

      return {error: "short name"};
    }
    if (obj.username ) {

      const  existe =  await strapi.query("clients").findOne({
        _id: {
          $ne:  jwt_utils.getUserInfo(obj.token).userId,
        },
        username: obj.username,
      });
      if (existe) {
        return {error: "user exist"};
      }
    } 
    if ( obj.phone && ((`${obj.phone}`).length < 9 || (`${obj.phone}`).length > 13)) {
      return {error: "error phone"};
    }
    if(obj.birth_day && ( +(obj.birth_day).split("-")[0] < (new Date().getFullYear()-100) || +(obj.birth_day).split("-")[0] > (new Date().getFullYear() -15) )){
      return {error: "error age"};
    }
    if (obj.sexe && obj.sexe != "none" && !(["homme","femme"]).includes(obj.sexe) ) {
      return {error: "error sexe"};
    }
    if (obj.wilaya && !wilaya.includes(obj.wilaya) ) {
      return {error: "error wilaya"};
    }
    if (obj.instagram &&( !(obj.instagram).includes("http") || !(obj.instagram).includes("www.") )) {
      return {error: "error instagram"};
    }
    
    if (obj.Twitter &&( !(obj.Twitter).includes("http") || !(obj.Twitter).includes("www.") )) {
      return {error: "error Twitter"};
    }
    
    if (obj.facebook &&( !(obj.facebook).includes("http") || !(obj.facebook).includes("www.") )) {
      return {error: "error facebook"};
    }
    return {success:jwt_utils.getUserInfo(obj.token) }

  }

}
