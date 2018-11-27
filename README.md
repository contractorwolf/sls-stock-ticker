# sls-stock-ticker
This is the stock ticker we use on one of our dashboard monitors at work.  I created a single page app version of a Serverless endpoint that displays a simple chart of LendingTree's 
stock price for the day.  The page uses a little angular and chartjs for the display and a mongodb and handlebars to get the data properly on the page.  There is NO SERVER for any of the page or display, everything that is used by the single page app comes from public CDN's.  If you change this line in the /lib/stockpriceitems.js file:

var db_conn = 'mongodb://[USERNAME]:[PASSWORD]@[MONGOLABSERVER]:[MONGOLABSERVERPORT]/[DBNAME]';

to a valid mongodb uri (copy format above), the scheduled task will get the stock price for the defined ticker value (TREE in this case) according to the CRON schedule defined in serverless.yml file.  Values are currently collected every 10 minutes and saved in the mongodb defined above.  When the display url is hit([root]/dev/tree) the single page app is returned with the last 150 records from the mongodb and displayed on the chartjs display


my test link (yours will have a different API Gateway root):

https://zzygxcjlva.execute-api.us-east-1.amazonaws.com/dev/tree


NOTE: this will probably look too large for your display on a computer as it is setup to be displayed on a 42 inch display at my office. Make UI adjustments in index.html to refine look and feel.
