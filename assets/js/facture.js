var base = {};
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var onCsv = function (csvs){
  var papaConf = {
    header: true,
    skipEmptyLines: false,
    delimiter: ",",
    dynamicTyping: true,
  };

  base = {
    data:Papa.parse(csvs[0], papaConf).data,
    itw:Papa.parse(csvs[1], papaConf).data
  }

  init(base);
}

function init(base){
  var sorted = _.orderBy(base.data, ['type'],['desc']);
  sorted = _.orderBy(sorted, ['wksp'],['asc']);
  console.log(sorted);
  var institut = [];
  var dehors = [];
  // split array by dehors et institut
  splitArray(sorted, institut, 'type', 'institut');
  splitArray(sorted, dehors, 'type', 'dehors');

  // split array by workshop
  var bidartOne = [];
  var aubervilliers = [];
  var jerusalem = [];
  var bidartTwo = [];
  splitArray(institut, bidartOne, 'wksp', '01-bidart');
  splitArray(institut, aubervilliers, 'wksp', '02-Aubervilliers');
  splitArray(institut, jerusalem, 'wksp', '03-Jerusalem');
  splitArray(institut, bidartTwo, 'wksp', '04-Bidart');

  console.log(institut, dehors);
  console.log(bidartOne, aubervilliers, jerusalem, bidartTwo);
  $("#render").html(uim.data({bidartOne:bidartOne, aubervilliers:aubervilliers, jerusalem:jerusalem, bidartTwo:bidartTwo, dehors:dehors}));
  $(".content").html(uim.itw({interviews:base.itw}));
  console.log(base.itw);
  $(".readText").resizable({
    handles: {
        'n': '#handle'
    }
  });

  $(".row > div > p").each(function(){
    if($(this).html() == ""){
      $(this).parent('div').addClass('vide');
    }
    else{
      $(this).parent('div').addClass('rempli');
    }
  });


  $(".wkshop p").on('click', function(){
    var text = $(this).html();
    var name = $(this).attr('data-name');
    var workshop = $(this).parents('.wkshop').find('h2').html();
    var moment = $(this).parents('.row').find('.moment').html();
    var interviewFull = $('.interview').html();
    $(".wkshop .active").removeClass('active');
    $(this).parent().addClass('active');
    $('.interview').removeHighlight();
    var searchTerm = text;
    
    if ( searchTerm ) {
      $('.interview').highlight( searchTerm );
    }


    // $('.readText .content').html('<div class="content-head"><h2>'+workshop+'</h2><h3>'+name+'</h3></div><h3>'+moment+'</h3><p>'+text+'</p>');
  });
}

function splitArray(arrayIn, arrayOut, key, sort){
  arrayIn.reduce(function(arr, el) {
    if (el[key] === sort) {
      arrayOut.push(el);
    }
  }, []);
}

Handlebars.registerHelper('nlbr', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

jQuery.fn.highlight = function(pat) {
 function innerHighlight(node, pat) {
  
  var skip = 0;
  if (node.nodeType == 3) {
   var pos = node.data.toUpperCase().indexOf(pat);
   if (pos >= 0) {
    var spannode = document.createElement('span');
    spannode.className = 'highlight';
    var middlebit = node.splitText(pos);
    var endbit = middlebit.splitText(pat.length);
    var middleclone = middlebit.cloneNode(true);
    spannode.appendChild(middleclone);
    middlebit.parentNode.replaceChild(spannode, middlebit);
    skip = 1;
   }
  }
  else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
   for (var i = 0; i < node.childNodes.length; ++i) {
    i += innerHighlight(node.childNodes[i], pat);
   }
  }
  return skip;
 }
 return this.each(function() {
  innerHighlight(this, pat.toUpperCase());
  var calcul = $(window).height() * (70/100);
  if($(".highlight").length){
    $('.readText').animate({
          scrollTop: $(".highlight").offset().top - calcul
      }, 1000);
  }
  else{
    $('.readText').animate({
          scrollTop: 0
      }, 1000);
  }
 });
};

jQuery.fn.removeHighlight = function() {
 function newNormalize(node) {
    for (var i = 0, children = node.childNodes, nodeCount = children.length; i < nodeCount; i++) {
        var child = children[i];
        if (child.nodeType == 1) {
            newNormalize(child);
            continue;
        }
        if (child.nodeType != 3) { continue; }
        var next = child.nextSibling;
        if (next == null || next.nodeType != 3) { continue; }
        var combined_text = child.nodeValue + next.nodeValue;
        new_node = node.ownerDocument.createTextNode(combined_text);
        node.insertBefore(new_node, child);
        node.removeChild(child);
        node.removeChild(next);
        i--;
        nodeCount--;
    }
 }

 return this.find("span.highlight").each(function() {
    var thisParent = this.parentNode;
    thisParent.replaceChild(this.firstChild, this);
    newNormalize(thisParent);
 }).end();
};

