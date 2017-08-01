//TODO: https://github.com/hiddentao/squel/issues/154 ?
function pgArr(array, cast) {
  let arrStr = JSON.stringify(array).replace('[', '{').replace(']', '}');
  if (cast) {
    arrStr = `${arrStr}::${cast}`;
  }
  return arrStr;
}

function lowerCaseArr(arr) {
  return arr.map(str => str.toLowerCase());
}

/**
 * Get a random integer.  Used to pause a random amount of time.
 * @param min
 * @param max
 * @returns {*}
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * Return a promise that will pause for a random amount of time, to simulate work being done.
 */
function pause() {
  return new Promise(resolve =>
    setTimeout(() => resolve(), getRandomInt(1000, 10000))
  );
}

module.exports = { pgArr, lowerCaseArr, getRandomInt, pause };
