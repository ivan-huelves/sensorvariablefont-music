window.onload = function () {
	// create audio context
	const audioCtx = new AudioContext();
	let data = new Uint8Array(2);

	// Audio's file url
	const audio_url = 'Funk_Down_Sting.mp3';

	// create analyser 
	const analyserNode = new AnalyserNode(audioCtx, {
		fftSize: 256,
		maxDecibels: -10,
		minDecibels: -90,
		smoothingTimeConstant: 0.8,
	});

	//Map function Javascript
	const scale = (num, in_min, in_max, out_min, out_max) => {
		return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	}

	// asign on the HTML the representation through the font
	let fontRepresentation = this.document.querySelector("#fontRepresentation");

	// analyse music data. In this case the frecuency. More info: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
	function getAnalyserData() {
		requestAnimationFrame(getAnalyserData);
		analyserNode.getByteFrequencyData(data);
		console.log(data);
		//With the frecuency we recieve two data, in this case I only use the frist one in the array
		normalize(data[0]);
	}

	// Function to normalize the frecuency (data[0]) extracted before to the axis font value
	function normalize(frecuency) {
		// (registered value from audio file, minSensorValue, maxSensorValue, minAxisFontvalue, maxAxisFontvalue)
		let normalizedValueLev = scale(frecuency, 0, 255, 300, 1000);
		fontRepresentation.style.setProperty('--weightH1', normalizedValueLev);
		console.log(normalizedValueLev);
	}

	//load audio
	var loadAudio = function () {
		var request = new XMLHttpRequest();

		request.open('GET', audio_url, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
			audioCtx.decodeAudioData(request.response, function (buffer) {
				audio_buffer = buffer;
				playAudio();
			});
		};
		request.send();
	};

	//play audio
	var playAudio = function () {
		var source = audioCtx.createBufferSource();
		source.buffer = audio_buffer;
		source.connect(audioCtx.destination);
		source.start(0);

		//to analyse the audio
		source.connect(analyserNode);
	};

	//play audio on click on text Play!
	let play = this.document.querySelector('#play');
	play.addEventListener("click", event => {
		loadAudio();
		getAnalyserData();
	})
}