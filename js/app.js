var json;
var form;

function getFile(input){
  let file = input.files[0];

  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function(){
    let data = reader.result;
    json = JSON.parse(data);
    createForm();
    // console.log(value);
    };

    reader.onerror = function(){
      console.log(reader.error);
  };
}

function createForm(){
  let divForm = document.body.firstElementChild.firstElementChild;

  let label = document.createElement('h1');
  label.textContent = json.name.toString();
  label.classList.add('display-2');
  divForm.parentNode.prepend(label);

  form = document.createElement('form');
  json.fields.forEach((item, i) => {
    form.append(createField(item));
  });
  divForm.replaceWith(form);
  let count = $("input[data-mask]").length;
  for(let i = 0;i < count;i++)
  {
    $(`input[data-mask]:eq(${i})`).mask($(`input[data-mask]:eq(${i})`).attr("data-mask"));
  }
}

function createField(field){
  //ParseLabel
  let labelElem;
  if(field?.label !== undefined)
  {
      labelElem = document.createElement('label');
      labelElem.textContent = field.label;
  }
  let inputElem = document.createElement('input');

  if(field.input.type.toString()==="number"){
    inputElem.type = "text";

  }
  else {
      inputElem.type = field.input.type.toString();
  }
  inputElem.classList.add('form-control');

  //isRequired
  Boolean(field.input?.required) ? inputElem.required = true : inputElem.disabled = true;

  //mask
  if (Boolean(field.input?.mask!==undefined))
  inputElem.setAttribute("data-mask", field.input.mask);

  //ParseInput
  let elem = document.createElement('div');
  elem.classList.add("form-group");

  if (field?.label) elem.append(labelElem);
  elem.append(inputElem);

  return elem;
}
