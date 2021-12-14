const Airtable = require('airtable')

exports.handler = function(event, context, callback) {

    if(JSON.parse(event.body).fields.Name != "test"){
        var base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_KEY);

        base('Main').create([JSON.parse(event.body)]
            , function(err, records) {
                if (err) { 
                    console.log(err);
                    callback(err);
                }
    
                const body = JSON.stringify({ record: records[0] })
                const response = {
                statusCode: 200,
                body: body,
                headers: {
                    'content-type': 'application/json',
                    'cache-control': 'Cache-Control: max-age=60, public'
                }
                }
                callback(null, response)
            });

        }


}
