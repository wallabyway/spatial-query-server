//PURPOSE: library to decode Fragment.fl and extras.fl into AABB

import _ from './libs/c-struct/index.js';
import aabb from "./libs/aabb-3d/index.js";
import fs from "fs";
import fetch from "node-fetch";

var fragSchema = new _.Schema({
	offset: _.type.uint16,
	version: _.type.uint16,
	blank: _.type.string(52),
	frags:[{
		geomId: _.type.uint32,
		materialId: _.type.uint32,
		dbId: _.type.uint32,
		flags: _.type.uint32,
		pos: _.type.vec3,
		quat: _.type.vec4,
		scale: _.type.vec3
	}]
});


var extraSchema = new _.Schema({
	offset: _.type.uint16,
	blank: _.type.string(26),
	extra:[{
		min: _.type.vec3,
		max: _.type.vec3,
		polycount: _.type.uint16, //should be 24bit
		istransparent: _.type.uint16, // should be 8bit
	}]
});

// register
_.register('frag', fragSchema);
_.register('extra', extraSchema);


export default class URNQuery {
    constructor(URN, token) {
        this.URN = `${URN}`;
        this.token = token;
		this.ofrags = {};
		this.frags = this.load(URN);
    }

	getFileURL() {
		return `${this.URN}/frags.fl`;
	}

	async fetchFiles() {
		const header = { headers: { header: {"Authorization": `Bearer ${this.token}` }}};
		const filename = await fetch(getFileURL(), header);
		const bytes = await filename.blob();
		return bytes;
	}

	load(URN) {
		const buffr = fs.readFileSync("tmp/frags.fl");
		const bufex = fs.readFileSync("tmp/extra.fl");
		const ofrags = _.unpackSync('frag',buffr);
		const oextras = _.unpackSync('extra',bufex);
		const frags = [];
		ofrags.frags.map((i, indx)=>{ 
			frags.push({
				polycount: oextras.extra[indx].polycount,
				min : oextras.extra[indx].min,
				max : oextras.extra[indx].max,
				dbId : i.dbId
			});
		});
		return frags;
	}

	// szSectionBox format: [min_vec3, max_vec3].  Example [3040047,919000,0.1],[3140147,919900,15.0]
	// minPolyCount  - ignore AABBs with polygon count less than minPolyCount
	// minAABBVolume - ignore AABBs with volume less than minAABBVolume (units: feet)
	query( szSectionBox, minPolyCount, minAABBVolume ) {
		const sb = JSON.parse(`[${szSectionBox}]`)
		const sectionBox =  aabb(sb[0],sb[1]);
		const dbids = [];
		if (!this.frags) return;

		this.frags.map(i=>{
			const box = new aabb(i.min, i.max);
			let istouching = (sectionBox) ? sectionBox.intersects(box) : true;
			if ( (i.polycount > minPolyCount) && (box.mag > minAABBVolume) && istouching ) 
				dbids.push(i.dbId); 
		});
		const dedup = [...new Set(dbids)];
		console.log(dbids.length, dedup.length)
		return dedup
	}
}