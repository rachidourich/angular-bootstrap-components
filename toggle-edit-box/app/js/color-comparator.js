//define less functions
var lessLighten = less.functions.functionRegistry.get('lighten');
var lessDarken = less.functions.functionRegistry.get('darken');
var lessTint = less.functions.functionRegistry.get('tint');
var lessSpin = less.functions.functionRegistry.get('spin');
var lessShade = less.functions.functionRegistry.get('shade');
var lessGreyscale = less.functions.functionRegistry.get('greyscale');
var lessContrast = less.functions.functionRegistry.get('contrast');
var Color = less.tree.Color; 

var lighten_fn = "lighten";
var darken_fn = "darken";
var tint_fn = "tint";
var spin_fn = "spin";
var shade_fn = "shade";
var greyscale_fn = "greyscale";
var contrast_fn = "contrast";

var lessComputed;  


//prepare the select down list when document is ready
$( document ).ready(function() {

    var sgC = [
                {'name':'@dark-text','hex':'#2D2926'},
                {'name':'@grey','hex':'#5F5F5F'},
                {'name':'@disabled','hex':'#C8C8C8'},
                {'name':'@background','hex':'#F3F3F3'},
              
                {'name':'@accent6','hex':'#62AC31'},
                {'name':'@brand-color','hex':'#00965E'},
                {'name':'@accent3','hex':'#62AC31'},
                {'name':'@accent4','hex':'#61C56E'},
                {'name':'@accent5','hex':'#bbdcc4'},
                
                {'name':'@accent2','hex':'#24B3C7'},
                
                {'name':'@delete','hex':'#E61D00'},
                {'name':'@disabledOff','hex':'#FE8778'},
                   
               ];



    for(var i=0 ; i < sgC.length ; i++)
    {
        var name = sgC[i].name; 
        var hex = sgC[i].hex;
        var fGlyphicon = '<span class="glyphicon glyphicon-fire" style="color:' + hex + '"></span>';
        var line = '<li class = "sg-dropdown-entry" >' 
                    + fGlyphicon + 
                   '<a onclick ="computeLessValues(\'' + hex + '\' , \'' + name + '\')" style="background-color:' + hex + '" >' + name + '</a>' +
                   '</li>';
        //document.getElementById("").innerHtml += ;
        
        $("#sg-dropDown-colors").append(line);
        $("#sg-dropdown-label").prepend(fGlyphicon);
        
    }
    $(".dropdown-toggle").dropdown();
});








function computeLessValues(hexColor, name){
   //set it as background
   $('#sg-dropdown-label').css('background-color',hexColor);
   $("#color-to-search").css('background-color','colorToSearch'); 
   $("#hex-src").html(hexColor); 
   $("#less-src-var").html(name);

   lessComputed = new Object();

   for(var i=0 ;i < 100 ; i++)
   {
      var col = new Color(hexColor.substr(1,7));

      var lightened = lessLighten( col , {value:i} );
      lessComputed[ lighten_fn + '(' + name + ',' + i + '%)' ] = lightened.toRGB();
      
      var darkned = lessDarken( col , {value:i} );
      lessComputed[ darken_fn + '(' + name + ',' + i + '%)' ] = darkned.toRGB();

      var spinned = lessSpin( col , {value:i} );
      lessComputed[ spin_fn + '(' + name + ',' + i + '%)' ] = spinned.toRGB();

      var tinted = lessTint( col , {value:i} );
      lessComputed[ tint_fn + '(' + name + ',' + i + '%)' ] = tinted.toRGB();

      var shaded = lessShade( col , {value:i} );
      lessComputed[ shade_fn + '(' + name + ',' + i + '%)' ] = shaded.toRGB();

      var greyscaled = lessGreyscale( col , {value:i} );
      lessComputed[ greyscale_fn + '(' + name + ',' + i + '%)' ] = greyscaled.toRGB();
       
   }
  
  if($("#color-to-search").val().length != 0){
      searchInStyleGuide();
  }

}

function pickColor(hex){
    $("#color-to-search").val(hex);
    searchInStyleGuide()
}

function searchInStyleGuide(){
   var colorToSearch = $("#color-to-search").val().trim();
   $("#color-to-search").css('background-color',colorToSearch);
   $("#dist-icon").css("color",colorToSearch); 
   $("#hex-dist").html(colorToSearch); 
   
   //find the best match
   var firstBestMatch = -1;
   var secondBestMatch = -1;

   var firstBestMatchIndex = -1;
   var secondBestMatchIndex = -1;

   var spaceCol = $.colorspaces.make_color('hex', colorToSearch).as('CIELAB');
   var cTarg = {L: spaceCol[0], A: spaceCol[1], B: spaceCol[2]};
     
   //look for the nearest color 
   var sortedResults = [];
   $.each(lessComputed, function(index, hexCand) {
      var spaceCT = $.colorspaces.make_color('hex', hexCand).as('CIELAB');
      var cCand = {L: spaceCT[0], A: spaceCT[1], B: spaceCT[2]};     
      
      var score = 100 - DeltaE.getDeltaE00(cTarg, cCand);
      sortedResults.push({lessFn : index, hexColor : hexCand, score : score})
    
   });
   sortedResults.sort(function(a, b) {
        return a.score - b.score;
   });
   
   //clear fields
   $('#degraded-score-results').html("");
   $('#matching-score-results').html("");

   $.each(sortedResults, function(index, hexCaobj) {  
         var gradienbar = "<div class='grd-color animated zoomIn' style='background-color:" + hexCaobj.hexColor + "' ></div>";
         $('#degraded-score-results').append(gradienbar); 
   });

   var first = sortedResults[sortedResults.length - 1 ];
   var second = sortedResults[sortedResults.length - 2 ];

   if(first.score < 90){
       
       var noFunction = '<br>No function found';
       $('#matching-score-results').append(noFunction);
    

   }else{
       
        var secondRes = '<div class="col-lg-4  score-result" style="background-color:' + second.hexColor + '" >'+
                            '<span class="col-lg-12"> score:' + Math.floor(second.score*100)+ '‰</span>'+
                            '<span class="col-lg-12">hex : ' + second.hexColor + '</span>'+
                            '<span class="col-lg-12">function:' + second.lessFn + '</span>'+
                        '</div>'
        $('#matching-score-results').html('<br>' + secondRes);
    
        var firstRes = '<div class="col-lg-4  score-result" style="background-color:' + first.hexColor + '" >'+
                            '<span class="col-lg-12"> score:' + Math.floor(first.score*100) + '‰</span>'+
                            '<span class="col-lg-12">hex : ' + first.hexColor + '</span>'+
                            '<span class="col-lg-12">function:' + first.lessFn + '</span>'+
                        '</div>'
        $('#matching-score-results').append(firstRes);
   }
}/**#5fba7d */