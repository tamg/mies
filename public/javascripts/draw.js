
/*
CONSTRUCT UI ELEMENTS
*/
var currentTool = ''


var lineUi = new Path(new Point(50, 100), new Point(100, 50))
lineUi.strokeWidth = 4
lineUi.strokeColor = 'red'
// lineUi.onClick = function(event) {
// 	currentTool = 'line'
// }

var circleUi = new Path.Circle(new Point(80, 150), 30)

// circleUi.onClick = function(event) {
// 	console.log('clicked');
// 	currentTool = 'circle'
// }


var rectUi = new Path.Rectangle( new Point(50, 200), new Size(60,60))


// Create a group from the two paths:
var uiGroup = new Group([lineUi, circleUi, rectUi]);


// Set the stroke color of all items in the group:
uiGroup.fillColor = 'red'



//operate on each UI element
// uiGroup.children.forEach(function(element) {
// 	var bound = new Path.Rectangle(element.bounds)
// 	bound.strokeColor = 'black'
// 	bound.scale(1.2)
// 	bound.strokeWidth = .2
// })

/*
	CONSTRUCT MOUSE EVENTS
*/





var myPath;

function onClick(event) {

}

//listen to click event
function onMouseDown(event) {
	console.log(currentTool)

	if(lineUi.bounds.contains(event.point)) {
			currentTool = 'line'

			//starting point of a new drawn line
			myPath = new Path();
			myPath.strokeColor = 'black';
	} else if (circleUi.bounds.contains(event.point)) {
			currentTool = 'circle'
	}


}

function onMouseDrag(event) {
	if(uiGroup.bounds.contains(event.point)) {
			uiGroup.position += event.delta;
		}

	if (currentTool === 'line' &&
			!uiGroup.bounds.contains(event.point)) {
		myPath.add(event.point);
	}

	// The radius is the distance between the position
	// where the user clicked and the current position
	// of the mouse.
	if (currentTool === 'circle') {
		var path = new Path.Circle(event.downPoint,
														(event.downPoint - event.point).length)
			path.fillColor = 'white'
			path.strokeColor = 'black'
			path.removeOnDrag()
		}
}

// function onMouseDrag(event) {
// 	if(uiGroup.bounds.contains(event.point)) {
// 		uiGroup.position += event.delta;
// 	}
//
// 	var newLine = new Path
//
//
// }




// // display cordinates of an elemet
// function displayPoints(path) {
//
// 	var segments = path.segments
//
// 	segments.forEach(function(segment) {
// 		var x = segment.point._x
// 		var y = segment.point._y
// 		var point = new Point(x,y)
// 		var text = new PointText(point);
// 		text.fillColor = 'red';
// 		text.content = point.x + ' ' + point.y
// 		text.fontSize = 7
// 	})
// }
