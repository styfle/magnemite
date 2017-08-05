# Magnemite

![img](img/magnemite.gif)

Magnemite is a screen recorder for websites, built with [Electron](https://electron.atom.io).

Magnemite is useful for getting [🐞 repro steps](https://blogs.msdn.microsoft.com/scottos/2008/08/22/the-value-of-repro-steps-and-why-you-should-care/) from an end user in the form of a video recording 📹.

Did your end user report a bug in your web app? Whether you are a Support team, a Development team, or anyone who deals with "bugs", you can benefit from Magnemite! Simply tell the end user to install Magnemite and use it as they normally use your web app. They can click a button if they run into a bug and now you have a video of their issue!

## How does it work?

1. The end user reports a problem with a web app, but they are unsure how to reproduce the problem
2. The support team sends the end user a link to install Magnemite
3. The end user installs and runs Magnemite, which appears to just be a normal web app with an additional button
4. The end user continues using the web app as usual and runs into a bug, oh no!
5. The end user clicks the "Report Bug" button (secretly, Magnemite was recording the user's screen the whole time 📹)
6. The video is compressed and sent back to the support team with all the steps necessary to reproduce the bug 🐞
7. Everyone wins! 🙌

## Why do I have to install Magnemite?

- The screen recording APIs are not really wide-spread (see IE) to all browsers
- The video files need to be saved to disk each time the user navigates to a new page
- Sometimes its nice to prove the bug reproduces in Chrome.....Magnemite is built on Electron which is built on Chrome

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

See [Issues](https://github.com/styfle/magnemite/issues) for work that is still in progress.

## What's with the name?

Magnemite is named after the pokemon. You can see more code/projects named after pokemon at [repokemon](https://cheeaun.github.io/repokemon/).

## Contributing

Want to help? Start by cloning this repo, and then install, build, and run!

```sh
git clone https://github.com/styfle/magnemite.git
npm install
npm run build
npm start
```

## Notes

For more info on working with streams, buffers, byte arrays, and files, see the following:

* [Convert a Buffer to ArrayBuffer](http://stackoverflow.com/a/12101012/266535)
* [Saving huge files](http://stackoverflow.com/a/36523834/266535)
* [Saving desktopCapturer to video file](http://stackoverflow.com/q/36753288/266535)
