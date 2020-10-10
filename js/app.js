function getFile(input){
  let file = input.files[0];

  let reader = new FileReader();
  reader.readAsText(file);

  reader.onload = function(){
    let data = reader.result;
    let value = JSON.parse(data);
    console.log(data.name);
    };

    reader.onerror = function(){
      console.log(reader.error);
  };
}
