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
                {'name':'@background','hex':'#F3F3F3'},
                {'name':'@brand-color','hex':'#00965E'},
                {'name':'@dark-text','hex':'#2D2926'},
                {'name':'@grey','hex':'#5F5F5F'},
                {'name':'@accent2','hex':'#24B3C7'},
                {'name':'@accent3','hex':'#62AC31'},
                {'name':'@accent4','hex':'#61C56E'},
                {'name':'@disabled','hex':'#C8C8C8'}
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
   $("#src-icon").css("color",hexColor); 
   $("#hex-src").html(hexColor); 
   $("#less-src-var").html(name);

   lessComputed = new Object();

   for(var i=0 ;i < 100 ; i++)
   {
      var col = new Color(hexColor.substr(1,7));

      var lightened = lessLighten( col , {value:i} );
      lessComputed[ lighten_fn + '_' + i ] = lightened.toRGB();
      
      var darkned = lessDarken( col , {value:i} );
      lessComputed[ darken_fn + '_' + i ] = darkned.toRGB();

      var spinned = lessSpin( col , {value:i} );
      lessComputed[ spin_fn + '_' + i ] = spinned.toRGB();

      var tinted = lessTint( col , {value:i} );
      lessComputed[ tint_fn + '_' + i ] = tinted.toRGB();

      var shaded = lessShade( col , {value:i} );
      lessComputed[ shade_fn + '_' + i ] = shaded.toRGB();

      var greyscaled = lessGreyscale( col , {value:i} );
      lessComputed[ greyscale_fn + '_' + i ] = greyscaled.toRGB();
       
   }
  

}

function searchInStyleGuide(){
   var colorToSearch = $("#color-to-search").val().trim();
   $("#dist-icon").css("color",colorToSearch); 
   $("#hex-dist").html(colorToSearch); 
   
   //find the best match
   var bestMatch = 999999; ;
   var bestMatchIndex = -1;
   var spaceCol = $.colorspaces.make_color('hex', colorToSearch).as('CIELAB');
   var cTarg = {L: spaceCol[0], A: spaceCol[1], B: spaceCol[2]};
     
   //look for the nearest color 
   
   $.each(lessComputed, function(index, hexCand) {
      var spaceCT = $.colorspaces.make_color('hex', hexCand).as('CIELAB');
      var cCand = {L: spaceCT[0], A: spaceCT[1], B: spaceCT[2]};     
      
      var delta = DeltaE.getDeltaE00(cTarg, cCand);
      console.log(delta);
      if(delta < bestMatch){
          bestMatchIndex = index;
          bestMatch = delta ;
      }
       
     
      
   });
   console.log(bestMatch+' -----------> ' + bestMatchIndex+' --> '+lessComputed[bestMatchIndex]);
   $("#toColor").css('background-color',lessComputed[bestMatchIndex]);
    $("#toColor").html('<h1>matching score : '+Math.floor(bestMatch)+' <br>-function : '+bestMatchIndex+'   <br>-color : '+lessComputed[bestMatchIndex]+'</h1>')

}

