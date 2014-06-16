#pragma strict

function Start () {

}

var customSkin : GUISkin;

function OnGUI () {
	if (GUI.Button(Rect((Screen.width - 100) * 0.5, 475, 100, 50), "Play Game")) {
		Application.LoadLevel("Game");
	}
}