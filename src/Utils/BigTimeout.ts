//* stolen from Nino
function bigTimeout(predicate: (...args: any[]) => void, ms: number) {
    if (ms > 0x7FFFFFFF) setTimeout(() => bigTimeout(predicate, ms - 0x77FFFFFFF), 0x7FFFFFFF);
    setTimeout(predicate, ms);
};

export default bigTimeout;