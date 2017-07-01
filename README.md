# Magnemite

![img](img/magnemite.gif)

A screen recorder for websites, built with Electron.

Magnemite is useful for getting repro steps from an end user as a video recording. Whether you are a Support team, a Development team, or anyone who deals with "bugs", you can benefit from Magnemite!

Did your end user report a bug in your web app? Simply tell them to install Magnemite and use it as they normally use your web app. They can click a button if they run into a bug and now you have a video of their issue!


## Getting started

Clone this repository

```sh
git clone https://github.com/styfle/magnemite.git
```

Install dependencies

```sh
npm install
```

Edit the `src` attribute in the `<webview src="">` located in the `index.html` file if you wish to change the startup page. Most likely, you will want this to be your web app before distributing to the end user.

Once you are ready, you can start the app with `npm start`.

As the user navigates to different pages, screen capture is recording videos.

The user can click the "Report Bug" button to end recording.

Finally, all videos can be viewed by opening the `playall.html` file with your browser.

## TODO

- How can electron be packaged as a single binary (or installable app)?
- How can the recorded video files be sent back to a server for a support team or development team?

## Contributing

```sh
npm install
npm run build
npm start
```

## Notes

For more info on working with streams, buffers, byte arrays, and files, see the following:

* [Convert a Buffer to ArrayBuffer](http://stackoverflow.com/a/12101012/266535)
* [Saving huge files](http://stackoverflow.com/a/36523834/266535)
* [Saving desktopCapturer to video file](http://stackoverflow.com/q/36753288/266535)
