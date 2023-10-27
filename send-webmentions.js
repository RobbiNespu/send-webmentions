const webmention = require('webmention');
const fetch = require('node-fetch');
const xml2js = require('xml2js');

const rssFeedURL = 'https://journal.robbi.my/index.xml';

// Fetch the RSS feed
fetch(rssFeedURL)
  .then((response) => response.text())
  .then((rss) => {
    // Parse the RSS and extract URLs to send webmentions
    const parser = new xml2js.Parser();
    parser.parseString(rss, (err, result) => {
      if (err) {
        console.error('Error parsing RSS feed:', err);
        return;
      }

      // Extract URLs from the RSS feed items
      const urlsToPing = result.rss.channel[0].item.map((item) => {
        return item.link[0];
      });

      // Send webmentions
      webmention.send({ targets: urlsToPing }, (err) => {
        if (err) {
          console.error('Error sending webmentions:', err);
        } else {
          console.log('Webmentions sent successfully.');
        }
      });
    });
  });
