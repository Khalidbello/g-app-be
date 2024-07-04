const calcTotalPrice = (fromDb: any, fromUser: any): number => {
    const length = fromUser.length;
    let total = 0;

    for (let i = 0; i < length; i++) {
        total += fromDb[i].price * fromUser[i].units;
    };

    return total;
};


export default calcTotalPrice;