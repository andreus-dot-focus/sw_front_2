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
  form.append(createField(json.fields[0]));
  divForm.replaceWith(form);
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
  inputElem.type = field.input.type.toString();
  inputElem.classList.add('form-control');

  //isRequired
  Boolean(field.input?.required.toString()) ? inputElem.required = true : inputElem.disabled = true;

  //ParseInput
  let elem = document.createElement('div');
  elem.classList.add("form-group");

  if (field?.label) elem.append(labelElem);
  elem.append(inputElem);

  return elem;
}
