
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // google streetview API
    var street = $('#street').val();
    var city = $('#city').val();
    var adress = street + ', ' + city;

    $greeting.text('So, you want to live at ' + adress + '?');

    var location = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + adress + '';
    $body.append('<img class="bgimg" src="' + location + '">');

    // NY Times API 
    var apikey = "382f915b9afe6efe45237c6707b8ead4:19:71857967"
    var apiurl = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=" + apikey + "";    
    $.getJSON(apiurl, function(data){
        $nytHeaderElem.text("NY Times articles about " + city);

        var articles = data.response.docs;
        for (var i=0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append("<li class='article'><a href='" + article.web_url + "'>" + article.headline.main + "</a><p>" + article.snippet + "</p></li>");
        };

    }).error(function(){
        $nytHeaderElem.text("Article can't be loaded...");
    });

    // wikipedia API

    var wiki_timeout = setTimeout(function(){
        $wikiElem.text("Failed to get wikipedia links, sorry!");
    },8000);

    var wiki_url = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";

    $.ajax({
        url: wiki_url,
        dataType: "jsonp",
        success: function(response){
            var article_list = response[1];

            for (var i = 0; i < article_list.length; i++ ){
                var article = article_list[i];
                var url = "https://en.wikipedia.org/wiki/" + article;
                $wikiElem.append("<li><a href='" + url + "'>" + article + "</a></li>");
            }
            clearTimeout(wiki_timeout);
        }
    });

    




    return false;
};

$('#form-container').submit(loadData);
