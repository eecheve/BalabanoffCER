import news from '../json/news_log.json' with { type: 'json' };

var blogpost = document.getElementsByClassName("blogpost")[0];
var wrapper = blogpost.getElementsByClassName("content_wrap")[1]; //second content wrap of the page
var last_month; //placeholder to for month header logic

function add_blog_entry(header, date, description){
  var b_entry = document.createElement('div');
  b_entry.className = "blog_entry";

  var b_header = document.createElement('h3');
  b_header.innerHTML = header;
  b_entry.appendChild(b_header);

  var b_description = document.createElement('p');
  b_description.innerHTML = date + "</br> " + description;
  b_entry.appendChild(b_description);

  return b_entry;
}

function populate_news_by_year(year_string){
  for(var i=0; i<news.length; i++){
    if(news[i].year == year_string){
      var month = document.createElement('div');
      month.className = "month";
      month.id = news[i].month;
  
      switch(wrapper.children.length){
        case 0: //logic for the first entry of the first month
          var month_header = document.createElement('h2'); // creating the header for first month
          month_header.innerHTML = news[i].month; // populating the first month header
          month.appendChild(month_header); // appending the header to the first month
          var entry = add_blog_entry(news[i].title, news[i].date, news[i].description);
          month.appendChild(entry); //appending the first entry to the first month
          wrapper.appendChild(month); // adding the first div of class 'month'
          break;
        default: //logic for the rest of the entries
          last_month = wrapper.children[wrapper.children.length -1]; //getting the last month
          if(last_month.id == news[i].month){ //last month is the same as current month
            var entry = add_blog_entry(news[i].title, news[i].date, news[i].description);
            last_month.appendChild(entry);
          }
          else{
            var month_header = document.createElement('h2'); // creating the header for first month
            month_header.innerHTML = news[i].month; // populating the first month header
            month.appendChild(month_header); // appending the header to the first month
            var entry = add_blog_entry(news[i].title, news[i].date, news[i].description);
            month.appendChild(entry); //appending the first entry to the first month
            wrapper.appendChild(month); // adding the first div of class 'month
          }
      }
    }
  }
}

populate_news_by_year(wrapper.id);