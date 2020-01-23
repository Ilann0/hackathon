const API_KEY = 'AIzaSyC03hwJ5LsvZZJzxk6PoxQFR0tEgQ0vPJ0';

const base = {
	location: 'HaKovshim Garden',
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			id: 0,
			properties: {},
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[34.76465828703309, 32.067476795393986],
						[34.76434446857835, 32.06712903081946],
						[34.76401455686952, 32.06669943746045],
						[34.76455636309053, 32.06636189840558],
						[34.7648031263199, 32.06620449340359],
						[34.765344932540906, 32.0658197876195],
						[34.765827730163586, 32.0661311891766],
						[34.766380265220654, 32.066565331183774],
					],
				],
			},
		},
	],
};

let map;
let drawingManager;

const maps = {
	map: undefined,
	drawingManager: undefined,
	eventListeners: {
		drawComplete: undefined,
		mapClick: undefined,
	},
	featureList: [],
	mapOptions: {
		zoom: 19,
		center: new google.maps.LatLng(32.06665, 34.765184),
		gestureHandling: 'cooperative',
	},

	drawingManagerOptions: {
		drawingMode: google.maps.drawing.OverlayType.MARKER,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle'],
		},
	},

	geoJsonTemplate: {
		location: 'HaKovshim Garden',
		type: 'FeatureCollection',
		features: [],
	},

	featureTemplate: {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [[]],
		},
	},

	initMap: () => {
		this.map = new google.maps.Map(document.getElementById('map'), this.mapOptions);
	},

	initDrawingManager: () => {
		this.drawingManager = new google.maps.drawing.DrawingManager(this.drawingManagerOptions);
	},

	convertPlanToGeoJson: () => {
		const geoJson = JSON.parse(JSON.stringify(this.geoJsonTemplate));

		this.featureList.forEach(polygon => {
			const feature = JSON.parse(JSON.stringify(this.featureTemplate));
			polygon.overlay
				.getPath()
				.getArray()
				.forEach(latLng => {
					feature.geometry.coordinates[0].push([latLng.lng(), latLng.lat()]);
				});
			geoJson.features.push(feature);
		});

		return geoJson;
	},

	prepareGeoJsonForDisplayOnMaps: geoJsonObj => {
		geoJsonObj.features.forEach(feature => {
			if (feature.geomety.type === 'Polygon')
				feature.geometry.coordinates[0].push(feature.geometry.coordinates[0][0]);
		});

		return geoJsonObj;
	},

	displayBase: baseGeoJson => {
		const base = this.prepareGeoJsonForDisplayOnMaps(baseGeoJson);
		this.map.data.addGeoJson(base);
	},

	displayPlan: geoJson => {
		const plan = prepareGeoJsonForDisplayOnMaps(geoJson);
		plan.features.forEach(feature => {
			if (feature.geometry.type === 'Polygon')
				const shape = new google.maps.Polygon({
					paths: feature.geometry.coordinates[0].map(coo => ({ lng: coo[0], lat: coo[1] })),
					editable: true,
					draggable: true,
					map: map,
				});
			else if (feature.geometry.type === 'Polyline')
				const shape = new google.maps.Polyline({
					paths: feature.geometry.coordinates[0].map(coo => ({ lng: coo[0], lat: coo[1] })),
					editable: true,
					draggable: true,
					map: map,
				});
			else if (feature.geometry.type === 'Point')
				const shape = new google.maps.Marker({
					postion: feature.geometry.coordinates.map(coo => ({ lng: coo[0], lat: coo[1] })),
				});

			this.featureList.push(shape);
		});
	},

	setMarkerMode: props => {
		this.eventListeners.mapClick = this.map.addListener('click', e =>
			addMarker({
				position: e.latLng,
				...props,
			})
		);
	},

	addMarker: props => {
		const marker = new google.maps.Marker(props);
		this.featureList.push(marker);
	},

	setDraw: () => {},

	initEventListeners: () => {
		this.eventListeners.drawComplete = google.maps.event.addListener(drawingManager, 'overlaycomplete', poly => {
			poly.overlay.setDraggable(true);
			poly.overlay.setEditable(true);
			polylist.push(poly);
		});
	},
};

window.onload = () => {
	const BASE_URL = 'http://192.168.0.92';

	function post(payload) {
		axios.post(BASE_URL + '/add-base', payload);
	}

	const polylist = [];

	const options = {
		zoom: 19,
		center: new google.maps.LatLng(32.06665, 34.765184),
		gestureHandling: 'cooperative',
	};
	function initMap(options) {
		map = new google.maps.Map(document.getElementById('map'), options);
		drawingManager.setMap(map);
		map.data.addGeoJson(
			prepareGeoJsonForDisplayOnMaps({
				location: 'HaKovshim Garden',
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						id: 0,
						properties: {},
						geometry: {
							type: 'Polygon',
							coordinates: [
								[
									[34.76465828703309, 32.067476795393986],
									[34.76434446857835, 32.06712903081946],
									[34.76401455686952, 32.06669943746045],
									[34.76455636309053, 32.06636189840558],
									[34.7648031263199, 32.06620449340359],
									[34.765344932540906, 32.0658197876195],
									[34.765827730163586, 32.0661311891766],
									[34.766380265220654, 32.066565331183774],
								],
							],
						},
					},
				],
			})
		);
		const plan = {
			location: 'HaKovshim Garden',
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					id: 0,
					properties: {
						editable: true,
					},
					geometry: {
						type: 'Polygon',
						coordinates: [
							[
								[34.76465828703309, 32.067476795393986],
								[34.76434446857835, 32.06712903081946],
								[34.765344932540906, 32.0658197876195],
								[34.765827730163586, 32.0661311891766],
								[34.766380265220654, 32.066565331183774],
							],
						],
					},
				},
			],
		};

		const displayPlan = geoJson => {
			const plan = prepareGeoJsonForDisplayOnMaps(geoJson);
			plan.features.forEach(feature => {
				console.log(feature);
				const poly = new google.maps.Polygon({
					paths: feature.geometry.coordinates[0].map(coo => ({ lng: coo[0], lat: coo[1] })),
					editable: true,
					dragable: true,
					map: map,
				});
			});
		};
		displayPlan(plan);
	}

	prepareGeoJsonForDisplayOnMaps = geoJsonObj => {
		geoJsonObj.features.forEach(feature => {
			if (feature.geometry.type === 'Polygon')
				feature.geometry.coordinates[0].push(feature.geometry.coordinates[0][0]);
		});

		return geoJsonObj;
	};

	const drawingManagerOptions = {
		drawingMode: google.maps.drawing.OverlayType.MARKER,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle'],
		},
		// markerOptions: {
		// 	icon:
		// 		'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
		// },
		// circleOptions: {
		// 	fillColor: '#ffff00',
		// 	fillOpacity: 1,
		// 	strokeWeight: 5,
		// 	clickable: false,
		// 	editable: true,
		// 	zIndex: 1,
		// },
	};

	drawingManager = new google.maps.drawing.DrawingManager(drawingManagerOptions);

	google.maps.event.addListener(drawingManager, 'overlaycomplete', poly => {
		poly.overlay.setDraggable(true);
		poly.overlay.setEditable(true);
		polylist.push(poly);
	});

	const geoJsonTemplate = {
		location: 'HaKovshim Garden',
		type: 'FeatureCollection',
		features: [],
	};

	const featureTemplate = {
		type: 'Feature',
		properties: {},
		geometry: {
			type: 'Polygon',
			coordinates: [[]],
		},
	};

	function convertPlanToGeoJson(polygonList) {
		const geoJson = JSON.parse(JSON.stringify(geoJsonTemplate));

		polygonList.forEach(polygon => {
			const feature = JSON.parse(JSON.stringify(featureTemplate));
			polygon.overlay
				.getPath()
				.getArray()
				.forEach(latLng => {
					feature.geometry.coordinates[0].push([latLng.lng(), latLng.lat()]);
				});
			geoJson.features.push(feature);
		});

		return geoJson;
	}

	// map.data.addGeoJson(prepareGeoJsonForMaps(convertPlanToGeoJson(polylist)))

	document.getElementsByTagName('button')[0].addEventListener('click', () => {
		console.log(convertPlanToGeoJson(polylist));
		map.data.addListener('click', event => {
			console.log(event);
			map.data.overrideStyle(event.feature, { fillColor: 'red' });
		});
	});

	document.getElementsByTagName('button')[1].addEventListener('click', () => {
		console.log(polylist);
		map.data.addGeoJson(prepareGeoJsonForMaps(convertPlanToGeoJson(polylist)));
	});

	document.getElementsByTagName('button')[2].addEventListener('click', () => {
		deleteMode(polylist);
	});

	document.getElementsByTagName('button')[3].addEventListener('click', () => {
		turnOffDeleteMode(polylist);
	});

	document.getElementsByTagName('button')[4].addEventListener('click', () => {
		treeMode();
	});
	document.getElementsByTagName('button')[5].addEventListener('click', () => {
		removeTreeMode();
	});

	function addTree(props) {
		const marker = new google.maps.Marker({
			position: props.coords,
			map: map,
		});
		console.log(marker);
	}

	function treeMode() {
		map.addListener('click', e => addTree({ coords: e.latLng }));
	}

	function removeTreeMode() {
		map.removeListener('click');
	}

	function deleteMode(polygonList) {
		polygonList.forEach((polygon, index) => {
			google.maps.event.addListener(polygon.overlay, 'click', () => {
				polygon.overlay.setMap(null);
				polygonList.splice(index, 1);
			});
		});
	}

	function turnOffDeleteMode(polygonList) {
		polygonList.forEach(({ overlay }) => {
			google.maps.event.clearListeners(overlay, 'click');
		});
	}

	initMap(options);
};
