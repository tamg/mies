
var currentColor = 'SpringGreen'
var currentStrokeWidth = 3

var previousTool = ''
var currentTool = 'line'
var myPath
var cursor

//the layer where most things are inside of
var baseLayer = new Layer({
	name: 'baseLayer'
})

//layer to hold the colorwheel tool
var colorWheelLayer = new Layer({
	name: 'colorWheelLayer'
})

var drawingLayer = new Layer({
	name: 'drawingLayer'
})

//activate baseLayer
baseLayer.activate()

//draw our artboard based on browser window size (view)
var artBoardSize = new Size (850, 500)
var artBoardTopX = Math.max(180,(view.center.x - artBoardSize.width/2))
var artBoardPoint = new Point (artBoardTopX, view.center.y - artBoardSize.height/2)

var artBoard = new Path.Rectangle({
	point: artBoardPoint,
	size: artBoardSize,
	strokeColor: '#cbcbcb',
	strokeWidth: .5,
	fillColor: 'ghostwhite',
	name: 'artboard',
	shadowColor: 'rgb(134, 149, 147)',
	shadowBlur: 30,
	shadowOffset: new Point(10, 10),
})

//draw all the ui elements
var ui = {

	info: new PointText({
		point: artBoardPoint - [0, 10],
		fillColor: 'black',
		fontSize: 24,
		content: 'Click and Drag to draw a line'
	}),

	line: new Path.Line({
		from: [50, 10],
		to: [100, -40],
		strokeWidth: 8,
		strokeColor: 'red',
		onClick: function(event) {
			currentTool = 'line'
			draw.line.activate()
			ui.info.content = 'Click and Drag to draw a ' + currentTool
		}
	}),

	brush: new CompoundPath({
    children: [
				new Path.Line({
					segments: [[80,25], [80,75]],
				}),
				new Path.Line({
            segments: [[60,75], [100,75]],
        }),
				new Path.Line({
				    segments: [[60, 75],[60, 90]],
				}),
				new Path.Line({
						segments: [[70, 75],[70, 90]],
				}),
				new Path.Line({
						segments: [[80, 75],[80, 90]],
				}),
				new Path.Line({
						segments: [[90, 75],[90, 90]],
				}),
				new Path.Line({
						segments: [[100, 75],[100, 90]],
				}),
    ],
		strokeCap: 'round',
		strokeJoin: 'round',
		strokeWidth: 10,
		strokeColor: 'red',
		fillColor: 'white',
		onClick: function(event) {
			currentTool = 'brush'
			draw.brush.activate()
			ui.info.content = 'Click and Drag to paint with a ' + currentTool
		}
	}),

	circle: new Path.Circle({
		center: [80, 150],
		radius: 30,
		fillColor: 'red',
		onClick: function(event) {
			currentTool = 'circle'
			draw.circle.activate()
			ui.info.content = 'Click and Drag to draw a ' + currentTool
		}
	}),

	rect: new Path.Rectangle({
		point: [50, 200],
		size: [60,60],
		fillColor: 'red',
		onClick: function(event) {
			currentTool = 'rectangle'
			draw.rectangle.activate()
			ui.info.content = 'Click and Drag to draw a ' + currentTool
		}
	}),

	arc: new Path.Arc({
		from: [50, 320],
		through: [80, 290],
		to: [110, 320],
		strokeColor: 'red',
		strokeWidth: 7,
		onClick: function(event) {
			currentTool = 'arc'
			draw.arc.activate()
			ui.info.content = 'Click and Drag to draw an ' + currentTool
		}
	}),

	cloud: new Path({
		segments:[[50, 370],[60, 350],[70, 370],[80, 350],
		[90, 370],[100, 350],[110,370]],
		strokeColor: 'red',
		strokeWidth: 8,
		onClick: function(event) {
			currentTool = 'cloud'
			draw.cloud.activate()
			ui.info.content = 'Click and Drag to draw a ' + currentTool
		}
	}),

	text: new PointText({
		point: [60, 450],
		fillColor: 'red',
		fontSize: 70,
		fontFamily: 'Arial Bold',
		content: 'T',
		onClick: function(event) {
			currentTool = 'text'
			draw.text.activate()
			ui.info.content = 'Click to insert text and type'
		}
	}),

	transform: new Path({
		segments:[[60, 490],[110, 470],[90, 520], [83, 497]],
		fillColor: 'red',
		onClick: function(event) {
			currentTool = 'transform'
			draw.transform.activate()
			ui.info.content = 'Mouse Drag = Move  Up/Down = Scale  Left/Right = Rotate  Space = Delete'
		}
	}),

	color: new Path.Circle({
		center: [80, 570],
		radius: 30,
		fillColor: currentColor,
		strokeColor: 'whitesmoke',
		strokeWidth: 1.5,
		onClick: function(event) {
			previousTool = currentTool
			previousUiInfo = ui.info.content
			currentTool = 'color'
			showColorUi()
			draw.color.activate()
			project.layers.colorWheelLayer.visible = true
			ui.info.content = 'Click to pick a color.   Space Bar to Exit'
		}
	}),

	random: new Path.Star({
	    center: [80, 650],
	    points: 10,
	    radius1: 25,
	    radius2: 35,
	    fillColor: 'red',
			onClick: function(event) {
				generateRandomDrawing()
				currentTool = 'transform'
				draw.transform.activate()
				ui.info.content = 'Mouse Drag = Move  Up/Down = Scale  Left/Right = Rotate  Space = Delete'
			}
	}),

	download: new CompoundPath({
    children: [
				new Path.Line({
            segments: [[65,740], [65,747], [95,747], [95,740]],
        }),
				new Path.Line({
            segments: [[70,730], [80,745], [90,730]],
        }),
				new Path.Line({
						segments: [[80,710], [80,745]],
				}),
				new Path.Circle({
						center: new Point(80, 730),
						radius: 30,
						fillColor: 'white',
				}),
    ],
		strokeColor: 'red',
		strokeWidth: 5,
		onClick: function(event) {
				artBoard.visible = false
				var svgData = paper.project.exportSVG({ asString: true, bounds: artBoard })
				var blob = new Blob([svgData], {type: "image/svg+xml"})
				saveAs(blob, 'Mies' +'.svg')
				artBoard.visible = true
		}
	}),

	tempColorDisplay: new Path.Line({
		from: artBoard.bounds.bottomLeft,
		to: artBoard.bounds.bottomRight,
		strokeWidth: 20,
		strokeColor: currentColor,
		onClick: function(event) {
				previousTool = currentTool
				previousUiInfo = ui.info.content
				currentTool = 'color'
				showColorUi()
				draw.color.activate()
				project.layers.colorWheelLayer.visible = true
				ui.info.content = 'Click to pick a color'
		}
	}),

	keyboard: new PointText({
		position: artBoard.bounds.bottomLeft + [0, 45],
		fillColor: 'black',
		fontSize: 16,
		content: 'shortcuts: l:line  b:brush  c:circle  r:rectangle  a:arc  d:cloud  t:text  m:transform  x:color  z:magic!  q:start over drawing',
		onClick: function(event) {
			window.open('https://github.com/tamg/mies','_blank')
		}
	}),

	created: new PointText({
		position: artBoard.bounds.bottomLeft + [0, 70],
		fillColor: 'black',
		fontSize: 16,
		content: 'Github Source [Created by @tamrrat at The Recurse Center]',
		onClick: function(event) {
			window.open('https://github.com/tamg/mies','_blank')
		}
	})

}//window.ui

//add style to cloud and tempColorDisplay ui
ui.cloud.simplify()
ui.tempColorDisplay.position.y += 10

// modified from Paperjs.org examples
function showColorUi() {

	colorWheelLayer.activate()
	colorWheelLayer.bringToFront()
	var steps = {
			hue: 36,
			saturation: 5,
			lightness: 3
	}

	var colorGroup = new Group()

	//lightness
	for (var l = 0; l < steps.lightness; l++) {
		var radius = artBoard.size.width / steps.lightness * 0.40
		var offset = new Point(artBoard.size.width / steps.lightness, 0)
		var center = artBoard.bounds.leftCenter + offset * (l + 0.5)
		var lightness = 1 - (l + 1) / (steps.lightness + 1)

		//hue
		var hUnit = 360 / steps.hue
		for (var h = 0; h < steps.hue; h++) {
			var hue = h * hUnit;
			var vector = new Point({
					angle: hue - 90,
					length: radius
			})

			//saturation
			for (var i = 0; i < steps.saturation; i++) {
				var saturation = i / steps.saturation
				var color = { hue: hue, saturation: saturation, lightness: lightness }
			}

			colorPath = new Path(new Point(), vector.rotate(hUnit / 2))
			colorPath.closed = true
			colorPath.arcTo(vector, vector.rotate(hUnit / -2))
			colorPath.position += center

			colorPath.onClick = function(event) {
				currentTool = previousTool
				ui.info.content = previousUiInfo
				draw[currentTool].activate()
				project.layers.colorWheelLayer.visible = false
			}

			colorPath.fillColor = colorPath.strokeColor = color
			colorPath.name = 'colorPath' + colorPath.id
			project.layers.colorWheelLayer.addChild(colorPath)
			colorGroup.addChild(colorPath)
		}

	//activate the base layer back after creating colorWheelLayer
	baseLayer.activate()
}
}//showColorUi()

// Group all the UI stuff together
var uiGroup = new Group({
	children: [ui.line, ui.brush, ui.circle, ui.rect, ui.arc, ui.cloud,
		 				 ui.text, ui.transform, ui.color, ui.random, ui.download]
})

//position UI relative to the artboard
//TODO make responsive to resize
uiGroup.position.y = artBoard.position.y
uiGroup.position.x = artBoard.position.x - 500
uiGroup.scale(.82)

// TODO: figure out layer index issue
// check/clip if a drawn object is outside the bounds of an artBoard
function checkIfBoardContains(object, index) {
	if (!artBoard.bounds.contains(object.bounds)) {
		var clipper = new Path.Rectangle(artBoard.bounds)
		var clippedGroup = new Group(clipper, object)
		clippedGroup.clipped = true
		drawingLayer.insertChild(index, clippedGroup)
		}
}

//all the drawing and editing tools
window.draw = {
		line: new Tool({
				onMouseDown: function(event) {
							path = new Path()
							path.strokeColor = currentColor
							path.add(event.point)
							path.strokeWidth = currentStrokeWidth
					},
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
						path.add(event.point)
					}
				}
		}),

		//modifed from paperJs examples
		brush: new Tool({
			minDistance: 10,
			maxDistance: 45,

			onMouseDown: function(event) {
				path = new Path()
				path.fillColor = currentColor
				path.add(event.point)
			},

			onMouseDrag: function(event) {
				if(artBoard.bounds.contains(event.point)) {
					var step = event.delta / 2
					step.angle += 90

					var top = event.middlePoint + step
					var bottom = event.middlePoint - step

					path.add(top)
					path.insert(0, bottom)
					path.smooth()

					checkIfBoardContains(path)
				}
			},

			onMouseUp: function(event) {
				path.add(event.point)
				path.closed = true
				path.smooth()
			}
		}),

		circle: new Tool({
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
						var radius = (event.downPoint - event.point).length
						 		path = new Path.Circle({
								center: event.downPoint,
								radius: radius,
								name: 'circle' + this.id,
								fillColor: currentColor,
								strokeColor: 'black',
						})
						path.removeOnDrag()
						checkIfBoardContains(path)
					}
				}
		}),

		rectangle: new Tool({
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
							var from = event.downPoint
							var to = event.point
							path = new Path.Rectangle({
									from: from,
									to: to,
							})
							path.fillColor = currentColor
							path.strokeColor = 'black'
							path.name = 'rect' + path.id
							path.removeOnDrag()

							checkIfBoardContains(path, path.index)
					}
				}
		}),

		arc: new Tool({
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
						path = new Path()
						path.strokeColor = currentColor
						path.strokeWidth = currentStrokeWidth,
						path.add(event.downPoint)
						path.arcTo(event.middlePoint, event.point)
				    path.selected = true
						path.removeOnDrag()

						checkIfBoardContains(path)
					}
				},
				onMouseUp: function(event) {
					path.selected = false
				}
		}),

		cloud: new Tool({
				minDistance: 20,
				onMouseDown: function(event) {
					path = new Path()
					path.strokeColor = currentColor
					path.strokeWidth = currentStrokeWidth,
					path.add(event.point)
				},
				onMouseDrag: function(event) {
					if(artBoard.bounds.contains(event.point)) {
  					path.arcTo(event.point, true)

						checkIfBoardContains(path)
					}
				}
		}),

		transform: new Tool({
			onMouseDown: function(event) {
				var hitOptions = {
						segments: false,
						stroke: true,
						fill: true,
						tolerance: 5
				}

				if (artBoard.bounds.contains(event.point)) {
						var hitResult = project.hitTest(event.point, hitOptions)
				}

				if (hitResult && hitResult.item !== artBoard) {
						path = hitResult.item
						index = path.index
				}

			},
			onMouseMove: function(event) {
				project.activeLayer.selected = false
				if (event.item &&
						event.item !== artBoard &&
						event.item.layer.name !== 'colorWheelLayer' &&
						artBoard.bounds.contains(event.point) ) {

						if(event.item.children) {
							event.item.children[1].selected = true
						} else {
							event.item.selected = true
						}

					}
			},
			onMouseDrag: function(event) {
				if (event.item &&
						event.item !== artBoard &&
						event.item.layer.name !== 'colorWheelLayer' &&
						artBoard.bounds.contains(event.point) ) {

						path.position += event.delta

						checkIfBoardContains(path, index)
				}
			},
			onKeyDown: function(event) {

			}
		}),// Move tool

		text: new Tool({
			onMouseDown: function(event) {
				if(artBoard.bounds.contains(event.point)) {
						var textPoint = event.downPoint
						newText = new PointText({
							point: textPoint,
							fillColor: currentColor,
							fontSize: 60,
							fontFamily: 'Arial Bold',
							content: ''
						})

						if(cursor) {
							cursor.remove()
						}

						cursor = new Path.Line({
							from: newText.bounds.bottomRight,
							to: newText.bounds.topRight,
							strokeWidth: 1,
							strokeColor: 'red',
						})
						//fix
						cursorBlink = setInterval(function(){
							if(currentTool === 'text') {
								cursor.visible = cursor.visible ? false : true
							}
						}, 500)
				}
			},//mousedown
			onKeyDown: function(event) {
					if (event.key === 'backspace') {
						if(newText.content.length > 0) {
							var tempTxt = newText.content
							newText.content = tempTxt.substring(0, tempTxt.length - 1)
							cursor.position.x = newText.bounds.bottomRight.x + 5
						}
					} else if (event.key === 'space') {
							newText.content += ' '
							cursor.position.x = newText.bounds.bottomRight.x + 5
							checkIfBoardContains(newText)
					} else if ( 'abcdefghijklmonpqrstuvwxyz0123456789-[]:?/,~!@#$%^&*()_+-'.indexOf(event.key) > -1) {
							newText.content += event.key
							cursor.position.x = newText.bounds.bottomRight.x + 5
							checkIfBoardContains(newText)
					} else if ( event.key === 'enter') {
							clearInterval(cursorBlink)
							cursor.remove()
					}
			}//mousedown

		}),

		color: new Tool({
			onMouseDown: function(event) {
				if (artBoard.bounds.contains(event.point)) {
						var hitResult = project.hitTestAll(event.point)

						for(i=0; i<hitResult.length; i++) {
							if(hitResult[i].item.layer.name === 'colorWheelLayer') {
								currentColor = hitResult[i].item.fillColor
								ui.color.fillColor = currentColor
							}
						}
					}
			},
			onMouseMove: function(event) {
				if (artBoard.bounds.contains(event.point)) {
						var hitResult = project.hitTestAll(event.point)

						for(i=0; i<hitResult.length; i++) {
							if(hitResult[i].item.layer.name === 'colorWheelLayer') {
								var tempColor = hitResult[i].item.fillColor
							}
						}
					}

					ui.tempColorDisplay.strokeColor = tempColor
			},
			onKeyDown: function(event) {
			if(event.key === 'space')
				//activate the tool that was active before picking color
				currentTool = previousTool
				draw[currentTool].activate()

				project.layers.colorWheelLayer.visible = false
			}
		})

}//drawing tools

//add global keyboard shortcuts
for(var key in draw) {
	if(key !== 'text') {
		draw[key].onKeyDown = function(event) {
			if(event.key === 'l') {
					currentTool = 'line'
					draw.line.activate()
					ui.info.content = 'Click and Drag to draw a ' + currentTool
			} else if ( event.key === 'b') {
					currentTool = 'brush'
					draw.brush.activate()
					ui.info.content = 'Click and Drag to paint with a ' + currentTool
			} else if ( event.key === 'c') {
					currentTool = 'circle'
					draw.circle.activate()
					ui.info.content = 'Click and Drag to draw a ' + currentTool
			} else if ( event.key === 'a') {
					currentTool = 'arc'
					draw.arc.activate()
					ui.info.content = 'Click and Drag to draw an ' + currentTool
			} else if ( event.key === 'd') {
				currentTool = 'cloud'
				draw.cloud.activate()
				ui.info.content = 'Click and Drag to draw a ' + currentTool
			} else if (	event.key === 'r') {
					currentTool = 'rectangle'
					draw.rectangle.activate()
					ui.info.content = 'Click and Drag to draw a ' + currentTool
			}	else if ( event.key === 'm') {
					currentTool = 'transform'
					draw.transform.activate()
					ui.info.content = 'Mouse Drag = Move  Up/Down = Scale  Left/Right = Rotate  Space = Delete'
			} else if ( event.key === 't') {
					currentTool = 'text'
					draw.text.activate()
					ui.info.content = 'Click to insert text and type'
			} else if ( event.key === 'x') {
					previousTool = currentTool
					previousUiInfo = ui.info.content
					currentTool = 'color'
					showColorUi()
					draw.color.activate()
					project.layers.colorWheelLayer.visible = true
					ui.info.content = 'Click to pick a color.   Space Bar to Exit'
			} else if ( event.key === 'z') {
				generateRandomDrawing()
				currentTool = 'transform'
				draw.transform.activate()
				ui.info.content = 'Mouse Drag = Move  Up/Down = Scale  Left/Right = Rotate  Space = Delete'
			} else if(event.key === 'up') {
					path.scale(1.2)
					checkIfBoardContains(path)
			} else if ( event.key === 'down') {
					path.scale(0.9)
					checkIfBoardContains(path)
			} else if ( event.key === 'left') {
					path.rotate(-10)
					checkIfBoardContains(path)
			} else if ( event.key === 'right') {
					path.rotate(10)
					checkIfBoardContains(path)
			} else if ( event.key === 'space') {
					path.remove()
			} else if ( event.key === 'q') {
					drawingLayer.removeChildren()
			}
		}
	}
}

function generateRandomDrawing() {

	var iteration = 150

	function randomPt() {
		var bounds = new Size(artBoard.bounds.width, artBoard.bounds.height)
		var newPoint = new Point(bounds * Point.random()) + artBoard.bounds.topLeft
		return newPoint
	}

	function randomColor() {
		return color = {
				hue: Math.random() * 360,
				saturation: 1,
				brightness: 1
		}
	}

	function randomNum(limit) {
		return Math.floor(Math.random() * limit)
	}

	function drawLine() {
		var from = randomPt()
		var to = randomPt()
		var color = randomColor()
		var num = randomNum(10)

		var path = Path.Line({
			from: from,
			to: to,
			strokeWidth: num,
			strokeColor: color,
		})

		checkIfBoardContains(path)
	}

	function drawCircle() {
		var center = randomPt()
		var color = randomColor()
		var radius = randomNum(35)

		var path = Path.Circle({
			center: center,
			radius: radius,
			fillColor: color,
			blendMode: 'multiply'
		})

		checkIfBoardContains(path)
	}

	var draw = [drawLine,drawCircle]

	for(var i=0; i< iteration ; i++) {
		var index = randomNum(draw.length)
		draw[index]()
		// i%2 == 0 ? drawLine() : drawCircle()
	}

}

//activate drawing layer after rendering all ui stuff
drawingLayer.activate()
