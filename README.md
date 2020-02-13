# Youtube JSON Server


Your personal Youtube API server to get Youtube API responses without needing credentials. 

Caches for 5 minutes(set as 300 seconds) which can be updated from /now.json in the root directory. 



## Installation

Install Node & [Now CLI](https://zeit.co/download).

Create or get a Google API Key with permissions to access the Youtube Data API https://developers.google.com/youtube/registering_an_application

We'll need to let Zeit know what your Google Key is which can only be done with the Now CLI

In your command line run `now secret add youtube-json-google-key "MY_GOOGLE_KEY"`

Deploy the server
[![Deploy with ZEIT Now](https://zeit.co/button)](https://zeit.co/new/project?template=https://github.com/ThatGuySam/youtube-json-server)
