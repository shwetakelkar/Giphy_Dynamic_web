$(document).ready(function(){

    var btnArray = ["tabla","recorder","flute","viola","harp","bongo drum","sitar","guitar","woodwinds","bass guitar","banjo","piano","drum","violin","rubab","garmon","keyboard","clarinet","xylophone","trumpet","tuba","saxophone","cello"];

    const limit = 10;//variable to define limit

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
    and push the value of new instrument in btnArray so it won't
    get duplicated in future.
    as well as some checkes for
    1. at the time of adding new button if any button is in active
       state then replace with "" 
    2. empty input value check and respective msg
    3. duplication checkpoint with respective msg 
    at last clearing the input text field
    --------------------------------------------------------------*/
    $("#submit-btn").on("click",function(e){
        
        e.preventDefault();
        $(".alert").remove();
        var inputTextVal = $("#input-name").val().trim();
        
        if(btnArray.indexOf(inputTextVal) == -1 && inputTextVal)
        {
            var newbtn = $("<button>").attr("class","btn-primary btn focus-cls m-1").text(inputTextVal).appendTo("#btn-row");
            btnArray.push(inputTextVal);
            var current = document.getElementsByClassName("active");
        
            if(current.length>0)
            {
                current[0].className = current[0].className.replace("active", "");
            }
            
        }
        else if(btnArray.indexOf(inputTextVal) !== -1){
            $("<p>").addClass("alert").text("Given input is already exist!!").appendTo(".col-md-3");
        }
        else if(!inputTextVal)
        {
            $("<p>").addClass("alert").text("please enter the value!!").appendTo(".col-md-3");
        }
        $("#input-name").val("");
    });

    /*---------------------------------------------------
    This .on("click") function will trigger the AJAX Call
    before it making the button display as selected
    and currently active  
    ------------------------------------------------------*/
    
    $("#btn-row").on("click",'button',function(e){

        e.preventDefault();
        $("#img-col").empty();
        $(".alert").remove();

        var current = document.getElementsByClassName("active");
        
        if(current.length>0)
        {
            current[0].className = current[0].className.replace("active", "");
        }
        this.className += " active";
        
        
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
        This .on("click") function will trigger state change of selected 
        image 
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


/*----------------------------------------------------------------
This function call will be placed after getting succesful response
It will create new elements to show the images of selection

arguments: response
return : none
----------------------------------------------------------------*/

    function displayImages(response) {
        var imgDiv = $("<div class='row'>").appendTo("#img-col");
        for (var i = 0; i < limit; i++) {
            if (response.data[i].rating === "g" || response.data[i].rating === "pg") {
                var imgToDisplay = $("<img>");
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
});
