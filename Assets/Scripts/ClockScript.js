#pragma strict

var isPaused : boolean = false;
var startTime : float;
var deltaStartTime : float;
var timeRemaining : float;
var percent : float;

var clockBackground : Texture2D;
var clockForeground : Texture2D;
var clockForegroundMaxWidth : float;

var rightSide : Texture2D;
var leftSide : Texture2D;
var back : Texture2D;
var blocker : Texture2D;
var shiny : Texture2D;
var finished : Texture2D;
var pieClockX : int = 20;
var pieClockY : int = 20;
var pieClockWidth : int = 128;
var pieClockHeight : int = 128;

function Start () {
	guiText.material.color = Color.white;
	startTime = 120.0;
	isPaused = false;
	deltaStartTime = Time.time;
	clockForegroundMaxWidth = clockForeground.width;
}

function Update () {
	if (PlayerPrefs.HasKey("isPaused")) {
		var pauseToken : int = PlayerPrefs.GetInt("isPaused");
		if (pauseToken == 1) {
			isPaused = true;
		}
	}
	if (!isPaused) {
		DoCountDown();
	}
}

function OnGUI () {
	var newBarWidth : float = (percent * 0.01 * clockForegroundMaxWidth);
	var gap : int = 20;
	GUI.BeginGroup(Rect(Screen.width - clockBackground.width - gap, gap, clockBackground.width, clockBackground.height));
	GUI.DrawTexture(Rect(0, 0, clockBackground.width, clockBackground.height), clockBackground);
	GUI.BeginGroup(Rect(5, 6, newBarWidth, clockForeground.height));
	GUI.DrawTexture(Rect(0, 0, clockForeground.width, clockForeground.height), clockForeground);
	GUI.EndGroup();
	GUI.EndGroup();
	
	var isPastHalfWay : boolean = percent < 50;
	var clockRect : Rect = Rect(pieClockX, pieClockY, pieClockWidth, pieClockHeight);
	var rotation : float = percent * 0.01 * 360;
	var centerPoint : Vector2 = Vector2(pieClockWidth * 0.5 + gap, pieClockHeight * 0.5 + gap);
	var startMatrix : Matrix4x4 = GUI.matrix;
	GUI.DrawTexture(clockRect, back, ScaleMode.StretchToFill, true, 0);
	if (isPastHalfWay) {
		GUIUtility.RotateAroundPivot(-rotation - 180, centerPoint);
		GUI.DrawTexture(clockRect, leftSide, ScaleMode.StretchToFill, true, 0);
		GUI.matrix = startMatrix;
		GUI.DrawTexture(clockRect, leftSide, ScaleMode.StretchToFill, true, 0);
	}
	else {
		GUIUtility.RotateAroundPivot(-rotation, centerPoint);
		GUI.DrawTexture(clockRect, rightSide, ScaleMode.StretchToFill, true, 0);
		GUI.matrix = startMatrix;
		GUI.DrawTexture(clockRect, blocker, ScaleMode.StretchToFill, true, 0);
	}
	if (percent < 0) {
		GUI.DrawTexture(clockRect, finished, ScaleMode.StretchToFill, true, 0);
	}
	GUI.DrawTexture(clockRect, shiny, ScaleMode.StretchToFill, true, 0);
}

function DoCountDown () {
	Debug.Log("Time remaining : " + timeRemaining);
	timeRemaining = startTime - Time.time + deltaStartTime;
	percent = timeRemaining / startTime * 100;
	if (timeRemaining < 0) {
		timeRemaining = 0;
		isPaused = true;
		TimeIsUp();
	}
	ShowTime();
}

function PauseClock () {
	isPaused = true;
}

function UnpauseClock () {
	isPaused = false;
}

function ShowTime () {
	var minutes : int;
	var seconds : int;
	var timeStr : String;
	minutes = timeRemaining / 60;
	seconds = timeRemaining % 60;
	if (minutes > 10) {
		if (seconds >= 10) {
			timeStr = minutes.ToString() + ":" + seconds.ToString();
		}
		else {
			timeStr = minutes.ToString() + ":0" + seconds.ToString();
		}
	}
	else {
		if (seconds >= 10) {
			timeStr = "0" + minutes.ToString() + ":" + seconds.ToString();
		}
		else {
			timeStr = "0" + minutes.ToString() + ":0" + seconds.ToString();
		}
	}
	
	
	guiText.text = timeStr;
}

function TimeIsUp () {
	PlayerPrefs.SetInt("isTimeUp", 1);
	PlayerPrefs.Save();
}