(function ($, window, document) {
  'use strict';
var sparola =  {
	level: 1,
	text : 'parolone',
	startTime: 8,
	timer : 0,
	total: 8,
	attempts: 0,
	maxLevel: 3,
	shufflePercentage: 0.33,
	init: function(){
		this.startTime = 8;
		this.randomWord();
		this.stampa(this.shuffle(), 'text');
		this.startTimer(this.startTime, this.startTime, $('#progressBar'));
		$('#level').text("Livello " + this.level);
		if(this.attempts == 0 && this.level == 1){
			this.verify();
		}
	},
	shuffle : function() {
		// var from = this.getRandomIndex(1, this.text.length - 2);
		// var to = this.getRandomIndex(1, this.text.length - 2);
		if(Math.random() > this.shufflePercentage){
			var from = this.getRandomIndex(1, this.text.length - 3);
			var to = from + 1;
			var arr = this.text.split('');
			var temp = arr[from];
			arr[from] = arr[to];
			arr[to] = temp;
			return arr.join("");
		}
		else return this.text;
	},
	getRandomIndex : function(min, max) {
		// var min = 1;
		// var max = this.text.length - 2;
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	stampa: function (testo, classe, classeColore) {

		$('.'+classe).text(testo).removeClass('right wrong').addClass(classeColore);
	},
	verify: function() {
		var self = this;
		$('body').on('keydown', function(e){
			var key = e.which;
		    if (key == 37){
		        $(".response.yes").click();
		        e.preventDefault();
		    }
		    else if (key == 39){
		    	$(".response.no").click();
		    	e.preventDefault();
		    }
		});
		
		$('.response.yes').on("click", function() {
			var text = $('.text').text();
			var test = text == self.text;
			if(test){
				self.rightAnswer();
			}
			else {

				self.wrongAnswer();
			}
		});
		$('.response.no').on("click", function() {
			var text = $('.text').text();
			var test = text == self.text;
			if(test){
				self.wrongAnswer();
			}
			else {
				self.rightAnswer();
			}
		});
	},
	startTimer: function(timeleft, timetotal, $element) {
		var self = this;
	    var progressBarWidth = timeleft * $element.width() / timetotal;

	    var timeText = timeleft + 1;

	    $element.find('div').animate({ width: progressBarWidth }, timeleft == timetotal ? 0 : 1000, 'linear', function(){
	    		self.startTimer(timeleft - 1, timetotal, $element);
	    })
	    .html(timeText + "s");
	     if(timeleft < 0) {
	    	self.stampa('Game over', 'result', 'wrong');
	    	$element.find('div').html('').css('padding', '0');
	    	clearTimeout(self.timer);
	    }
	},
	randomWord: function(){
		if (this.level == 1) {
			var words = ['gatto', 'dente', 'tempo', 'salto', 'pausa'];
		}
		else if (this.level == 2) {
			var words = ['vedere', 'veloce', 'pulizia', 'pratico', 'medico'];
		}
		else {
			var words = ['innaffiatoio', 'asciugamano', 'categoria', 'praticamente', 'psicologo'];
		}
		
		this.text = words[this.getRandomIndex(0, words.length - 1)];
	},
	reset: function(){
		this.startTime = this.startTime - 1;
		var time = this.startTime;
		this.startTimer(time, time, $('#progressBar'));
		this.randomWord();
		this.stampa(this.shuffle(), 'text');
	},
	stopTimer: function() {
		//clearTimeout(this.timer);
		$('#progressBar').find('div').clearQueue().stop(true, false);
	},
	rightAnswer : function() {
		this.stopTimer();
		this.updateAttempts(this.attempts + 1);
		this.stampa("Corretto", 'result', 'right');
		if(this.startTime == 1) {
			alert("Congratulazioni, hai vinto!");
			if(this.maxLevel != this.level){
				this.level = this.level +1;
				this.attempts = 0;
				var divs = $('#start, #progressBar, .choice, .result');
				divs.toggleClass('hide');
				// $('#progressBar').toggleClass('hide');
				this.loadStartButton();
				// this.init();
			}
			else {
				this.winScreen();
			}
		}
		else { 
			this.reset();
		}
	},
	wrongAnswer: function() {
		this.updateAttempts(this.attempts);
		this.stampa("Hai perso", 'result', 'wrong');
		this.stopTimer();
		$('.response').unbind('click');
	},
	updateAttempts: function(tries) {
		this.attempts = tries;
		$('.attempts').text(this.attempts + "/" + this.total);
	},
	debug: function(text) {
		var temp = $('#debug').html();
		$('#debug').html(temp + "   " + text);
	},
	winScreen: function() {
		$('.winner').removeClass('hide');
		$('#video').get(0).play();
	},
	loadStartButton() {
		console.log('chiamato?');
		$('#start').one("click", function(e) {
			$('#start, #progressBar, .choice, .result').toggleClass('hide');
			// $('#progressBar').toggleClass('hide');
			sparola.init();
		});
	}
}

// $(document).ready(function(){
// 	var text = $('#level').text("Livello " + sparola.level);
// });


sparola.loadStartButton();


})(jQuery);