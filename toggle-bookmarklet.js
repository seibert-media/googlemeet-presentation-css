if(document.body.classList.toggle('clean-meet')) {
	document.documentElement.requestFullscreen()
}

document.addEventListener('fullscreenchange', () => {
	if(!document.fullscreen) {
		document.body.classList.remove('clean-meet')
	}
})
