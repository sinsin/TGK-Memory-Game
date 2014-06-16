var cols : int = 4;
var rows : int = 4;
var totalCards : int = cols * rows;
var matchesNeededToWin : int = totalCards * 0.5;
var matchesMade : int = 0;
var cardWidth = 100;
var cardHeight = 100;
var arrayCards : Array;
var arrayGrid : Array;
var arrayListCardsFlipped : ArrayList;
var playerCanClick : boolean;
var playerHasWon : boolean = false;
var isTimeUp : boolean = false;

function Start () {
	playerCanClick = true;
	arrayCards = new Array();
	arrayGrid = new Array();
	arrayListCardsFlipped = new ArrayList();
	BuildDeck();
	for (var i : int = 0; i < rows; i++) {
		arrayGrid[i] = new Array();
		for (var j : int = 0; j < cols; j++) {
			var someNum : int = Random.Range(0, arrayCards.length);
			arrayGrid[i][j] = arrayCards[someNum];
			arrayCards.RemoveAt(someNum);
		}
	}
	PlayerPrefs.SetInt("isTimeUp", 0);
	PlayerPrefs.SetInt("isPaused", 0);
	PlayerPrefs.Save();
}

function OnGUI () {
	GUILayout.BeginArea(Rect(0, 0, Screen.width, Screen.height));
	GUILayout.BeginHorizontal();
	if (playerHasWon) BuildWinPrompt();
	if (isTimeUp) BuildTimeUpPrompt();
	else BuildGrid();
	GUILayout.EndHorizontal();
	GUILayout.EndArea();
}

function Update () {
	if (PlayerPrefs.HasKey("isTimeUp")) {
		var isTimeUpInt : int;
		isTimeUpInt = PlayerPrefs.GetInt("isTimeUp");
		Debug.Log(isTimeUpInt);
		if (isTimeUpInt > 0) {
			isTimeUp = true;
		}
	}
}

function BuildGrid () {
	GUILayout.BeginVertical();
	GUILayout.FlexibleSpace();
	for (i = 0; i < rows; i++) {
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		for (j = 0; j < cols; j++) {
			var card : Object = arrayGrid[i][j];
			var img : String;
			if (card.isMatched) {
				img = "blank";
			}
			else {
				if (card.isFaceUp) {
					img = card.img;
				}
				else {
					img = "wrench";
				}
			}
			GUI.enabled = !card.isMatched;
			if (GUILayout.Button(Resources.Load(img), GUILayout.Width(cardWidth))) {
				if (playerCanClick) {
					FlipCardFaceUp(card);
				}
				Debug.Log(card.img);
			}
			GUI.enabled = true;
		}
		GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
	}
	GUILayout.FlexibleSpace();
	GUILayout.EndVertical();
}

function BuildDeck () {
	var totalRobots : int = 4;
	var card : Object;
	var id : int = 0;
	for (var i : int = 0; i < totalRobots; i++) {
		var arrayRobotParts : Array = ["Head", "Arm", "Leg"];
		for (var j : int = 0; j < 2; j++) {
			var someNum : int = Random.Range(0, arrayRobotParts.length);
			var theMissingPart : String = arrayRobotParts[someNum];
			arrayRobotParts.RemoveAt(someNum);
			card = new Card("robot" + (i + 1) + "Missing" + theMissingPart, id);
			arrayCards.Add(card);
			card = new Card("robot" + (i + 1) + theMissingPart, id);
			arrayCards.Add(card);
			id++;
		}
	}
}

function FlipCardFaceUp (card : Card) {
	card.isFaceUp = true;
	if (arrayListCardsFlipped.IndexOf(card) < 0) {
		arrayListCardsFlipped.Add(card);
		if (arrayListCardsFlipped.Count == 2) {
			playerCanClick = false;
			yield WaitForSeconds(1);
			if (arrayListCardsFlipped[0].id == arrayListCardsFlipped[1].id) {
				arrayListCardsFlipped[0].isMatched = true;
				arrayListCardsFlipped[1].isMatched = true;
				matchesMade++;
				if (matchesMade >= matchesNeededToWin) {
					playerHasWon = true;
				}
			}
			else {
				arrayListCardsFlipped[0].isFaceUp = false;
				arrayListCardsFlipped[1].isFaceUp = false;
			}
			arrayListCardsFlipped = new ArrayList();
			playerCanClick = true;
		}
	}
}

function BuildWinPrompt () {
	PlayerPrefs.SetInt("isPaused", 1);
	PlayerPrefs.Save();
	var winPromptWidth : int = 100;
	var winPromptHeight : int = 100;
	GUI.BeginGroup(Rect((Screen.width - winPromptWidth) * 0.5, (Screen.height - winPromptHeight) * 0.5, winPromptWidth, winPromptHeight));
	GUI.Box(Rect(0, 0, winPromptWidth, winPromptHeight), "You win!");
	if (GUI.Button(Rect(10, 40, 80, 20), "Play Again")) {
		Application.LoadLevel("Title");
	}
	GUI.EndGroup();
}

function BuildTimeUpPrompt () {
	var timeUpPromptWidth : int = 100;
	var timeUpPromptHeight : int = 100;
	GUI.BeginGroup(Rect((Screen.width - timeUpPromptWidth) * 0.5, (Screen.height - timeUpPromptHeight) * 0.5, timeUpPromptWidth, timeUpPromptHeight));
	GUI.Box(Rect(0, 0, timeUpPromptWidth, timeUpPromptHeight), "Time's up!");
	if (GUI.Button(Rect(10, 40, 80, 20), "Play Again")) {
		Application.LoadLevel("Title");
	}
	GUI.EndGroup();
}

class Card extends System.Object {

	var isFaceUp : boolean = false;
	var isMatched : boolean = false;
	var img : String;
	var id : int;
	
	function Card (img : String, id : int) {
		this.img = img;
		this.id = id;
	}
	
}