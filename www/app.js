const AV = Autodesk.Viewing;
const div = document.getElementById("Viewer");

///////////////////////////////////////////////////////////////////
// your extension code goes here.... 
class MyExtension extends AV.Extension {
	unload() { return true }
	load() { return true }
}
AV.theExtensionManager.registerExtension("MyExtension", MyExtension);


// probably do this in Node.js, rather than inside the viewer code
async function fetchGlobalOffset(urn, token) {
	const url = `https://developer.api.autodesk.com/modelderivative/v2/designdata/${urn}/manifest`;
	const res = await fetch(url, { method: 'GET', headers: { "Authorization":`Bearer ${token}`}});
	const json = await res.json();
	const cam = json.derivatives[0].children[0].children[0].camera;
	return {x:cam[0],y:cam[1],z:cam[2]};
}

async function fetchFloorDBids(urn,level) {
	// floor: [3139833, 920209.5, -79.8257],[3140047, 920393.5, 113.0]);
	// zone:  [3040047, 919000, 0.1],       [3140147, 919900,   15.0 ]
	const levels = [{},{},{},{},{min:0.1, max:15.0}]; // lookup table comes from AECmetadata.json
	const url = `api?minPolyCount=0&minBoxSize=1.5&sectionBox=[3040047,919000,${levels[level].min}],[3140147,919900,${levels[level].max}]&urn=${urn}&token=${_access_token}`;
	const res = await fetch(url);
	const json = await res.json();
	return json;
}

function startViewer(urn) {
	AV.Initializer({ 
		env: "AutodeskProduction2", 
		api: "streamingV2", 
		accessToken: _access_token }, () => {
			const options = { extensions: ["Autodesk.AEC.LevelsExtension", "Autodesk.BoxSelection"] };
			const viewer = new AV.Private.GuiViewer3D(div, options);
			viewer.start();
			viewer.setTheme("light-theme");
			AV.Document.load(`urn:${urn}`, async (doc) => {
				var viewables = doc.getRoot().getDefaultGeometry();
				const offs = await fetchGlobalOffset(urn, _access_token);
				const floorDBIDs = await fetchFloorDBids(urn,4);
				viewer.loadDocumentNode(doc, viewables, { ids: floorDBIDs, globalOffset: offs }).then( async (model) => {
						const target = {x: -105.70753479003906, y: -53.74824523925781, z: 16.573711395263672};
						const cameraStartPosition =  {x: -103.13512120889261, y: 115.76364015913602, z: 254.7574472189561};

						viewer.navigation.setView(cameraStartPosition , target);
						viewer.navigation.setPivotPoint(target);
						viewer.navigation.setPivotSetFlag(true);
						viewer.navigation.setFocalLength(35);
						viewer.impl.setFPSTargets(15,15,24);

						// Wait for geometry to finish loading...
						await viewer.waitForLoadDone({ propDb: false, geometry: true});
						viewer.autocam.setCurrentViewAsHome();
						viewer.getExtension("Autodesk.AEC.LevelsExtension").floorSelector.selectFloor(15,true);
						const boxSelectionExt = await viewer.getExtension('Autodesk.BoxSelection');
						boxSelectionExt.addToolbarButton(true);
						model.unconsolidate();
				});
			});
		}
	);
}

startViewer("dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2NhZC13ZXMvSG9ydG9uJTIwUGxhemElMjAxMC4yNy4yMi5ud2Q");