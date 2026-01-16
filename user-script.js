// ==UserScript==
// @name         Google Meet Leader Election
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  When multiple Tabs/Windows join the same Meet, one is elected as Audio I/O Source, all others are muted. To be used together with https://github.com/seibert-media/googlemeet-presentation-css
// @author       Peter Körner <pkoerner@seibert-media.net>
// @match        https://meet.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
  const broadcastInterval = 500;
  const purgeTimeout = broadcastInterval * 1.5;

  // Logging
  function log(s) {
    const args = arguments;
    args[0] = 'LeaderElection: ' + s;
    console.log.apply(console, args);
  }

  // State
  const contexts = {}

  // Events
  const channelName = location.host + location.pathname;
  const contextId = Math.random().toString(36).substr(2);
  log('channelName', channelName);
  log('contextId', contextId);

  const channel = new BroadcastChannel(channelName)
  channel.addEventListener('message', (e) => onMessage(e.data))
  window.addEventListener('DOMContentLoaded', () => transmitExistence());
  window.setInterval(() => {
    transmitExistence();
    purgeOldContexts();
    updateLeaderState();
  }, 500);

  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    e.returnValue = 'Don\'t leave me this way...';
  });

  function transmitExistence() {
    if(!isOperable()) {
      return;
    }

    contexts[contextId] = {
      title: document.title,
      lastSeen: Date.now(),
    }

    channel.postMessage({
      id: contextId,
      title: document.title,
    })
  }

  function onMessage(message) {
    if(!(message.id in contexts)) {
      log('onMessage : adding', message.id)
    }
    contexts[message.id] = {
      title: message.title,
      lastSeen: Date.now(),
    }
  }

  function purgeOldContexts() {
    const now = Date.now();
    Object.keys(contexts).forEach(key => {
      if(now - contexts[key].lastSeen > 750) {
        console.log('purgeOldContexts : removing', key, contexts[key]);
        delete contexts[key];
      }
    });
  }

  function updateLeaderState() {
    if(Object.keys(contexts).length < 2) {
      console.debug('updateLeaderState : only one context - not modifying state');
      return;
    }

    const leaderId = findLeaderId();
    const isLeader = (leaderId === contextId);
    console.debug('updateLeaderState : isLeader=%s leaderId=%s contextId=%s', isLeader, leaderId, contextId);

    if(window.location.host == 'meet.google.com') {
      if(isLeader) { unmute() }
      else { mute() }
    }
    else {
      document.body.style.backgroundColor = isLeader ? 'green' : 'grey';
    }
  }

  function findLeaderId() {
    const entries = Object.entries(contexts);
    console.debug('findLeaderId : titles', entries.map(e => e[1].title));
    entries.sort(contextLeaderComparisonFunction);
    console.debug('findLeaderId : sorted', entries.map(e => e[1].title));
    console.debug('findLeaderId : selected', entries[0][0], entries[0][1].title);
    return entries[0][0]; // key of first reesult
  }

  function contextLeaderComparisonFunction(a, b) {
    const contextA = a[1];
    const contextB = b[1];
    const precedenceA = findTitlePrefixPrecedence(contextA.title);
    const precedenceB = findTitlePrefixPrecedence(contextB.title);
    if(precedenceA < precedenceB) { return -1; }
    if(precedenceA > precedenceB) { return +1; }

    if(contextA.title < contextB.title) { return -1; }
    if(contextA.title > contextB.title) { return +1; }

    const contextIdA = a[0];
    const contextIdB = b[0];
    if(contextIdA < contextIdB) { return -1; }
    if(contextIdA > contextIdB) { return +1; }

    return 0;
  }

  function findTitlePrefixPrecedence(title) {
    const titlePrefixOrder = ['Speaker', 'Moderator', 'Slides']
    for (let i = 0; i < titlePrefixOrder.length; i++) {
      const prefix = titlePrefixOrder[i];
      if(title.indexOf(prefix) != -1) {
        return parseInt(i);
      }
    }

    return titlePrefixOrder.length;
  }

  // Meet Functions
  function unmute() {
    setMutedState(false);
  }

  function mute() {
    setMutedState(true);
  }

  function isOperable() {
    if(window.location.host == 'meet.google.com') {
      const cameraButton = document.querySelector('.AAU0Jf');
      return cameraButton != null;
    }
    else {
      return true;
    }
  }

  function setMutedState(targetState) {
    const audioTag = document.querySelector('audio');
    if(audioTag) audioTag.muted = targetState;

    const cameraButton = document.querySelector('.AAU0Jf');
    if(cameraButton && isMuted(cameraButton) !== targetState) {
      cameraButton.dispatchEvent(new MouseEvent('click', {bubbles: true}))
    }

    const microphoneButton = document.querySelector('.qIiG8c');
    if(microphoneButton && isMuted(microphoneButton) !== targetState) {
      microphoneButton.dispatchEvent(new MouseEvent('click', {bubbles: true}))
    }
  }

  function isMuted(button) {
    return JSON.parse(button.dataset.isMuted);
  }
})();
