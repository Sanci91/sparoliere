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
		// if(this.attempts == 0 && this.level == 1){
			this.verify();
		// }
	},
	shuffle : function() {
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
		this.stopActions();
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
			var words = ['gatto', 'dente', 'tempo', 'salto', 'pausa', 'gente', 'salto',
			 'conto', 'pista', 'pasto', 'posta', 'mente', 'lungo', 'vinte', 'tante', 'verde', 'mondo'];
		}
		else if (this.level == 2) {
			var words = ['vedere', 'veloce', 'pulizia', 'pratico', 'medico', 'anatra', 'pecora', 'felice', 'sentire', 'giallo',
			'cavolo', 'napoli', 'sedile'];
		}
		else {
			var words = ['innaffiatoio', 'asciugamano', 'categoria', 'praticamente', 'psicologo', 'paracadute',
			'pomodoro', 'piffero', 'termometro', 'poliziotto', 'fotografia'];
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
		this.updateTableRow(true);
		this.stampa("Corretto", 'result', 'right');
		if(this.startTime == 1) {
			this.stampa('Hai vinto il livello' + this.level, 'level', 'right');
			if(this.maxLevel != this.level){
				this.level = this.level +1;
				this.attempts = 0;
				var divs = $('#start, #game');
				divs.toggleClass('hide');
				this.loadStartButton();
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
		this.updateTableRow(false);
		this.stampa("Hai perso", 'result', 'wrong');
		this.stopTimer();
	},
	updateAttempts: function(tries) {
		this.attempts = tries;
		$('.attempts').text(this.attempts + "/" + this.total);
		$('#storico tbody').append('<tr><td>'+ this.text +'</td><td>' + $('.text').text() + '</td></tr>');
	},
	debug: function(text) {
		var temp = $('#debug').html();
		$('#debug').html(temp + "   " + text);
	},
	winScreen: function() {
		this.stopActions();
		var divs = $('#start, #game');
		divs.toggleClass('hide');
		$('.winner').removeClass('hide');
		// $('#video').get(0).play();
	},
	loadStartButton() {
		this.stopActions();
		var self = this;
		$('#start').one("click", function(e) {
			$('#start, #game').toggleClass('hide');
			self.init();
		});
	},
	updateTableRow(correct){
		if(correct){
			$('#storico tr:last').addClass('right');
		}
		else {
			$('#storico tr:last').addClass('wrong');
		}
	},
	stopActions() {
		$('.response').unbind('click');
		$('body').unbind('keydown');
	}
}

sparola.loadStartButton();

})(jQuery);