var json;
var form;
var loadForm;

function getFile(input){
  loadForm = document.getElementById("loadForm");
  let file = input.files[0];

  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function(){
    let data = reader.result;
    json = JSON.parse(data);
    createForm();
    document.getElementById("footer").classList.remove("invisible");
    };

    reader.onerror = function(){
      console.log(reader.error);
  };
}

function createForm(){
  let divForm = loadForm;

  let label = document.createElement('h1');
  label.textContent = json.name.toString();
  label.classList.add('display-2');
  label.classList.add('mb-4');
  label.classList.add('text-center');
  divForm.parentNode.prepend(label);

  form = document.createElement('form');
  json.fields.forEach((item, i) => {
    form.append(createField(item.input, item?.label));
  });
  divForm.replaceWith(form);
  addMasks();

}

function createField(input, label){
  let elem = document.createElement('div');
  let labelElem;

  let inputElem;
  input.type==="textarea" ? inputElem = document.createElement('textarea') :inputElem = document.createElement('input');

  //ParseLabel
  if(label !== undefined)
  {
      labelElem = document.createElement('label');
      labelElem.textContent = label;
  }
  //ParseInput
  //type
  //"number" to "text" for correct masks
  input.type.toString()==="number" ? inputElem.type = "text" : inputElem.type = input.type.toString();

  //parse technologies
  if(input.type.toString()==="technology"){
    labelElem.classList.add("h5");
    elem.append(labelElem);
    input.type = "checkbox";
    input.technologies.forEach((item, i) => {
      elem.append(createField(input, item));
    });
    return elem;
  }

  //parse colors
  let colorList;

  if(input.type.toString()==="color"){
    input.type = "color";
    colorList = document.createElement('datalist');
    colorList.setAttribute("id", "colors");
    input.colors.forEach((item, i) => {
      let optionElem = document.createElement('option');
      optionElem.setAttribute("value", item);
      colorList.append(optionElem);
    });
    inputElem.setAttribute("list", "colors");
  }

  //filetype
  if(input.type.toString()==="file" && input?.filetype!==undefined){
    input.filetype.forEach((item, i) => {
      i=0 ? inputElem.accept += `.${item}`: inputElem.accept+=`, .${item}`;
    });
  }

  //isRequired
  if (Boolean(input?.required)!==undefined) inputElem.required = true;

  //isMultiple
  if (Boolean(input?.multiple)!==undefined) inputElem.multiple = true;

  //mask
  if (Boolean(input?.mask!==undefined))
  inputElem.setAttribute("data-mask", input.mask);

  //colors
  // if(label.toString().contains("#"))
  //   inputElem.setAttribute("style", `background-color: ${label};`);
  //placeholder
  if (Boolean(input?.placeholder!==undefined))
  inputElem.placeholder = input.placeholder;


  //for checkbox input first
  if (label!==undefined) elem.append(labelElem);
  input.type==="checkbox" ? elem.prepend(inputElem) : elem.append(inputElem);

  //set colorlist for "color"
  if(input.type.toString() === "color"){
    elem.append(colorList);
  }

  addClasses(elem, inputElem, labelElem);

  return elem;
}

function addClasses(div, input, label){
  if(input.type === "checkbox"){
    div.classList.add("form-check");
    input.classList.add("form-check-input");
    label?.classList.add("form-check-label");
  }
  else{
    div.classList.add("form-group");
    input.classList.add("form-control");
    label?.classList.add("h5");
  }
}

function addMasks(){
  let count = $("input[data-mask]").length;
  for(let i = 0;i < count;i++)
  {
    $(`input[data-mask]:eq(${i})`).mask($(`input[data-mask]:eq(${i})`).attr("data-mask"));
  }
}

function createButton(){

}

function removeForm(){
  let doc = document.getElementById("mainDiv");
  doc.childNodes.forEach((item, i) => {
    item.remove();
  });
  doc.append(loadForm);
  document.getElementById("footer").classList.remove("invisible");
  console.log(doc);
}
