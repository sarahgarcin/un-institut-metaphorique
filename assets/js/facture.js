var txTVA = 10;
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
  }

  // _.forEach(base.data, function(data){
  //   // console.log(data);
  //    //invoice.client = _.find(base.clients, { 'id': invoice.client });
  // })

  // var newConfig = {};

  // _.forEach(base.config, function(config){ newConfig[config.key] = config.value })
  // base.config = newConfig;

  // console.log(base);

  init(base);
}

function init(base){

  // var clients =  _.map(base.clients,function(client){
  //   client.operations = _.filter(base.invoices, { 'client': client.id });
  //   return client
  // })

  // console.log(base.data);

  // displayList(base);

  // $( "#invoices-button" ).click(displayList);

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
    $('.readText .content').html('<div class="content-head"><h2>'+workshop+'</h2><h3>'+name+'</h3></div><h3>'+moment+'</h3><p>'+text+'</p>');
    $(".wkshop .active").removeClass('active');
    $(this).parent().addClass('active');
  });
}

function splitArray(arrayIn, arrayOut, key, sort){
  arrayIn.reduce(function(arr, el) {
    if (el[key] === sort) {
      arrayOut.push(el);
    }
  }, []);
}

function displayList(base){
  var sorted = _(base.data).sortBy(function(inv){
    return inv.date.split("/").reverse().join('-');
  }).value().reverse();
  console.log('display', base.data);
   $("#render").html(uim.data({data:sorted}));
   document.title = '';
   $( ".invoiceButton" ).click(function() {
      console.log($(this).attr('id'));
      var line = _.find(base.data, { 'id_string': $(this).attr('id') });
      $("#render").html(uim.data({data:line}));

      // document.title = invoice.id_string
      //   +'_'+ invoice.date.replaceAll("/","-")
      //   +'_'+ invoice.title.replaceAll(" ","_")
      //   +'_'+ invoice.client.instituion.replaceAll(" ","_")
   });

}
Handlebars.registerHelper('nlbr', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});

