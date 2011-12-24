var debug;
var lastreporttime;

function init() {
	debug = document.getElementById("debug");
	// This would work for retrieving data on my server:
	// sendGETRequest("sales.json", useData);
	// But it gives an access-not-allowed error for retrieving data on 
	//	someone else's server because of "cross-domain security issues"
	// To get around that, use JSONP:
	//	(this time, I do it continuously)
	sendJSONPRequest();
}

function sendJSONPRequest() {
	debug.innerHTML = "sending request...";
	
	var url = "http://gumball.wickedlysmart.com?callback=useJSON";
	if (lastreporttime != null)
		url += "&lastreporttime="+lastreporttime;
	
	var newScriptElem = document.createElement("script");
	newScriptElem.setAttribute("src",url);
	newScriptElem.setAttribute("id","jsonp");
	
	var head = document.getElementsByTagName("head")[0];
	var oldScriptElem = document.getElementById("jsonp");
	if (oldScriptElem == null)
		head.appendChild(newScriptElem);
	else
		head.replaceChild(newScriptElem, oldScriptElem);
}

function useJSON(salesArr) {
	var salesDiv = document.getElementById("sales");
	var prevDiv = salesDiv.firstChild;
	for(var i = 0; i < salesArr.length; i++) {
		var s = salesArr[i];
		var div = document.createElement("div");
		div.setAttribute("class","saleItem");
		div.innerHTML = s.name+" sold "+s.sales+" gumballs at "
			+(new Date(s.time)).toLocaleTimeString();	
		salesDiv.insertBefore(div,prevDiv);
		prevDiv = div;
		lastreporttime = s.time;
	}
	
	setTimeout(sendJSONPRequest, 3000);
}

function sendGETRequest(url, handle) {
	var request = new XMLHttpRequest();
	request.open("GET", url);
	request.onload = function() {
		if (request.status == 200) 
			handle(request.responseText);
	};
	request.send(null);
}

function useData(strdata) {
	var salesArr = JSON.parse(strdata);
	var salesDiv = document.getElementById("sales");
	for(var i = 0; i < salesArr.length; i++) {
		var s = salesArr[i];
		var div = document.createElement("div");
		div.setAttribute("class","saleItem");
		div.innerHTML = s.name+" sold "+s.sales+" gumballs";	
		salesDiv.appendChild(div);
	}
}