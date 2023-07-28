module.exports.getDate = getDate;

function getDate(){

const today =  new Date();


let options = {
    weekday : "long",
    month : "long",
    day : "numeric",
}

let day = today.toLocaleDateString("en-US" , options);
return day;
}


module.exports.getDay = getDay;

function getDay(){

    const today =  new Date();
    
    
    let options = {
        weekday : "long",
     
    }
    
    let day = today.toLocaleDateString("en-US" , options);
    return day;
    }

//console.log(module.exports);    