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
    input.value = '';
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
  label.classList.add('display-3');
  label.classList.add('mb-4');
  label.classList.add('text-center');
  divForm.parentNode.prepend(label);

  form = document.createElement('form');
  json.fields.forEach((item, i) => {
    form.append(createField(item.input, item?.label));
  });

  if(json.references!==undefined)
  form.append(createRefs(json?.references));

  if(json.buttons!==undefined)
  form.append(createButtons(json?.buttons));

  divForm.replaceWith(form);
  addMasks();
}

function createButtons(buttons){
  div = document.createElement('div');
  div.classList.add("d-flex");
  div.classList.add("justify-content-between");
  div.classList.add("form-group");

  for (var button of buttons) {
    let butElem = document.createElement("button");
    butElem.classList.add("btn");
    butElem.classList.add("btn-primary");

    butElem.textContent = button.text;
    div.append(butElem);
  }
  return div;
}

function createRefs(references){
  let input = references.find(item => item["input"]!==undefined);
  let label = references.find(item => item["text"]!==undefined);

  if(input!==undefined){
    return createField(input.input, createRef(label));
  }
  else if(label!==undefined){
    div = document.createElement("div");
    div.classList.add("form-group");
    for (var ref of references) {
      console.log(ref);
      div.innerHTML += createRef(ref);
    }
    return div;
  }
}

function createRef(label){
  let labelElem = document.createElement('a');
  labelElem.textContent = label?.text.toString();
  labelElem.href = label?.ref;
  if (label["text without ref"]===undefined){
    return labelElem.outerHTML.toString()+" ";
  }
  else {
    return label["text without ref"]?.toString()+ " " + labelElem.outerHTML.toString();
  }
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
      labelElem.innerHTML = label;
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

  addClassesInFields(elem, inputElem, labelElem);

  return elem;
}

function addMasks(){
  let count = $("input[data-mask]").length;
  for(let i = 0;i < count;i++)
  {
    $(`input[data-mask]:eq(${i})`).mask($(`input[data-mask]:eq(${i})`).attr("data-mask"));
  }
}

function addClassesInFields(div, input, label){
  div.classList.add("form-group");
  if(input.type === "checkbox"){
    div.classList.add("form-check");
    input.classList.add("form-check-input");
    label?.classList.add("form-check-label");
  }
  else{
    input.classList.add("form-control");
    label?.classList.add("h5");
  }
}

function removeForm(){
  let doc = document.getElementById('mainDiv');
  doc.innerHTML = "";
  doc.append(loadForm);
  document.getElementById("footer").classList.add("invisible");
}
