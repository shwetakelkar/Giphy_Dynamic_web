$(document).ready(function(){
    var btnArray = ["tabla","recorder","flute","viola","harp","bongo drum","sitar","guitar","woodwinds","bass guitar","banjo","piano","drum","violin","rubab","garmon","keyboard","clarinet","xylophone","trumpet","tuba","saxophone","cello"];
    /*-------------------------------------------------------------
     the btnArray will be filled once at the time of page load.
    --------------------------------------------------------------*/
    if($("#btn-row").empty){

        for(var i=0;i<btnArray.length;i++)
        {
            var newbtn = $("<button>").attr("class","btn-primary btn focus-cls m-1").text(btnArray[i]).appendTo("#btn-row");
        }
    }

    
    /*-------------------------------------------------------------
    this part of code execute .on click of submit button.
    and create new button/s with the label of input text.
    and puch the value of new instrument in btnArray so it won't
    get duplicated in future. 
    --------------------------------------------------------------*/
    $(".btn").on("click",function(e){
        
        e.preventDefault();
        var inputTextVal = $("#instru-name").val();
        $("#instru-name").val("");
        
        
        if(btnArray.indexOf(inputTextVal) == -1 && inputTextVal)
        {
            ;
            var newbtn = $("<button>").attr("class","btn-primary btn focus-cls m-1").text(inputTextVal).appendTo("#btn-row");
            btnArray.push(inputTextVal);
            
        }
        else if(btnArray.indexOf(inputTextVal) !== -1){
            $("<p>").text("already exist").appendTo(".col-md-3");
        }
    });

    /*---------------------------------------------------
    This .on("click") function will trigger the AJAX Call
    ------------------------------------------------------*/
    
    $("#btn-row").on("click",'button',function(e){

        
        $("#img-col").empty();
        e.preventDefault();
        
        var instrument = $(this).text();
        
        
        $.ajax({
            url:"https://api.giphy.com/v1/gifs/search?q="+instrument+"&api_key="+"m08zIpacZ3RD136N3O7yY1AV8K9JTQNn&limit="+limit,
            method:'GET'
        })
        .then(function(response){
            
            displayImages(response); 
        
        });

    });
    /*----------------------------------------------------------------
        This .on("click") function will trigger state change of images 
        eg; still -> animate , animate ->still
    ----------------------------------------------------------------*/
    $("#img-col").on("click","img", function(){
                
                
        var dataState =$(this).attr("data-state");
        if(dataState =="still"){
            
            $(this).attr("src",$(this).attr("data-animate"));

            dataState =$(this).attr("data-state","animate");

        }
        else if(dataState =="animate"){
            $(this).attr("src",$(this).attr("data-still"));

            dataState =$(this).attr("data-state","still");

        }
    })
});
/*----------------------------------------------------------------
This function call will be placed after getting succesful response
It will create new elements to show the images of selection

arguments: response
return : none
----------------------------------------------------------------*/
const limit = 10;
function displayImages(response) {
    var imgDiv = $("<div class='row'>").appendTo("#img-col");
    for (var i = 0; i < limit; i++) {
        if (response.data[i].rating === "g" || response.data[i].rating === "pg") {
            var imgToDisplay = $("<img width=200px>");
            var imgCol = $("<div class='col-lg-3 col-md-4 mr-1 mt-2'>").appendTo(imgDiv);
            $("<p class= 'mb-3'>").text("Rating : " + response.data[i].rating).appendTo(imgCol);
            imgToDisplay.attr({
            "data-state": "still", "class": "gif", "src": response.data[i].images.fixed_height_small_still.url,
                "data-animate": response.data[i].images.fixed_height_small.url,
                "data-still": response.data[i].images.fixed_height_small_still.url
            });
            imgToDisplay.appendTo(imgCol);
        }
    }
}
