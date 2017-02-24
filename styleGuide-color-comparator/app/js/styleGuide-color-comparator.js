
function setAsBackground(){
    var colorToSet = document.getElementById("colorToBackground").value;
    if(colorToSet.length != 7){
        alert("The typed color is not valid (ex : #97d66d)");
        retun;
    }
    document.getElementById('b-container').style.backgroundColor = colorToSet;
} 

function hideAll(evt){
    var parent = evt.target.parentNode;
    parent.style.height = "20px";
    parent.style.margin = "0px";
        
}

function revertHideAll(evt){
    var parent = evt.target.parentNode;
    parent.style.height = "100px";
    
    parent.style.margin = "15px";
}

var sgColors = [
                {'colorRef':'@background','colorCode':'#F3F3F3'},
                {'colorRef':'@brand-color','colorCode':'#00965E'},
                {'colorRef':'@dark-text','colorCode':'#2D2926'},
                {'colorRef':'@grey','colorCode':'#5F5F5F'},
                {'colorRef':'@accent2','colorCode':'#24B3C7'},
                {'colorRef':'@accent3','colorCode':'#62AC31'},
                {'colorRef':'@accent4','colorCode':'#61C56E'},
                {'colorRef':'@disabled','colorCode':'#C8C8C8'}
               ];

var hide = '<span class="glyphicon glyphicon-menu-up show-hide"  onClick="hideAll(event)"  ></span>'
var show = '<span class="glyphicon glyphicon-menu-down show-hide" onClick="revertHideAll(event)" ></span>'
var showHide = hide + show;

function loadStyleGuide(){



for(var i=0 ; i < sgColors.length ; i++)
{
    var colorRef = sgColors[i].colorRef; 
    var colorCode = sgColors[i].colorCode; 
    var entry = '<li> <span class="glyphicon glyphicon-fire" ></span> <a href="#">@background</a> </li>';
   
    var colorCollumnB = '<div class="collor-collumn">'+
                            '<div class="col-lg-12" style="background-color:' + colorCode + '">'+
                                colorRef +
                            '</div>';                         
    // add lighten colors
    var lightenRows = "" ;
    for (var j = 0 ;j <= 100 ; j += 1)
    {//+' lighten( ' + colorRef + ' , ' + j + '% )
        lightenRows += '<div class="col-lg-12 color-row lighten-' + colorRef.substr(1,colorRef.length)+'-'+ j + '" > '+ showHide  +'</div>';
    }
    //add darken colors
    var darkenenRows = "" ;
    for (var j = 0 ;j <= 100 ; j += 1)
    {// darken( ' + colorRef + ' , ' + j + '% ) 
        darkenenRows += '<div class="col-lg-12 color-row darken-' + colorRef.substr(1,colorRef.length)+'-'+ j + '" >'+ showHide +'</div>';
    }

                            
    //close div
    var colorCollumnE = '</div>';
    var content = colorCollumnB + lightenRows + darkenenRows + colorCollumnE ;
    document.getElementById('b-container').innerHTML += content ; 


    //hide white and black results
    $('*').filter(function() {
    if (this.currentStyle) 
              return this.currentStyle['background-color'] === '#000000';
    }).addClass('hidden-element');



}

};