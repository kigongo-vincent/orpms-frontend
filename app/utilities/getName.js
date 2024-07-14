export const getName=(email, one_name)=>{
const fullName = email?.split("@")[0]
const firstName = fullName?.split(".")[0]
const lastName = fullName?.split(".")[1]
return one_name ? `${firstName}`:`${firstName} ${lastName}`
}