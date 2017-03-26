
var currentTool = ''


window.draw = {
		line: new Tool({
				onMouseDown: function(event) {
							path = new Path();
							path.strokeColor = 'black';
							path.add(event.point);
					},
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
						path.add(event.point);
					}
				}
		}),

		circle: new Tool({
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
						var radius = (event.downPoint - event.point).length
						var path = new Path.Circle({
								center: event.downPoint,
								radius: radius,
								name: 'circle' + this.id,
								fillColor: 'white',
								strokeColor: 'black',
						})
								path.removeOnDrag()
					}
				}
		}),

		rectangle: new Tool({
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
							// figure out to do with native rect instead of circle
							var radius = (event.downPoint - event.point).length
							var path = new Path.Circle(event.downPoint, radius)
							var rect = new Path.Rectangle(path.bounds)
								rect.fillColor = 'white'
								rect.strokeColor = 'black'
								rect.removeOnDrag()
					}
				}
		})
}//drawing tools


var lineUi = new Path.Line({
	from: [50, 100],
	to: [100, 50],
	strokeWidth: 8,
	strokeColor: 'black',
	onClick: function(event) {
		currentTool = 'line'
		draw.line.activate()
	}
})

var circleUi = new Path.Circle({
	center: [80, 150],
	radius: 30,
	onClick: function(event) {
		currentTool = 'circle'
		draw.circle.activate()
	}
})

project.importSVG('');

var cloudUI = new Path({
	center: [80, 150],
	radius: 30,
	onClick: function(event) {
		currentTool = 'circle'
		draw.circle.activate()
	}
})

var rectUi = new Path.Rectangle({
	point: [50, 200],
	size: [60,60],
	onClick: function(event) {
		currentTool = 'rectangle'
		draw.rectangle.activate()
	}
})

// Create a UI group
var uiGroup = new Group({
	children: [lineUi, circleUi, rectUi],
	fillColor: 'red'
	//adjust group position based on artboards position
})


var artBoardSize = new Size (800, 600)
var artBoardTopX = Math.max(180,(view.center.x - artBoardSize.width/2))
var artBoardPoint = new Point (artBoardTopX, view.center.y - artBoardSize.height/2)

var artBoard = new Path.Rectangle({
	point: artBoardPoint,
	size: artBoardSize,
	strokeColor: '#cbcbcb',
	strokeWidth: .5,
	fillColor: 'ghostwhite',
	name: 'artboard',
	shadowColor: '#cbcbcb',
	shadowBlur: 30,
	shadowOffset: new Point(10, 10),
	onMouseEnter: function(event) {

	},
	onMouseDown: function(event) {
		//new line everytime we hit artboard
	},
	onMouseDrag: function(event) {
	}
})

//CONSTRUCT MOUSE EVENTS
function onMouseDown(event) {

}



// //clone path horizintally
// for (var i = 0; i < 3; i++) {
// 	var copy = path.clone();
//
// // Distribute the copies horizontally, so we can see them:
// 	copy.position.x += i * copy.bounds.width;
// }

//fit something to a rectangular bounds
// path.fitBounds(artBoard.bounds)


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

// Loop 30 times:
// for (var i = 0; i < 30; i++) {
//     // Create a circle shaped path at a random position
//     // in the view:
//     var path = new Path.Circle({
//         center: Point.random() * view.size,
//         radius: 25,
//         fillColor: 'black',
//         strokeColor: 'white'
//     });
//
//     // When the mouse is pressed on the item, remove it:
//
