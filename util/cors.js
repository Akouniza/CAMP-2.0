import { XMLHttpRequest } from 'xmlhttprequest';

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/';

/**
 * Do a CORS request to corsAnywhere and get receive the response
 * @param {function} printResult
 */
export default function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, corsAnywhere + options.url);
  x.onload = x.onerror = function () {
    printResult(
      options.method + ' ' + options.url + '\n'
      + x.status + ' ' + x.statusText + '\n\n'
      + (x.responseText || ''),
    );
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  }
  x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  x.send(options.data);
}
