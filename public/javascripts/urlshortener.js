function validateForm(url){
  let pattern = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  let res = pattern.test(url);

  return res;
}

console.log("loaded")
document.getElementById('userUrl').addEventListener('keyup',(element) => {
  if(validateForm(element.target.value)){
    document.getElementById('btnSubmit').disabled = false;
  }
});
