
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  document.body.style.backgroundColor = "white";
}

function GetIngredient(theBarcode){
    url = "http://fs.panictriggers.xyz:7070/api/v1/product?product=" + string(theBarcode)
    fetch(url, {mode: 'cors'})
    console.log(String(theBarcode))
    console.log(String(url))
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        console.log(data);
      });
    }
  )
  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });

      }


(() => {
  document.getElementById("cameraInput").hidden = false;
  document.getElementById("product").hidden = true;
  document.getElementById("Automatisch").click();
})();

document.getElementById("Handmatig").addEventListener('change', ev => {
  console.log('Handmatig!');
  document.getElementById("cameraInput").hidden = true;
  document.getElementById("product").hidden = false;
});

document.getElementById("Automatisch").addEventListener('change', ev => {
  console.log('Automatisch!');
  document.getElementById("cameraInput").hidden = false;
  document.getElementById("product").hidden = true;
});