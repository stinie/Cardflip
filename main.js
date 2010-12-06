/*
 * 
 * Find more about this app by visiting
 * http://miniapps.co.uk/
 *
 * Copyright (c) 2010 Alex Gibson, http://miniapps.co.uk/
 * Released under MIT license
 * http://miniapps.co.uk/license/
 * 
 * Version 1.4 - Last updated: March 31 2010
 * 
 */

var cardflip = {

	turn: 1, //first or second turn of card
	firstcard: null, //first choice
	secondcard: null, //second choice
	totalturns: 0, //total no of turns
	starttime: null, //game start time
	deck: null, //array of all cards
	moved: false, //checks for touch move
	locked: false, //turns lock
	container : null,
	menu : null,
	
	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
			case 'touchcancel': this.onTouchCancel(e); break;
			case 'mousedown': this.onMouseDown(e); break;
			case 'mousemove': this.onMouseMove(e); break;
			case 'mouseup': this.onMouseUp(e); break;
			case 'webkitTransitionEnd': this.onWebkitTransitionEnd(e); break;
		}
	},

	//return random number
	ran: function() { 
		return (Math.round(Math.random())-0.5); 
	},

	//shuffle deck and start new game
	init: function() {

		this.starttime = new Date();
		this.totalturns = 0;
		var cards = [ '&clubs;', '&clubs;', '&spades;', '&spades;', '&loz;', '&loz;', '&dagger;', '&dagger;', '&diams;', '&diams;', '&hearts;', '&hearts;', '&Dagger;', '&Dagger;', '&infin;', '&infin;'];
	
		//shuffle
		cards.sort(cardflip.ran);

		//deal
		this.deck = [];	
		this.deck = document.querySelectorAll('.card');
	
		for (var i = 0; i < this.deck.length; i++) {
   			this.deck[i].innerHTML = '<div class="front face"><p>?</p></div><div class="back face"><p>' + cards[i] + '</p></div>';
  		}
  		
		//add touch click listeners
		for (var i = 0; i < this.deck.length; i++) {
			this.deck[i].addEventListener('touchstart', this, false);
			this.deck[i].addEventListener('mousedown', this, false);
  		}	
	},

	onTouchStart: function(e) {
	
		e.preventDefault();
	
		var element = e.currentTarget;
		this.moved = false;

		//card not already turned
		if ((element.className !== 'matched') && (element.className !== 'flipped')) {
			//either turn 1 or 2
			if (this.turn < 3) {
				//add highlight color
				element.firstChild.style.background = 'rgb(197,0,0)';
				//add event listeners
				element.addEventListener('touchmove', this, false);
				element.addEventListener('touchend', this, false);
				element.addEventListener('touchcancel', this, false);
				element.addEventListener( 'webkitTransitionEnd', this, false );
			}
		}
	},
	
	//player can drag finger off selected card to cancel flip
	onTouchMove: function(e) {
		this.moved = true;
	},
	
	onTouchEnd: function(e) {
					
		var element = e.currentTarget;
		
		//remove highlight color
		element.firstChild.style.background = 'rgb(128,0,0)';
		//remove event listeners
		element.removeEventListener('touchmove', this, false);
		element.removeEventListener('touchend', this, false);
		element.removeEventListener('touchcancel', this, false);
		
		//touchmove not fired
		if (!this.moved) {
			//card not already turned
			if ((element.className !== 'matched') && (element.className !== 'flipped')) {
			
				//first turn
				if ((this.turn === 1) && (!this.locked)) {
			 
					this.firstcard = element;
					element = null;
				
					this.firstcard.className = 'flipped'; 
					this.locked = true;
				}
				//second turn
				else if ((this.turn === 2) && (this.locked)) { 
				 
					this.totalturns ++;
				
					this.secondcard = element;
					element = null;
				
					this.secondcard.className = 'flipped';
					this.locked = false;
				}
			}	
		}
	},
	
	onTouchCancel: function(e) {
					
		var element = e.currentTarget;
		
		//remove highlight color
		element.firstChild.style.background = 'rgb(128,0,0)';
		//remove event listeners
		element.removeEventListener('touchmove', this, false);
		element.removeEventListener('touchend', this, false);
		element.removeEventListener('touchcancel', this, false);
		element.removeEventListener( 'webkitTransitionEnd', this, false );
		
	},
	
	onMouseDown: function(e) {
	
		e.preventDefault();
	
		var element = e.currentTarget;
		this.moved = false;
		
		//card not already turned
		if ((element.className !== 'matched') && (element.className !== 'flipped')) {
			//either turn 1 or 2
			if (this.turn < 3) {
				//add highlight color
				element.firstChild.style.background = 'rgb(197,0,0)';
				//remove event listeners
				element.addEventListener('mousemove', this, false);
				element.addEventListener('mouseup', this, false);
				element.addEventListener( 'webkitTransitionEnd', this, false );
			}
		}
	},
	
	onMouseMove: function(e) {

	},
	
	onMouseUp: function(e) {
					
		var element = e.currentTarget;
		
		//remove highlight color
		element.firstChild.style.background = 'rgb(128,0,0)';
		//remove event listeners
		element.removeEventListener('mousemove', this, false);
		element.removeEventListener('mouseup', this, false);
		
		//card not already turned
		if ((element.className !== 'matched') && (element.className !== 'flipped')) {
			
			//first turn
			if ((this.turn === 1) && (!this.locked)) {
			 
				this.firstcard = element;
				element = null;
				
				this.firstcard.className = 'flipped'; 
				this.locked = true;
			}
			//second turn
			else if ((this.turn === 2) && (this.locked)) { 
				 
				this.totalturns ++;
				
				this.secondcard = element;
				element = null;
				
				this.secondcard.className = 'flipped';
				this.locked = false;
			}
		}	
	},
	
	//fires once flip animation finshed
	onWebkitTransitionEnd: function(e) {
	
		var element = e.currentTarget;
		//remove event listener
		element.removeEventListener( 'webkitTransitionEnd', this, false );
		
		//if turn 1, set next go to turn 2
		if (this.turn === 1) {
		
			this.turn = 2;
		}
		//if turn 2	
		else if (this.turn === 2) {
		
			//check if 2 cards match
			if (this.firstcard.innerHTML === this.secondcard.innerHTML) {
				this.firstcard.className = 'matched';
				this.secondcard.className = 'matched';
    		}
    		//if not, flip back over
			else {
				this.firstcard.className = 'card';
				this.secondcard.className = 'card';
			}	
			//check if player has won the game
			cardflip.win();
		
			//reset turn
			this.firstcard = null;
			this.secondcard = null;
			this.turn = 1;
		}
	},
	
	//check if the player has won
	win: function() { 
		var matched = document.querySelectorAll('.matched');
		//check if all cards have been matched
		if (matched.length === 16) {
	
			//get time and number of turns
			var sTime = this.starttime;
			var tTurns = this.totalturns;
			
			//pause for animation to finish
			var pauseForAnimation = setTimeout(function() {
				//calculate game time
				var endtime = new Date();
				var difference = endtime.getTime() - sTime.getTime();
				var time = Math.floor(difference/1000);
				var minutes = Math.floor(time/60);
				var seconds = Math.floor(time % 60);
		
				//get high score from storage
				var recordtime = localStorage.getItem('time');
				var recordturns = localStorage.getItem('turns');
		
				//calculate high score
				if (recordtime !== null) {
					var calcrectime = Math.floor(recordtime/1000);
					var calcrecminutes = Math.floor(calcrectime/60);
					var calcrecseconds = Math.floor(calcrectime % 60);
				}
				
				//check if current score beats high score
				if (((time <= recordtime) && (tTurns <= recordturns)) || ((recordtime === null) || (tTurns === null))) {
					
					alert('Congratulations! New high score!\n\n Time: ' + minutes + 'm' + seconds + 's, ' + tTurns + ' turns.');
					//save new high score
					try {
						localStorage.setItem('time', difference);
						localStorage.setItem('turns', tTurns);
					} catch (e) {
						if (e == QUOTA_EXCEEDED_ERR) {
							alert('Quota exceeded!');
						}
						else {
							alert('Could not save your score, sorry!');
						}
					}
				}
				//better luck next time
				else {
					alert('Time: ' + minutes + 'm' + seconds + 's, ' + tTurns + ' turns.\n\nBetter luck next time!');
				}
				
				//flip cards back over
				for (var i = 0; i < matched.length; i++) {
   					matched[i].className = 'card';
  				}				
  				//initialize a new game
				var pauseForNewGame = setTimeout(function() {
				
					var answer = confirm("Play again?");
					//play again?
					if (answer) {
						cardflip.init();
					}
					//go back to menu
					else {
						var container = document.getElementById('container');
						var menu = document.getElementById('menu');
					
						container.style.display = 'none';
						menu.style.display = 'block';
  					
  						document.getElementById('new').addEventListener('click', newGame, false);	
						document.getElementById('score').addEventListener('click', highScore, false);		
					}				
				},501);				
			},501);
		}
	}	
};

//closes the menu and displays the game board
function newGame() {

	document.getElementById('new').removeEventListener('click', newGame, false);	
	document.getElementById('score').removeEventListener('click', highScore, false);
	
	var container = document.getElementById('container');
	var menu = document.getElementById('menu');
  		
  	menu.style.display = 'none';
  	container.style.display = 'block';
  		
  	cardflip.init();
}

//get high score for game menu
function highScore() {

	//get record time and turns
	var recordtime = localStorage.getItem('time');
	var recordturns = localStorage.getItem('turns');
		
	//calculate high score
	if (recordtime !== null) {
		var calcrectime = Math.floor(recordtime/1000);
		var calcrecminutes = Math.floor(calcrectime/60);
		var calcrecseconds = Math.floor(calcrectime % 60);
			
		alert('High score:\n' + calcrecminutes + 'm' + calcrecseconds + 's, ' + recordturns + ' turns.');
	}
	//no score saved
	else {
		var answer = confirm("No high score saved yet. Start a new game?");
		//start new game?
		if (answer) {
			newGame();
		}
	}	
}

function loaded() {
	
	//prevent scrolling if app is running full screen
  	if (window.navigator.standalone) {
  		document.addEventListener('touchmove', function() {
  			e.preventDefault();
  		}, false);
  	}
  	
  	if ((typeof(localStorage) == 'undefined')) {
  		alert("Your browser does not support localStorage. You high score will not be saved.");
  	}
  	
  	//hack to enable active pseudo selectors on buttons in mobile webkit
	document.addEventListener("touchstart",new Function(),false);
			
	document.getElementById('new').addEventListener('click', newGame, false);	
	document.getElementById('score').addEventListener('click', highScore, false);

}

window.addEventListener("load", loaded, true);