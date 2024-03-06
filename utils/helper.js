function checkIfUserOnline(onlineUserMap,username){
    return !(onlineUserMap[username] === undefined);
}

module.exports ={
    checkIfUserOnline
}