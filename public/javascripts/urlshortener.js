function validateForm(url){
  let pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  let res = pattern.test(url);
  console.log(res);

  return res;
}

document.getElementById('userUrl').addEventListener('keyup',(element) => {
  if(validateForm(element.target.value)){
    document.getElementById('btnSubmit').disabled = false;
  }
})
