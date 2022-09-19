import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import { convertHourStringToMinutes, convertMinutesToHoursString } from './utils/timeUtils';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/games', async (req, res) => {
	const games = await prisma.game.findMany({
		include: {
			_count: {
				select: {
					ads: true
				}
			}
		}
	});
	return res.json(games);
});

app.post('/games/:gameId/ads', async (req, res) => {
	const { gameId } = req.params;
	const { body } = req;

	const ad = await prisma.ad.create({
		data: {
			gameId,
			name: body.name,
			yearsPlaying: body.yearsPlaying,
			discord: body.discord,
			hoursStart: convertHourStringToMinutes(body.hoursStart),
			hoursEnd: convertHourStringToMinutes(body.hoursEnd),
			useVoiceChannel: body.useVoiceChannel,
			weekDays: body.weekDays.join(','),
		}
	})
	return res.status(201).json(ad);
});

app.get('/games/:gameId/ads', async (req, res) => {
	const { gameId } = req.params;
	const ads = await prisma.ad.findMany({
		select: {
			id: true,
			name: true,
			weekDays: true,
			useVoiceChannel: true,
			yearsPlaying: true,
			hoursStart: true,
			hoursEnd: true
		},
		where: {
			gameId
		},
		orderBy: {
			createdAt: 'desc'
		}
	})
	return res.json(ads.map(ad => {
		return {
			...ad,
			weekDays: ad.weekDays.split(','),
			hoursStart: convertMinutesToHoursString(ad.hoursStart),
			hoursEnd: convertMinutesToHoursString(ad.hoursEnd),
		}
	}));
});
app.get('/ads/:id/discord', async (req, res) => {
	const { id } = req.params;

	const ad = await prisma.ad.findUniqueOrThrow({
		select: {
			discord: true
		},
		where: {
			id
		}
	})
	return res.json(ad);
});



app.listen(3333);