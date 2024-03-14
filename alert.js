window.onerror = function(messsage, url, line, colno, error) {
  alert("1:" + messsage + "/" + url + "/" + line+ "/" + colno+ "/" + error);
  return true
}

window.addEventListener("unhandledrejection", function (event) {
  alert("2:" + event.reason);
  event.preventDefault();
});

