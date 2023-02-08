import fastify_ from 'fastify'
import fastifyServe from '@fastify/static';

import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import URNQuery from "./urnquery.mjs";

const fastify = fastify_({logger: true})
fastify.register(fastifyServe, { root: path.join(__dirname, 'www') });
console.log(__dirname)
const sessions = []; 	// cache URN sessions

fastify.get('/api', async (request, reply) => {
	if ((!request.query.urn) || (!request.query.token)) 
		return `missing urn and token`;

	// load fragment files once
	const URN = request.query.urn;
	if (!sessions[URN]) 
		sessions[URN] = await new URNQuery(URN, request.query.token);

	const minPolyCount = Number(request.query.minPolyCount);
	const minAABBVolume = Number(request.query.minBoxSize);
	return sessions[URN].query(request.query.sectionBox, minPolyCount, minAABBVolume);
});

// Run the server!
const start = async () => { await fastify.listen({ port: process.env.PORT || 3000 })};
start();
