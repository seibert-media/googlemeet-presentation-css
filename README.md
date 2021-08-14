Google-Meet for Remote Presentations
====================================
Since the first Covid-Wave in early 2020 we used Google Meet as Video-Transport for our remote events together with OBS Studio.
Seamless presentations with multiples speakers and slide-decks, live link-ups with quickly changing speakers – even a large-ish multi-day event with 7 sepearate stages and hundereds of hours of video have been produced with this setup – in over the year we've refined it quite well.

This document will guide you throgh the principle of operation and link to the relevant resources.

We are aware that there are other and even more dedicated solutions (including Skype and Microsoft Teams with NDI Output, OBS-Ninja and various others), but for a lot of reasons Google Meet turned out to be the best working and Ecosystem-Fitting solution, but that might be different for you.


TL;DR
-----
 - [Stylus Extension for Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
 - [Mute Tab Extension for Chrome](https://chrome.google.com/webstore/detail/mute-tab/blljobffcekcbopmkgfhpcjmbfnelkfg)
 - [uBlock Origin Extension for Chrome](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=de)
 - [User-CSS for Clean Feed](user-style.css)
 - [URL Patterns to block with uBlock](ublock-url-patterns.txt)
 - [Bookmarklets](https://mazdermind.de/googlemeet-presentation-css/bookmarklets.html)


Principle of Operation
----------------------
The setup we used is based on the idea that we can join the same Google Meet Video-Call multiple times with different browser windows. This way we can have each speaker and each slide share in a different window. We can then use the Window-Capture-Feature of OBS to capture each window individually and have each of them as a separate source.

After preparing our Google Chrome with the plugins and configuration below, we open up as many windows as we expect to need, join the same Meet with all of them, set their window titles to something meaningful using the bookmarklets below, mute all of them but one using the *Mute Tab* Plugin. We then configure our OBS Scenes to show all the combinations of speaker, slides and moderator we need (here is [our configuration from T4AT 2020](T4AT_Live.json)).

When the first guests arrive, we pin them and their slides in their respective windows and start mixing with OBS. We can prepare the next guests in separate windows and quickly switch to a prepared scene in OBS, when they are ready.

You can get a better understanding of the Operation from this quick YouTube Presentation I gave (with an older version of the Meet-CSS):

[![YouTube Presentation](https://img.youtube.com/vi/uoKLjwIZgiw/0.jpg)](https://www.youtube.com/watch?v=uoKLjwIZgiw)


User-CSS
--------
Ideally we want to use the speaker's webcam like a remote camera, giving us a pure video-feed of their camera. We also want them to be able to share their screen at the same time. Also multiple speakers must be able to join the call and see the others presenting. They should also be able to share their screens while the other presentation is still running, to allow a seamless hand-over. Speakers joining, leaving, sharing or chatting should not result in any visible or audible signal in our Clean-Feed. Lastly we want to be able to switch from clean feed to the normal UI to change which guest is pinned to which window.

We achieve this by applying the stylesheet [User-CSS](User-CSS) to Google Meet using the [Stylus Extension for Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne). The User-CSS, once activated, hides all the UI Elements and sets the pinned Video to fullscreen with no borders or edges. To activate it, we use a bookmarklet which sets a CSS class on the body tag (enabling the User-CSS) and sends the browser into fullscreen mode. It also automatically detects when you leave fullscreen mode again and removes the CSS class, thus deactivating the User-CSS and allowing interaction with the UI again. There is also a minimal variant which only toggles the CSS Class and does not mess with the fullscreen state:

[Bookmarklets](https://mazdermind.de/googlemeet-presentation-css/bookmarklets.html)


Video Resolution
----------------
We produce all our Videos at a 1920x1080 ("FullHD") resolution. To get a full 1920x1080 feed from the browser window we set at least one of our screens to 1920x1080 resolution and put all the Chrome windows there into fullscreen. On Gnome/Linux we can have multiple Windows in Fullscreen over each other and can still switch between them using Alt-Tab or the window menu. We recommend to have at least one additional screen to run OBS on, so they do not interfere with each other.


Audio
-----
To get the audio sorted we use the [Mute Tab Extension for Chrome](https://chrome.google.com/webstore/detail/mute-tab/blljobffcekcbopmkgfhpcjmbfnelkfg), which allows us to mute all tabs but one. We then use the Audio *Output Capture Source* in OBS to get a feed of the pre-mixed and normalized audio produced by Google Meet. To get rid of the audible indicators Meet plays, when a user joins, leaves or leaves a chat message, we use the [uBlock Origin Extension for Chrome](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=de) with some custom [URL Patterns to block with uBlock](ublock-url-patterns.txt). They will prevent Google Meet from downloading (and thus playing back) any sounds.


OBS Capture & Window Titles
---------------------------
In OBS we select the windows to capture based on their title. Google Meet gives every window the same title, so we have to change them ahead of time to something meaningful using [Bookmarklets](https://mazdermind.de/googlemeet-presentation-css/bookmarklets.html). The window titles are also important to be able to quickly switch to the windws and unpin or repin speakers during a live link-up.


Local Video Feed (Partially Remote Setup)
-----------------------------------------
**Warning** Our hybrid setup is quite a bit more involved. Do not hesitate, you don't need any of this when you run fully remote.

While the setup described above does work perfectly fine for fully remote events, we usually do not run fully remote for the bigger and more professional events, but have a very small crew on-set with the moderators to at least give the feeling of being kind-of sort-of there in person. We use our broadcast or DLSR-Cameras and professional wireless microphones together with an [Elgato Camlink 4k](https://www.elgato.com/de/cam-link-4k) HDMI-to-USB3 Stick to feed the camera- and audio-Input of Google Meet. This gives the speakers a good video and audio signal of the moderators on Stage. On Linux this required a [Trick to fix Elgato Camlink4k colorspace](https://github.com/xkahn/camlink).

In such a hybrid scenario we we usually also feed the SDI signals from all our Cameras into one of our [DeckLink Duo2](https://www.blackmagicdesign.com/de/products/decklink/techspecs/W-DLK-31) cards and use them in OBS as local camera sources. We can also recommend to use one of the Duo2's Ports as output and send the program signal to a TV for the moderators to see what is actually currently being broadcasts. In this scenario we use a monitoring speaker instead of headphones for audio monitoring.

[![Picture of the T4AT Setup](https://pbs.twimg.com/media/EoY831_WMAA_2un?format=jpg)](https://twitter.com/mazdermind/status/1334821274498052098)


Computer / OS / General Setup Recommendations
---------------------------------------------
We mostly used *(L)Ubuntu Linux* and do not know if all the tricks (audio output capture, stacking fullscreen windows, …) will work on other OSes. We recommend *Google Chrome* over Chromium or even Firefox for best performance with Google Meet.
You want a fairly beefy *PC (or Workstation-Like Notebook)*. A *dedicated GPU* is recommended altough we successfully used the embedded GPU in our i7 8700k CPUs (but failed to use the embedded GPU in earlier i7 Generations). Any halfway modern GPU will do, even 2 or 3 year old models are *much* better then the embeddded GPU.

Also
- Use cabled network over Wifi for Streaming.
- Use cabled headphones.
- Do not unplug them (it *will* screw up PulseAudio based audio output capture).
- Use at least 2 Screens of at least 1920x1080 resolution.
- Use a separate Notebook for your research and communication needs, so you don't need to touch your Mixing-PC.
- Listen you your own stream there for End-to-End-Monitoring.
- Have a "We'll start in a couple of minutes" loop or image and some elevator music prepared, in case speakers are late (…they will be.)
- Invite your speakers to preparation meets and check their audio-, video-, lighing- and network setting *before the Event*.
- *to be continued…*
