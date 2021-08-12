Google-Meet for Remote Presentations
====================================
Since the first Covid-Wave in early 2020 we used Google Meet as Video-Transport for our remote Events together with OBS Studio.
Seamless presentations with multiples speakers and slide-decks, live link-ups with quickly changing speakers – event a large-ish multi-day event with 7 sepearate stages and hundereds of hours ov video have been produced with this setup – in over the year we've refined it quite well.

This document will guide you throgh the principle of operation and link to the relevant resources.

We are aware that there are other and even more dedicated Solutions (including Skype and Microsoft Teams with NDI Output, OBS-Ninja and various others), but for a lot of reasons Google Meet turned out to be the best working and Ecosystem-Fitting solution, but that might be different for you.


TL;DR
-----
 - [Stylus Extension for Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne)
 - [Mute Tab Extension for Chrome](https://chrome.google.com/webstore/detail/mute-tab/blljobffcekcbopmkgfhpcjmbfnelkfg)
 - [uBlock Origin Extension for Chrome](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=de)
 - [user-css.css for Clean Feed](user-css.css)
 - <a href="javascript:(function()%7Bif(document.body.classList.toggle('clean-meet')) %7B document.documentElement.requestFullscreen()%3B %7Ddocument.addEventListener('fullscreenchange'%2C (e) %3D> %7B if(!document.fullscreen) %7B document.body.classList.remove('clean-meet') %7D %7D)%7D)()">Bookmarklet to Toggle Clean Feed Mode</a>
 - [URL Patterns to block with uBlock](ublock-url-patterns.txt)
 - Bookmarklets to set Window-Title:
   - <a href="javascript:(function()%7Bdocument.title%3D'Speaker 1'%7D)()">Speaker 1</a>
   - <a href="javascript:(function()%7Bdocument.title%3D'Speaker 2'%7D)()">Speaker 2</a>
   - <a href="javascript:(function()%7Bdocument.title%3D'Speaker 3'%7D)()">Speaker 3</a>
   - <a href="javascript:(function()%7Bdocument.title%3D'Moderator 1'%7D)()">Moderator 1</a>
   - <a href="javascript:(function()%7Bdocument.title%3D'Moderator 2'%7D)()">Moderator 2</a>
   - <a href="javascript:(function()%7Bdocument.title%3D'Slides 1'%7D)()">Slides 1</a>
   - <a href="javascript:(function()%7Bdocument.title%3D'Slides 2'%7D)()">Slides 2</a>


Principle of Operation
----------------------
The setup we used is based on the Idea that we can join the same Google Meet Video-Call multiple times with different Browser-Windows.This way we can have each Speaker and each Slide-Share in a different window. We can then use the Window-Capture-Feature of OBS to capture each window individually and have each of them as a separate source.

After preparing our Google Chrome with the Plugins and Configuration below, we open up a many Windows as we expect to need, join the same Meet with all of them, set their Window-Titles to something meaningful using the Bookmarklets below, mute all of them but one using the *Mute Tab* Plugin. We then configure our OBS Scenes to show all the combinations if Speaker, Slides and Moderator we need (here is [our configuration from T4AT 2020](T4AT_Live.json)).

When the first guests arriv, we Pin them and their Slides in their respective Windows and start Mixing with OBS. We can prepare the next guests in separate Windows and quickly switch to a prepared scene in OBS, when they are ready.

You can get a better understanding of the Operation from this quick YouTube Presentation I gave (with an oder Version of the Meet-CSS):
[![YouTube Presentation](https://img.youtube.com/vi/uoKLjwIZgiw/0.jpg)](https://www.youtube.com/watch?v=uoKLjwIZgiw)


User-CSS
--------
Ideally we want to use the speaker's webcam like a remote camera, giving us a pure video-feed of their camera. We also want them to be able to share their screen at the same time. Also multiple Speakers must be able to join the call and see the others presenting. They should also be able to share their screens while the other presentation is still running, to allow a seamless hand-over. Speakers joining, leaving, sharing or chatting should not resut in any visible or audible signal in our Clean-Feed. Lastly we want to be able to switch from Clean-Feed to the normal UI to change which guest is visible in which Window.

We achive this by applying a User-Stylesheet [user-css.css](user-css.css) to Google Meet using the [Stylus Extension for Chrome](https://chrome.google.com/webstore/detail/stylus/clngdbkpkpeebahjckkjfobafhncgmne). The User-CSS, once activated, hides all the UI Elements and set the pinned Video to fullscreen with no borders or edges. To activate it, we use a Bookmarket which sets a CSS-Class on the body Tag (enabling the User-CSS) and sends the Browser into Fullscreen-Mode. It also automatically detects when you leave Fullscreen Mode again and removes the Class, thus deactivating the User-CSS and allwing interaction with the UI again.

Bookmarklet: <a href="javascript:(function()%7Bif(document.body.classList.toggle('clean-meet')) %7B document.documentElement.requestFullscreen()%3B %7Ddocument.addEventListener('fullscreenchange'%2C (e) %3D> %7B if(!document.fullscreen) %7B document.body.classList.remove('clean-meet') %7D %7D)%7D)()">Toggle Clean Feed Mode</a>


Video Resolution
----------------
We produce all our Videos at a 1920x1080 ("FullHD") resolution. To get a full 1920x1080 feed from the Browser-Window we set at least one of our screens to 1920x1080 resolution and put all the Chrome Windows there into fullscreen. On Gnome/Linux we can have multiple Windows in Fullscreen over each other and can still switch between them using Alt-Tab or the Window-Menu. We recommend to have at least one additional screen to run OBS on, so they do not interfere with each other.


Audio
-----
To get the Audio sorted we use the[Mute Tab Extension for Chrome](https://chrome.google.com/webstore/detail/mute-tab/blljobffcekcbopmkgfhpcjmbfnelkfg), which allows us to mute all Tabs but one. We then use the Audio *Output Capture Source* in OBS to get a Feed of the pre-mixed and normalized audio produced by Google Meet. To get rid of the audible indicators the Meet plays, when a user joins, leaves or leaves a chat message, we use the [uBlock Origin Extension for Chrome](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=de) with this custom [URL Patterns to block with uBlock](ublock-url-patterns.txt). They will prevent Google Meet from downloading (and thus playing back) any Sounds.


OBS Capture & Window Titles
---------------------------
In OBS we select the Windows to capture based on their title. Google Meet gives every Window the same title, so we'll change them ahead of time to something meaningful using Bookmarklets:
- <a href="javascript:(function()%7Bdocument.title%3D'Speaker 1'%7D)()">Speaker 1</a>
- <a href="javascript:(function()%7Bdocument.title%3D'Speaker 2'%7D)()">Speaker 2</a>
- <a href="javascript:(function()%7Bdocument.title%3D'Speaker 3'%7D)()">Speaker 3</a>
- <a href="javascript:(function()%7Bdocument.title%3D'Moderator 1'%7D)()">Moderator 1</a>
- <a href="javascript:(function()%7Bdocument.title%3D'Moderator 2'%7D)()">Moderator 2</a>
- <a href="javascript:(function()%7Bdocument.title%3D'Slides 1'%7D)()">Slides 1</a>
- <a href="javascript:(function()%7Bdocument.title%3D'Slides 2'%7D)()">Slides 2</a>

The Window-Titles are also important to be able to quickly switch to the Windws and Un-Pin or Re-Pin speakers during a live link-up.


Local Video Feed (Partially Remote Setup)
-----------------------------------------
**Warning** Our Hybrid Setup is quite a bit more involved. Do not hesitate, you don't need any of this when you run fully remote.

While this Setup does work perfectly fine for fully remote events, for the bigger and more professional events we usually do not run fully-remote but have a very small crew on-set with the Moderators to at least give the feeling of being kind-of sort-of there in person. We use our Broadcast or DLSR-Cameras and professional wireless Microphones together with an [Elgato Camlink 4k](https://www.elgato.com/de/cam-link-4k) HDMI-to-USB3 Stick to feed the Camera- and Audio-Input of Google Meet. This gives the Speakers a good Video- and Audio-Signal of the Moderators on Stage. Under Linux this required a [Trick to fix Elgato Camlink4k colorspace](https://github.com/xkahn/camlink).

In such a Hybrid Scenario we we usually also feed the SDI-Signals from all our Cameras into one of our [DeckLink Duo2](https://www.blackmagicdesign.com/de/products/decklink/techspecs/W-DLK-31) Cards and us them in the OBS as Local Camera Sources. We can also recommend to use one of the Duo2's Ports as Output and send the Program-Signal to a TV for the Moderators to see what is actually currently being broadcasts. In this scenario we use a Monitoring Speaker instead of Headphones for Audio Monitoring.

[![Picture of the T4AT Setup](https://pbs.twimg.com/media/EoY831_WMAA_2un?format=jpg)](https://twitter.com/mazdermind/status/1334821274498052098)


Computer / OS / General Setup Recommendations
---------------------------------------------
We mostly used *(L)Ubuntu Linux* and do not know if all the tricks (Audio-Output capture, stacking Fullscreen-Windows, …) will work on other OSes. We recommend *Google Chrome* over Chromium or even Firefox for best performance with Google Meet.
You want a fairly beefy *PC (or Workstation-Like Notebook)*. A *Dedicated GPU* is recommended altough we successfully used the embedded GPU in our i7 8700k CPUs (but failed to use the embedded GPU in earlier i7 Generations). Any halfway modern GPU will do, even 2 or 3 year old models are *much* better then the embeddded GPU.

Also
- Use cabled Network over Wifi for Streaming.
- Use cabled Headphones.
- Do not unplug them (it *will* screw up PulseAudio based Audio-Output-Capture).
- Use at least 2 Screens of at least 1920x1080 resolution.
- Use a separate Notebook for your research and communication needs, so you don't need to touch your Mixing-PC.
- Listen you your own Stream there for End-to-End-Monitoring.
- Have a "We'll start in a couple of minutes" Loop or Image and some elevator Music prepared, in case Speakers are late (…they will be.)
- Invite your Speakers to preparation Meets and check their Audio-, Video-, Lighing- and Network-Setting *before the Event*.
- *to be continued…*
