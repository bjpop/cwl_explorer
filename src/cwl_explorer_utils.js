/* Take a JS object and print it to the developer console for debugging
   purposes.
*/
function dump(object) {
    console.log(JSON.stringify(object, null, 4));
}
