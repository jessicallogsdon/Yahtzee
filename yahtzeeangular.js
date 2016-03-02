var app = angular.module('yahtzeeApp', []);

app.controller('YahtzeeController', ['$scope', function($scope) {

	var rollCount = 0
	$scope.rollsLeft = 2

	$scope.dice = [
 		{
 			name: 'die 1',
 			value: Math.floor((Math.random() * 6) + 1),
 			isHeld: false
 		},
 		{
 			name: 'die 2',
 			value: Math.floor((Math.random() * 6) + 1),
 			isHeld: false
 		},
 		{
 			name: 'die 3',
 			value: Math.floor((Math.random() * 6) + 1),
 			isHeld: false
 		},
 		{
 			name: 'die 4',
 			value: Math.floor((Math.random() * 6) + 1),
 			isHeld: false
 		},
 		{
 			name: 'die 5',
 			value: Math.floor((Math.random() * 6) + 1),
 			isHeld: false
 		}
	];

	$scope.scoreList = [
		{
			name: 'ones',
			label: 'Ones',
			score: function(dice) {
				var numbers = dice.filter(function(d) { return d == 1 })
				if (numbers.length > 0)
					return numbers.reduce(function(a,b) { return a+b })
				else
					return 0
			},
			clicked: false
		},
		{
			name: 'twos',
			label: 'Twos',
			score: function(dice) {
				var numbers = dice.filter(function(d) { return d == 2 })
				if (numbers.length > 0)
					return numbers.reduce(function(a,b) { return a+b })
				else
					return 0
			},
			clicked: false
		},
		{
			name: 'threes',
			label: 'Threes',
			score: function(dice) {
				var numbers = dice.filter(function(d) { return d == 3 })
				if (numbers.length > 0)
					return numbers.reduce(function(a,b) { return a+b })
				else
					return 0
			},
			clicked: false
		},
		{
			name: 'fours',
			label: 'Fours',
			score: function(dice) {
				var numbers = dice.filter(function(d) { return d == 4 })
				if (numbers.length > 0)
					return numbers.reduce(function(a,b) { return a+b })
				else
					return 0
			},
			clicked: false
		},
		{
			name: 'fives',
			label: 'Fives',
			score: function(dice) {
				var numbers = dice.filter(function(d) { return d == 5 })
				if (numbers.length > 0)
					return numbers.reduce(function(a,b) { return a+b })
				else
					return 0
			},
			clicked: false
		},
		{
			name: 'sixes',
			label: 'Sixes',
			score: function(dice) {
				var numbers = dice.filter(function(d) { return d == 6 })
				if (numbers.length > 0)
					return numbers.reduce(function(a,b) { return a+b })
				else
					return 0
			},
			clicked: false
		},
		{
			name: 'three-of-a-kind',
			label: "Three Of A Kind",
			score: function(dice) {
				dice = dice.sort()
				return repeats(dice, 3) ? dice.reduce(function(a,b) { return a+b }) : 0
			},
			clicked: false
		},
		{
			name: 'four-of-a-kind',
			label: "Four Of A Kind",
			score: function(dice) {
				dice = dice.sort()
				return repeats(dice, 4) ? dice.reduce(function(a,b) { return a+b }) : 0
			}
		},
		{
			name: 'small-straight',
			label: 'Small Straight',
			score: function(dice) {
				dice = dice.sort()
				return isIncreasing(dice.slice(-4)) || isIncreasing(dice.slice(0,4)) ? 30 : 0
			},
			clicked: false
		},
		{
			name: 'large-straight',
			label: 'Large Straight',
			score: function(dice) {
				return isIncreasing(dice.sort()) ? 40 : 0
			},
			clicked: false
		},
		{
			name: 'full-house',
			label: 'Full House',
			score: function(dice) {
				dice = dice.sort()
				return repeats(dice, 2, true) && repeats(dice, 3, true) ? 25 : 0
			},
			clicked: false
		},
		{
			name: 'chance',
			label: 'Chance',
			score: function(dice) {
				return dice.reduce(function(a,b) { return a+b })
			},
			clicked: false
		},
		{
			name: 'yahtzee',
			label: 'Yahtzee',
			score: function(dice) {
				return dice.filter(function(d) { return d == dice[0] }).length == 5 ? 50 : 0
			},
			clicked: false
		}
	]

	// data-driven table score generation
	// $.each(data, function(i,d) {
	// 	$('.scores').append(function() {
	// 		var score = $('<td class="score"></td>')
	// 		var possible = $('<td class="possible-score"></td>')
	// 		var label = $('<td></td>').text(d.label).click(function() {
	// 			score.text(d.score(getDiceValues()))
	// 			d.clicked = true
	//
	// 			$(this).attr('disabled','')
	//
	// 			updateTotal()
	// 			resetAfterScore()
	//
	// 			if(IsGameFinished) $scope.gameOver = true
	// 		})
	//
	// 		return $('<tr class="score-label '+d.name+'"></tr>').append(label, score, possible)
	// 	})
	// })
	//
	// // add total score row to table
	// $('.scores').append(function() {
	// 	var score = $('<td class="total">0</td>')
	// 	var label = $('<td></td>').text("Total")
	// 	return $('<tr class="total-label"></tr>').append(label, score)
	// })

	// $.each(dice, function(i,d) {
	// 	$('.dice').append(function() {
	// 		return $('<span class="die"></span>').text(d.value).click(function() {
	// 			d.isHeld = !d.isHeld
	// 			if (d.isHeld)
	// 				$(this).attr('data-clicked','')
	// 			else
	// 				$(this).removeAttr('data-clicked')
	// 		})
	// 	})
	// })

	$scope.rollClick = function() {
		roll()
		rollCount++
		rollsLeft--
		$scope.rollsLeft = rollsLeft
		var input = this
		if (rollCount == 2) $scope.rollButtonDisabled = true
	}

	$scope.newGame = function() {
		//resets every value for a new game
		for (var i = 0; i < data.length; i++) {
			$scope.data[i].score = 0
			$('td').removeAttr('disabled')

		}
		$scope.total = 0;
		roll()
		$scope.rollButtonDisabled = false
		$('span').removeAttr('data-clicked')
		$scope.gameOver = true;
	}

	var getDiceValues = function() {
		return [$scope.dice[0].value,$scope.dice[1].value,$scope.dice[2].value,$scope.dice[3].value,$scope.dice[4].value]
	}

	var updatePossible = function() {
		for(var i = 0; i < $scope.data.length; i++) {
			if (!$scope.data[i].clicked) {
				$scope.data[i].possible = $scope.data[i].score(getDiceValues())
			}
			else {
				$scope.data[i].possible = 0
			}
		}
	}

	var roll = function() {
		for(var i = 0; i < $scope.dice.length; i++)
			if (!$scope.dice[i].isHeld) {
				$scope.dice[i].value = Math.floor((Math.random() * 6) + 1)
			}
		updatePossible()
	}

	$scope.resetAfterScore = function() {
		rollCount = 0
		rollsLeft = 2

		for(var i = 0; i < $scope.dice.length; i++)
			if($scope.dice[i].isHeld) $scope.dice[i].isHeld = false

		$scope.rollsLeft.text(rollsLeft)
		$('span').removeAttr('data-clicked')
		$scope.rollButton.prop('disabled', false)

		roll();
	}

	$scope.setScore = function(index) {
		$scope.scoreList[index].scoreValue = $scope.scoreList[index].score(getDiceValues());
		$scope.total += $scope.score[index].scoreValue;
		roll();
	}

	// returns true if elements of data are increasing by 1, else returns false
	var isIncreasing = function(data) {
		var valid = true
		for(var i = 0; i < data.length-1; i++)
			if (data[i+1] != data[i]+1) valid = false
		return valid
	}

	// returns true if any number is repeated "number" or more times, else returns false
	// if "exactly" == true, only returns true if a number repeats exactly "number" times
	var repeats = function(data, number, exactly) {
		var repeatCount = {}
		data.forEach(function(d) {
			repeatCount[d] = (repeatCount[d] || 0) + 1
		})
		for (var i in repeatCount) {
			if (exactly && repeatCount[i] == number) return true
			else if (!exactly && repeatCount[i] >= number) return true
		}
		return false
	}

	// checks to see if all the different scores have been select
	// if so returns true, else returns false
	var IsGameFinished = function() {
		var isFinished = true
		for (var i = 0; i < data.length; i++)
			if (!data[i].clicked) {
				isFinished = false
				return isFinished
			}
		return isFinished
	}
}]);
