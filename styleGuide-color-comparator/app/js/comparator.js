
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

var mapComputed;  

function changeSourceColor(elt){
   //set it as background
   var settedColor = elt.value.trim();
   $("#source-color-box").css('background-color',settedColor);
   // store lighten function in an array
   
   mapComputed = new Object();

   //var LessFunctions = []

   for(var i=0 ;i < 100 ; i++)
   {
      var col = new Color( settedColor.substr(1,settedColor.length));

      var lightened = lessLighten( col , {value:i} );
      mapComputed[ lighten_fn + '_' + i ] = lightened.toRGB();
      
      var darkned = lessDarken( col , {value:i} );
      mapComputed[ darken_fn + '_' + i ] = darkned.toRGB();

      var spinned = lessSpin( col , {value:i} );
      mapComputed[ spin_fn + '_' + i ] = spinned.toRGB();

      var tinted = lessTint( col , {value:i} );
      mapComputed[ tint_fn + '_' + i ] = tinted.toRGB();

      var shaded = lessShade( col , {value:i} );
      mapComputed[ shade_fn + '_' + i ] = shaded.toRGB();

      var greyscaled = lessGreyscale( col , {value:i} );
      mapComputed[ greyscale_fn + '_' + i ] = greyscaled.toRGB();

     //var contrasted = lessContrast( col , {value:i} );
      //mapComputed[ contrast_fn + '_' + i ] = contrasted.toRGB();
       
   }
  

}

function changeDestinationColor(elt){
   
   $("#destination-color-box").css('background-color',elt.value.trim());
   var bestMatch = 999999; ;
   var bestMatchIndex = -1;
   var spaceCol = $.colorspaces.make_color('hex', elt.value.trim()).as('CIELAB');
   var cTarg = {L: spaceCol[0], A: spaceCol[1], B: spaceCol[2]};
     
   //look for the nearest color 
   
   $.each(mapComputed, function(index, hexCand) {
      var spaceCT = $.colorspaces.make_color('hex', hexCand).as('CIELAB');
      var cCand = {L: spaceCT[0], A: spaceCT[1], B: spaceCT[2]};     
      
      var delta = DeltaE.getDeltaE00(cTarg, cCand);
      console.log(delta);
      if(delta < bestMatch){
          bestMatchIndex = index;
          bestMatch = delta ;
      }
       
     
      
   });
   console.log(bestMatch+' -----------> ' + bestMatchIndex+' --> '+mapComputed[bestMatchIndex]);
   $("#toColor").css('background-color',mapComputed[bestMatchIndex]);
    $("#toColor").html('<h1>matching score : '+Math.floor(bestMatch)+' <br>-function : '+bestMatchIndex+'   <br>-color : '+mapComputed[bestMatchIndex]+'</h1>')

}

function computefn(){
   console.log("computing function");
   mapComputed;

}
/*
var d50 = new less.tree.Dimension(50);

var c1 = new Color("000fff");
var c2 = new Color("ff0000");
console.log(mix(c1, c2, d50).toRGB());*/