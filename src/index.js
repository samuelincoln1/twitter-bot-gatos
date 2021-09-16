console.log("Bot iniciado");

var Twit = require('twit');

require("dotenv").config();

var Bot = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});


var cats = require("cats-js");
var fs = require('fs');
var c = new cats();
request = require('request');

console.log('Procurando tweets...');

var stream = Bot.stream('statuses/filter', { track: '@fotodegatinho gato' });


stream.on('tweet', tweet);


function tweet(tweet) {

  var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      if (err) {
        console.log('Deu algum erro no codigo de download da imagem: ' + err);
      }
    });
  };

  c.get().then((cat) => {
    var url = cat.images.image.url;
    download(url, 'gato.jpg', function () {
      console.log('dowload feito com sucesso');
    });
  });

  var text = tweet.text;
  var from = tweet.user.screen_name;

  console.log('@' + from + ' enviou o tweet: ' + text);

  if (tweet.in_reply_to_status_id_str === null || tweet.in_reply_to_user_id_str === '1435730477676118019') {

    var b64content = fs.readFileSync('./gato.jpg', { encoding: 'base64' })

    function tweetIt(id) {

      var media = {
        media_data: b64content,
      }

      Bot.post('media/upload', media, function (error, data, response) {

        var mediaIdStr = data.media_id_string;

        var meta_params = {
          media_id: mediaIdStr
        }

        Bot.post('media/metadata/create', meta_params, function (err, data, response) {
          if (err) {
            console.log('Algo deu errado no metadata: ' + err);
          } else {
            var params = {
              status: '',
              media_ids: [mediaIdStr],
              in_reply_to_status_id: id,
              auto_populate_reply_metadata: true,
            }

            Bot.post('statuses/update', params, function (err, data, response) {
              if (err) {
                console.log('Algo deu errado ao tentar postar o tweet: ' + err);
              }
            });
          }
        });

      });
    }

    function tweetIt(id) {
      var media = {
        media_data: b64content,
      }

      Bot.post('media/upload', media, function (error, data, response) {

        var mediaIdStr = data.media_id_string;

        var meta_params = {
          media_id: mediaIdStr
        }

        Bot.post('media/metadata/create', meta_params, function (err, data, response) {
          if (err) {
            console.log('Algo deu errado: ' + err);
          } else {
            var params = {
              status: '',
              media_ids: [mediaIdStr],
              in_reply_to_status_id: id,
              auto_populate_reply_metadata: true,
            }

            Bot.post('statuses/update', params, function (err, data, response) {
              if (err) {
                console.log('Algo deu errado ao tentar postar o tweet: ' + err);
              }
            });
          }
        });

      });

    }

    tweetIt(tweet.id_str);

  }

}

