var bandsList = document.getElementById("bands");
var artistsList = document.getElementById("artists");
var data;
var xhr = new XMLHttpRequest();

xhr.open("GET", "rockbands.json");
xhr.send();

xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200){
        data = JSON.parse(xhr.responseText);

        var html = '<option value="">-- Select a band --</option>';
        for(var band in data){
            var displayName = band;
            html += "<option value='" + band + "'>" + displayName + "</option>";
        }
        bandsList.innerHTML = html;
    } 
    else{
        bandsList.innerHTML = '<option value="">Error loading bands</option>';
    }
};

bandsList.addEventListener("change", function(){
    var selectedBand = bandsList.value;

    if(!selectedBand){
        artistsList.innerHTML = '<option value="">-- Select a band first --</option>';
        artistsList.disabled = true;
        return;
    }

    var artists = data[selectedBand];
    var html = '<option value="">-- Select an artist --</option>';
    for(var i = 0; i < artists.length; i++){
        html += "<option value='" + artists[i].value + "'>" + artists[i].name + "</option>";
    }
    artistsList.innerHTML = html;
    artistsList.disabled = false;
});

artistsList.addEventListener("change", function(){
    var selectedArtist = artistsList.value;
    if(selectedArtist){
        window.open(selectedArtist, "_blank");
    }
});

