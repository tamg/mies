
/*
CONSTRUCT UI ELEMENTS
*/
var currentTool = ''

var artBoardSize = new Size (800, 600)
var artBoardTopX = Math.max(180,(view.center.x - artBoardSize.width/2))
var artBoardPoint = new Point (artBoardTopX, view.center.y - artBoardSize.height/2)

var artBoard = new Path.Rectangle(artBoardPoint, artBoardSize)
artBoard.strokeColor = 'grey'
artBoard.fillColor = 'ghostwhite'

var lineUi = new Path(new Point(50, 100), new Point(100, 50))
lineUi.strokeWidth = 4
lineUi.strokeColor = 'red'

var circleUi = new Path.Circle(new Point(80, 150), 30)

var rectUi = new Path.Rectangle( new Point(50, 200), new Size(60,60))

// Create a group from the two paths:
var uiGroup = new Group([lineUi, circleUi, rectUi]);

// Set the stroke color of all items in the group:
uiGroup.fillColor = 'red'

/*
	CONSTRUCT MOUSE EVENTS
*/

var myPath;

//listen to click event
function onMouseDown(event) {

	if(lineUi.bounds.contains(event.point)) {
			currentTool = 'line'
			linePath = new Path()
	} else if (circleUi.bounds.contains(event.point)) {
			currentTool = 'circle'
 	} else if (rectUi.bounds.contains(event.point)) {
			currentTool = 'rectangle'
	}
}

function onMouseDrag(event) {
	// if(uiGroup.bounds.contains(event.point)) {
	// 		uiGroup.position += event.delta;
	// }
	if (artBoard.bounds.contains(event.point)) {
			if (currentTool === 'line') {
				  linePath.add(event.point)
					linePath.strokeColor = 'black'
			}

			if (currentTool === 'circle') {
				var radius = (event.downPoint - event.point).length
				var nearestPoint = artBoard.getNearestPoint(event.point)
				console.log(nearestPoint);
				var path = new Path.Circle(event.downPoint, radius)

					path.fillColor = 'white'
					path.strokeColor = 'black'
					path.removeOnDrag()

			}

			if (currentTool === 'rectangle') {
					//figure out to do with native rect instead of circle
					var radius = (event.downPoint - event.point).length
					var path = new Path.Circle(event.downPoint, radius)
					var rect = new Path.Rectangle(path.bounds)
						rect.fillColor = 'white'
						rect.strokeColor = 'black'
						rect.removeOnDrag()
			}
}
}


function onMouseUp(event) {
	//clip out of artboard paths
	var lastItem = project.activeLayer.lastChild
	var bounds = new Path.Rectangle(artBoard.bounds)
	console.log(lastItem);
	if(bounds.contains(lastItem)) { console.log('intersects');}

}

function onFrame(event) {

}





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
